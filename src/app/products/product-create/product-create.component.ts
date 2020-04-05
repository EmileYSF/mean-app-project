import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ProductsService } from '../products.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  product: Product;
  isLoading = false;
  private path = "create";
  private productId: string;

  constructor(public productsService: ProductsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("productId")) {
        this.path = "edit";
        this.productId = paramMap.get("productId");
        this.isLoading = true;
        this.productsService.getProduct(this.productId)
        .subscribe(data => {
          this.isLoading = false;
          this.product = {
            id: data._id,
            title: data.title,
            description: data.description
          }
        });
      } else {
        this.path = "create";
        this.productId = null;
      }
    });
  }

  onRegisterProduct(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.path === "create") {
      this.productsService.addProduct(form.value.title, form.value.description);
    } else {
      this.productsService.updateProduct(
        this.productId,
        form.value.title,
        form.value.description);
    }
    form.resetForm();
  }
}
