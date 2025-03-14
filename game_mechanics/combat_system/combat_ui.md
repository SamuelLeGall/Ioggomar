# Hybrid RPG Game - Targeting UI Design

The UI for targeting in this hybrid RPG game is designed to provide a clear and detailed view of unit actions and targeting probabilities, while keeping information separated in relevant sections for easy comprehension. The game involves complex gameplay mechanics such as timelines, probability-based targeting, and modifiers that influence unit decisions.

### Summary

The key distinction in the UI is the separation of different views for different states of gameplay:

1. **Global View**: Shows basic targeting information and which unit will act next.
2. **Team-Wide Stats View**: A dropdown filter to quickly show action and targeting info for all or specific units.
3. **Unit-Specific Targeting View**: Shows the specific action of a unit, the available targets, and their probabilities.
4. **Detailed Unit Stats on Hover**: Displays more in-depth information about each unit when hovering over them, including their next planned action, target probabilities, and modifiers.

These sections are all kept separate to ensure the player can easily navigate between them without overwhelming the screen with too much information at once.

## 1. **Global Targeting UI - No Active Stat Window**

This view is available when the player is not actively looking at detailed stats or information for individual units. The following elements will be visible:

### **Unit Display & Status Indicators**

- Each unit (both allied and enemy) is represented by a **square panel** displaying:
  - The **unit’s portrait** in the center.
  - A **health bar** positioned below the portrait.
  - A **mana/qi bar** (if applicable) below the health bar.
  - A **radial clock overlay** covering the entire square, visually representing the time remaining until the unit’s next action.
    - The radial clock functions similarly to **cooldown indicators in RPGs**, where a gray overlay slowly fades as time progresses.
    - Once the overlay completes a full cycle, the unit is **ready to act**, and the icon regains full color.

### **Targeting Indicators**

Each allied unit will display **icons** showing how likely they are to be targeted by enemy units, grouped by probability:

- **⚪**: Hidden (0%)
- **🟢**: Safe (low targeting probability, <10%)
- **🟡**: Moderate danger (10-30%)
- **🔴**: High chance of being attacked (30%+)
- **💀**: Marked for Death (e.g., due to special enemy skills like "Focus Target")

These icons are displayed **over the unit’s square**, ensuring visibility without obstructing key unit details.

### **Next Enemy to Act - Turn Order Highlighting**

- The **next ennemy unit** scheduled to act will have it's **square panel** border changed to red.
- Each potential target is **ranked based on likelihood** of being attacked by the next action.
- A **numbered indicator (`1️⃣`, `2️⃣`, `3️⃣`)** is displayed next to the **top 3 most likely targets** of that action.

By integrating these elements, players can quickly assess **who is in danger**, **which enemy is about to act**, and **how much time remains until each unit can take their turn**—all without opening additional menus.

#### **Example Display:**

If an **Orc Berserker** is about to act and its targeting priorities are:

| Targeted Unit  | Probability |
| -------------- | ----------- |
| Player         | 45% `1️⃣`    |
| Mage_Ally      | 30% `2️⃣`    |
| Assassin_Ally  | 20% `3️⃣`    |
| Berserker_Ally | 5%          |

- **1️⃣ appears next to the most likely target** (Player – 45%).
- **2️⃣ appears next to the second most likely target** (Mage_Ally – 30%).
- **3️⃣ appears next to the third most likely target** (Assassin_Ally – 20%).

This ranking **only applies to the upcoming action** and does not indicate the order of turns for the battle.  
It provides a **quick way to anticipate immediate threats** without opening additional menus.
The same kind of system is shown for the next action of the ally unit but on the ennemy **square panels**

## 2. **Global Team-Wide Stats View (Dropdown Filter)**

This view is triggered by a key press to show the **overall team-wide information**, separated by allies and enemies. It includes a dropdown filter to show stats for **All**, **Ally**, or **Enemy** units. For each unit that is about to act, the display will show:

- **Unit Name** (red if ennemy, blue if ally)
- **Action They Are Performing** (e.g., "⚔ Heavy Slash")
- **Target(s) & Probability** (up to Top 3 most likely targets)

| Unit          | Planned Action | Target(s) & Probability    |
| ------------- | -------------- | -------------------------- |
| Orc Berserker | ⚔ Heavy Slash  | Knight (65%), Archer (35%) |
| Player        | ⚔ Attack       | Knight (65%), Archer (35%) |
| Goblin Mage   | Fireball       | Mage (80%), Rogue (20%)    |
| Assassin      | ☠ Backstab     | Healer (100%)              |

## 3. **Targeting UI - When Hovering Over a Specific Unit**

When hovering over a specific unit or selecting an action for that unit (e.g., an attack), the following UI window will show updated information about the potential targets and probabilities.

#### Unit Action View

- **Unit Name**: Display the name of the unit (e.g., "Adam - Vigorous Berserker").
- **Action**: Show the action they will perform (e.g., "⚔ Heavy Slash").
  - Include a brief description of the action and its effect (e.g., damage dealt, debuff applied, etc.).
  - Include any relevant modifiers for the action.

#### Targeting Table

A table will show the available targets and their respective probability of being chosen, considering both the unit's class and the action's specific probabilities.

| Available Targets | Probability |
| ----------------- | ----------- |
| Orc Warrior       | 40%         |
| Mage              | 10%         |
| Archer            | 50%         |

#### Additional Information (Optional)

- **Threat Level**: Show how threatening each enemy unit is to the unit currently taking the action.
  - This is based on the enemy's probability to act and the risk posed to the player’s unit.
- **Personality Modifiers**: Display any personality traits or modifiers that might influence the unit’s decision-making (e.g., vengeful, cautious, etc.). These will be referenced briefly here but can be expanded in another section like the unit glossary.

## 4. **Unit Hover Stats Window**

When hovering over a unit on the battlefield, a **detailed stat window** will appear showing the following information:

- **Next Planned Action**: The action the unit is about to perform next (e.g., "⚔ Heavy Slash").
- **Target(s) & Probability**: The top 3 most likely targets for that unit, along with their probabilities of being selected (e.g., "Knight (65%), Archer (35%)").
- **Threat Level**: Show the threat level of each enemy that could target this unit, including modifiers.
- **Personality Modifiers**: Show any personality or status modifiers that influence the unit’s behavior (e.g., "Hateful" makes the unit more likely to target the enemy who last hit it).

This window serves as a **stat summary** for the unit, displaying not only the target probabilities but also additional stats like personality effects, active buffs/debuffs, and threat modifiers.

## 5. **Skill Selection UI**

When the player selects a skill for their unit (e.g., an attack, heal, or debuff), the UI will update to show:

- **Skill Action**: The skill the player has selected.
- **Description**: Describe effects of the skill (e.g., damage, healing, debuff strength) May be as a table for the actual numbers for each unit targeted (useful for debuff/heal)
- **Targeting Table**: A list of all possible targets and their probabilities of being hit by the selected action.

### 6. **Notes on Modifiers and Personality Effects**

- **Personality Modifiers** (e.g., "Vengeful", "Cautious", etc.) will influence the likelihood of targeting specific enemies.
  - These modifiers will not be shown directly in the targeting table but will affect the probabilities of targets and actions.
  - Further details on how personalities influence behavior can be found in a **Unit Review Screen** or glossary.

---
