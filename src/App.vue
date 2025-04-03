<template>
  <div class="app-container">
      <notifications></notifications>
      <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import axios  from 'axios';
import config from '@/config';

  export default {
    methods: {
      disableRTL() {
        if (!this.$rtl.isRTL) {
          this.$rtl.disableRTL();
        }
      },
      toggleNavOpen() {
        let root = document.getElementsByTagName('html')[0];
        root.classList.toggle('nav-open');
      },
    },
    computed: {
      api_address() {
        return this.$store.getters['auth/api_address'];
      },
      port_number() {
        return this.$store.getters['auth/port_number'];
      },
    },
    mounted() {
      this.$watch('$route', this.disableRTL, { immediate: true });
      this.$watch('$sidebar.showSidebar', this.toggleNavOpen)
      if (!this.api_address) return;
      const url = this.port_number? config.schema+this.api_address+':'+this.port_number+'/rdmadmin/?list=version': config.schema+this.api_address+'/rdmadmin/?list=version';
      axios.get(url)
      .then(res => {
        if(res.hasOwnProperty('status') && res.status == 200) {
          this.$store.commit('auth/storeVersionInfo', res.data["RDM Version Information"])
        }
      })
    },
  };
</script>

<style lang="scss"></style>
