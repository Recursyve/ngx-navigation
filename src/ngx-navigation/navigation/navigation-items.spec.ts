import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { NiceBasicNavigationItems } from "./navigation-items";

@Component({
    template: `
        <nice-basic-navigation link="/dashboard" [exact]="exact">
            <span itemTitle>Dashboard</span>
        </nice-basic-navigation>
    `,
    imports: [NiceBasicNavigationItems]
})
class TestHostComponent {
    public exact = false;
}

describe("NiceBasicNavigationItems", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let harness: RouterTestingHarness;
    let host: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [
                provideRouter([
                    { path: "dashboard", component: TestHostComponent },
                    { path: "dashboard/users", component: TestHostComponent }
                ])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        harness = await RouterTestingHarness.create();
        fixture.detectChanges();
    });

    function getNavigationItem(): HTMLElement {
        return fixture.nativeElement.querySelector(".nice-navigation-basic-item");
    }

    it("marks the item active on a child route by default", async () => {
        await harness.navigateByUrl("/dashboard/users");
        fixture.detectChanges();

        expect(getNavigationItem().classList.contains("item-active")).toBe(true);
    });

    it("marks the item inactive on a child route when exact is true", async () => {
        host.exact = true;
        fixture.detectChanges();

        await harness.navigateByUrl("/dashboard/users");
        fixture.detectChanges();

        expect(getNavigationItem().classList.contains("item-active")).toBe(false);
    });

    it("marks the item active on the exact route when exact is true", async () => {
        host.exact = true;
        fixture.detectChanges();

        await harness.navigateByUrl("/dashboard");
        fixture.detectChanges();

        expect(getNavigationItem().classList.contains("item-active")).toBe(true);
    });
});
