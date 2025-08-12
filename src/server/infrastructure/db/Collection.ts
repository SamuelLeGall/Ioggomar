export class Collection<T extends { id: string }> {
  // using options.force= true bypass the readony requirement but is only for privileged calls.
  constructor(
    private getState: () => T[],
    private setState: (data: T[], options?: { force?: boolean }) => void,
    private getDefaultState: () => T[]
  ) {}

  getAll(): T[] {
    return this.getState();
  }

  getById(id: string): T | undefined {
    return this.getState().find((item) => item.id === id);
  }

  update(id: string, value: T): void {
    const items = this.getState();
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
      const updated = [...items];
      updated[index] = value;
      this.setState(updated);
    }
  }

  clear(): void {
    this.setState([]);
  }

  add(item: T): void {
    this.setState([...this.getState(), item]);
  }

  remove(id: string): void {
    this.setState(this.getState().filter((item) => item.id !== id));
  }

  _forceReset(): void {
    this.setState(this.getDefaultState(), { force: true });
  }
}
