<template>
  <ion-page>
    <p>Hello dashboard</p>
    <p>
      {{ dashboard }}
    </p>
  </ion-page>
</template>


<script setup lang="ts">
import {IonPage, onIonViewWillEnter} from "@ionic/vue";
import {ref} from "vue";
import type {Metric} from "@/services/aiAPI";
import {getMetricByRangeDate} from "@/services/metricAPI";

const dashboard = ref<Metric[]>([])

onIonViewWillEnter(async () => {
  try {
    dashboard.value = await getMetricByRangeDate(subtractMonths(new Date(),4), new Date())
  } catch (err) {
    console.log(err)
  }
})

function subtractMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}


</script>

<style>
</style>