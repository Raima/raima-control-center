<template>
  <div class="page-container" id="create-row">
    <card class="h-100">
      <!-- START:CARD HEADER -->
      <h3 slot="header" class="card-title"><i class="tim-icons icon-simple-add text-success "></i> Insert row</h3>
      <!-- END:CARD HEADER -->

      <!-- START:ALERT MESSAGES -->
      <base-alert v-if="response.type == 'success'" type="success" >
        <span><b> Success - </b> {{ response.message }}</span>
      </base-alert>
      <base-alert v-if="response.type == 'error'" type="danger" >
        <span><b> Error - </b> {{ response.message }}</span>
      </base-alert>
      <!-- END:ALERT MESSAGES -->

      <!-- START:FORM -->
      <form method="POST" @submit.prevent="insertValues" id="insert-row-form">
      <!-- START:FORM INPUTS -->
      <div class="row pb-4" v-if="selectedRow">
        <div v-for="(value, key) in selectedRow" class="col-md-6 pr-md-1">
          <base-input :label="key"
                    v-model="model[key]"
                    :placeholder="key"
                    :disabled="requestLoading ? true : false">
          </base-input>
        </div>
      </div>
      <!-- END:FORM INPUTS -->
      <!-- START:CARD FOOTER -->
      <div class="row" slot="footer" >
        <div class="col" style="display:flex; justify-content: space-between;">
          <base-button simple type="primary" fill @click="backToTableView()" >Cancel</base-button>
          <base-button id="insert-btn" type="primary" fill native-type="submit" :loading="requestLoading">Insert</base-button>
        </div>
      </div>
      <!-- END:CARD FOOTER -->
      </form>
      <!-- END:FORM -->
    </card>
  </div>
</template>
<script>
  import router from '@/router'
  import axios from 'axios'

  import { BaseAlert } from '@/components/VueBlackDashboard';
  import config from '@/config'

  export default {
    props: {
      model: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data () {
      return {
        selectedRow: {},
        response: {
          type: null,
          message: null
        },
        requestLoading: false,
      }
    },
    components: {
      BaseAlert,
    },
    computed: {
      selectedDatabase() {
        return this.$route.params.database;
      },
      selectedTable() {
        // return this.$store.getters["selectedTable"]
        return this.$route.params.table;
      },
    },
    watch: {},
    methods: {
      backToTableView() {
        router.replace('/' +  this.selectedDatabase + '/' + this.selectedTable + '/tableview')
      },
      resetResponse() {
        this.response = {
          type: null,
          message: null
        }
      },
      insertValues() {
        this.requestLoading = true;
        this.resetResponse();
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable;
        axios.post(url, this.model )
          .then(res => {
            this.requestLoading = false;
            this.response.type = 'success'
            this.response.message = 'Row inserted successfully'
            var timeout = setTimeout((timeout) => {
              router.replace('/' + this.selectedDatabase + '/' + this.selectedTable + '/tableview');
              clearTimeout(timeout)
              timeout = false;
            }, 1000 );
          })
          .catch( (error) => {
            // console.log(error);
            this.requestLoading = false;
            this.response.type = 'error'
            let errorMsg = error.response.data.replace('Error:', '')
            this.response.message = errorMsg
          });
      }
    },
    created() {
      const response = this.$store.dispatch('datatable/fetchTableData', this.selectedDatabase)
      response.then((result) => {
        //
        if( result.data.hasOwnProperty('tables')) {
          result.data.tables.forEach((table, index) => {
            if( table.name === this.selectedTable ) {
              table.columns.forEach((column, columnIndex) => {
                this.selectedRow[column.name] = null
              });
            }
          });
          this.selectedRow = Object.assign({}, this.selectedRow);
        }
      });
    }
  }
</script>
<style>

</style>
