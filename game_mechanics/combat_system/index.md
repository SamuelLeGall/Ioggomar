# Combat System Overview

The combat system is a **hybrid turn-based system** that balances speed, action timing, and strategic decision-making.

## **Core Concepts**

- **Speed-Based Turn System**: Determines when and how often units act.
- **Tiredness System**: Prevents excessive action spamming by introducing fatigue penalties.
- **Turn Manipulation**: Players can influence battle flow through buffs, debuffs, and action delays.
- **Stealth & Scouting**: A dynamic detection system affects target visibility.
- **Threat System**: Governs AI & player target selection based on unit actions.
- **Evasion & Hit Rate**: Ensures attacks aren't always guaranteed to hit.

Each of these systems is detailed in separate documents:

- [Turn System](turn_system.md)
- [Tiredness System](tiredness_system.md)
- [Turn Manipulation](turn_manipulation.md)
- [Stealth & Scouting](stealth_scouting.md)
- [Threat System](threat_system.md)
- [Evasion & Hit Rate](evasion_hit_rate.md)
- [How to show data in the UI](combat_ui.md)

# Future Considerations

Additional mechanics for future updates:

- **Elemental Modifiers** – Strengths and weaknesses based on elements.
- **Status Effects** – Poison, burn, silence, etc.
- **Equipment Effects**: Gear may modify scouting, threat, or evasion.
- **Terrain Influence** – Battlefields affecting movement and detection.

These mechanics could further enhance strategy.
