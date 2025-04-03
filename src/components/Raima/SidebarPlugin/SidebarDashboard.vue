<template>
  <div class="sidebar-dashboard">
    <div>
       <v-treeview
         expand-icon="mdi-chevron-down"
         v-model="selectedNodes"
         ref="myTreeView"
         :open-all="expanded"
        class="app-navigation"
        :items="navLinks"
        :open.sync="open"
        item-key="name"
        activatable
        open-on-click
        active-class="primary--text"
        selection-type="all"
        v-if="renderComponent"
      >
        <template slot="label" slot-scope="{ item }">
          <router-link v-if="item.route" :to="{ name: item.route }" >
            <i :class="item.icon"></i>
            {{ item.name }}
          </router-link>
          <router-link :to="{ path: '/' + item.database + '/' + item.name + '/tableview' }" v-else-if="item.database">
            <i :class="item.icon"></i>
            {{ item.name }}
          </router-link>
          <span v-else>
            <i :class="item.icon"></i>
            {{ item.name }}
          </span>
        </template>
      </v-treeview>
      <div v-else class="text-center">
        <v-progress-circular
          indeterminate
        ></v-progress-circular>
      </div>
    </div>
    <div class="sidebar-footer">
      <div class="divider"></div>
      <div class="db-links">
        <a href="https://docs.raima.com" target="_blank"><i class="far fa-file"></i> The Docs</a>
        <a href="https://github.com/Raima/raima-control-center.git" target="_blank"><i class="fab fa-github"></i> Github</a>
        <a href="https://raima.com/support/" target="_blank"><i class="fas fa-life-ring"></i> Support</a>
      </div>

      <div class="version-info-container" v-if="(typeof versionInfo !== 'undefined') && versionInfo.length !==0">
        <p>{{versionInfo.name}} {{versionInfo.version}}｜Build {{versionInfo.build}} </p>
        <p v-html="formatVersionInfo(versionInfo.copyright)"></p>
      </div>
    </div>


  </div>
</template>
<script>

  import axios from "axios";
  import router from "@/router";
  import config from '@/config';
  import { watch } from "vue";

  export default {
    props: {
      title: {
        type: String,
        default: "Back"
      },
      backgroundColor: {
        type: String,
        default: "vue"
      },
      activeColor: {
        type: String,
        default: "success",
        validator: value => {
          let acceptedValues = [
            "primary",
            "info",
            "success",
            "warning",
            "danger"
          ];
          return acceptedValues.indexOf(value) !== -1;
        }
      },
      sidebarLinks: {
        type: Array,
        default: () => []
      },
      autoClose: {
        type: Boolean,
        default: true
      },
    },
    provide() {
      return {
        autoClose: this.autoClose,
        addLink: this.addLink,
        removeLink: this.removeLink
      };
    },
    components: {

    },
    computed: {
      /**
       * Styles to animate the arrow near the current active sidebar link
       * @returns {{transform: string}}
       */
      arrowMovePx() {
        return this.linkHeight * this.activeLinkIndex;
      },
      shortTitle() {
        return this.title.split(' ')
          .map(word => word.charAt(0))
          .join('').toUpperCase();
      },
      versionInfo() {
        return this.$store.getters["auth/version_info"]
      },
    },
    data() {
      return {
        triggered: false,
        selectedNodes: [],
        selectedDB: null,
        active: [],
        expanded: false,
        open: [],
        linkHeight: 65,
        activeLinkIndex: 0,
        windowWidth: 0,
        isWindows: false,
        hasAutoHeight: false,
        links: [],
        renderComponent: true,
        navLinks: [
          { id: 1,icon: "fas fa-columns", name: "Dashboard", route: "dashboard" },
          {
            id: 2,
            icon: "fas fa-database",
            name: "Databases",
            children: []
          },
          { id: 3,icon: "far fa-window-maximize", name: "Applications",
            children: [
              {
                id: 31,
                name: 'Geospatial',
                route: "geospatial"
              },
              {
                id: 32,
                name: 'Time Series',
                route: "timeSeries"
              }
            ]
          },
        ],
        databases: [],
      };
    },
    methods: {
      async fetchDatabases() {
        this.databases = [];
        this.renderComponent = false;
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdmadmin/?list=disk&databases=true': config.schema + this.$store.getters["auth/api_address"] + '/rdmadmin/?list=disk&databases=true';
        await axios.get(url)
          .then(res => {
            if( res.data.hasOwnProperty('databases')) {
              this.databases = res.data.databases
              for (let i=0; i < this.databases.length; i++) {
                this.navLinks.find(item => item.name === 'Databases').children.push({'name':this.databases[i].name, 'id': parseInt('2' + i)})
              }
              for (let x=0; x < this.navLinks.find(item => item.name === 'Databases').children.length; x++) {
                this.navLinks.find(item => item.name === 'Databases').children[x].children = []
                let fetchedTables = this.fetchTables( this.navLinks.find(item => item.name === 'Databases').children[x].name )
                fetchedTables.then((value) => {
                  if( value.hasOwnProperty('data')
                    && value.data.hasOwnProperty('tables')
                    && value.data.tables.length > 0 ) {
                    for (let k=0; k < value.data.tables.length; k++) {
                      this.navLinks.find(item => item.name === 'Databases').children[x].children.push({'name':value.data.tables[k].name, 'database': this.navLinks.find(item => item.name === 'Databases').children[x].name, 'id': parseInt('2' + x + '0' + k)})
                    }
                  }
                });
              }
            }
          }).catch( (error) => {
            this.error = true;
          }).then(() => {
            this.$nextTick(() => {
              this.renderComponent = true
              this.selectedMenu();
            })
          })
      },
      async fetchTables( databaseName ) {
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + databaseName +'/?list=tables': config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + databaseName +'/?list=tables';
        return await axios.get(url);
      },
      goToPage( database, table ) {
        router.replace('/' + database + '/' + table + '/tableview')
      },
      findSelectedItems () {

      },
      findActiveLink() {
        this.links.forEach((link, index) => {
          if (link.isActive()) {
            this.activeLinkIndex = index;
          }
        });
      },
      selectedMenu () {
        if (this.$route.name === 'tableview') {
          const selectedItem = this.navLinks.find(item => item.name === 'Databases')
          this.open.push(selectedItem.name)
          this.selectedDB = selectedItem.children.find(item => item.name === this.$route.params.database)
        } else if (this.$route.name === 'timeSeries' || this.$route.name === 'geospatial') {
          const selectedItem = this.navLinks.find(item => item.name === 'Applications')
          this.open = [selectedItem.name]

        } else {
          this.renderComponent = true
        }
        this.expanded = false;
      },
      addLink(link) {
        const index = this.$slots.links.indexOf(link.$vnode);
        this.links.splice(index, 0, link);
      },
      removeLink(link) {
        const index = this.links.indexOf(link);
        if (index > -1) {
          this.links.splice(index, 1);
        }
      },
      goBack() {
        router.go(-1);
      },
      formatVersionInfo(text){
        if(!text) return
        return text.replace(/(\\r)*\\n/g, '<br>')
      }
    },
    mounted() {
      this.fetchDatabases();
      /*
      this.$watch("$route", this.findActiveLink, {
        immediate: true
      });
      this.$watch("selectedMenu", this.findSelectedItems, {
        immediate: true
      });
       */

    },
    watch: {
      open: {
        handler: function (val, old) {
          if(val[0] === 'Databases' && old[0] === 'Databases' && this.$route.name === 'tableview' && !this.triggered) {
            this.open = []
            this.renderComponent = false
            let vm = this
            setTimeout(function () {
              vm.triggered = true
            }, 2000);
          }
        },
      },
      triggered: {
        handler: function (val, old) {
          if(val) {
            this.open.push('Databases',  this.$route.params.database, this.$route.params.table)
            this.renderComponent = true
          }
        },
      },
    },
  };
</script>
