import { Component, Injectable } from "@angular/core";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable
} from "@angular/material/table";
import {
    NiceFilterQueryParamsDirective,
    NiceFilterView,
    NiceFilterViewData,
    NiceFilterViewDataLoader,
    NiceFilterViewMatInputDirective,
    NiceFilterViewMatPaginatorDirective,
    NiceFilterViewMatSortDirective,
    NiceFilterViewMatTableDirective,
    NiceFilterViewParameters,
    provideNiceFilterView
} from "../../ngx-navigation";
import { Observable, of } from "rxjs";

export type Data = {
    name: string;
};

@Injectable()
export class DataLoader implements NiceFilterViewDataLoader<Data> {
    public fetchData(parameters: NiceFilterViewParameters): Observable<NiceFilterViewData<Data>> {
        return of({
            values: Array
                .from({ length: 100 }, (_, i) => ({
                    name: `test_${i + parameters.page.start + 1}`
                }))
                .filter((value) => value.name.includes(parameters.search?.value ?? ""))
                .slice(0, parameters.page.size),
            total: 100,
            page: {
                start: parameters.page.start,
                size: parameters.page.size
            }
        });
    }
}

@Component({
    selector: "nice-root",
    standalone: true,
    imports: [
        MatTable,
        MatSort,
        NiceFilterViewMatTableDirective,
        NiceFilterViewMatSortDirective,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        MatPaginator,
        NiceFilterViewMatPaginatorDirective,
        MatFormField,
        MatInput,
        NiceFilterViewMatInputDirective,
        NiceFilterQueryParamsDirective,
        MatHeaderCell,
        MatCell,
        MatHeaderCellDef,
        MatCellDef,
        MatSortHeader,
        MatColumnDef
    ],
    templateUrl: "./app.template.html",
    styleUrl: "./app.style.scss",
    providers: provideNiceFilterView({
        dataLoader: DataLoader,
        state: {}
    })
})
export class AppComponent extends NiceFilterView<Data> {
    public readonly columns = ["name"];
}
