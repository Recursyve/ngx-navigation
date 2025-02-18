import { ChangeDetectionStrategy, Component, Directive, inject, ViewContainerRef } from "@angular/core";
import { NiceNavigationItemsRenderer } from "../navigation-item-renderer";

@Directive({
    selector: "[niceNavigationSectionOutlet]",
    standalone: true,
})
export class NiceNavigationSectionOutlet {
    constructor(public viewContainer: ViewContainerRef) {
        const navigation = inject(NiceNavigationItemsRenderer);
        navigation._navigationOutlet = this;
        navigation._outletAssigned();
    }
}

@Component({
    selector: "nice-navigation-section",
    templateUrl: "item-section.template.html",
    providers: [{ provide: NiceNavigationItemsRenderer, useExisting: NavigationSection }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NiceNavigationSectionOutlet],
    standalone: true
})
export class NavigationSection extends NiceNavigationItemsRenderer {}
