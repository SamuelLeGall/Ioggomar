import { CombatantEntity } from "@src/server/domain/entities/combatantEntity";
import { ElementalTypeConfig, ElementalTypesInteractions } from "@src/models/fight/ElementalTypesModels";
import {
  defaultElementalTypeConfig,
  elementalTypesGlobalConfig
} from "@config/globalConstants/fighting/Elements/elementTypesConfig";

/** FOR SOME GOOD MATHEMATICAL FONCTION FOR GRAPH (experience/damagedealt etc) - https://easings.net/ */
class CombatSystemService {
  private allies: CombatantEntity[];
  private ennemies: CombatantEntity[];
  private combatants: CombatantEntity[];

  /**
   *  TODO dans le futur :
   * ne pas avoir a fournir les allies ou ennemies.
   * Avoir les combatants alliés dans session en base.
   * Appeler une fonction initialize fight avec un idLocation ou qqchse du
   * genre en entrée et il trouve l'ennemi calcule son niveau, cree une entite
   * etc depuis la methode initializeFight sans avoir quoi que se soit a faire.
   * Voir comment le front gère "l'intance du combat en court pour chaque tour ?
   * peut etre pareil stocket dans la partie session et recup depuis la base
   * a chaque action ?
   *
   * Voir un peu different --> cf sur le fonctionnement du système de combat actuel
   *
   * Voir une fois que une actions a lieu si on retourne la data a jour ou si on sync
   * en se basant sur la base.
   *
   * voir aussi pour la migration entity -> dataFront de cette partie
   */
  constructor(
    allies: CombatantEntity[],
    ennemies: CombatantEntity[]
  ) {
    this.allies = allies;
    this.ennemies = ennemies;
    this.combatants = [...this.allies, ...this.ennemies];
  }

  isFightOngoing(): boolean {
    return (
      this.allies.some((combatant) => combatant.isAlive()) &&
      this.ennemies.some((combatant) => combatant.isAlive())
    );
  }
  initializeFight() {
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
    attacker: CombatantEntity,
    target: CombatantEntity
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
    attacker: CombatantEntity,
    target: CombatantEntity
  ): void {
    const damage = target.calculateDamageReceived(attacker);
    target.updateHealth(damage);
  }

  getElementalTypeConfig(
    attacker: CombatantEntity,
    target: CombatantEntity
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
