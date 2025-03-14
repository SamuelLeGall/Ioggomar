# Turn System

## Turn System (Speed-Based)

Unlike traditional turn-based RPGs, where each unit acts once per turn, this system defines a turn as the time it takes for the slowest unit to act once. Faster units may act multiple times within a single turn.

### **Turn Structure (Hybrid of Turn-Based & Timeline)**

- A **Turn** is defined by the time it takes for the **last alive unit to complete their first action** within that turn.
- **Turn length is not solely determined by the slowest unit** but rather by **whichever unit takes the longest to complete their chosen action.**
  - Example: If the **slowest unit** chooses a **quick attack**, but a **faster unit** uses an **ultimate ability with a high time cost**, the turn will last **until that ultimate ability resolves**.
- If the **last acting unit dies before acting**, the turn length is **recalculated** based on the remaining units.
- **The timeline is recalculated** after each action because action may buff or debuff the speed of allies or ennemies
- If **all units have acted once**, the turn **ends immediately** (even if some units had queued additional actions).
- At the **start of each turn**, all units **choose their first action** before execution begins.
  - This ensures **strategic planning** rather than **reactionary spam**.
- **Timeline resets each turn,** but the **order of actions within the turn** is based on **unit speed and action time costs**.
- **Actions have three key properties** that impact turn structure:
  - **Time Cost** – Determines when the unit acts within the turn.
  - **Max Uses Per Turn** – Prevents excessive repetition of powerful moves.
  - **Turn Cooldown** – Limits how frequently certain actions can be used.

### **Action Cost & Speed Interaction**

- **Each action has a Base Time Cost**, modified by speed. ex: `cost=(base_time_cost * speed_modifier)`.
- Slower units might **take longer to act**, but their actions could be **stronger or more tactical**.
- **Fast units can act more**, but their **excessive actions come with risks**.

## **Wave-Based Adjustments**

- **Cooldowns & Tiredness Persist Across Waves.**
- **Some Recovery Mechanics Exist, But Are Limited.**
- **Some Buffs/Debuffs Carry Over, Encouraging Tactical Play.**

To see how the speed advantage is balanced, see this additional mechanic [Tiredness System](tiredness_system.md).
