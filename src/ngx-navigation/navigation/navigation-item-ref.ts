import { Directive, inject, input, TemplateRef } from "@angular/core";
import { NiceNavigation } from "./navigation";

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

    protected navigation: NiceNavigation | null = inject(NiceNavigation, { optional: true, skipSelf: true });

    constructor(public templateRef: TemplateRef<NiceNavigationItemRefContext>) {}
}
