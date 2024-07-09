import { ProductService } from '../../../services/product.service';
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { IAuthority, IProduct, IRoleType } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal.component';
import { ProductsFormComponent } from '../products-form/products-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ProductsFormComponent
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnChanges{
  @Input() itemList: IProduct[] = [];
  @Input() areActionsAvailable: boolean = false;
  public selectedItem: IProduct = {};
  private productService = inject(ProductService);
  public modalService = inject(NgbModal);
  private authService = inject(AuthService);

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
  }

  showDetailModal(item: IProduct, modal:any) {
    this.selectedItem = {...item};
    modal.show(); 
  }

  isAdmin(): boolean {
    return this.authService.hasAnyRole([IRoleType.admin, IRoleType.superAdmin]);
  }
  
  onFormEventCalled (params: IProduct) {
    this.productService.update(params);
    this.modalService.dismissAll();
  }

  deleteProduct (product: IProduct) {
    this.productService.delete(product);
  }
}
