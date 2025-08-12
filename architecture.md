# My Current Take / Interpretation on Clean Architecture

This is my personal adaptation of Clean Architecture principles applied to my Vue.js + TypeScript frontend and my backend.  
The goal is to keep **layers independent**, **dependencies flowing inward**, and responsibilities **clearly separated**.

---

## High-Level Layer Overview

I apply the same layered thinking to both **frontend** and **backend**, though the concrete implementations differ.

---

## Frontend Layers (Vue.js Example with Quests)

### 1. **UI Layer – Child Components**
- Example: `<ActiveQuestItem />`
- **Responsibilities**:
    - Render given props.
    - Handle local UI events (e.g., button click for `Complete` or `Cancel` quest).
    - Make minimal API calls relevant to its scope (e.g., `questApiService.complete()`).
    - Emit events to **inform** the parent of something that happened — never directly refresh/store sync.
- **Rules**:
    - **Dumb component principle**:
        - Knows *what happened* locally, but not what the system should do about it.
        - Never tries to predict, “keep in sync,” or imagine the current/future state of its props.
        - All display state comes from **computed values** or equivalent bindings that read directly from the reactive store layer — no duplicate local copies.
    - **Action handling**:
        - For actions, only call the corresponding API method and check success/failure.
        - Do **not** attempt to adjust the data, mutate props, or update the store yourself based on the API response — that responsibility lives in higher layers.
    - **Event emission**:
        - Emit **domain-specific** events in `"this-happened"` style:
            - ✅ `quest-state-changed` (with payload like `{ newState: 'cancelled', action: 'cancel', id }`)
            - ❌ Avoid vague names like `updated`.
            - ❌ Avoid imperative names like `request-quest-refresh` (would couple UI to application logic).

---

### 2. **UI Layer – Parent Components (Orchestrators)**
- Example: `<QuestsList />`
- **Responsibilities**:
    - Listen to child component events.
    - Decide **what** store services to call based on the event.
    - Can also make **additional API calls** if the event requires it — unlike children, this layer is allowed to trigger side effects beyond a single store update.
    - Do **not** know *how* the store sync is implemented — only which method to call.
- **Rules**:
    - Coordinates both **store service calls** and **API calls** that are necessary after an event.
    - Reacts to events with **domain meaning**:
      ```ts
      onQuestStateChanged(payload) {
        if (payload.type === 'completed' || payload.type === 'cancelled') {
          // Can call APIs directly if needed
          questApiService.logQuestChange(payload.id, payload.type);
          // Then refresh the relevant parts of the store
          questStoreService.refreshAllQuests();
        }
      }
      ```
    - Compared to children:
        - Child = only launches its scoped API action + checks success, with display state tied directly to the store.
        - Parent = interprets the event in the application context, may trigger **multiple API calls** or **refresh different store services** depending on the situation.

---

### 3. **Store Services (Application Layer – Frontend)**
- Example: `QuestStoreService`
- **Responsibilities**:
    - Expose **reactive computed getters** for components to consume.
    - Have `sync` / `refresh` methods to update state by calling the API services.
    - Encapsulate all logic for syncing from backend into the store.
    - Perform **mapping from backend DTOs to frontend structures** if needed.
- **Rules**:
    - Components never directly manipulate store state — only through exposed methods.
    - Group related syncs into methods like `refreshAllQuests()` to avoid boilerplate and clarify intent.
    - `sync` methods are void — they **update state**, not return data directly.
    - Conversion between backend format and frontend format happens here (or in a shared mapper).

---

### 4. **API Services (Infrastructure Layer – Frontend)**
- Example: `QuestApiService`
- **Responsibilities**:
    - Handle HTTP calls to backend endpoints.
    - Return raw data (DTOs) or status codes to store services.
    - Contain no UI logic and minimal data transformation.
- **Rules**:
    - API services **never** know about Vue reactivity.
    - They only speak HTTP/JSON (or WebSocket/etc.).
- **Currently, the http call is bypassed, we just call without async/await the service layer of the backend**
---

## Backend Layers (Quest Example)

### 1. **Controller / Entry Point**
- Accepts HTTP requests.
- Passes requests to the appropriate **service layer**.
- Does not know how data is stored or retrieved.
- **Currently, the http call is bypassed, we just call without async/await the service layer of the backend**

---

### 2. **Service Layer**
- Implements **use cases**.
- Knows **which repositories** to use.
- Prepares the data **before** passing it to the repository.
- Calls repository methods with **fully formed entities**, not raw data.
- Can return:
    - Status codes for actions (`POST`, `PUT`, etc.).
    - Mapped DTOs for getters.
- **Rules**:
    - No direct DB access — always goes through a repository.
    - Responsible for converting **Entities → DTOs** before sending to the frontend.
    - Uses repository’s `toEntity` and `toDB` indirectly via repo calls.

---

### 3. **Repository Layer**
- Responsible for **all DB access**.
- **Always converts raw DB rows into Entities** before returning data:
    - Uses an internal `toEntity(raw: DbRow)` method.
- **Only accepts fully prepared Entities** for updates:
    - Uses `toDB(entity: Entity)` to convert back to DB format.
- Exposes only **basic CRUD operations**:
    - Example:
      ```ts
      updateById(id: string, questUpdated: ActiveQuestEntity): Result<true> { ... }
      ```
    - No business logic — just persistence.

---

### 4. **Entities**
- Represent the core business objects (e.g., `ActiveQuestEntity`).
- Contain domain logic (validation, transformations).
- Used **both** in the service layer and repository layer.
- Never directly expose raw DB structures — always via mapping.

---

## Naming Conventions

### Event Names
- Use `"this-happened"` style to communicate **facts** from child to parent:
    - `quest-state-changed`
- Payload includes both:
    - `newState`: the resulting domain state.
    - `action`: (optional) how it happened.

### Store Method Names
- `sync` = update local store state from backend.
- `refresh` = high-level grouped sync.
- Group related syncs for common scenarios (e.g., `refreshAllQuests()`).
- Avoid imperative coupling from UI (`request-quest-refresh`) — keep orchestration in parent.

### API Service Methods
- Use verbs that reflect backend actions:
    - `completeQuest(id)`, `cancelQuest(id)`, `getAllActiveQuests()`.
- Never return reactive data.

### **When a Concept Can Be Represented as a Boolean**
- If a business/domain concept can naturally be reduced to *yes/no* or *on/off*, name it so that:
    - `true` = the positive, expected, or “active” state.
    - `false` = the opposite state.
- Examples:
    - ✅ `isSoundEnabled` → `true` means sound is enabled.
    - ✅ `isCheatEnabled` → `true` means cheats are enabled.
    - ❌ `isSoundDisabled` → `true` means sound is disabled (double negative risk when checking).
- Why:
    - Avoids mental flips like `if (!isSoundDisabled)`.
    - Keeps naming aligned with how the feature is discussed in the domain (users say “sound is on”, not “sound is not off”).


### **When a Concept is a Validation**
- If the logic checks a rule or constraint and returns a *result object*  
  like `{ isValid: true }` or `{ isValid: false, message: "..." }`,  
  name it so that:
    - The function name describes the **rule being validated**, not the “validity” itself.
    - The return’s `isValid` is always interpreted the same way:  
      `true` means the data passed the rule, `false` means it failed.
- Examples:
    - ✅ `validateWithinBusinessHours` → returns `{ isValid: true }` if inside hours.
    - ✅ `validateUserAvailability` → returns `{ isValid: false, message: "User busy" }` if unavailable.
    - ❌ `isOutsideBusinessHours` → invites negation and confusion (`if (!isOutsideBusinessHours)`).
- Why:
    - Prevents mixing “valid” vs. “invalid” naming patterns across code.
    - Avoids double-negatives like `if (!isNotAvailable)`.
- Tip:
    - If you find yourself needing a negation in the name, reframe the concept so that `isValid: true`  
      naturally means “no error”.
    - Stick to `validateX` for any function that follows this `{ isValid }` contract.
---

## Special Case: Multiple Store Syncs (e.g., Load Game)
- For high-level scenarios (start, load, resume), create **application-layer orchestration methods**:
    - `gameContextStoreService.initialSyncAfterLoad()`
- This method calls multiple store service syncs:
  ```ts
  syncLocalization();
  syncTheme();
  syncPlayer();
  syncAllActiveQuests();
  syncAllQuests();
