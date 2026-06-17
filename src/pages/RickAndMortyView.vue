<template>
  <div class="section">
    <div class="container">
      <h1 class="title is-2 has-text-centered mb-5 current-title">🧪 Rick & Morty Characters</h1>

      <SearchBar @search="handleSearch" />

      <div v-if="totalResults > 0 && !errorState && !loading" class="has-text-centered mb-5">
        <span class="tag is-info is-light is-medium total-count-tag">
          Total Results Found: {{ totalResults }}
        </span>
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="loading" class="has-text-centered my-6" key="loading">
          <button class="button is-loading is-large is-ghost text-loading">Searching characters...</button>
          <p class="subtitle is-6 has-text-grey mt-2">Please wait, I am filtering the API results...</p>
        </div>

        <div v-else-if="errorState" class="has-text-centered my-6" key="error">
          <div class="notification is-warning is-light py-5 px-6 error-box">
            <p class="title is-4 mb-2">🤷‍♂️ No characters found</p>
            <p class="subtitle is-6">We couldn't find any characters matching your search criteria. Try another name!</p>
          </div>
        </div>

        <div v-else class="columns is-multiline" key="content">
          <div 
            v-for="character in characters" 
            :key="character.id" 
            class="column is-one-quarter"
          >
            <div class="card character-card">
              <div class="character-image-container">
                <img 
                  :src="character.image" 
                  :alt="character.name"
                  class="character-img"
                  @error="handleImageError"
                >
              </div>
              
              <div class="card-content my-custom-content">
                <div class="character-name-block">
                  {{ character.name }}
                </div>
                
                <div class="character-details-block">
                  <span class="tag status-tag" :class="statusClass(character.status)">
                    {{ character.status }}
                  </span>
                  <span class="ml-2 species-text">{{ character.species }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <PaginationBar 
        v-if="totalPages > 1 && !errorState && !loading"
        :current-page="currentPage" 
        :total-pages="totalPages" 
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PaginationBar from '../components/PaginationBar.vue';
import SearchBar from '../components/SearchBar.vue';

// =========================================================================
// MY STAGE 2 ANSWERS TO THE QUESTIONS:
//
// 1. How many API requests were made while typing "morty"?
//    Answer: 5 API requests were made (one for each keystroke: "m", "mo", "mor", "mort", "morty").
//
// 2. What happens if a slow request from keystroke 2 arrives after keystroke 5?
//    Answer: A race condition occurs. The outdated data from keystroke 2 ("mo") 
//            will overwrite the latest correct data from keystroke 5 ("morty").
//
// 3. How does this affect the server and the user experience?
//    Answer: It causes request flooding on the server, wasting resources. For the user,
//            it creates a buggy and flickering UI with wrong search results.
// =========================================================================

const route = useRoute();
const router = useRouter();

const characters = ref([]);
const totalPages = ref(1);
const totalResults = ref(0);
const currentPage = ref(Number(route.query.page) || 1);
const searchQuery = ref(route.query.name || '');
const loading = ref(false);
const errorState = ref(false);

// I track my AbortController instance to cancel pending in-flight HTTP requests
let currentAbortController = null;

// Stage 3 Requirement: Custom manual debounce function written from scratch
const myDebounce = (fn, delay) => {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// My core API request function
const fetchCharactersRaw = async (page, name) => {
  errorState.value = false;

  // Stage 3 Requirement: Abort the previous request if it's still running
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();

  try {
    let url = `https://rickandmortyapi.com/api/character?page=${page}`;
    if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }

    const response = await fetch(url, { signal: currentAbortController.signal });
    
    if (response.status === 404) {
      characters.value = [];
      totalPages.value = 1;
      totalResults.value = 0;
      errorState.value = true;
      return;
    }

    const data = await response.json();
    characters.value = data.results;
    totalPages.value = data.info.pages;
    totalResults.value = data.info.count;
  } catch (error) {
    // I ignore native AbortErrors since I trigger them intentionally on typing
    if (error.name === 'AbortError') {
      return;
    }
    console.error('My API Fetch Error:', error);
    errorState.value = true;
  } finally {
    if (!currentAbortController?.signal.aborted) {
      loading.value = false; // Turn off loading only if the request actually completed
    }
  }
};

// I wrap my raw fetch logic with a 400ms delay to stop request flooding
const debouncedFetchCharacters = myDebounce(fetchCharactersRaw, 400);

// I handle pagination page switches instantly without debounce delay
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  loading.value = true; // Turn on loading immediately during manual page clicks
  updateUrl();
};

// I handle input changes, resetting page to 1 and pushing the new search string
const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
  loading.value = true; // UX FIX: Turn on loading INSTANTLY as the user types, before the 400ms delay starts!
  updateUrl();
};

// My helper function to sync state variables to the address bar
const updateUrl = () => {
  const queryParams = { page: currentPage.value };
  if (searchQuery.value) {
    queryParams.name = searchQuery.value;
  }
  router.push({ query: queryParams });
};

const handleImageError = (event) => {
  event.target.src = 'https://dummyimage.com/300x300/cbd5e1/555555.png&text=No+Image';
};

const statusClass = (status) => {
  if (status === 'Alive') return 'is-success';
  if (status === 'Dead') return 'is-danger';
  return 'is-dark';
};

// I watch the router query string to safely trigger my debounced or instant fetching
watch(() => route.query, (newQuery) => {
  currentPage.value = Number(newQuery.page) || 1;
  searchQuery.value = newQuery.name || '';

  // Check if this route change was triggered by typing vs page switching
  const currentUrlParams = new URLSearchParams(window.location.search);
  const routerTriggeredByTyping = currentUrlParams.get('page') === '1' && searchQuery.value !== '';

  if (routerTriggeredByTyping) {
    loading.value = true; // Double-guarding to keep the spinner alive while typing is active
    debouncedFetchCharacters(currentPage.value, searchQuery.value);
  } else {
    loading.value = true;
    fetchCharactersRaw(currentPage.value, searchQuery.value);
  }
}, { deep: true });

onMounted(() => {
  loading.value = true;
  fetchCharactersRaw(currentPage.value, searchQuery.value);
});
</script>

<style scoped>
.current-title {
  color: #0f172a !important;
  font-weight: 800;
}
.total-count-tag {
  font-weight: 700 !important;
  font-size: 1rem !important;
  color: #1e293b !important;
  border: 1px solid #cbd5e1;
}
.error-box {
  border: 1px solid #fde047;
  border-radius: 8px;
  max-width: 500px;
  margin: 2rem auto;
}
.character-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: #ffffff;
}
.character-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.character-image-container {
  width: 100%;
  height: 250px;
  background-color: #f1f5f9;
  overflow: hidden;
}
.character-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.my-custom-content {
  padding: 1.25rem !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
  background-color: #ffffff !important;
}
.character-name-block {
  font-size: 1.3rem !important;
  font-weight: 800 !important;
  color: #0f172a !important;
  line-height: 1.3 !important;
  display: block !important;
  word-break: break-word !important;
}
.character-details-block {
  display: flex !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
}
.species-text {
  font-weight: 600 !important;
  color: #475569 !important;
  font-size: 0.95rem !important;
}
.status-tag {
  font-weight: 700 !important;
}
.text-loading {
  color: #0f172a !important;
  font-weight: 700;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>