<script setup>

import MessageList from "../components/MessageList.vue";
import UserInput from "../components/UserInput.vue";
</script>

<template>
  <div class="chat">
    <MessageList/>
    <UserInput/>
  </div>
</template>

<style scoped>
.chat {
  @apply flex-auto w-full flex;
}
</style>