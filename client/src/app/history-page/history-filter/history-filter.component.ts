import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {MaterialDatepicker, MaterialService} from "../../shared/classes/material.service";
import {Filter} from "../../shared/interfaces";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {

  @ViewChild('pickerFrom') pickerFromRef: ElementRef;
  @ViewChild('pickerTo') pickerToRef: ElementRef;

  @Output() onFilter = new EventEmitter<Filter>();

  start: MaterialDatepicker;
  end: MaterialDatepicker;
  order: number;

  isValid = true;

  ngOnDestroy() {
    this.start.destroy();
    this.end.destroy();
  }

  ngAfterViewInit() {
    this.start = MaterialService.initPicker(this.pickerFromRef, this.validate.bind(this));
    this.end = MaterialService.initPicker(this.pickerToRef, this.validate.bind(this));
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return
    }

    this.isValid = this.start.date <= this.end.date;
  }

  submitFilter() {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order
    }

    if (this.start.date) {
      filter.start = this.start.date
    }

    if (this.end.date) {
      filter.end = this.end.date
    }

    this.onFilter.emit(filter);
  }
}
