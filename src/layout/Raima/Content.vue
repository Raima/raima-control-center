<template>
  <div :style="$route.name !== 'sql-editor' && $route.name !== 'data-visualization' ? '' : 'padding-left:24px !important'" class="content">
    <fade-transition :duration="100" mode="out-in">
      <!-- your content here -->
      <router-view></router-view>
    </fade-transition>
  </div>
</template>
<script>
  import {FadeTransition} from 'vue2-transitions';
  export default {
    components: {
      FadeTransition
    },
  };
</script>
