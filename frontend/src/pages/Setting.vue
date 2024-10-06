<script setup>
import {onMounted, ref} from 'vue'
import ollama from 'ollama/browser'
import pinia from "../stores/declare-pinia.js";
import useSetting from "../stores/setting.js";
import useGlobalConfig from "../stores/global-config.js";
import {ElNotification} from "element-plus";
import { useRouter } from 'vue-router'
const router = useRouter()

const useSettingStore = useSetting(pinia);
const useGlobalConfigStore = useGlobalConfig(pinia);

const setting = useSettingStore.setting

const optionApiPlatform = [
  {label: "Ollama", value: "Ollama"},
]

let optionAiModel = ref([])

const onSubmit = () => {
  useGlobalConfigStore.config.routeLocation = '/'
  console.log('submit!')
  router.push('/')
  ElNotification({
    message: '配置保存成功',
    duration: 4500,
  })
}

onMounted(() => {
  try {
    const modelList = ollama.list();
    modelList.then((listResponse) => {
      console.log(listResponse, listResponse.models, optionAiModel)
      let optionList = []
      listResponse.models.forEach(model => {
        optionList.push({label: model.name, value: model.model});
        console.log({label: model.name, value: model.model})
      })
      optionAiModel.value = optionList
      console.log(optionAiModel)
    }).catch((e) => {
      console.log("modelList", e)
    })
    console.log(modelList)
  } catch (e) {
    console.log("onMounted", e)
  }
  console.log(`the component is now mounted.`)
})
</script>

<template>
  <div class="more">
    <el-form :model="setting" label-width="auto" class="form">
      <el-form-item label="API平台">
        <el-select v-model="setting.apiPlatform">
          <el-option v-for="item in optionApiPlatform" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Host">
        <el-input v-model="setting.host" placeholder="请输入模型调用地址"/>
      </el-form-item>
      <el-form-item label="模型">
        <el-select v-model="setting.aiModel">
          <el-option v-for="item in optionAiModel" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="聊天模式">
        <el-radio-group v-model="setting.apiMode">
          <el-radio-button label="生成回答" value="generate" />
          <el-radio-button label="&emsp;对话&emsp;" value="chat" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" color="#3d3df5" size="large" @click="onSubmit" round class="saveButton">
          保 存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.more {
  @apply w-full flex-auto py-8;
}

.more .form {
  width: clamp(300px, 80%, 440px);
  @apply mx-auto;
}

.saveButton {
  @apply mt-8 w-full text-base;
}

</style>