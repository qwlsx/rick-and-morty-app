<template>
  <div id="app">
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <span class="navbar-item title is-4 has-text-white mb-0">Rick & Morty App</span>
        </div>
        <div class="navbar-menu is-active">
          <div class="navbar-start">
            <router-link to="/" class="navbar-item">Buttons Example</router-link>
            <router-link to="/characters" class="navbar-item">Characters & Pagination</router-link>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Global application background tweaks */
body {
  background-color: #fafafa;
}
</style>