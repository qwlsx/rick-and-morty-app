<template>
  <nav class="pagination is-centered my-6" role="navigation" aria-label="pagination">
    <button 
      class="pagination-previous" 
      :disabled="currentPage === 1" 
      @click="changePage(currentPage - 1)"
    >
      Previous
    </button>

    <button 
      class="pagination-next" 
      :disabled="currentPage === totalPages" 
      @click="changePage(currentPage + 1)"
    >
      Next page
    </button>

    <ul class="pagination-list">
      <li v-for="(page, index) in visiblePages" :key="index">
        <span v-if="page === '...'" class="pagination-ellipsis">&hellip;</span>
        
        <button 
          v-else 
          class="pagination-link" 
          :class="{ 'is-current': page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-change']);

const visiblePages = computed(() => {
  const current = props.currentPage;
  const total = props.totalPages;
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 4) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (current <= 4) {
    for (let i = 2; i <= 4; i++) pages.push(i);
  } else if (current >= total - 3) {
    for (let i = total - 3; i <= total - 1; i++) pages.push(i);
  } else {
    for (let i = start; i <= end; i++) pages.push(i);
  }

  if (current < total - 3) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
});

const changePage = (page) => {
  if (page !== '...' && page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};
</script>

<style scoped>
/* Кастомные ультра-контрастные стили для пагинации */
.pagination-link, .pagination-previous, .pagination-next {
  cursor: pointer;
  user-select: none;
  font-weight: 700 !important; /* Делаем шрифт жирным */
  color: #1e293b !important; /* Глубокий темно-серый, почти черный цвет текста */
  border: 1px solid #94a3b8 !important; /* Четкая серая рамка, чтобы кнопки не сливались */
  background-color: #ffffff !important;
}

.pagination-link:hover, .pagination-previous:hover, .pagination-next:hover:not(:disabled) {
  background-color: #f1f5f9 !important; /* Легкий серый фон при наведении */
  border-color: #475569 !important;
}

/* Стиль для текущей активной страницы */
.pagination-link.is-current {
  background-color: #1e293b !important; /* Полностью темный контрастный фон */
  border-color: #1e293b !important;
  color: #ffffff !important; /* Белый текст на темном фоне */
}

.pagination-previous:disabled, .pagination-next:disabled {
  cursor: not-allowed;
  opacity: 0.4;
  background-color: #e2e8f0 !important;
  border-color: #cbd5e1 !important;
  color: #94a3b8 !important;
}

.pagination-ellipsis {
  color: #334155 !important;
  font-weight: 700;
}
</style>