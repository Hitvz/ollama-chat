<script setup>
import pinia from "../../stores/declare-pinia.js";
import useGlobalConfig from "../../stores/global-config.js";

const useGlobalConfigStore = useGlobalConfig(pinia);

const routeClick = (path) => {
  useGlobalConfigStore.config.routeLocation = path
}

</script>

<template>
  <header class="header">
    <span class="macTitleDotRegion"/>
    <span class="title">Ollama-Chat</span>
    <div>
      <RouterLink to="/" @click="routeClick('/')" v-if="useGlobalConfigStore.config.routeLocation!='/'">
        <img src="../../assets/images/arrow-back.svg" class="icon" alt="返回">
      </RouterLink>
    </div>
    <div class="iconBox">
<!--      <RouterLink>-->
<!--        <img src="../../assets/images/clear.svg" class="icon" alt="清空聊天记录">-->
<!--      </RouterLink>-->
      <RouterLink to="/setting" @click="routeClick('/setting')" v-if="useGlobalConfigStore.config.routeLocation!='/setting'">
        <img src="../../assets/images/more.svg" class="icon" alt="更多">
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  @apply fixed z-10 flex w-full cursor-move items-center justify-center px-4 pt-4;
  @apply bg-gray-100 bg-opacity-80 backdrop-blur;
  @apply border-b border-slate-300;
  border-bottom-style: solid;
}

.title {
  @apply fixed top-1.5 cursor-default select-none bg-clip-text text-xs font-bold text-transparent font-sans;
  background-image: linear-gradient(
      135deg,
      rgb(255, 33, 70),
      rgb(227, 41, 240) 30%,
      rgb(48, 169, 255)
  );
}

.macTitleDotRegion {
  @apply fixed left-0 top-0 z-20 block h-6 w-16 cursor-default;
}

.icon {
  width: 24px;
  height: 24px;
}

.iconBox {
  @apply ml-auto flex scale-110 gap-2 text-gray-700;
}
</style>