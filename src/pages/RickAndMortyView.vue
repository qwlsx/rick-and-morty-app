<template>
  <div class="section">
    <div class="container">
      <h1 class="title is-2 has-text-centered mb-6 current-title">🧪 Rick & Morty Characters</h1>

      <transition name="fade" mode="out-in">
        <div v-if="loading" class="has-text-centered my-6" key="loading">
          <button class="button is-loading is-large is-ghost text-loading">Loading characters...</button>
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
        v-if="totalPages > 1"
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

const route = useRoute();
const router = useRouter();

const characters = ref([]);
const totalPages = ref(1);
const currentPage = ref(Number(route.query.page) || 1);
const loading = ref(false);

const fetchCharacters = async (page) => {
  loading.value = true;
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const data = await response.json();
    characters.value = data.results;
    totalPages.value = data.info.pages;
  } catch (error) {
    console.error('My API Fetch Error:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  router.push({ query: { page: newPage } });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Функция-заглушка: если картинка не загрузилась с сервера, ставим стандартный аватар placeholder
const handleImageError = (event) => {
  event.target.src = 'https://dummyimage.com/300x300/cbd5e1/555555.png&text=No+Image';
};

const statusClass = (status) => {
  if (status === 'Alive') return 'is-success';
  if (status === 'Dead') return 'is-danger';
  return 'is-dark';
};

watch(() => route.query.page, (newPage) => {
  const pageNum = Number(newPage) || 1;
  currentPage.value = pageNum;
  fetchCharacters(pageNum);
});

onMounted(() => {
  fetchCharacters(currentPage.value);
});
</script>

<style scoped>
.current-title {
  color: #0f172a !important;
  font-weight: 800;
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

/* Новый жесткий контейнер для изображений */
.character-image-container {
  width: 100%;
  height: 250px; /* Фиксированная высота для всех картинок на сетке */
  background-color: #f1f5f9; /* Серый фон-заглушка пока картинка грузится */
  overflow: hidden;
}

.character-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Картинка заполняет область без искажения пропорций */
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