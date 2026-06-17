<template>
  <div class="field search-bar-container">
    <div class="control is-expanded">
      <input 
        v-model="searchQuery" 
        class="input search-input" 
        type="text" 
        placeholder="Type to search characters..."
      >
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// I define my search query ref
const searchQuery = ref('');

// I set up my custom emit to talk to the parent component
const emit = defineEmits(['search']);

// I am watching the input value and emitting changes instantly on every keystroke
watch(searchQuery, (newQuery) => {
  emit('search', newQuery.trim());
});
</script>

<style scoped>
.search-bar-container {
  max-width: 500px;
  margin: 0 auto 2rem auto;
}

.search-input {
  background-color: #ffffff !important; 
  color: #0f172a !important; 
  border: 1px solid #94a3b8 !important;
  font-weight: 600 !important;
}

.search-input:focus {
  background-color: #ffffff !important;
  color: #0f172a !important;
  border-color: #11b0c8 !important;
  box-shadow: 0 0 0 0.125em rgba(17, 176, 200, 0.25) !important;
}

.search-input::placeholder {
  color: #64748b !important;
}
</style>