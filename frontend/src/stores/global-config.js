import {defineStore} from 'pinia'

const useSettingStore = defineStore('globalConfig', {
  state: () => {
    return {
      config: {
        routeLocation: '/'
      }
    }
  },
  actions: {},
})

export default useSettingStore