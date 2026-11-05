<script setup>
// TODO — step 1: a `name` ref, bound to the input with v-model.
// TODO — step 2: on submit, without reloading the page, keep the name to greet.
// TODO — step 3: show `Hello, <name>!` in #greeting.
</script>

<template>
  <form>
    <label for="name">Your name</label>
    <input id="name" autocomplete="given-name" />
    <button>Greet me</button>
  </form>
  <p id="greeting"></p>
</template>
