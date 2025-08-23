import {
  ErrorFactory,
  QueryParam,
  Result,
} from "@src/models/BasicAndTempModels";

export class Collection<T extends { id: string }> {
  // using options.force= true bypass the readony requirement but is only for privileged calls.
  constructor(
    private getState: () => T[],
    private setState: (data: T[], options?: { force?: boolean }) => void,
    private getDefaultState: () => T[],
    private instanceName: string,
  ) {}

  find(query: QueryParam<T>): Result<T[]> {
    try {
      const items = this.getState();
      let filteredItems: T[];

      if (typeof query === "function") {
        // Handle predicate function
        filteredItems = items.filter(query);
      } else {
        // Handle object filter
        filteredItems = items.filter((item) => {
          return Object.entries(query).every(([key, value]) => {
            const itemValue = item[key as keyof T];
            return itemValue === value;
          });
        });
      }

      return [filteredItems, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Collection", "find", {
            query,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  findOne(query: QueryParam<T>): Result<T | null> {
    try {
      const [items, error] = this.find(query);

      if (error) {
        return [null, error];
      }

      return [items[0] ?? null, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Collection", "findOne", {
            query,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  update(id: string, value: T): Result<boolean> {
    try {
      const items = this.getState();
      const index = items.findIndex((i) => i.id === id);

      if (index === -1) {
        return [
          null,
          ErrorFactory.resourceNotFound(
            ErrorFactory.createContext("Collection", "update", {
              id,
              instanceName: this.instanceName,
            }),
            this.instanceName,
            id,
          ),
        ];
      }

      const updated = [...items];
      updated[index] = value;
      this.setState(updated);
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Collection", "update", {
            id,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  add(item: T): Result<boolean> {
    try {
      // Check for duplicates
      const existing = this.getState().find((i) => i.id === item.id);
      if (existing) {
        return [
          null,
          ErrorFactory.resourceConflict(
            ErrorFactory.createContext("Collection", "add", {
              id: item.id,
              instanceName: this.instanceName,
            }),
            this.instanceName,
            item.id,
          ),
        ];
      }

      this.setState([...this.getState(), item]);
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Collection", "add", {
            id: item.id,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  remove(id: string): Result<boolean> {
    try {
      const items = this.getState();
      const exists = items.some((item) => item.id === id);

      if (!exists) {
        return [
          null,
          ErrorFactory.resourceNotFound(
            ErrorFactory.createContext("Collection", "remove", {
              id,
              instanceName: this.instanceName,
            }),
            this.instanceName,
            id,
          ),
        ];
      }

      this.setState(items.filter((item) => item.id !== id));
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Collection", "remove", {
            id,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  clear(): Result<boolean> {
    try {
      this.setState([]);
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Collection", "clear", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  _forceReset(): Result<boolean> {
    try {
      this.setState(this.getDefaultState(), { force: true });
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Collection", "_forceReset", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
