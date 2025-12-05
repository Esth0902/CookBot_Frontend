<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label>Start Date</ion-label>
        <ion-datetime-button datetime="start-date"></ion-datetime-button>
        <ion-modal :keep-contents-mounted="true">
          <ion-datetime id="start-date" v-model="startDate"></ion-datetime>
        </ion-modal>
      </ion-item>
      <ion-item>
        <ion-label>End Date</ion-label>
        <ion-datetime-button datetime="end-date"></ion-datetime-button>
        <ion-modal :keep-contents-mounted="true">
          <ion-datetime id="end-date" v-model="endDate"></ion-datetime>
        </ion-modal>
      </ion-item>
      <ion-button @click="fetchMetrics" expand="block">Start</ion-button>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import {
  IonPage,
  onIonViewWillEnter,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonButton
} from "@ionic/vue";
import {ref} from "vue";
import type {Metric} from "@/services/aiAPI";
import {getMetricByRangeDate} from "@/services/metricAPI";
import {Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const dashboard = ref<Metric[]>([]);
const startDate = ref<string>(subtractMonths(new Date(), 4).toISOString());
const endDate = ref<string>(new Date().toISOString());

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

onIonViewWillEnter(async () => {
  await fetchMetrics();
});

const fetchMetrics = async () => {
  try {
    dashboard.value = await getMetricByRangeDate(new Date(startDate.value), new Date(endDate.value));
    const {labels, data} = processDataForChart(dashboard.value);
    createOrUpdateChart(labels, data);
  } catch (err) {
    console.error("Error fetching or processing metrics:", err);
  }
};

const processDataForChart = (metrics: Metric[]): { labels: string[], data: number[] } => {
  const monthlyData = new Array(12).fill(0);
  const monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  metrics.forEach(metric => {
    const date = new Date(metric.creationDate);
    const month = date.getMonth(); // 0-11
    if (metric.totalToken) {
      monthlyData[month] += metric.totalToken;
    }
  });

  return {labels: monthLabels, data: monthlyData};
};

const createOrUpdateChart = (labels: string[], data: number[]) => {
  if (!chartCanvas.value) {
    return;
  }
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) {
    return;
  }

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.update();
  } else {
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Tokens Used',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};

function subtractMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}
</script>

<style>
ion-button {
  margin-top: 16px;
  margin-bottom: 16px;
}

.chart-container {
  position: relative;
  height: 40vh;
  width: 80vw;
  margin: auto;
}
</style>