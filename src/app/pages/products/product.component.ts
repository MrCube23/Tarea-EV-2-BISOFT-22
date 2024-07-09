import { Component, OnInit, inject } from '@angular/core';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ProductsListComponent } from '../../components/product/products-list/products-list.component';
import { ProductService } from '../../services/product.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { ProductsFormComponent } from '../../components/product/products-form/products-form.component';
import { IProduct, IRoleType } from '../../interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    LoaderComponent,
    ProductsListComponent,
    ModalComponent,
    ProductsFormComponent,
    CommonModule
    ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductsComponent implements OnInit{
  public productService: ProductService = inject(ProductService);
  public modalService: NgbModal = inject(NgbModal);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public authService: AuthService = inject(AuthService);
  public routeAuthorities: string[] = [];
  public areActionsAvailable: boolean = false;

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.productService.getAll();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  isAdmin(): boolean {
    return this.authService.hasAnyRole([IRoleType.admin, IRoleType.superAdmin]);
  }

  onFormEventCalled (params: IProduct) {
    this.productService.save(params);
    this.modalService.dismissAll();
  }

}
