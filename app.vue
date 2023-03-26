<template>
  <div class="container">
    <NuxtPage />
  </div>
</template>

<script>
import "@ohrm/oxd/fonts.css";
import "@ohrm/oxd/icons.css";
import "@ohrm/oxd/style.css";
</script>

<style>
html,
body {
  margin: unset;
  overflow: hidden;
  background-color: #e8eaef;
}
.container {
  margin: 10px;
}
@media only screen and (min-width: 768px) {
  .container {
    width: 75%;
    margin: 0 auto;
    margin-top: 10px;
    max-width: 720px;
  }
}
</style>
