export class Document<T> {
  // using options.force= true bypass the readony requirement but is only for privileged calls.
  constructor(
    private getState: () => T,
    private setState: (doc: T, options?: { force?: boolean }) => void,
    private getDefaultState: () => T,
  ) {}

  get(): T {
    return this.getState();
  }

  update(updater: (doc: T) => T): void {
    const document = this.get();
    const updated = updater(document);
    this.setState(updated);
  }

  _forceReset(): void {
    this.setState(this.getDefaultState(), { force: true });
  }
}
