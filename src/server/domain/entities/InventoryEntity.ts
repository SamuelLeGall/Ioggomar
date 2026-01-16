import {
  ActiveItem,
  Inventory,
} from "@src/server/models/inventory/inventory.db.model";
import * as generalUtils from "@src/server/utils/GeneralUtils";

export class InventoryEntity {
  private readonly inventory: Inventory;

  private constructor(inventory: Inventory) {
    this.inventory = inventory;
  }

  // For recreating from raw/persisted data
  public static fromData(data: Inventory): InventoryEntity {
    return new InventoryEntity(data);
  }

  public getId() {
    return this.inventory.id;
  }

  public getItems(): ActiveItem[] {
    return this.inventory.data;
  }
  private updateItems(newValue: ActiveItem[]): void {
    this.inventory.data = newValue;
  }
  public deleteItems(uuids: string[]) {
    const result: ActiveItem[] = this.getItems().filter(
      (el) => !uuids.includes(el.id),
    );
    this.updateItems(result);
  }
  public addItems(items: ActiveItem[]): void {
    this.updateItems(this.getItems().concat(items));
  }

  public getItemIndexByUUID(uuid: string): number {
    return this.inventory.data.findIndex((el) => el.id === uuid);
  }
  public getItemByUUID(uuid: string): ActiveItem | undefined {
    return this.inventory.data.find((el) => el.id === uuid);
  }
  public updateItem(
    uuid: string,
    newValue: ActiveItem,
  ): ActiveItem | undefined {
    const index = this.getItemIndexByUUID(uuid);
    if (index === -1) {
      return;
    }
    this.inventory.data.splice(index, 1, newValue);
  }
  public addItem(item: ActiveItem): void {
    this.addItems([item]);
  }
  public shouldItemBeRemoved(uuid: string, quantity: number): boolean {
    const item = this.getItemByUUID(uuid);
    if (!item) {
      return false;
    }
    return item.quantity <= quantity;
  }
  public deleteItem(uuid: string) {
    this.deleteItems([uuid]);
  }
  public splitItem(uuid: string) {
    const selectedItem = this.getItemByUUID(uuid);
    if (!selectedItem) {
      return;
    }

    // divide in half the requested item
    const newQuantity: number = Math.floor(selectedItem.quantity / 2);
    selectedItem.quantity = selectedItem.quantity - newQuantity;

    // add a new item with the wanted quantity
    this.addItems([
      {
        ...selectedItem,
        id: generalUtils.generateUUID(),
        quantity: newQuantity,
      },
    ]);
  }
}
