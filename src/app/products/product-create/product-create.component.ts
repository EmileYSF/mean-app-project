import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  productCategories: { name: string, values: string[] }[] = [
    {
      name: "Vehicles",
      values: [
        "Cars",
        "Motos"
      ]
    },
    {
      name: "Fashion",
      values: [
        "Clothes",
        "Shoes",
        "Jewels",
        "Accessorieeeeeeees"
      ]
    },
    {
      name: "Various",
      values: [
        "Others",
      ]
    }
  ];
  private path = 'create';
  private productId: string;
  private authStatusSubscription: Subscription;

  constructor(
    public productsService: ProductsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {    
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      category: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('[1-9]{1}[0-9]{0,5}(.[0-9]{1,2})?'),
        ],
      }),
      description: new FormControl(null, { validators: [Validators.required, Validators.maxLength(1024)] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.path = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productsService
          .getProduct(this.productId)
          .subscribe((responseData) => {
            this.isLoading = false;
            this.product = {
              id: responseData._id,
              title: responseData.title,
              price: responseData.price,
              category: responseData.category,
              description: responseData.description,
              imagePath: responseData.imagePath,
              userId: responseData.userId,
            };
            this.form.setValue({
              title: this.product.title,
              category: responseData.category,
              price: this.product.price,
              description: this.product.description,
              image: this.product.imagePath,
            });
          });
      } else {
        this.path = 'create';
        this.productId = null;
      }
    });
  }

  onImageUpload(event: Event) {
    const image = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: image });
    this.form.get('image').updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
      let error = this.form.get('image').getError('invalidMimeType');
      if (error) {
        console.log(
          'ERROR: This type of file (' +
          this.form.get('image').getError('type') +
          ") is not an image!"
        );
      }
    };
    fileReader.readAsDataURL(image);
  }

  onRegisterProduct() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.path === 'create') {
      this.productsService.addProduct(
        this.form.value.title,
        this.form.value.category,
        this.form.value.price,
        this.form.value.description,
        this.form.value.image
      );
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.title,
        this.form.value.category,
        this.form.value.price,
        this.form.value.description,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
