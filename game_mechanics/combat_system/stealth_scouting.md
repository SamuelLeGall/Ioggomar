# Stealth & Scouting System

## **Overview**

The Stealth & Scouting System determines which units can be **targeted** during combat by dynamically tracking their visibility. The system aims to provide a list of targetable units, which evolves with each action and skill, giving players multiple ways to protect vulnerable units.

The system allows units to stay hidden or detect enemies through innate abilities, skills, and environmental factors. The threat system then selects targets from this list to decide who will be attacked. This creates strategic depth by offering various ways to control visibility and protect key units.

## **Phases**

1. **Scouting Phase** – Determines visibility at the start of each turn.
2. **Action-Based Updates** – Attacks and skills change visibility during combat.
3. **Turn End Reset** – Some visibility states persist.

## **Stealth Levels**

- **Stealthy** – Cannot be targeted.
- **Estimated** – Visible but harder to hit.
- **Scouted** – Fully visible.

Certain **skills and environment factors** affect detection.

## **Turn-Based Stealth/Scouting System with Timeline Impact**

The scouting system is separated in 3 steps (well actually 2):

- **scouting phase** : at the start of each turn. It run a team wide check and determine the initial situation with if each unit is **Scouted** or **Stealthy** and there stealth status.
- **Action-Based Impact** : As the turn progresses, **actions** and **skills** will update the stealth status of units and may cause a unit to move between **Scouted** and **scouted** status.
- At the end of each turn we reset the stealth status of each remaining unit and rerun the scouting phase for next turn with the unit still alive. Some unit are overexposed (there found stat is over 100%) and will be force scouted next turn.

- Over mutiples turn a stealth decay may be applicable to help find those high stealth units. (multiplier)

### **Turn Start (Scouting Phase)**

At the start of each turn, a **scouting phase** occurs, setting up the initial visibility for all units:

- **Allies' scout stats** and **enemy stealth stats** are compared to determine a global **team_wide_visibility for whole team**.
- A **detection percentage** for each enemy and ally is calculated based on the team **visibility** and this specific unit **stealth stat** && the class && the position.
- Units that are hidden at this phase are considered **stealthy** and cannot be targeted unless they take actions that break stealth, they may also have access to specific action and bonuses only available to undetected units.
  - **Stealthy Unit**: May remain hidden if not detected.
  - **estimated Unit**: mostly Visible and can be targeted but less likely to be hit.
  - **Scouted Unit**: Visible and can be targeted.

### **During the Turn (Action-Based Impact)**

As the turn progresses, **actions** and **skills** will update the stealth status of units:

- **Attack Actions**:
  - Attacking can reveal the attacking unit or the target, depending on whether they were already spotted.
  - Some high stealth classes may have access to attack by consuming there stealth for the turn
  - For rogue it is use stealth for skills
  - for mages it take out a lot of stealth when attacking and require mana to use spell to get stealth back
- **Abilities & Spells**:
  - Some abilities can **reduce stealth** (e.g., loud AoE spells), while others may **boost stealth** (e.g., invisibility spells).
  - Classes have an innate that make them check the unit of a specific battleline.
  - Some unit may have skills with turn cooldown that show a hidden unit (either 100% or x%)
  - Some unit may have skills to ambush and stun a stealth unit, this skill is wasted if the stealth unit dont attack
- **Environmental Factors**:
  - Weather, lighting, and terrain might influence detection chances.

### **Turn End (Reset Stealth/Scouting Stats)**

**Partial Reset**: Units that were exposed during the turn may remain **exposed** for the next turn, or units using stealth skills may continue to benefit from a reduced detection chance for one or two turns. Or the unit may be overexposed (>100%) so for next turn even if she should be hidden she stay visible with malus in stats or more chance to get hit for X first attacks. Malus may get converted to a new title of "survivor" with minor bonus if survive the x first attacks.

### **Persistent Stealth Modifiers**

- **Loud Actions** (e.g., AoE spells) can lead to lingering **scouting penalties** for a few turns.
- **Stealth Buffs** (e.g., invisibility) can persist and offer advantages across multiple turns until broken by certain actions.

See [Threat System](threat_system.md) for targeting mechanics.
