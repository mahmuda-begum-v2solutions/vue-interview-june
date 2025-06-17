<script setup lang="ts">
import CompOne from '@/components/CompOne.vue';
import { useComposableCodes } from '@/composables/useComposableCode';
const { loading, err, searchInput, callApisFromSearch, lastFiveWeather, toggleFn } = useComposableCodes()
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
        <CompOne :last-five-weather="lastFiveWeather" @toggle="toggleFn" />
      </div>

    </div>
  </main>
</template>
