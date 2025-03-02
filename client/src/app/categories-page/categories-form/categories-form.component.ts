import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {of} from "rxjs";
import {switchMap} from "rxjs/operators";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";
import {Observable} from "rxjs";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef;
  category: Category;
  form: FormGroup;
  image: File;
  imagePreview: string;
  isNew = true;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params.id) {
            this.isNew = false;
            return this.categoriesService.getById(params.id)
          }
          return of(null)
        })
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.image;
            MaterialService.updateTextInputs()
          }

          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  deleteCategory() {
    const decition = window.confirm(`Вы уверены, что хотите удалить категорию ${this.category.name}`);

    if (decition) {
      this.categoriesService.remove(this.category._id)
        .subscribe(
          res => MaterialService.toast(res.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string
    };

    reader.readAsDataURL(file)
  }

  onSubmit() {
    let obs$: Observable<Category>;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Изменения сохранены');
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable()
      }
    )
  }

}
