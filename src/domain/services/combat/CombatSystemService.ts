import {
  elementalTypesGlobalConfig,
  defaultElementalTypeConfig,
} from "@src/config/globalConstants/fighting/Elements/elementTypesConfig";
import {
  ElementalTypeConfig,
  ElementalTypesInteractions,
} from "@src/domain/models/fight/ElementalTypesModels";
import { CombatEntityService } from "../../entities/combat/CombatEntityService";

/** FOR SOME GOOD MATHEMATICAL FONCTION FOR GRAPH (experience/damagedealt etc) - https://easings.net/ */
class CombatSystemService {
  private frindlyCombatants: CombatEntityService[];
  private enemyCombatants: CombatEntityService[];
  private combatants;

  constructor(
    frindlyCombatants: CombatEntityService[],
    enemyCombatants: CombatEntityService[]
  ) {
    this.frindlyCombatants = frindlyCombatants;
    this.enemyCombatants = enemyCombatants;
    this.combatants = [...this.frindlyCombatants, ...this.enemyCombatants];
  }

  isFightOngoing(): boolean {
    return (
      this.frindlyCombatants.some((combatant) => combatant.isAlive()) &&
      this.enemyCombatants.some((combatant) => combatant.isAlive())
    );
  }
  initializeFight() {
    /* 
    we will have a system where if some combatants have 3 times the speed of the slowest combatant,
    they will be able to attack 3 times before the slowest combatant can attack.
    we would need some kind of speed system where each combatant has some kind of timer before there next attack and each time
    a combatant attack it's timer is reset while the other combatant timer keep going down until there next attack.
    the timer will be calculated with the speed of the combatant. 
    
    */
    const sortedCombatants = this.combatants.sort(
      (a, b) => a.getTimeBeforeNextAction() - b.getTimeBeforeNextAction()
    );

    while (this.isFightOngoing()) {
      const currentCombatant = sortedCombatants[0];

      if (currentCombatant.isAlive()) {
        // TODO, see how the player can choose both the action and the target (if there is a target needed for the action)
        this.performAction("attack", currentCombatant, this.combatants[0]);
      }

      // we actualize the timer for the  all combatants except the one that performed the action
      this.combatants.forEach((combatant) => {
        if (combatant !== currentCombatant && combatant.isAlive()) {
          combatant.updateTimeBeforeNextAction(
            currentCombatant.getTimeBeforeNextAction()
          );
        }
      });

      // we reset the timer for the combatant that performed the action
      currentCombatant.resetTimeBeforeNextAction();
    }

    return true;
  }

  // WIP
  performAction(
    action: string,
    attacker: CombatEntityService,
    target: CombatEntityService
  ): void {
    switch (action) {
      case "attack":
        this.attack(attacker, target);
        break;
      // Add more cases for different actions
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private attack(
    attacker: CombatEntityService,
    target: CombatEntityService
  ): void {
    const damage = target.calculateDamageReceived(attacker);
    target.updateHealth(damage);
  }

  getElementalTypeConfig(
    attacker: CombatEntityService,
    target: CombatEntityService
  ): ElementalTypeConfig {
    // if the attacker element is not in the global config --> we return a default config that will not give any bonus/malus
    if (!elementalTypesGlobalConfig[attacker.getElementalType()]) {
      return defaultElementalTypeConfig;
    }
    const atkTypeConfig: ElementalTypesInteractions =
      elementalTypesGlobalConfig[attacker.getElementalType()];

    // if the target element is not in the attacker config --> we return a default config that will not give any bonus/malus
    return (
      atkTypeConfig.effectOn[target.getElementalType()] ||
      defaultElementalTypeConfig
    );
  }

  isCriticalHit = (): boolean => {
    return false;
  };

  // speed - agility - dexterity - luck
  // high agility increase dodge rate
  // high dexterity increase crit rate and hit rate
  checkDodgeSuccesfull = (): boolean => {
    return true;
  };

  escapeFight() {
    return true;
  }
}
