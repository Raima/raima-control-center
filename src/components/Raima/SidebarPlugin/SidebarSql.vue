<template>
  <div class="sidebar-sql" style="height: calc(100vh - 240px); overflow-y: scroll;">
    <div v-if="sqlSelected" class="sidebar-wrapper" id="style-3">
      <div class="selected-database" style="">
        {{ $route.params.database }}
      </div>

      <div class="database-columns" v-if="renderComponent">
        <div v-for="sqlItem in sqlItems">
          <div class="selected-table" style="">
            {{ sqlItem.name }}
          </div>
          <div class="column-title" style="">
            <span>Columns</span>
          </div>
          <ul class="sql-columns">
            <li v-for="item in sqlItem.children">
              {{ item.name }} <span style="font-size: 10px;color: #da465c !important"
                                    v-if="item.type">[ {{ item.type }} ]</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="text-center">
        <v-progress-circular
          indeterminate
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>
<script>
  import router from '@/router'
  import axios from 'axios'
  import SidebarLink from "./SidebarLink";

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
        datatables: [],
        renderComponent: false,
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
      routeName () {
        return this.$route.name
      },
      versionInfo() {
        return this.$store.getters["auth/version_info"]
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
      arrowMovePx() {
        return this.linkHeight * this.activeLinkIndex;
      },
      selectedDatabaseFromRoute() {
        return this.$route.params.database;
      },
      sqlItems() {
        return this.$store.getters['database/getSQLItems'];
      },
      sqlSelected() {
        return this.$store.getters['database/getSQLPage'];
      },
    },
    methods: {
      goBack () {
        this.$store.commit('database/storeSQLPage', false )
      },
      findActiveLink() {
        this.links.forEach((link, index) => {
          if (link.isActive()) {
            this.activeLinkIndex = index;
          }
        });
      },
      formatVersionInfo(text){
        if(!text) return
        return text.replace(/(\\r)*\\n/g, '<br>')
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
    },
    watch: {
      sqlItems: {
        handler: function (val, old) {
          this.renderComponent = false
          let vm = this
          setTimeout(function () {
            vm.renderComponent = true
          }, 500);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
.sidebar-sql .selected-database {
  width: 100%;
  padding: 0 23px;
  margin-top: 22px;
  font-weight: 600;
  color: white;
  text-decoration: underline;
  font-size: 18px;
}
.sidebar-sql .nav li > a {
  padding: 0px 8px !important;
}
.sidebar-sql .nav li.active > a:not([data-toggle="collapse"]):before, .off-canvas-sidebar .nav li.active > a:not([data-toggle="collapse"]):before {
  top: 12px !important;
}

.sidebar-sql .selected-table {
  width: 100%;
  padding: 0 23px;
  margin-top: 22px;
  font-weight: 600;
  color: white;
  font-size: 14px;
}

.sidebar-sql .column-title {
  width: 100%;
  padding: 0 23px;
  margin-top: 11px;
  margin-bottom: 11px;
  font-weight: 600;
  font-size: 12px;
  color: #da465c !important;
}

.sidebar-sql .column-title span {
  border-bottom: 1px solid #da465c;
  padding-bottom: 5px;
}

.sidebar-sql .sql-columns {
  width: 100%;
  padding: 0 23px;
  margin-top: 11px;
  margin-bottom: 11px;
  list-style: none;
  font-size: 12px;
}

.sidebar-sql .sql-columns li {
  margin: 5px 0;
}
</style>
