import {
    AfterContentInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    Directive, effect,
    inject,
    input,
    signal,
    ViewContainerRef
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NiceNavigationItemRef, NiceNavigationItemRefContext } from "./navigation-item-ref";
import { NiceNavigationOutlet } from "./navigation";
import { NavigationStore } from "./store";

@Directive()
export abstract class NiceNavigationItemsRenderer implements AfterContentInit {
    protected readonly _contentItemRef = contentChildren(NiceNavigationItemRef, { descendants: true });

    public items = computed(() => {
        const items = this.store.items();
        const path = this._getPath();
        if (!path) {
            return items;
        }

        return items.filter((item) => item.startsWith(`${path}.`)).map((item) => item.replace(`${path}.`, ""));
    });

    public ref: NiceNavigationItemRef | null = inject(NiceNavigationItemRef, { optional: true });
    public contentItemRefByName = new Map<string, NiceNavigationItemRef>();
    public _navigationOutlet: NiceNavigationOutlet | null = null;
    private _hasInitialized = false;

    protected readonly store = inject(NavigationStore);

    constructor() {
        effect(() => {
            this._render();
        }, {
            allowSignalWrites: true
        });
    }

    public ngAfterContentInit(): void {
        this._hasInitialized = true;
        this._cacheItemsRef();
        this._render();
    }

    public _outletAssigned(): void {
        if (this._navigationOutlet) {
            this._render();
        }
    }

    public _render(): void {
        if (!this._hasInitialized) {
            return;
        }

        this._navigationOutlet?.viewContainer.clear();

        const items = this.items();
        for (const item of items) {
            const itemRef = this.contentItemRefByName.get(item);
            if (itemRef) {
                const viewRef = this._navigationOutlet?.viewContainer.createEmbeddedView<NiceNavigationItemRefContext>(
                    itemRef.templateRef
                );
                if (viewRef) {
                    viewRef.context.$implicit = item;
                }
            }
        }
    }

    public _cacheItemsRef(): void {
        if (!this._contentItemRef()) {
            return;
        }

        const itemsRef = this._contentItemRef()
        for (const ref of itemsRef) {
            const name = ref.name();
            if (!name) {
                continue;
            }

            this.contentItemRefByName.set(name, ref);
        }
    }

    private _getPath(): string {
        const path: string[] = [];

        let ref = this.ref;
        while (ref) {
            const name = ref.name();
            if (!name) {
                continue;
            }

            path.unshift(name);
            ref = ref.parentRef;
        }

        return path.join(".");
    }
}

@Component({
    selector: "nice-basic-navigation",
    templateUrl: "./basic/item-basic.template.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class NiceBasicNavigationItems {
    public link = input.required<string>();
}

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
    templateUrl: "./collapsable/item-collapse.template.html",
    providers: [{ provide: NiceNavigationItemsRenderer, useExisting: NavigationCollapse }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NiceNavigationCollapseOutlet],
    standalone: true
})
export class NavigationCollapse extends NiceNavigationItemsRenderer {
    public chevron = input(true, { transform: booleanAttribute });
    public collapsed = signal(true);

    public toggleCollapse(): void {
        this.collapsed.set(!this.collapsed());
    }
}

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
    templateUrl: "./section/item-section.template.html",
    providers: [{ provide: NiceNavigationItemsRenderer, useExisting: NavigationSection }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NiceNavigationSectionOutlet],
    standalone: true
})
export class NavigationSection extends NiceNavigationItemsRenderer {}
