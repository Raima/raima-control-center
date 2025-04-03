<template>
  <div class="page-container">
    <card class="h-100">
      <!-- START:CARD HEADER -->
      <h3 slot="header" class="card-title"><i class="tim-icons icon-pencil text-success "></i> Edit row</h3>
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
      <form method="POST" @submit.prevent="updateValues" id="edit-row-form">

      <!-- START:FORM INPUTS -->
      <div class="row pb-4">
        <div v-for="(value, key) in composeInputFields()" class="col-md-6 pr-md-1">
          <div>
            <base-input
              :disable="keyData.find(data => data.name === key)?.type === 'primary' || keyData.find(data => data.name === key)?.type === 'unique'"
              :label="key"
              v-model="model[key]"
              :placeholder="key"
              :disabled="requestLoading ? true : false"
            />
          </div>
        </div>
      </div>
      <!-- END:FORM INPUTS -->
      <!-- START:CARD FOOTER -->
      <div class="row" slot="footer" >
        <div class="col" style="display:flex; justify-content: space-between;">
          <base-button simple type="primary" fill @click="backToTableView()" >Cancel</base-button>
          <base-button type="primary" native-type="submit" fill>Confirm</base-button>
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
  import config from '@/config'

  import { BaseAlert } from '@/components/VueBlackDashboard';

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
        response: {
          type: null,
          message: null
        },
        keyData: [],
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
        return this.$route.params.table;
      },
      selectedRow() {
        return Object.entries(this.$store.getters.selectedRows).filter(item => item[0].includes(this.$route.params.key))[0][1];
      }
    },
    watch: {
      selectedRow: {
        handler: function (val) {
          if( val !== null ) {
            Object.entries(val).forEach(([key, value]) => {
              this.model[key] = value;
            });
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted () {
      this.fetchKeysData(1, 10)
    },
    methods: {
      fetchKeysData(limit, position) {
        const queryKeyParams = '/?list=tables' + '&limit=' + limit + '&position=' + position + '&rowid=on';
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable + queryKeyParams: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable + queryKeyParams;
        axios.get(url).then(keys => {
          this.keyData = keys.data.tables.filter(item => item.name === this.selectedTable)[0].keys.reverse()
        })
      },
      composeInputFields() {
        return this.removeRowId(this.selectedRow)
      },
      backToTableView() {
        router.replace('/' +  this.selectedDatabase + '/' + this.selectedTable + '/tableview')
      },
      resetResponse() {
        this.response = {
          type: null,
          message: null
        }
      },
      removeRowId(obj){
        if(typeof obj !== 'object' && obj == null) return
        if(obj.hasOwnProperty('rowid')) {
          let itemWithoutRowId = JSON.parse(JSON.stringify(obj))
          delete itemWithoutRowId.rowid

          return itemWithoutRowId
        }
        else {
          return obj
        }
      },
      updateValues() {
        this.requestLoading = true;
        this.resetResponse();
        // https://hostname:port/rdm/dbname/tablename/?key=keyname&start=keyvalue[;keyvalue]
        // const keyname = 'keyname';
        // const keyname = 'keyvalue';
        const keyname = Object.keys(this.selectedRow)[0];
        const keyvalue = this.selectedRow[Object.keys(this.selectedRow)[0]];

        const data = this.removeRowId(this.model)
        // axios.put(config.schema + this.$store.getters["auth/api_address"] + ':' + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + keyname + '&value=' + keyvalue + '[;' + keyvalue + ']', this.model )
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + keyname + '&value=' + keyvalue: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + keyname + '&value=' + keyvalue;
        axios.put(url, data)
        .then(res => {
          this.requestLoading = false;
          this.response.type = 'success'
          this.response.message = 'Row updated successfully'
          this.$store.commit('removeSelectedRow', this.$route.params.key)
          let timeout = setTimeout((timeout) => {
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
    created() {}
  }
</script>
<style>
</style>
