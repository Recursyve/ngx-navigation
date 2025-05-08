import { Component } from "@angular/core";
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
    public readonly items = ["home", "home.dashboard", "sales", "sales.sales", "user"];
}
