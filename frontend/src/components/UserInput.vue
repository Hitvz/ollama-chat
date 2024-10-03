<script setup>

</script>

<script>
import useMessageList from "../stores/message-list.js";
import useSetting from "../stores/setting.js";
import pinia from "../stores/declare-pinia.js";
import {ROLE_ASSISTANT, ROLE_USER} from "../utils/role.js";
import {makeId} from "../utils/utils.js";
import ollama from 'ollama'
import {ElMessage} from "element-plus";

const messageListStore = useMessageList(pinia);
const useSettingStore = useSetting(pinia);
export default {
  data() {
    return {
      ask: "",
      aiResponse: "",
      chatModeMessageList: []
    }
  },
  methods: {
    addUserMessage(e) {
      console.log(e.target.value)
      this.ask = this.ask.trimEnd();
      messageListStore.addMessage(messageListStore, {
        id: makeId(),
        role: ROLE_USER,
        content: this.ask,
        isDone: true,
        isError: false,
        apiMode: useSettingStore.setting.apiMode
      });
      this.chatModeMessageList.push({
        role: ROLE_USER,
        content: this.ask
      })
      this.handleInputAsk(this.ask);
      console.log('aiResponse', this.aiResponse)
      this.ask = '';
    },
    addAiMessage() {
      messageListStore.addMessage(messageListStore, {
        id: makeId(),
        role: ROLE_ASSISTANT,
        content: this.aiResponse,
        isDone: false,
        isError: false,
        apiPlatform: useSettingStore.setting.apiPlatform,
        aiModel: useSettingStore.setting.aiModel,
        apiMode: useSettingStore.setting.apiMode
      });
    },
    updateAiResponse(response) {
      this.aiResponse += response;
      messageListStore.appendLastContent(messageListStore, response);
    },
    endAiResponse() {
      console.log('end aiResponse', this.aiResponse)
      this.chatModeMessageList.push({
        role: ROLE_ASSISTANT,
        content: this.aiResponse
      })
      this.aiResponse = '';
      this.ask = ''
      messageListStore.updateLastMessageDone(messageListStore);
    },
    async handleInputAsk(ask) {
      this.aiResponse = '';
      this.addAiMessage();
      // let ai = await generate({
      //   model: "qwen2",
      //   prompt: ask,
      //   stream: true
      // })
//      console.log(ai)
      let model = useSettingStore.setting.aiModel;
      let tipMsg = '请去右上角设置模型，再使用';
      if (model === '') {
        ElMessage({
          message: tipMsg,
          type: 'error',
          plain: true,
        })
        this.updateAiResponse(tipMsg)
        this.endAiResponse();
        return
      }
      await this.requestApi(model, ask, useSettingStore.setting.apiMode)
      // const decoder = new TextDecoder('utf-8');
      // let ai = await gen({
      //   model: "qwen2",
      //   prompt: ask
      // })
      // // 获取读取可读流
      // let reader = ai.body.getReader();
      // while (1) {
      //   let res = await reader.read();
      //   if (res.done) {
      //     console.log('break')
      //     this.endAiResponse();
      //     break;
      //   }
      //   let str = decoder.decode(res.value);
      //   // console.log('decoder', str)
      //   let lineArr = str.split("\n");
      //   // console.log(lineArr)
      //   if (lineArr.length > 2) {
      //     console.log("--------------------------------------------")
      //   }
      //   for (let i = 0; i < lineArr.length; i++) {
      //     let line = lineArr[i];
      //     if (!line) {
      //       continue
      //     }
      //     const data = JSON.parse(line);
      //     this.updateAiResponse(data.response)
      //   }
      // }
    },
    async requestApi(model, ask, apiMode) {
      if (apiMode === 'chat') {
        console.log('messages', this.chatModeMessageList)
        await ollama.chat({
          model: model,
          messages: this.chatModeMessageList,
          stream: true
        }).then(async (genResponse) => {
          console.log(genResponse);
          for await(const chunk of genResponse) {
            console.log(chunk, chunk.message.content)
            if (chunk.done) {
              console.log('break')
              this.endAiResponse();
            }
            this.updateAiResponse(chunk.message.content)
          }
        })
      } else {
        await ollama.generate({
          model: model,
          prompt: ask,
          stream: true
        }).then(async (genResponse) => {
          console.log(genResponse);
          for await(const chunk of genResponse) {
            console.log(chunk, chunk.response)
            if (chunk.done) {
              console.log('break')
              this.endAiResponse();
            }
            this.updateAiResponse(chunk.response)
          }
        })
      }
    }
  }
}
</script>

<template>
  <div class="userInput">
    <textarea placeholder="ask anything ..." v-model="ask" @keyup.enter="addUserMessage"/>
  </div>
</template>

<style scoped>
.userInput {
  @apply fixed bottom-0 z-10 flex h-24 w-full items-center justify-center py-2;
  @apply border-t border-slate-300;
  @apply bg-white;
  border-top-style: solid;
}

.userInput textarea {
  @apply border-0 bottom-0 top-0 p-0 block h-full flex-auto bg-transparent px-4 text-sm text-gray-800 caret-gray-800 font-sans;
  outline: none;
  resize: none;
  line-height: 1.25;
}

.userInput textarea::placeholder {
  @apply text-gray-500;
}

.sendBtn {
  @apply cursor-pointer hover:bg-blue-200;
}

.stopBtn {
  @apply flex scale-110 cursor-pointer items-center gap-2 rounded-xl border border-gray-600 p-2 opacity-70 hover:opacity-100;
}
</style>