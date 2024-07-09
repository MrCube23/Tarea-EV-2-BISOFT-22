import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProduct, ICategory } from '../../../interfaces';
import { CategoryService } from '../../../services/category.service'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() toUpdateProduct: IProduct = {};
  @Output() callParentEvent: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  categories: ICategory[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  addEdit() {
    this.callParentEvent.emit(this.toUpdateProduct);
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(
      (data: ICategory[]) => {
        this.categories = data;
      },
      (error: any) => {
        console.error('Error loading categories:', error);
      }
    );
  }
}
