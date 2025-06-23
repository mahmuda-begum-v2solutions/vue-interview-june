<script setup lang="ts">
import type { ForecastType } from '@/types/WeatherTypes';
import { computed } from 'vue';
import { Chart as ChartJs, Legend, LineController, LineElement, PointElement, Title, Tooltip, LinearScale, CategoryScale } from 'chart.js';
import { LineChart } from 'vue-chart-3';

const props = defineProps<{
  forecastDetails: ForecastType
}>()

const chartData = computed(() => {
  const forecaseDataSets = {
    labels: [] as string[],
    datasets: [{
      label: 'in 7 days',
      data: [] as (string | number)[]
    }]
  } satisfies {
    labels: string[],
    datasets: { label: string, data: (string | number)[] }[]
  }

  props.forecastDetails?.list?.forEach(element => {
    forecaseDataSets.labels.push(element.weather[0]?.description || '')
    forecaseDataSets.datasets[0].data.push(element.main.temp)
  });

  return forecaseDataSets
})

ChartJs.register(Legend, LineController, LineElement, LinearScale, PointElement, Title, Tooltip, CategoryScale)


const chartOptions = {
  responsive: true
}
</script>
<template>
  <LineChart :chart-data="chartData" :chart-options="chartOptions"></LineChart>
</template>
