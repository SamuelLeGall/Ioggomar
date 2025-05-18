export class Document<T> {
  constructor(private getState: () => T, private setState: (doc: T) => void) {}

  get(): T {
    return this.getState();
  }

  update(updater: (doc: T) => T): void {
    const document = this.get();
    const updated = updater(document);
    this.setState(updated);
  }
}
