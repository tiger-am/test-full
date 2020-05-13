import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {Chart} from "chart.js";


@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  aSub: Subscription;
  average: number;
  pending = true;

  constructor(private service: AnalyticsService) {
  }

  ngOnDestroy() {
    if (this.aSub)
      this.aSub.unsubscribe()
  }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    };

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    };

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      const createChart = (config: any, ref: ElementRef, name: string): void => {
        config.labels = data.chart.map(item => item.label);
        config.data = data.chart.map(item => item[name]);

        const ctx = ref.nativeElement.getContext('2d');
        ctx.canvas.height = '300px';
        new Chart(ctx, createChartConfig(config));
      };

      this.average = data.average;

      createChart(gainConfig, this.gainRef, 'gain');
      createChart(orderConfig, this.orderRef, 'order');

      this.pending = false;
    })
  }

}


function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
