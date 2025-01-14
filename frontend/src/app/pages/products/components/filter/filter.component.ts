import { Component, Input } from '@angular/core';
import { IFilterationDto } from '../../../../core/models/interfaces/IFilteration';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Input('filterItem') filterItem!: IFilterationDto[];
  selectedFilters: { [key: string]: string | null } = {};

  onChange(filterName: string, value: string) {
    if (this.selectedFilters[filterName] === value) {
      this.selectedFilters[filterName] = null;  
    } else {
      this.selectedFilters[filterName] = value;  
    }
    console.log(this.selectedFilters[filterName]);
  }
}

