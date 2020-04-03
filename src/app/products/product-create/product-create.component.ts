import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Product } from '../product.model';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  constructor(public productsService: ProductsService) { }

  ngOnInit(): void {
  }

  onRegisterProduct(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.productsService.addProduct(form.value.title, form.value.description);
    form.resetForm();
  }
}
