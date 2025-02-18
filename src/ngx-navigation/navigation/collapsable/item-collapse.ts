import { ChangeDetectionStrategy, Component, Directive, inject, signal, ViewContainerRef } from "@angular/core";
import { NiceNavigationItemsRenderer } from "../navigation-item-renderer";

@Directive({
    selector: "[niceNavigationCollapseOutlet]",
    standalone: true,
})
export class NiceNavigationCollapseOutlet {
    constructor(public viewContainer: ViewContainerRef) {
        const navigation = inject(NiceNavigationItemsRenderer);
        navigation._navigationOutlet = this;
        navigation._outletAssigned();
    }
}

@Component({
    selector: "nice-navigation-collapse",
    templateUrl: "item-collapse.template.html",
    providers: [{ provide: NiceNavigationItemsRenderer, useExisting: NavigationCollapse }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NiceNavigationCollapseOutlet],
    standalone: true
})
export class NavigationCollapse extends NiceNavigationItemsRenderer {
    public collapsed = signal(true);

    public toggleCollapse(): void {
        this.collapsed.set(!this.collapsed());
    }
}
