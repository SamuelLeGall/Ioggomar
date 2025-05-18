export class Collection<T extends { id: string }> {
  constructor(private getState: () => T[], private setState: (data: T[]) => void) {}

  getAll(): T[] {
    return this.getState();
  }

  getById(id: string): T | undefined {
    return this.getState().find(item => item.id === id);
  }

  update(id: string, value: T): void {
    const items = this.getState();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      const updated = [...items];
      updated[index] = value;
      this.setState(updated);
    }
  }

  add(item: T): void {
    this.setState([...this.getState(), item]);
  }

  remove(id: string): void {
    this.setState(this.getState().filter(item => item.id !== id));
  }
}