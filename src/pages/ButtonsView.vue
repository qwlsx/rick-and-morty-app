<template>
  <!-- I moved my button testing page here according to the task requirements -->
  <section class="section">
    <div class="container">
      <!-- I fixed the text colors here so they remain perfectly visible on a light background -->
      <h1 class="title has-text-dark">Task 1: My Btn Component with Validation</h1>
      <h2 class="subtitle has-text-grey-dark">Project: Rick and Morty (Stack: JS, Ajax, Bulma)</h2>
      
      <div class="box">
        <p class="subtitle is-5">1. Testing different colors of my button:</p>
        <div class="buttons">
          <Btn text="Primary Button" colorClass="is-primary" @click="testClick" />
          <Btn text="Success Button" colorClass="is-success" />
          <Btn text="Danger Button" colorClass="is-danger" />
        </div>
      </div>

      <div class="box">
        <p class="subtitle is-5">2. Testing states (Loading and Disabled):</p>
        <div class="buttons">
          <Btn text="Loading" colorClass="is-info" :loading="true" />
          <Btn text="Disabled" colorClass="is-warning" :disabled="true" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// I am importing my custom button component using a relative path
import Btn from '../components/Btn.vue';

export default {
  name: 'ButtonsView',
  components: {
    Btn
  },
  methods: {
    // My method to verify if the button click event works on this page
    testClick() {
      alert('Awesome! My reusable button component works perfectly on this routed page!');
    }
  }
}
</script>