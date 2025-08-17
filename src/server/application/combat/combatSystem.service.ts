import { CombatantEntity } from "@src/server/domain/entities/combatantEntity";
import {
  ElementalTypeConfig,
  ElementalTypesInteractions,
} from "@src/models/fight/ElementalTypesModels";
import {
  defaultElementalTypeConfig,
  elementalTypesGlobalConfig,
} from "@config/globalConstants/fighting/Elements/elementTypesConfig";
import {
  ErrorFactory,
  FrontendResult,
  Result,
  ResultFactory,
  TAction,
} from "@src/models/BasicAndTempModels";

/** FOR SOME GOOD MATHEMATICAL FONCTION FOR GRAPH (experience/damagedealt etc) - https://easings.net/ */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  constructor(allies: CombatantEntity[], ennemies: CombatantEntity[]) {
    this.allies = allies;
    this.ennemies = ennemies;
    this.combatants = [...this.allies, ...this.ennemies];
  }

  private isFightOngoing(): boolean {
    return (
      this.allies.some((combatant) => combatant.isAlive()) &&
      this.ennemies.some((combatant) => combatant.isAlive())
    );
  }

  // WIP
  private performAction(
    action: TAction,
    attacker: CombatantEntity,
    target: CombatantEntity,
  ): Result<boolean> {
    try {
      if (action !== "ATTACK") {
        return [null, ErrorFactory.combatActionNotFound(action)];
      }

      const resultAttack = this.attack(attacker, target);
      if (ResultFactory.isError(resultAttack)) {
        const [, errorAttack] = resultAttack;
        return [
          null,
          ErrorFactory.chainError(
            errorAttack,
            ErrorFactory.createContext("Service", "performAction", {
              action: action,
              attacker: attacker.getId(),
              target: target.getId(),
            }),
          ),
        ];
      }

      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Service", "attack", {
            attacker: attacker.getId(),
            target: target.getId(),
          }),
          e,
        ),
      ];
    }
  }

  private attack(
    attacker: CombatantEntity,
    target: CombatantEntity,
  ): Result<boolean> {
    try {
      const resultDamageReceived = target.calculateDamageReceived(attacker);
      if (ResultFactory.isError(resultDamageReceived)) {
        const [, errorDamageReceived] = resultDamageReceived;
        return [
          null,
          ErrorFactory.chainError(
            errorDamageReceived,
            ErrorFactory.createContext("Service", "attack", {
              attacker: attacker.getId(),
              attackerAtk: attacker.getAttack(),
              target: target.getId(),
              defenderDef: attacker.getDefense(),
            }),
          ),
        ];
      }
      const [damage] = resultDamageReceived;

      const resultHealthUpdated = target.updateHealth(damage);
      if (ResultFactory.isError(resultHealthUpdated)) {
        const [, errorHealthUpdated] = resultHealthUpdated;
        return [
          null,
          ErrorFactory.chainError(
            errorHealthUpdated,
            ErrorFactory.createContext("Service", "attack", {
              attacker: attacker.getId(),
              damage: damage,
              target: target.getId(),
              targethealth: target.getHealth(),
            }),
          ),
        ];
      }

      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Service", "attack", {
            attacker: attacker.getId(),
            target: target.getId(),
          }),
          e,
        ),
      ];
    }
  }

  private getElementalTypeConfig(
    attacker: CombatantEntity,
    target: CombatantEntity,
  ): Result<ElementalTypeConfig> {
    try {
      // if the attacker element is not in the global config --> we return a default config that will not give any bonus/malus
      if (!elementalTypesGlobalConfig[attacker.getElementalType()]) {
        return [defaultElementalTypeConfig, null];
      }
      const atkTypeConfig: ElementalTypesInteractions =
        elementalTypesGlobalConfig[attacker.getElementalType()];

      // if the target element is not in the attacker config --> we return a default config that will not give any bonus/malus
      const config =
        atkTypeConfig.effectOn[target.getElementalType()] ||
        defaultElementalTypeConfig;

      return [config, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Service", "getElementalTypeConfig", {
            attacker: attacker.getId(),
            attackerType: attacker.getElementalType(),
            target: target.getId(),
            targetType: target.getElementalType(),
          }),
          e,
        ),
      ];
    }
  }

  private isCriticalHit = (): boolean => {
    return false;
  };

  // speed - agility - dexterity - luck
  // high agility increase dodge rate
  // high dexterity increase crit rate and hit rate
  private checkDodgeSuccesfull = (): boolean => {
    return true;
  };

  private escapeFight() {
    return true;
  }

  public initializeFight(): FrontendResult<boolean> {
    try {
      const sortedCombatants = this.combatants.sort(
        (a, b) => a.getTimeBeforeNextAction() - b.getTimeBeforeNextAction(),
      );

      while (this.isFightOngoing()) {
        const currentCombatant = sortedCombatants[0];

        if (currentCombatant.isAlive()) {
          // TODO, see how the player can choose both the action and the target (if there is a target needed for the action)
          const resultAction = this.performAction(
            "ATTACK",
            currentCombatant,
            this.combatants[0],
          );
          if (ResultFactory.isError(resultAction)) {
            const [, errorAction] = resultAction;
            errorAction.logToConsole();
            return [null, errorAction.getPublicMessage()];
          }
        }

        // we actualize the timer for the  all combatants except the one that performed the action
        this.combatants.forEach((combatant) => {
          if (combatant !== currentCombatant && combatant.isAlive()) {
            combatant.updateTimeBeforeNextAction(
              currentCombatant.getTimeBeforeNextAction(),
            );
          }
        });

        // we reset the timer for the combatant that performed the action
        currentCombatant.resetTimeBeforeNextAction();
      }

      return [true, null];
    } catch (e) {
      console.error("initializeFight - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }
}
