<template>
  <!-- My Bulma button. Color and size classes are dynamically applied from my props -->
  <button 
    class="button" 
    :class="[colorClass, sizeClass, { 'is-loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <!-- My slot for flexible text rendering inside the button -->
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
export default {
  name: 'Btn',
  // My props to configure the button from the outside
  props: {
    text: {
      type: String,
      default: 'Click me'
    },
    colorClass: {
      type: String,
      default: 'is-link', // My default color (blue)
      // My validation: checking if the provided class is a valid Bulma color class
      validator: function (value) {
        const allowedColors = ['is-primary', 'is-link', 'is-info', 'is-success', 'is-warning', 'is-danger', 'is-white', 'is-light', 'is-dark'];
        return allowedColors.includes(value);
      }
    },
    sizeClass: {
      type: String,
      default: '' // I can pass 'is-small', 'is-medium', or 'is-large' here
    },
    loading: {
      type: Boolean,
      default: false // I switch this to true when I need to show the loading spinner
    },
    disabled: {
      type: Boolean,
      default: false // I use this to disable the button interaction
    }
  }
}
</script>