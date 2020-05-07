import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;

  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  form: FormGroup;
  positionId = null

  constructor(private positionsService: PositionsService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    });

    this.loading = true;
    this.positionsService.fetch(this.categoryId)
      .subscribe(
        positions => {
          this.positions = positions;
          this.loading = false
        },
        error => MaterialService.toast(error.error.message)
      )
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs()
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = confirm(`Удалить позицию ${position.name}?`);

    if(decision) {
      this.positionsService.remove(position)
        .subscribe(
          res => {
            const idx = this.positions.findIndex(p => p._id === position._id);
            this.positions.splice(idx, 1);
            MaterialService.toast(res.message);
          },
          error => MaterialService.toast(error.error.message),
        )
    }
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: null,
      cost: null
    });
    this.modal.open();
    MaterialService.updateTextInputs()
  }

  onModalClose() {
    this.modal.close();
    this.form.reset({name: null, cost: null});
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const complete = () => {
      this.onModalClose();
      this.form.enable()
    };

    if (this.positionId) {
      newPosition._id = this.positionId;

      this.positionsService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Позиция обновлена');
        },
        error => MaterialService.toast(error.error.message),
        complete
      )
    } else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана');
          this.positions.push(position)
        },
        error => MaterialService.toast(error.error.message),
        complete
      )
    }
  }
}
