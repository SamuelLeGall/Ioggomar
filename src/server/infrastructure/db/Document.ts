import { ErrorFactory, Result } from "@src/models/BasicAndTempModels";

export class Document<T> {
  // using options.force= true bypass the readony requirement but is only for privileged calls.
  constructor(
    private getState: () => T,
    private setState: (doc: T, options?: { force?: boolean }) => void,
    private getDefaultState: () => T,
    private instanceName: string,
  ) {}

  get(): Result<T> {
    try {
      const document = this.getState();
      return [document, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Document", "get", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  update(updater: (doc: T) => T): Result<T> {
    try {
      const document = this.getState();
      const updated = updater(document);
      this.setState(updated);
      return [updated, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Document", "update", {
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
          ErrorFactory.createContext("Document", "_forceReset", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
