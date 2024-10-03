import {defineStore} from 'pinia'

const useSettingStore = defineStore('setting', {
  state: () => {
    return {
      setting: {
        apiPlatform: 'Ollama',
        host: 'http://127.0.0.1:11434',
        aiModel: 'qwen2:latest',
        apiMode: 'generate'
      }
    }
  },
  actions: {},
  persist: {
    key: 'chat-ta-setting',
    storage: localStorage
  },
})

export default useSettingStore