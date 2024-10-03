<script setup>
defineProps(['src'])
</script>
<script>
export default {
  data() {
    return {
      curSrc: this.$props.src
    }
  },
}
</script>

<template>
  <img :src="{curSrc}" class="icon">
</template>

<style scoped>
.icon {
  width: 24px;
  height: 24px;
}
</style>