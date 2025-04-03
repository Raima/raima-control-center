<template>
  <card class="card-tasks h-100 mb-0 options-card">
        <template slot="header">
            <h3 class="card-title"><i class="tim-icons icon-settings-gear-63 text-success "></i> Options</h3>
        </template>
        <div class="content-holder"  v-if="options && loaded" >
          <div class="v-component">
            <v-data-table
              id="options-table"
              :class="(this.darkmode) ? 'options-dark-mode' : 'options-white-mode'"
              :headers="headers"
              :items="filteredOptions"
              :mobile-breakpoint="0"
              fixed-header
              hide-default-footer
              disable-pagination
            >
              <template v-slot:[`item.VALUE`]="{item}">
                <td v-if="item.VALUE == ''">[unset]</td>
                <td v-else>{{ item.VALUE }}</td>
              </template>
            </v-data-table>
          </div>
        </div>
        
        <!-- FETCH ERROR -->
        <div v-else-if="loaded && error" class="h-100 no-databases-with-error"> 
          <div class="main-icon">
            <i class="tim-icons icon-alert-circle-exc p-4"></i>
          </div>
          <p class="text-center mb-2">
            There was an error fetching data from server.<br>
            Click the button to try to refetch list of options from the server.
          </p>
          <base-button round type="primary" @click="fetchOptions()">
            <i class="tim-icons icon-refresh-01 mr-2 text-white"></i>Reload
          </base-button>
        </div>
        <!-- REQUEST DONE BUT NO RESULT -->
        <div v-else-if="loaded && !error" class="h-100 no-databases" >
          <div class="main-icon">
            <i class="fas fa-ban p-4"></i>
          </div>
          <p class="text-center mb-2">
            There are no options to load.<br>
            Click the button to refetch options.
          </p>
          <base-button round type="primary" @click="fetchOptions()" >
              <i class="tim-icons icon-refresh-01 mr-2 text-white"></i>Reload
          </base-button>
        </div>
        <!-- -->
        <template slot="footer">
          <div class="v-component">
            <v-tabs class="tabs-container">
              <v-tab v-for="item in categories" :key="item" v-on:click="filterTable(item)">{{item}}</v-tab>
            </v-tabs>
          </div>
        </template>
    </card>
</template>

<script>
import axios from 'axios'
import config from '@/config'
// https://hostname:port/rdmadmin/?list=options
export default {
    data() {
      return {
        options: null,
        // request datas
        loaded: false,
        error: false,
        requestLoading: false,
        categories: [],
        filteredOptions: [],
        headers: [
          {text:'NAME', value:'NAME', width: '200'},
          {text:'VALUE', value:'VALUE', width: '120'},
          {text:'DESCRIPTION', value:'DESCRIPTION', width: '120'},
        ]
      }
    },
    methods: {
        fetchOptions() {
          this.requestLoading = true;
          const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdmadmin/?list=options': config.schema + this.$store.getters["auth/api_address"] + '/rdmadmin/?list=options';
          axios.get(url).then(res => {
            if( res.data.hasOwnProperty('Options')) {
              this.options = res.data.Options
              this.categories = this.fetchCategories(this.options)
              this.filterTable("TFS")
            }
          }).catch(err => {
            this.error = true;
          }).then(() => {
            this.loaded = true;
            this.requestLoading = false;
          })
        },
        fetchCategories(options){
          if(typeof options !== 'object' && options == null) return

          let categoriesArray = [];

          for(let i in options){
            let category = options[i].CATEGORY;
            
            if((categoriesArray.length == 0 || !categoriesArray.includes(category)) && category !== "TFS/DB"){
              categoriesArray.push(category)
            }
          }
          return categoriesArray
        },
        filterTable(category){
          this.filteredOptions = []

          for(let i in this.options){
            if(category == "DB") {
              if(this.options[i].CATEGORY == "DB"|| this.options[i].CATEGORY == "TFS/DB"){
                this.filteredOptions.push(this.options[i])
              }
            }
            else if (category == "TFS"){
              if(this.options[i].CATEGORY == "TFS"|| this.options[i].CATEGORY == "TFS/DB"){
                this.filteredOptions.push(this.options[i])
              }
            }
            else {
              if(this.options[i].CATEGORY == category){
                this.filteredOptions.push(this.options[i])
              }
            }
          }

          return
        }
    },
    mounted() {
      this.fetchOptions();
    },
    computed: {
      darkmode() {
        return this.$store.getters["darkmode"];
      }
    },
}
</script>

<style lang="scss">
.options-card .card-body{
  overflow-y: hidden !important;
}
#options-table {
background-color: transparent !important;

thead>tr>th{
      i{
        margin-left: 5px;
      }
    }
  
    thead{  
      tr>th{
        z-index: 1050 !important;
      }
    }

    .v-data-table__wrapper{
      height: 330px;
      table{
        border-collapse: separate;
      }
    }
 
  table > thead > tr > th:last-child,
  table > tbody > tr > td:last-child {
    text-align: left !important;
    position: sticky !important; 
    right: unset !important; 
    z-index: 1 ;
  }
  table > thead > tr > th:last-child {
    z-index: 1 ;
  }

  tbody{
    tr>td:not(:last-child){
      word-break: break-all;
      max-width: 1px !important;
    }
  }
}

.options-dark-mode{
  color: hsla(0,0%,100%,.7) !important;

  thead>tr>th{
      i{
        margin-left: 5px;
        color: white !important;
      }
    }
  
    thead{  
      tr>th{
        z-index: 1050;
        background-color: #27293d !important;
        box-shadow: 0 1px white !important;
        color: rgba(255, 255, 255, 0.7) !important;
      }

      th:hover{
        color:white !important;
      }

      th.sortable.active{
        color: white !important;
      }
    }



  .v-data-table__empty-wrapper td{
    color: rgba(255, 255, 255, 0.7) !important;
  }

  tbody{
    tr>td{
      border-color: rgba(255, 255, 255, 0.1) !important;
    }

    tr:hover{
      background-color: #253e5f !important;
    }
  }
}

.options-white-mode{
  color: hsla(0,0%,100%,.7) !important;

  thead>tr>th{
      i{
        color: rgba(0, 0, 0, 0.87) !important;
      }
    }
  
    thead{  
      tr>th{
        z-index: 1050;
        background-color: white;
        box-shadow: 0 1px black !important;
        color: rgba(0, 0, 0, 0.6);
      }

      th:hover{
        color: rgba(0, 0, 0, 0.87);
      }

      th.sortable.active, th.sortable{
        color: rgba(0, 0, 0, 0.87);
      }
    }



  .v-data-table__empty-wrapper td{
    color: rgba(255, 255, 255, 0.7) !important;
  }

  tbody{
    tr>td{
      color: rgba(0, 0, 0, 0.87);
      border-color: rgba(0, 0, 0, 0.1);
    }

    tr:hover{
      background-color: #cae0f3 !important;
    }
  }
}
</style>