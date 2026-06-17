<template>
  <div class="field has-addons search-bar-container">
    <div class="control is-expanded">
      <input 
        v-model="searchQuery" 
        class="input search-input" 
        type="text" 
        placeholder="Search characters by name..."
        @keyup.enter="triggerSearch"
      >
    </div>
    <div class="control">
      <button class="button is-info search-btn" @click="triggerSearch">
        Search
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');

// Defining custom event to emit the query string back to the parent component
const emit = defineEmits(['search']);

const triggerSearch = () => {
  emit('search', searchQuery.value.trim());
};
</script>

<style scoped>
.search-bar-container {
  max-width: 500 darkened;
  margin: 0 auto 2rem auto;
}

.search-input {
  border: 1px solid #94a3b8 !important;
  font-weight: 600;
  color: #0f172a !important;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-btn {
  background-color: #11b0c8 !important;
  color: #ffffff !important;
  font-weight: 700;
}

.search-btn:hover {
  background-color: #0f9cb1 !important;
}
</style>