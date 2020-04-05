import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './product.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class ProductsService {
  private baseURL = "http://localhost:3000";
  private products: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getProducts() {
    this.httpClient.get<{ products: any }>(this.baseURL + "/api/products")
    .pipe(map(data => {
      return data.products.map(product => {
        return {
          id: product._id,
          title: product.title,
          description: product.description
        };
      });
    }))
    .subscribe(transformedData => {
      this.products = transformedData;
      this.productsUpdated.next([...this.products]);
    });
  }

  getProduct(id : string) {
    return this.httpClient.get<{ _id: string, title: string, description: string }>(this.baseURL + "/api/products/" + id);
  }

  getProductUpdatedListener() {
    return this.productsUpdated.asObservable();
  }

  addProduct(title: string, description: string) {
    const product: Product = {
      id: null,
      title: title,
      description: description
    }
    this.httpClient.post<{ id: string }>(this.baseURL + "/api/products", product)
    .subscribe((data) => {
      product.id = data.id;
      this.products.push(product);
      this.productsUpdated.next([...this.products]);
      this.router.navigate(["/"]);
    });
  }

  updateProduct(id: string, title: string, description: string) {
    const product: Product = {
      id: id,
      title: title,
      description: description
    };
    this.httpClient.put(this.baseURL + "/api/products/" + id, product)
    .subscribe(data => {
      const updatedProducts = [...this.products];
      const updatedProductIndex = updatedProducts.findIndex(p => p.id === product.id);
      updatedProducts[updatedProductIndex] = product;
      this.products = updatedProducts;
      this.productsUpdated.next([...this.products]);
      this.router.navigate(["/"]);
    });
  }

  deleteProduct(productId: string) {
    this.httpClient.delete(this.baseURL + "/api/products/" + productId).subscribe(() => {
      this.products = this.products.filter(product => product.id !== productId);
      this.productsUpdated.next([...this.products]);
    });
  }
}
