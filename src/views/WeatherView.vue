<script setup lang="ts">
import DisplayCharts from '@/components/DisplayCharts.vue';
import DisplayWeatherInfo from '@/components/DisplayWeatherInfo.vue';
import { useWeatherInfos } from '@/composables/useWeatherInfos';
const { loading, err, searchInput, callApisFromSearch, lastFiveWeather, toggleFn } = useWeatherInfos()
</script>

<template>
  <main class="max-w-4xl m-auto p-3 text-sm">
    <div class="flex flex-col gap-y-3 w-full">
      <h1 class="text-center items-center content-center text-lg">Weather Details</h1>
      <!--  -->
      <div class="w-full flex justify-between">
        <input v-model="searchInput" placeholder="search city"
          class="border boreder-blue-500 p-2 rounded-md w-[inherit]" />
        <button class="p-2 bg-blue-500 text-white rounded-md" @click="callApisFromSearch">Search</button>
      </div>
      <!--  -->
      <div class="text-center items-center content-center" v-if="loading">loading...</div>
      <!--  -->
      <div v-if="err.length" class="text-red-500">{{ err }}</div>
      <!--  -->
      <div v-if="lastFiveWeather.length">

        <div class="grid grid-cols-3 gap-1">
          <div class="flex flex-col gap-y-3 border border-blue-500 rounded-md p-3"
            v-for="(weatherAllDetail, index) in lastFiveWeather" :key="weatherAllDetail.id">
            <DisplayWeatherInfo :last-five-weather="weatherAllDetail" @toggle="toggleFn" :index="index" />
            <template v-if="weatherAllDetail.forecast">
              <DisplayCharts :forecast-details="weatherAllDetail.forecast" />
            </template>
          </div>

        </div>
      </div>

    </div>
  </main>
</template>
