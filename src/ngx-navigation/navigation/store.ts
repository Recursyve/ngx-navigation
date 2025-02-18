import { Injectable, signal } from "@angular/core";

@Injectable()
export class NavigationStore {
    private readonly _items = signal<string[]>([]);

    public readonly items = this._items.asReadonly();

    public setItems(items: string[]): void {
        this._items.set(items);
    }
}
