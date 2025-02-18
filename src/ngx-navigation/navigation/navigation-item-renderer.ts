import { AfterContentInit, computed, contentChildren, Directive, inject } from "@angular/core";
import { NiceNavigationItemRef, NiceNavigationItemRefContext } from "./navigation-item-ref";
import { NiceNavigationOutlet } from "./navigation";
import { NavigationStore } from "./store";

@Directive()
export abstract class NiceNavigationItemsRenderer implements AfterContentInit {
    protected readonly _contentItemRef = contentChildren(NiceNavigationItemRef, { descendants: true });

    public contentItemRefByName = new Map<string, NiceNavigationItemRef>();
    public items = computed(() => {
        const path = this._getPath();
        const items = this.store.items();
        return items.filter((item) => item.startsWith(`${path}.`)).map((item) => item.replace(`${path}.`, ""));
    });

    public ref: NiceNavigationItemRef | null = inject(NiceNavigationItemRef, { optional: true });
    public _navigationOutlet: NiceNavigationOutlet | null = null;
    private _hasInitialized = false;

    protected readonly store = inject(NavigationStore);

    public ngAfterContentInit(): void {
        this._hasInitialized = true;
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

        this._cacheItemsRef();
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
        if (!this._contentItemRef) {
            return;
        }

        const itemsRef = this._contentItemRef()
        for (const ref of itemsRef) {
            this.contentItemRefByName.set(ref.name(), ref);
        }
    }

    private _getPath(): string {
        const path: string[] = [];

        let ref = this.ref;
        while (ref) {
            path.unshift(ref.name());
            ref = ref.parentRef;
        }

        return path.join(".");
    }
}
