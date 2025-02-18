import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: "nice-basic-navigation",
    templateUrl: "item-basic.template.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class NiceBasicNavigationItems {
    public link = input.required<string>();
}
