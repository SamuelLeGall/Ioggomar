# localisation

Pour la localisation, charger le EN_US par défaut puis ecraser tout ce qui est possible par la localisation choisie pour etre sur d'avoir toute les clés définie au moins une fois.

## reflexion with my rubber duck chatgpt

NEXT SUBJECT : threat system.

# **Threat System & AI Targeting Overview**

The enemy targeting system blends **class-based behavior** with **individual personalities**, ensuring enemies act logically yet remain unpredictable.

## **How Threat Works**

- Each unit has a **Threat Value** based on **class, actions, and positioning**.
- **Formula**:  
  \[
  P(\text{target}) = \frac{\text{Unit's Threat Value}}{\text{Total Threat in Range}}
  \]
- **Threat Decay** ensures tanks must **maintain** threat over time.
- **Class-Based Targeting Priorities** define **how different enemy types behave**.
- **Personalities modify the class priorities**, creating **enemy variety**.

## **How Class & Personality Interact**

- **Each class has a target priority list**.
- **Personalities reshape the priority weights** without fully overriding them.

### **Example: Berserker AI**

| Personality  | Highest HP | Closest | Last Attacker | Random |
| ------------ | ---------- | ------- | ------------- | ------ |
| **Normal**   | 60%        | 30%     | 10%           | 0%     |
| **Hateful**  | 20%        | 10%     | 70%           | 0%     |
| **Reckless** | 10%        | 80%     | 5%            | 5%     |
| **Tactical** | 40%        | 20%     | 30%           | 10%    |

example of other personnalities and there perks
Hateful → Targets who hit them last.
Reckless → Always attacks the nearest unit.
Cautious → Avoids high-threat targets, preferring weaker ones.
Hunter → Tracks the same unit across multiple turns.
Tactical → Prioritizes units with buffs/debuffs (e.g., ignores Stealth units).

- **Example Behavior**:
  - A **Normal Berserker** mostly targets **tanky units**.
  - A **Hateful Berserker** prioritizes **who hit them last**.
  - A **Reckless Berserker** mostly **attacks whoever is closest**.

## **Threat Manipulation (Player Control)**

- **Taunt Abilities**: Force enemies to focus on a unit.
- **Threat Suppression**: Reduces an ally’s chance of being targeted.
- **Formation & Positioning**: Influence how enemies distribute attacks.
- **Bodyguard Mechanics**: Tanks absorb hits for allies.

## **Enemy AI Targeting**

- **Factors influencing targeting**:
  - **Higher Threat Rating** = More likely to be targeted.
  - **Distance to Enemy** = Closer targets slightly preferred.
  - **Enemy Type-Specific Behavior** (Snipers prefer fragile units, Berserkers attack their last attacker, etc.).

## **Status Effects That Influence Targeting**

- **Fear**: Enemy avoids attacking the feared unit.
- **Frenzy**: Enemy only attacks the closest unit.
- **Confusion**: Enemy picks a random target.
- **Mark for Death**: Enemy prioritizes one specific target.

This system ensures **tactical depth**, while keeping combat **fun and fair**.
