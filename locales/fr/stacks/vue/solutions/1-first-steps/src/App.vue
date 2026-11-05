<script setup>
import { ref } from 'vue';

const name = ref('');
const greeted = ref('');
</script>

<template>
  <form @submit.prevent="greeted = name">
    <label for="name">Votre prénom</label>
    <input id="name" v-model="name" autocomplete="given-name" />
    <button>Saluez-moi</button>
  </form>
  <p id="greeting">{{ greeted && `Bonjour, ${greeted} !` }}</p>
</template>
