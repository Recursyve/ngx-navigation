import { ChangeDetectionStrategy, Component, Directive, effect, inject, input, ViewContainerRef } from "@angular/core";
import { NiceNavigationItemsRenderer } from "./navigation-items";
import { NavigationStore } from "./store";

@Directive({
    selector: "[niceNavigationOutlet]",
    standalone: true
})
export class NiceNavigationOutlet {
    constructor(public viewContainer: ViewContainerRef) {
        const navigation = inject(NiceNavigationItemsRenderer);
        navigation._navigationOutlet = this;
        navigation._outletAssigned();
    }
}

@Component({
    selector: "nice-navigation",
    templateUrl: "navigation.template.html",
    providers: [NavigationStore, { provide: NiceNavigationItemsRenderer, useExisting: NiceNavigation }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NiceNavigationOutlet]
})
export class NiceNavigation extends NiceNavigationItemsRenderer {
    public _items = input.required<string[]>({ alias: "items" });

    constructor() {
        super();

        effect(() => {
            this.store.setItems([...this._items()]);
        });
    }
}
