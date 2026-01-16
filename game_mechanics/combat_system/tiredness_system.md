# Tiredness System

## **Purpose**

This is a **risk-reward system** to stop units from mindlessly spamming actions. Instead, they need to **pace themselves strategically**.

## **How It Works**

1. **Each consecutive action within the same turn adds tiredness.**
2. **Each unit has a class-specific "Safe Action Limit" per turn.**
   - Exceeding this limit triggers tiredness effects.
   - **Tanks** might handle **3 safe actions**, while **fragile mages** might **only have 2**.
3. **Tiredness Effects Stack the More You Push It:**
   The number of stages and there effects may vary for each classes
   - **Stage 1:** Reduced Accuracy & Slight Speed Debuff.
   - **Stage 2:** Small Chance to Hurt Themselves.
   - **Stage 3:** Higher Chance of Friendly Fire, Lower Defense.
   - **Stage 4:** Strong Stat Reduction.
   - **Stage 5:** Hero is Nearly Unusable for the Rest of the Fight.
4. **Tiredness Carries Over Between Waves!**
   - This forces the player to **think ahead** instead of spamming in every fight.
5. **Recovery Mechanisms Exist:**
   - Some **skills** can reduce tiredness (like _"Rally"_ or _"Second Wind"_).
   - Certain **items** or **resting mechanics** can reset tiredness.

### **Tiredness Recovery**

- Some **classes** have **natural tiredness recovery per turn** (percentage-based for diminishing returns, capped).
- Recovery options:
  - **Items:** Primary method for reducing tiredness.
  - **Skills:** Might exist but with high time costs, class restrictions, or conditions (X times used on turn).
  - **Class Passives:** Some classes recover a small amount naturally.

### **Using Tiredness to Your Advantage**

- **Bait enemies into overexerting themselves** so their strong units become weaker in later waves.
- **Tiredness as a Counterplay Tool:** Some classes might **inflict tiredness on enemies**, forcing them to misfire attacks.
- **Trade-Offs Between Short-Term Power & Long-Term Sustainability.**

## **Class-Specific Tiredness Effects**

Each class **handles tiredness differently**, making unit management more **nuanced**. Example:

| **Class Type**                                              | **Stage 1**              | **Stage 2**          | **Stage 3**             | **Stage 4**                | **Stage 5**               |
| ----------------------------------------------------------- | ------------------------ | -------------------- | ----------------------- | -------------------------- | ------------------------- |
| **Tank (Paladin, Warrior, Guardian, etc.)**                 | Small Accuracy Drop      | Small Defense Drop   | Small Speed Drop        | Heavy Speed Drop           | Unable to Guard/Block     |
| **Rogue (Assassin, Thief, Ninja, etc.)**                    | Small Accuracy Drop      | Chance to Hurt Self  | Chance to Friendly Fire | Severe Speed Drop          | Cannot Attack at All      |
| **Mage (Sorcerer, Elementalist, etc.)**                     | Small Spell Delay        | Increased Mana Costs | Spell Failure Chance    | Cannot Use High-Tier Magic | Cannot Use Any Magic      |
| **Support (Healer, Bard, Buffer, etc.)**                    | Weaker Healing           | Weaker Buffs/Debuffs | Healing Costs More      | Skills Take Longer         | Cannot Use Support Skills |
| **Berserker-Type (Rage-Based Fighters, Blood Mages, etc.)** | Minor HP Drain on Action | Increased HP Drain   | Chance to Friendly Fire | Cannot Be Healed           | Collapses for 1 Turn      |

---

## **Strategic Impact**

- The system **discourages reckless spamming** but doesn’t **completely remove multi-action strategies**.
- **Players must decide:** Do they push their unit **hard** for an early advantage and suffer later? Or **pace their actions** for longevity?
- Forces players to **think about turn-ending tactics** to **cut enemy actions short** and reset tiredness.
- **Fast units aren't just OP spam bots anymore**—they have to manage their risk.
