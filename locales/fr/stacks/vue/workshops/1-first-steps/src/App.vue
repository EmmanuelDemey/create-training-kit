<script setup>
// TODO — étape 1 : une ref `name`, liée au champ avec v-model.
// TODO — étape 2 : à l'envoi, sans recharger la page, garder le prénom à saluer.
// TODO — étape 3 : afficher `Bonjour, <prénom> !` dans #greeting.
</script>

<template>
  <form>
    <label for="name">Votre prénom</label>
    <input id="name" autocomplete="given-name" />
    <button>Saluez-moi</button>
  </form>
  <p id="greeting"></p>
</template>
