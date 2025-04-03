<template>
  <card type="tasks" class="h-100 mb-0 databases-card">
    <template slot="header">
      <div class="card-header-container" style="display:flex; width: 100%; flex-direction: row; justify-content: space-between;">
        <h3 class="card-title"><i class="tim-icons icon-app text-success "></i> Databases</h3>
        <div class="col-auto pr-0" id="search-databases-input-container">
          <base-input v-model="filter" id="search-databases-input" addon-left-icon="tim-icons icon-zoom-split" placeholder="Search databases" :disabled="databases.length == 0"/>
        </div>
      </div>
    </template>
    <!-- DATABASES LIST -->
    <div class="list-group" v-if="databases && databases.length && loaded && !error && !filterIsActive">
      <a href="#" v-for="(database, index) in databases" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="margin-bottom: 20px;"   @click="selectDatabase(database.name)" >
        <div class="v-component">
          {{ database.name }}
          <v-chip class="color-marker-chip" :color="database.color"></v-chip>
        </div>
        <span>{{ setUnit(database.total_disk_usage) }}</span>
      </a>
    </div>
    <div class="list-group" v-if="databases && databases.length && loaded && !error && filterIsActive && filteredDatabases.length !== 0">
      <a href="#" v-for="(database, index) in filteredDatabases" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="margin-bottom: 20px;"   @click="selectDatabase(database.name)" >
        <div class="v-component">
          {{ database.name }}
          <v-chip class="color-marker-chip" :color="database.color"></v-chip>
        </div>
        <span>{{ setUnit(database.total_disk_usage) }}</span>
      </a>
    </div>
    <!-- FETCH ERROR -->
    <div v-else-if="loaded && error" class="h-100 no-databases-with-error">
      <div class="main-icon">
        <i class="tim-icons icon-alert-circle-exc p-4"></i>
      </div>
      <p class="text-center mb-2">
        There was an error fetching data from server.<br>
        Click the button to try to refetch database list from the server.
      </p>
      <base-button round type="primary" @click="fetchDatabases()">
          <i class="tim-icons icon-refresh-01 mr-2 text-white"></i>Reload
      </base-button>
    </div>
    <!-- REQUEST DONE BUT NO RESULT -->
    <div v-else-if="loaded && !error && filteredDatabases.length == 0 && filterIsActive" class="h-100 no-databases" >
      <div class="main-icon">
        <i class="fas fa-ban p-4"></i>
      </div>
      <p class="text-center mb-2">
        Your search returned no results.
      </p>
    </div>
    <!-- -->
  </card>
</template>

<script>
import router from '@/router'
import axios from 'axios'
import { convertUnit } from '@/helpers'
import config from '@/config'

// https://localhost:21553/rdmadmin/?list=databases
export default {
    data() {
      return {
        databases: [],
        filteredDatabases: [],
        filterIsActive: false,
        filter: null,
        // request datas
        loaded: false,
        error: false,
        requestLoading: false,
      }
    },
    computed: {
      databaseColors() {
        return this.$store.getters['database/getDatabaseColors'];
      }
    },
    methods: {
        async fetchDatabaseKeys() {
          const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdmadmin/?list=databases&tables=on&keys=on': config.schema + this.$store.getters["auth/api_address"] + '/rdmadmin/?list=databases&tables=on&keys=on';
          await axios.get(url)
          .then(res => {
            if( res.data.hasOwnProperty('databases')) {
              this.$store.commit('database/storeKeys', res.data.databases)
            }
          }).catch( (error) => {
            this.error = true;
          })
        },
        async fetchDatabases() {
          this.requestLoading = true;
          this.databases = [];
          const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdmadmin/?list=disk&databases=true': config.schema + this.$store.getters["auth/api_address"] + '/rdmadmin/?list=disk&databases=true';
          await axios.get(url)
          .then(res => {
              if( res.data.hasOwnProperty('databases')) {
                  this.databases = res.data.databases
                  for(let db in this.databases){
                    for(let color in this.databaseColors){
                      if(this.databases[db].name == this.databaseColors[color].name) {
                        this.databases[db].color = this.databaseColors[color].color
                      }
                    }
                  }
              }
          }).catch( (error) => {
            this.error = true;
          }).then(() => {
            this.loaded = true;
            this.requestLoading = false;
          })
        },
        async fetchTables( databaseName ) {
            // https://localhost:21553/rdm/BICYCLE_DB/Manufacturer/?list=rows
            const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + databaseName +'/?list=tables': config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + databaseName +'/?list=tables';
            return await axios.get(url);
        },
        startsWith(wordToCompare) {
            return function(element) {
                return element.name.toLowerCase().includes(wordToCompare.toLowerCase());
            }
        },
        // select database and navigate to table view
        selectDatabase( database ) {
            // TODO fetch first table name
            let fetchedTables = this.fetchTables( database );
            let table = '';

            fetchedTables.then((value) => {
              if( value.hasOwnProperty('data')
                  && value.data.hasOwnProperty('tables')
                  && value.data.tables.length > 0 ) {
                    table = value.data.tables[0].name
                    this.$store.commit('database/storeSelectedDatabase', database )
                    this.$store.commit('database/storeTables', value.data.tables.map(a => a.name) );
              }
              // this.$store.commit('storeSelectedDatabase', database)
              router.replace('/' + database + '/' + table + '/tableview')
            });
        },
        setUnit(bytes){
          return convertUnit(bytes)
        }
    },
    watch: {
        filter(val, oldval) {
            if(val) this.filterIsActive = true
            else this.filterIsActive = false
            if( val && val.length > 0 ) {
                if( val && val.length > 0 && oldval && oldval.length > val.length ){
                    this.filteredDatabases = this.databases.filter( this.startsWith(val))
                }
                else {
                    this.filteredDatabases = this.databases.filter( this.startsWith(val))
                }
            }
            else {
              this.filteredDatabases = []
            }

        }
    },
    mounted() {
      this.fetchDatabases();
      this.fetchDatabaseKeys();
    },
}
</script>
