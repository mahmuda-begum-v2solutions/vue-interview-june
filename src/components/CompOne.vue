<script setup lang="ts">
import type { FiveWeatherInfo } from '@/types/typesCode';

defineProps<{
  lastFiveWeather: FiveWeatherInfo[]
}>()

defineEmits<{
  (e: 'toggle', val: { indexNumber: number; lat: number | undefined; lon: number | undefined }): void
}>()
</script>
<template>
  <div class="grid grid-cols-3 gap-1">
    <div class="flex flex-col gap-y-3 border border-blue-500 rounded-md p-3"
      v-for="(weatherAllDetail, index) in lastFiveWeather" :key="weatherAllDetail.id">
      <div class="flex justify-between">
        <p>{{ weatherAllDetail.name }}</p>
        <div>
          <button class="p-2 bg-blue-500 text-white rounded-md"
            @click="$emit('toggle', { indexNumber: index, lat: weatherAllDetail.latlon?.lat, lon: weatherAllDetail.latlon?.lon })">Toggle
            {{ weatherAllDetail.units }}</button>
        </div>
      </div>
      <div>
        <p>Temperature: {{ weatherAllDetail.weatherDetail?.main.temp }}</p>
        <p>Weather description: {{ weatherAllDetail.weatherDetail?.weather[0].description }}</p>
        <p>Visibility: {{ weatherAllDetail.weatherDetail?.visibility }}</p>
        <p>Humidity: {{ weatherAllDetail.weatherDetail?.main.humidity }}</p>
        <p>Wind speed: {{ weatherAllDetail.weatherDetail?.wind.speed }}</p>
      </div>
    </div>
    <div v-if="lastFiveWeather.forecast">
      Chart
    </div>
  </div>
</template>
