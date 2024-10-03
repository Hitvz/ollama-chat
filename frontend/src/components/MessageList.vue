<script setup>
import {ROLE_ASSISTANT, ROLE_USER} from "../utils/role.js";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

</script>
<script>


import scrollIntoView from "scroll-into-view-if-needed";
import useMessageList from "../stores/message-list.js";
import pinia from "../stores/declare-pinia.js";
import {marked} from 'marked';
import {convert} from 'html-to-text'
import useClipboard from 'vue-clipboard3'

const {toClipboard} = useClipboard()

const messageListStore = useMessageList(pinia);

export default {
  data() {
    return {
      lastMessageEl: null,
      lastMessageRect: null,
    }
  },
  methods: {
    messageRef(el, index, size) {
      if (index < size - 1) {
        return;
      }
      setTimeout(() => {
        let messageId = "message" + index;
        let lastMessageEl = document.getElementById(messageId)
        this.lastMessageEl = lastMessageEl;
        console.log(lastMessageEl, messageId)
        if (lastMessageEl) {
          scrollIntoView(lastMessageEl, {
            behavior: 'smooth',
            scrollMode: 'if-needed'
          })
          this.lastMessageElOnResize(messageId);
        }
      }, 100);
    },
    lastMessageElOnResize(messageId) {
      const element = document.getElementById(messageId);
      const resizeObserver = new ResizeObserver(entries => {
        if (entries.length === 0) {
          console.log('length 0');
          return;
        }
        if (messageListStore.lastMessageIsDone(messageListStore)) {
          console.log('lastMessageDone');
          return;
        }
        let entry = entries.pop();
        if (this.lastMessageRect === null) {
          console.log('lastMessageRect null');
          this.lastMessageRect = entry.contentRect;
          return;
        }
        if (this.lastMessageRect.height === entry.contentRect.height) {//使用scrollIntoView会进入绘制死循环，需要加判断
          console.log('height eq');
          return;
        }
        scrollIntoView(this.lastMessageEl, {
          behavior: 'smooth'
        })
        this.lastMessageRect = entry.contentRect;
      });

      // 开始监听
      resizeObserver.observe(element);
    },
    async copy(markdown) {
      try {
        let html = marked.parse(markdown)
        let text = convert(html);
        console.log(text)
        await toClipboard(text)
        console.log('Copied to clipboard')
      } catch (e) {
        console.error(e)
      }
    },
    async copyMarkDown(markdown) {
      try {
        await toClipboard(markdown)
        console.log('Copied to clipboard')
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<template>
  <div class="emptyMessageList" v-if="messageListStore.messageList.length===0">
    <span class="logo"/>
    <span class="welcomeText">欢迎使用 Ollama Chat</span>
  </div>
  <div class="messageList" v-if="messageListStore.messageList.length>0">
    <div class="messageCard" v-for="(item,index) in messageListStore.messageList">
      <el-card shadow="hover" class="cardFieldset" :id="'message'+index"
               :ref="(el) => messageRef(el,index,messageListStore.messageList.length)">
        <fieldset class="chat-fieldset-user" v-if="item.role===ROLE_USER">
          <legend class="legendUser">
            <el-avatar src="/src/assets/images/user.jpg" :size="32"/>
            <span class="legendUserName">User</span>
          </legend>
          <p class="contextText">
            {{ item.content }}
          </p>
        </fieldset>
        <fieldset class="chat-fieldset" v-if="item.role===ROLE_ASSISTANT">
          <legend class="legendUser">
            <el-avatar src="/src/assets/images/bot.png" :size="32"/>
            <span class="legendUserName">Bot</span>
          </legend>
          <MdPreview editorId="preview-only" class="markOver" :modelValue="item.content"/>
          <div v-if="item.aiModel" class="genModelBox">
            <span>
              <el-tooltip content="生成模式生成" placement="top" v-if="item.apiMode==='generate'">
                <el-button class="genContextBut">
                  <img src="../assets/icons/generate.svg" class="genContextButIcon">
                </el-button>
              </el-tooltip>
              <el-tooltip content="对话模式回答" placement="top" v-if="item.apiMode==='chat'">
                <el-button class="genContextBut">
                  <img src="../assets/icons/chat.svg" class="genContextButIcon">
                </el-button>
              </el-tooltip>
              <el-tooltip content="复制为markdown格式" placement="top">
                <el-button class="genContextBut" @click="copyMarkDown(item.content)">
                  <img src="../assets/icons/copy-markdown.svg" class="genContextButIcon">
                </el-button>
              </el-tooltip>
              <el-tooltip content="复制为文本" placement="top">
                <el-button class="genContextBut" @click="copy(item.content)">
                  <img src="../assets/icons/copy.svg" class="genContextButIcon" alt="copy">
                </el-button>
              </el-tooltip>
            </span>
            <p class="genModelDesc">由{{ item.aiModel }}生成</p>
          </div>
        </fieldset>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.emptyMessageList {
  @apply flex max-w-full flex-auto flex-col justify-end px-4 -mt-24 items-center justify-center;
}

.messageList {
  @apply flex max-w-full flex-auto flex-col justify-end px-4
}

.logo {
  display: block;
  width: 200px;
  height: 200px;
  mask: url('../assets/images/bot-no-bg.png');
  mask-size: contain;
  @apply bg-gray-200;
}

.welcomeText {
  @apply text-2xl font-bold text-gray-300 font-sans
}

.messageCard {
  @apply mt-2 p-1 flex max-w-full rounded-md;
}

.messageCard:last-child {
  @apply mb-24;
}

.cardFieldset {
  @apply w-full;
}

.legendUser {
  @apply flex items-center pl-2
}

.legendUserName {
  @apply font-bold p-2
}

.contextText {
  @apply m-0
}

.markOver {
  padding: 0;
}

.chat-fieldset-user {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #334155;
  border-radius: 6px;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  margin: 0 0.2rem 0.2rem 0.2rem;
}

.chat-fieldset {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #334155;
  border-radius: 6px;
  padding: 0.5rem 0.75rem 0rem 0.75rem;
  margin: 0 0.2rem 0.2rem 0.2rem;
}

.genModelBox {
  @apply flex justify-end
}

.genContextBut {
  width: 16px;
  height: 16px;
  @apply p-0 border-0
}

.genContextButIcon {
  width: 15px;
  height: 15px;
}

.genModelDesc {
  background: linear-gradient(to right, #fdfdfe, #bdbdbd);
  padding: 0rem 1.5rem;
  margin: 0 -0.75rem 0 0;
  border-radius: 0 0 6px 0;
  @apply text-xs
}

</style>

<style>
.markOver .md-editor-preview-wrapper {
  position: relative;
  flex: 1;
  box-sizing: border-box;
  overflow: auto;
  padding: 0px;
}

#preview-only {
  p {
    margin-bottom: 0;
  }
}

#preview-only-preview .md-editor-code {
  margin: 0.5rem 0;
}

#preview-only-preview :first-child {
  @apply mt-0;
}

.cardFieldset .el-card__body {
  padding: 1px;
}
</style>