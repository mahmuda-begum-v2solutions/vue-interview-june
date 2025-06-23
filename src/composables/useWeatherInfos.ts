import type {
  AllWeatherInfo,
  FiveWeatherInfo,
  ForecastType,
  LatlonType,
  WeatherType,
} from '@/types/WeatherTypes'
import { apiCallFn } from '@/utils/api'
import { ref } from 'vue'

export function useWeatherInfos() {
  const loading = ref(false)
  const err = ref('')
  const apiweatherInfo = ref<AllWeatherInfo>({ latlon: null, weatherDetail: null, forecast: null })
  const lastFiveWeather = ref<FiveWeatherInfo[]>([])
  const searchInput = ref('')
  const units = ref<'metric' | 'imperial'>('metric')

  const API_KEY = 'b93636ba461c7294ecf793aae36a3107'

  // const callApisFromSearch = async () => {
  //   if (loading.value) return
  //   units.value = 'metric'
  //   const city = searchInput.value.trim()
  //   if (city === '') return

  //   try {
  //     const latlongUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
  //     const apiInfo = await apiCallFn<LatlonType>(latlongUrl, (data) => (data as LatlonType[])[0])
  //     apiweatherInfo.value.latlon = apiInfo
  //     await callWeatherApi(apiweatherInfo.value.latlon.lat, apiweatherInfo.value.latlon.lon)
  //     const nameUnit = { name: city, units: units.value, id: `${units.value}_${city}` }
  //     const newWeatherDetails = { ...apiweatherInfo.value, ...nameUnit }
  //     if (lastFiveWeather.value.length === 5) lastFiveWeather.value.pop()
  //     lastFiveWeather.value.unshift(newWeatherDetails)
  //   } catch (error) {
  //     consoleErr((error as Error).message || 'callApisFromSearch failed')
  //   } finally {
  //     loading.value = false
  //     searchInput.value = ''
  //   }
  // }

  const callApisFromSearch = async () => {
    if (loading.value) return
    units.value = 'metric'
    const city = searchInput.value.trim().toLowerCase()
    if (city === '') return

    const id = `${units.value}_${city}`

    // already exists in the cache — skip
    const alreadyExists = lastFiveWeather.value.some((item) => item.id === id)
    if (alreadyExists) {
      console.log(`City "${city}" already cached with units "${units.value}"`)
      searchInput.value = ''
      return
    }

    try {
      loading.value = true

      const latlongUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
      const apiInfo = await apiCallFn<LatlonType>(latlongUrl, (data) => (data as LatlonType[])[0])
      apiweatherInfo.value.latlon = apiInfo

      await callWeatherApi(apiInfo.lat, apiInfo.lon)

      const nameUnit = { name: city, units: units.value, id }
      const newWeatherDetails = { ...apiweatherInfo.value, ...nameUnit }

      if (lastFiveWeather.value.length === 5) lastFiveWeather.value.pop()
      lastFiveWeather.value.unshift(newWeatherDetails)
    } catch (error) {
      consoleErr((error as Error).message || 'callApisFromSearch failed')
    } finally {
      loading.value = false
      searchInput.value = ''
    }
  }

  const callWeatherApi = async (
    lat: number | undefined,
    lon: number | undefined,
    fromToggle?: number,
    unitshere?: 'metric' | 'imperial',
  ) => {
    const unitVal = unitshere ? unitshere : units.value
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitVal}`
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitVal}&cnt=7`

    const [weatherData, forecastData] = await Promise.allSettled([
      apiCallFn<WeatherType>(weatherUrl),
      apiCallFn<ForecastType>(forecastUrl),
    ])

    if (weatherData.status === 'fulfilled') {
      if (typeof fromToggle === 'number') {
        lastFiveWeather.value[fromToggle].weatherDetail = weatherData.value
      } else {
        apiweatherInfo.value.weatherDetail = weatherData.value
      }
    }

    if (forecastData.status === 'fulfilled') {
      if (typeof fromToggle === 'number') {
        lastFiveWeather.value[fromToggle].forecast = forecastData.value
      } else {
        apiweatherInfo.value.forecast = forecastData.value
      }
    }
  }

  const toggleFn = async (payload: {
    indexNumber: number
    lat: number | undefined
    lon: number | undefined
    units: 'metric' | 'imperial'
  }) => {
    const newunits = payload.units === 'imperial' ? 'metric' : 'imperial'
    await callWeatherApi(payload.lat, payload.lon, payload.indexNumber, newunits)
    lastFiveWeather.value[payload.indexNumber].units = newunits
  }

  const consoleErr = (mess: string) => {
    err.value = mess
    setTimeout(() => (err.value = ''), 1000)
  }
  return {
    loading,
    err,
    apiweatherInfo,
    searchInput,
    units,
    callApisFromSearch,
    lastFiveWeather,
    toggleFn,
  }
}
