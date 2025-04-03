<template>
  <div v-if="selectedDatabase != null" class="sidebar-wrapper" id="style-3">
      <div class="logo">
        <router-link class="simple-text back-url" :to="{ name: 'dashboard' }" ><i class="fas fa-arrow-left mr-1"></i> Back</router-link>
      </div>

      <div class="selected-database" style="">{{ selectedDatabase }}</div>
      <ul v-if="sidebarLinks && sidebarLinks.length > 0" class="nav" style="margin-top: 0; margin-bottom: 20px;" >
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <sidebar-link v-for="(link,index) in sidebarLinks"
                      :key="index"
                      :to="link.path"
                      :name="link.name"
                      :icon="link.icon">
        </sidebar-link>
      </ul>
  </div>
</template>
<style>
.sidebar .nav li > a {
  padding: 0px 8px !important;
}
.sidebar .nav li.active > a:not([data-toggle="collapse"]):before, .off-canvas-sidebar .nav li.active > a:not([data-toggle="collapse"]):before {
  top: 12px !important;
}
</style>
<script>
  import router from '@/router'
  import axios from 'axios'
  import SidebarLink from "./SidebarLink";
  import config from '@/config';

  export default {
    props: {
      backgroundColor: {
        type: String,
        default: "vue"
      },
      /*
      sidebarLinks: {
        type: Array,
        default: () => []
      },
      */
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        linkHeight: 65,
        activeLinkIndex: 0,
        windowWidth: 0,
        isWindows: false,
        hasAutoHeight: false,
        links: [],
        datatables: []
      };
    },
    provide() {
      return {
        autoClose: this.autoClose,
        addLink: this.addLink,
        removeLink: this.removeLink
      };
    },
    components: {
      SidebarLink
    },

    computed: {
      /**
       * Styles to animate the arrow near the current active sidebar link
       * @returns {{transform: string}}
       */
      arrowMovePx() {
        return this.linkHeight * this.activeLinkIndex;
      },
      selectedDatabase() {
        if(this.$store.getters["database/selectedDatabase"]) {
          return this.$store.getters["database/selectedDatabase"]
        }
        else if( this.datatables.length > 0 ){
          return this.$route.params.database;
        }
        else{
          this.fetchTables( this.$route.params.database )
          return this.$route.params.database;
        }
      },
      selectedDatabasetables() {
        return this.$store.getters["database/tables"];
      },
      sidebarLinks() {
        return (this.$store.getters["database/sidebarLinks"].length > 0) ? this.$store.getters["database/sidebarLinks"] : this.datatables ;
      },
      // Route properties
      selectedDatabaseFromRoute() {
        return this.$route.params.database;
      },
    },
    watch: {},
    methods: {
      findActiveLink() {
        this.links.forEach((link, index) => {
          if (link.isActive()) {
            this.activeLinkIndex = index;
          }
        });
      },
      addLink(link) {
        /*
        const index = this.$slots.links.indexOf(link.$vnode);
        this.links.splice(index, 0, link);
        */
      },
      removeLink(link) {
        /*
        const index = this.links.indexOf(link);
        if (index > -1) {
          this.links.splice(index, 1);
        }
        */
      },
      goBack() {
        router.go(-1);
      },
      fetchTables( database ) {
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + database +'/?list=tables': config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + database +'/?list=tables';
        axios.get(url).then(res => {
            if( res.data.hasOwnProperty('tables')) {

                res.data.tables.forEach(key => {
                  this.datatables.push( { path: '/' + database + '/' + key.name + '/tableview', name: key.name, icon: ''} );
                })
            }
        }).catch(err => {

        })
      }
    },
    mounted() {}
  };
</script>
