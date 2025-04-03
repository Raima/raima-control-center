<template>
  <nav class="navbar navbar-expand-lg navbar-absolute"
       :class="{'bg-white': showMenu && !darkmode, 'navbar-transparent': !showMenu}">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle d-inline" :class="{toggled: $sidebar.showSidebar}">
          <button type="button"
                  class="navbar-toggler"
                  aria-label="Navbar toggle button"
                  @click="toggleSidebar">
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <router-link :to="{path:'/'}" class="navbar-brand">
          <img :src="darkmodeinput ? '/img/raima-control-wide-white.svg' : '/img/raima-control-wide.svg'" class="img-fluid" style="height: 60px;" />
        </router-link>
      </div>
      <button class="navbar-toggler" type="button"
              @click="toggleMenu"
              data-toggle="collapse"
              data-target="#navigation"
              aria-controls="navigation-index"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <collapse-transition>
        <div class="collapse navbar-collapse show" v-show="showMenu">
          <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">


            <!-- START:MODE SWITCHER -->
            <div class="mode-switcher-container" >
              <img src="/assets/icons/light/sun.svg" style="max-width:20%" />
              <div class="switcher">
                <!--
                <input type="checkbox" id="switch" v-model="darkmode" value="true" /><label for="switch">Toggle</label>
                -->
                <input type="checkbox" id="switch" :checked="darkmode" v-model="darkmodeinput" value="true" /><label for="switch">Toggle</label>
              </div>
              <img src="/assets/icons/light/moon.svg" style="max-width:20%" />
            </div>
            <!-- END:MODE SWITCHER -->

            <!--
            <div style="content: ''; border: 1px solid #E4E4E4; height:23px; margin-top:10px; margin-left:30px; margin-right: 30px;"></div>
            -->
            <a href="#" id="logout-btn" @click="logout()" style="display:flex; align-items: center;">log out</a>
          </ul>
        </div>
      </collapse-transition>
    </div>
  </nav>
</template>
<script>
  import { CollapseTransition } from 'vue2-transitions';
  import Modal from '@/components/VueBlackDashboard/Modal';
  import router from '@/router';
  import { store } from "@/store/store"; // Vuex

  export default {
    components: {
      CollapseTransition,
      Modal
    },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        // darkmode: false,
        darkmodeinput: false,
      };
    },
    computed: {
      isRTL() {
        return this.$rtl.isRTL;
      },
      darkmode() {
        return this.$store.getters["darkmode"];
      }
    },
    methods: {
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications;
      },
      closeDropDown() {
        this.activeNotifications = false;
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      // set light mode
      toggleMode() {
        let docClasses = document.body.classList;
        if (this.themes === false) {
          docClasses.add('white-content')
        } else {
          docClasses.remove('white-content')
        }
      },
      setDarkMode() {
        document.body.classList.remove('white-content');
      },
      setLightMode() {
        document.body.classList.add('white-content')
      },
      logout() {
        store.dispatch("auth/signout");
      }
      // navigate functions
    },
    watch: {
      darkmode: function (val) {
        this.darkmodeinput = val
        if( val ) {
          this.setDarkMode();
        }
        else {
          this.setLightMode();
        }
      },
      darkmodeinput: function (val) {
        store.commit('setDarkMode', val)
      }
    },
    created() {
      this.darkmodeinput = this.darkmode
      if( this.darkmode ) {
        this.setDarkMode();
      }
      else {
        this.setLightMode();
      }
    }
  };
</script>
<style>
</style>
