<script setup lang="ts">
import type { FiveWeatherInfo } from '@/types/WeatherTypes';

defineProps<{
  lastFiveWeather: FiveWeatherInfo,
  index: number
}>()

defineEmits<{
  (e: 'toggle', val: { indexNumber: number; lat: number | undefined; lon: number | undefined, units: 'metric' | 'imperial' }): void
}>()
</script>
<template>
  <div class="flex justify-between">
    <p>{{ lastFiveWeather.name }}</p>
    <div>
      <button class="p-2 bg-blue-500 text-white rounded-md"
        @click="$emit('toggle', { indexNumber: index, lat: lastFiveWeather.latlon?.lat, lon: lastFiveWeather.latlon?.lon, units: lastFiveWeather.units })">Toggle
        {{ lastFiveWeather.units }}</button>
    </div>
  </div>
  <div>
    <p>Temperature: {{ lastFiveWeather.weatherDetail?.main.temp }}</p>
    <p>Weather description: {{ lastFiveWeather.weatherDetail?.weather[0].description }}</p>
    <p>Visibility: {{ lastFiveWeather.weatherDetail?.visibility }}</p>
    <p>Humidity: {{ lastFiveWeather.weatherDetail?.main.humidity }}</p>
    <p>Wind speed: {{ lastFiveWeather.weatherDetail?.wind.speed }}</p>
  </div>
</template>
