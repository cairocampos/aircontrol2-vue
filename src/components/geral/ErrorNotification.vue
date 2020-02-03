<template>
  <transition>
    <ul class="errors" v-if="errors.length > 0">
      <li v-for="(error, index) in errors" :key="index" v-html="error"></li>
    </ul>
  </transition>
</template>

<script>
export default {
  name: "ErrorNotification.vue",
  props: {
    errors: Array
  }
};
</script>

<style scoped>
.errors {
  margin: 20px auto;
}

.errors li {
  color: #1919c7;
  text-align: center;
}
</style>
