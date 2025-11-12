import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {
    NavigationCollapse,
    NavigationSection,
    NiceBasicNavigationItems,
    NiceNavigation,
    NiceNavigationItemRef
} from "@recursyve/ngx-navigation";

@Component({
    selector: "nice-root",
    imports: [
        NiceNavigation,
        NavigationSection,
        NiceBasicNavigationItems,
        NavigationCollapse,
        RouterOutlet,
        NiceNavigationItemRef,
        NavigationSection
    ],
    templateUrl: "./app.template.html",
    styleUrl: "./app.style.scss"
})
export class AppComponent {
    public readonly itemsA = ["home", "home.dashboard", "user"];
    public readonly itemsB = ["home", "home.dashboard", "sales", "sales.sales", "user"];

    public readonly items = signal(this.itemsA);

    public toggle(): void {
        this.items.set(this.items() === this.itemsA ? this.itemsB : this.itemsA);
    }
}
