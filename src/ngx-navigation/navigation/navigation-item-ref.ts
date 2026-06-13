import { Directive, forwardRef, inject, input, TemplateRef } from "@angular/core";
import { NiceNavigationItemsRenderer } from "./navigation-items";

export type NiceNavigationItemRefContext = {
    $implicit: string;
};

@Directive({
    selector: "[niceNavigationItemRef]",
    standalone: true
})
export class NiceNavigationItemRef {
    public readonly name = input<string | null>(null, { alias: "niceNavigationItemRef" });

    public get parentRef(): NiceNavigationItemRef | null {
        return this.navigation?.ref ?? null;
    }

    protected navigation: NiceNavigationItemsRenderer | null = inject(
        forwardRef(() => NiceNavigationItemsRenderer),
        { optional: true, skipSelf: true }
    );

    constructor(public templateRef: TemplateRef<NiceNavigationItemRefContext>) {}
}
