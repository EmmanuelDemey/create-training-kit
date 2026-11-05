<script setup>
import { ref } from 'vue';

const name = ref('');
const greeted = ref('');
</script>

<template>
  <form @submit.prevent="greeted = name">
    <label for="name">Your name</label>
    <input id="name" v-model="name" autocomplete="given-name" />
    <button>Greet me</button>
  </form>
  <p id="greeting">{{ greeted && `Hello, ${greeted}!` }}</p>
</template>
