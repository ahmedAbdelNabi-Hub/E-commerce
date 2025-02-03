import { AfterViewInit, Component, Input } from '@angular/core';
import { HoverService } from '../../../../../core/services/hover.service';
import { Menu } from '../../../../../core/models/interfaces/navbar.model';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements AfterViewInit{
  @Input('menuCategories') menuCategories!:Menu[];
  constructor(private _hoverService:HoverService){}
  ngAfterViewInit(): void {}
   
}
