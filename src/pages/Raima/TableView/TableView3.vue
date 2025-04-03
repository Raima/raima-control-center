<template>
  <div class="page-container tableview">
    <card class="h-100 table-view-card" style="overflow: auto;background: transparent !important;">
      <v-tabs
        class="page-selector"
        @change="tabSelector"
        v-model="tab"
        background-color="transparent"
        color="basil"
        grow
      >
        <v-tab>
          Table View
        </v-tab>
        <v-tab>
          SQL Editor
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <!-- START:CARD HEADER -->
          <div class="slot-header">
            <div class="tableview-header">
              <!-- START:TITLE -->
              <!-- <h3 class="title">{{ selectedTable }}</h3> -->
              <h3 class="card-title"><i class="tim-icons icon-bag-16 text-success "></i> {{ selectedTable }}</h3>
              <!-- END:TITLE -->

              <!-- START:START CONTROL-SECTION -->
              <div class="control-section">
                <!-- START:INSERT ROW BUTTON -->
                <div>
                  <base-button type="primary" fill @click="goToInsertForm()" >
                    <!--<i class="tim-icons icon-simple-add" ></i>-->Insert Row
                  </base-button>
                </div>
                <!-- END:INSERT ROW BUTTON -->

                <!-- START:SEARCH BOX -->
                <div class="input-group mb-3 custom-search">
                  <div class="input-group-prepend">
                    <select class="custom-select" name="datatable_filter_column" v-model="table.filterSelectedColumn">
                      <option v-for="(filterColumn, index) in filterColumns" :value="filterColumn.value" >{{ filterColumn.text }}</option>
                    </select>
                  </div>
                  <input type="text"
                         class="form-control"
                         aria-label="Text input with dropdown button"
                         name="datatable_filter_query"
                         v-model="table.search" >
                  <div class="input-group-append">
                    <button class="btn btn-primary btn-link btn-search" type="button" id="button-addon2" @click="filterDatatable"><i class="tim-icons icon-zoom-split"></i></button>
                  </div>
                </div>
                <!-- END:SEARCH BOX -->
              </div>
              <!-- END:CONTROL-SECTION -->
            </div>
          </div>
          <!-- END:CARD HEADER -->
          <div class="v-component">
            <div :class="(darkmode) ? 'information-dark-mode' : 'information-white-mode'" v-if="typeof this.globalSort != 'undefined' && this.globalSort !== null && this.globalSort.length > 0">
              <!--
               <div class="information-wrapper">
                <v-icon>mdi-information-outline</v-icon>
                <span v-for="sortObject in this.globalSort" :key="sortObject.index">
                  <span class="sort-column-info" v-for="column in sortObject.key" :key="column.index">{{ column.column }} - </span>
                </span>
                <span>Sort the table globally</span>
              </div>
              <div class="information-wrapper">
                <v-icon>mdi-information-outline</v-icon>
                <span>The other columns only sort the visible data</span>
              </div>
               -->
              <v-radio-group class="sorting-selector" v-model="sortType">
                <v-radio
                  v-for="n in sortItems"
                  :key="n"
                  :label="n"
                  :value="n"
                ></v-radio>
              </v-radio-group>
            </div>
            <div :class="(darkmode) ? 'information-dark-mode' : 'information-white-mode'" v-else>
              <div class="information-wrapper">
                <v-icon>mdi-information-outline</v-icon>
                <span>The columns only sort the visible data</span>
              </div>
            </div>
            <v-data-table
              id="data-table"
              :class="(darkmode) ? 'tableview-dark-mode' : 'white-mode'"
              :headers="table.headers"
              :items="table.rows"
              :search="table.search"
              :custom-filter="filterOnlyCapsText"
              :custom-sort="sortType === 'Global Sorting' ? globalSorting : visibleSorting"
              :mobile-breakpoint="0"
              fixed-header
              :footer-props="{
          showCurrentPage: true,
          disableItemsPerPage: true
        }"
              hide-default-footer
              :page.sync="table.pagination.page"
              :items-per-page="table.pagination.itemsPerPage"
              @page-count="pageCount = $event"
              @update:options="paginate"
            >
              <template v-slot:top="{ }">
                <div class="pagination-wrapper">
                  <div :class="(darkmode) ? 'current-state dark-mode' : 'current-state white-mode'">
                    <div class="page-info">
                      <div>{{(parseInt(table.pagination.page) - 1) * parseInt(table.pagination.itemsPerPage) + 1}}</div>
                      <div>-</div>
                      <div v-if="showRowsValue <= table.pagination.rowCount">{{(parseInt(table.pagination.page) - 1) * parseInt(table.pagination.itemsPerPage) + table.pagination.itemsPerPage}}</div>
                      <div v-else-if="showRowsValue > table.pagination.rowCount">{{table.pagination.rowCount}}</div>
                      <div>/ {{table.pagination.rowCount}}</div>
                    </div>


                    <div :class="(darkmode) ? 'show-rows dark-mode' : 'show-rows white-mode'">
                      <div class="show-rows-text">Show rows:</div>
                      <select class="custom-select" name="datatable_filter_column" v-model="showRowsValue">
                        <option v-for="(number, index) in showRowsOptions" :value="number" >{{ number }}</option>
                      </select>
                    </div>
                  </div>
                  <v-pagination
                    id="pagination"
                    :class="(darkmode) ? 'pagination-dark-mode' : 'pagination-white-mode'"
                    v-model="table.pagination.page"
                    :length="table.pagination.pageCount"
                    :total-visible="10"
                    @input="paginate(table.pagination.page)"
                  ></v-pagination>
                  <div class="go-to-page">
                    <div :class="(darkmode) ? 'go-dark-mode-text' : 'go-white-mode-text'">
                      Go to page
                    </div>
                    <v-text-field type="number" id="go-to-page-input" :class="(darkmode) ? 'go-dark-mode' : 'go-white-mode'" :color="(darkmode) ? '#0098f0a1' : '#194b7d'" v-model="goToPageData" min="1"></v-text-field>
                    <base-button type="primary" id="go-to-page-btn" fill @click="goToPage()" >
                      Go
                    </base-button>
                  </div>
                </div>
              </template>
              <template v-slot:body="{ items, headers }">
                <tbody v-if="items.length > 0">
                <tr v-for="(item,idx,k) in items" :key="idx">
                  <td v-for="(header,key) in headers" :key="key">
                    <template v-if="header.value !== 'controls'">
                      <div v-if="keyData.find(data => data.name === header.value)?.type !== 'primary' && keyData.find(data => data.name === header.value)?.type !== 'unique'">
                        <v-edit-dialog
                          :return-value.sync="item[header.value]"
                          @save="save(item)"
                          @cancel="cancel"
                          @open="open(item)"
                          @close="close"
                        > {{formatItem(item[header.value])}}
                          <template v-slot:input>
                            <v-text-field
                              v-model="item[header.value]"
                              label="Edit"
                              single-line
                            ></v-text-field>
                          </template>
                        </v-edit-dialog>
                      </div>
                      <div style="cursor:not-allowed" v-else>
                        {{formatItem(item[header.value])}}
                      </div>
                    </template>
                    <template v-else>
                      <!--
                      <button type="button" class="link px-3 btn-delete" >
                        <i class="far fa-trash-alt"></i>
                      </button>
                      -->
                      <base-button id="delete-btn" link type="primary" @click="openConfirmModal(item, idx)">
                        <i class="tim-icons icon-trash-simple"></i>
                      </base-button>
                      <base-button id="edit-btn" link type="primary" @click="openEditModal(item)" >
                        <i class="tim-icons icon-pencil"></i>
                      </base-button>
                    </template>
                  </td>
                </tr>
                </tbody>
                <tbody v-else-if="dataIsLoaded">
                <tr class="no-result">
                  <td :colspan="headers.length + 1" class="no-result-cell">
                    <div class="h-100" >
                      <div class="main-icon">
                        <i class="fas fa-ban p-4"></i>
                      </div>
                      <p class="text-center mb-2">
                        Your search returned no results.
                      </p>
                    </div>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-data-table>
            <div class="pagination-wrapper">
              <div :class="(darkmode) ? 'current-state dark-mode' : 'current-state white-mode'">
                <div class="page-info">
                  <div>{{(parseInt(table.pagination.page) - 1) * parseInt(table.pagination.itemsPerPage) + 1}}</div>
                  <div>-</div>
                  <div>{{(parseInt(table.pagination.page) - 1) * parseInt(table.pagination.itemsPerPage) + table.pagination.itemsPerPage}}</div>
                  <div>/ {{table.pagination.rowCount}}</div>
                </div>


                <div :class="(darkmode) ? 'show-rows dark-mode' : 'show-rows white-mode'">
                  <div class="show-rows-text">Show rows:</div>
                  <select class="custom-select" name="datatable_filter_column" v-model="showRowsValue">
                    <option v-for="(number, index) in showRowsOptions" :value="number" >{{ number }}</option>
                  </select>
                </div>
              </div>
              <v-pagination
                id="pagination"
                :class="(darkmode) ? 'pagination-dark-mode' : 'pagination-white-mode'"
                v-model="table.pagination.page"
                :length="table.pagination.pageCount"
                :total-visible="10"
                @input="paginate()"
              ></v-pagination>
              <div class="go-to-page">
                <div :class="(darkmode) ? 'go-dark-mode-text' : 'go-white-mode-text'">
                  Go to page
                </div>
                <v-text-field type="number" id="go-to-page-input" v-model="goToPageData" :class="(darkmode) ? 'go-dark-mode' : 'go-white-mode'" :color="(darkmode) ? '#0098f0a1' : '#194b7d'" min="1"></v-text-field>
                <base-button type="primary" id="go-to-page-btn" fill @click="goToPage()" >
                  Go
                </base-button>
              </div>
            </div>

          </div>
          <!-- START:MODAL -->
          <modal id="delete-modal" :show.sync="confirmModalVisible" :centered="true" modal-classes="modal-dialog-centered modal-sm">
            <div class="py-4 text-center" >
              <i class="far fa-trash-alt fa-4x mb-4"></i>
              <div class="text-center"><strong>Are you sure you want to delete, all affected rows where the column "{{ displayedKey }}" value is "{{ displayedValue}}" ?</strong></div>
            </div>
            <template slot="footer">
              <base-button simple  type="primary" @click="confirmModalVisible = false">Cancel</base-button>
              <base-button type="primary" class="delete-confirm-btn" native-type="submit" fill @click="removeRecord(deleteableKey, deleteableValue)" >Delete</base-button>
            </template>
          </modal>
          <!-- END:MODAL -->
        </v-tab-item>
        <v-tab-item>
          <SQLEditor :selected-tables="relatedTables" :selected-database="selectedDatabase"/>
        </v-tab-item>
      </v-tabs-items>
    </card>
  </div>
</template>
<script>
/* TODO
* - use notifications after inline edit ( dialog open/close, successfull update, error)
* - redraw table after delete row, or simple delete row from table too
* - create md5 version for edit
*/
import axios from 'axios'
import router from '@/router'
import Modal from '@/components/VueBlackDashboard/Modal';
import NotificationTemplate from '@/pages/VueBlackDashboard/Notifications/NotificationTemplate';
import SQLEditor from "@/pages/Raima/SQLEditor/SQLEditor";
import config from '@/config'

export default {
  components: {
    Modal,
    SQLEditor
  },
  data () {
    return {
      tab: null,
      type: ["", "info", "success", "warning", "danger"],
      showRowsOptions: [10, 25, 50, 100, 250, 500],
      showRowsValue: 10,
      globalsort: [],
      /*globalSortKey: {
        column: null,
        order: null,
      },*/
      activeSortKeyName: null,
      goToPageData: 1,
      sortDirection: 'asc',
      confirmModalVisible: false,
      deleteableKey: null,
      deleteableValue: null,
      displayedKey: null,
      displayedValue: null,
      idx: null,
      dataIsLoaded: null,
      keyData: [],
      table: {
        limit: 10,
        pagination:{
          itemsPerPage:  10,
          page: 1,
          pageCount: 0,
          rowCount: 0,
        },
        headers: [],
        rows: [],
        search: '',
        filterSelectedColumn: null,
      },
      edit: {
        originalItem: null,
        newItem: null,
      },
      sortItems: ['Global Sorting' , 'Visible Sorting'],
      sortType: 'Global Sorting',
      relatedTables: [],
    }
  },
  created(){
    this.getKeys();
  },
  computed: {
    sqlSelected() {
      return this.$store.getters['database/getSQLPage'];
    },
    selectedDatabase: function () {
      return this.$route.params.database;
    },
    selectedTable: function () {
      return this.$route.params.table;
    },
    filterColumns: function() {
      var result = this.table.headers.filter(obj => {
        return obj.filterable !== false
      })
      return result;
    },
    darkmode() {
      return this.$store.getters["darkmode"];
    },
    allKeys() {
      return this.$store.getters['database/keys'];
    }
  },
  methods: {
    tabSelector ($event) {
      if ($event === 1) {
        this.$store.commit('database/storeSQLPage', true )
      } else {
        this.$store.commit('database/storeSQLPage', false )

      }
    },
    filterDatatable() {

    },
    formatItem(item){
      if(typeof item == "undefined" || item == null) return

      let regex = /[\[\]']+/g

      item = item.replace(regex, '')
      item = item.replace('ARRAY', '')

      return item
    },
    buildQuery(){
      const paginate = this.table.pagination;

      let params = {
        limit: null,
        position: null,
      }

      params.limit = paginate.itemsPerPage
      params.position = (parseInt(this.table.pagination.page) - 1) * parseInt(this.table.pagination.itemsPerPage) + 1;
      return params;
    },
    getPageCount(){
      let modulus = this.table.pagination.rowCount % this.table.pagination.itemsPerPage

      if(modulus == 0){
        return this.table.pagination.pageCount = this.table.pagination.rowCount / this.table.pagination.itemsPerPage
      }
      else {
        return this.table.pagination.pageCount = Math.floor(this.table.pagination.rowCount / this.table.pagination.itemsPerPage + 1)
      }
    },
    paginate (val){
      // emitted by the data-table when changing page, rows per page, or the sorted column/direction - will be also immediately emitted after the component was created

      const queryParams = this.buildQuery()

      this.fetchRows(queryParams.limit, queryParams.position)

      if(typeof this.globalSort != "undefined" && this.globalSort !== null && this.globalSort.length > 0) {
        this.sortTable(queryParams.limit, queryParams.position)
      } else {
        this.fetchRows(queryParams.limit, queryParams.position)
      }

    },
    filterOnlyCapsText (value, search, item) {
      return item.hasOwnProperty(this.table.filterSelectedColumn) &&
        item[this.table.filterSelectedColumn] != null &&
        search != null &&
        typeof item[this.table.filterSelectedColumn] === 'string' &&
        item[this.table.filterSelectedColumn].toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
    },
    getRowCount(){
      const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable +'/?list=rowcount': config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable +'/?list=rowcount';
      axios.get(url).then(res => {
        if( res.data.hasOwnProperty('rowcount')) {
          this.table.pagination.rowCount = res.data.rowcount
          this.getPageCount();
        }
      }).catch(error => {
        this.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  Something went wrong!', 'tim-icons  icon-alert-circle-exc')
      })

    },
    fetchRows(limit, position) {
      // https://localhost:21553/rdm/BICYCLE_DB/Manufacturer/?list=rows
      const queryKeyParams = '/?list=tables' + '&limit=' + limit + '&position=' + position + '&rowid=on';
      const url1 = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable + queryKeyParams: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable + queryKeyParams;
      axios.get(url1).then(keys => {
        this.keyData = keys.data.tables.filter(item => item.name === this.selectedTable)[0].keys.reverse()
        this.relatedTables = keys.data.tables.map(item => item.name)
      })

      const queryParams = '/?list=rows' + '&limit=' + limit + '&position=' + position + '&rowid=on';
      const url2 = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable + queryParams: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable + queryParams;
      axios.get(url2).then(res => {
        // console.log( res.data );
        if( res.data.hasOwnProperty('row')) {
          if(this.table.headers.length == 0) {
            Object.keys(res.data.row[0]).forEach((value, key) => {
              if(value == "rowid") return
              if(!this.table.filterSelectedColumn) {
                this.table.filterSelectedColumn = value;
              }
              this.table.headers.push({ text: value, value: value, class: value});
            })
            this.table.headers.push({ text : "", value: "controls", sortable: false, filterable: false, align: 'center', width: 130 });
          }
          // console.log( res.data.row );
          this.table.rows = res.data.row
          this.dataIsLoaded = true
        }
      }).catch(error => {
        const vm = this
        if(error.response.data) {
          let errorMsg = error.response.data.replace('Error:', '<div class="error-text">Error -</div> ')
          vm.notifyVue('top', 'right', 4, errorMsg, 'tim-icons  icon-alert-circle-exc')
        } else {
          vm.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  Something went wrong!', 'tim-icons  icon-alert-circle-exc')
        }
        this.dataIsLoaded = false
      })
    },
    updateValue( $keyName, $keyValue, $newValue ) {
      const vm = this
      const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + $keyName + '&value=' + $keyValue: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + $keyName + '&value=' + $keyValue;
      axios.put(url, $newValue )
      .then(res => {
        vm.notifyVue('top', 'right', 2, 'Changes successfully saved!', 'tim-icons icon-check-2')
      })
      .catch( (error) => {
        if(error.response.data) {
          let errorMsg = error.response.data.replace('Error:', '<div class="error-text">Error -</div> ')
          vm.notifyVue('top', 'right', 4, errorMsg, 'tim-icons  icon-alert-circle-exc')
        } else {
          vm.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  Something went wrong!', 'tim-icons  icon-alert-circle-exc')
        }
      });
    },
    removeRecord( $keyName, $keyValue ) {
      const vm = this
      const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + $keyName + '&value=' + $keyValue: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + $keyName + '&value=' + $keyValue;
      axios.delete(url)
      .then(res => {
        // console.log( res );
        vm.notifyVue('top', 'right', 2, 'Data successfully removed!', 'tim-icons icon-check-2')
        vm.confirmModalVisible = false;
        this.table.rows.splice(vm.idx, 1)
      })
      .catch( (error) => {
        if(error.response.data) {
          let errorMsg = error.response.data.replace('Error:', '<div class="error-text">Error -</div> ')
          vm.notifyVue('top', 'right', 4, errorMsg, 'tim-icons  icon-alert-circle-exc')
        } else {
          vm.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  Something went wrong!', 'tim-icons  icon-alert-circle-exc')
        }

      });
    },
    /* START:INLINE EDIT */
    save ( item ) {
      this.edit.newItem = item;
      //console.log( this.edit.originalItem );
      //console.log( this.edit.newItem );

      const data = this.removeRowId(this.edit.newItem)

      this.updateValue( Object.keys(this.edit.originalItem)[0], this.edit.originalItem[Object.keys(this.edit.originalItem)[0]], data );
    },
    cancel () {
    },
    open ( item ) {
      this.edit.originalItem = Object.assign({}, item);
    },
    close () {
      this.notifyVue('top', 'right', 1, 'Update dialog closed', 'tim-icons  icon-alert-circle-exc')
    },
    /* END:INLINE EDIT */
    // navigate to insertform
    goToInsertForm() {
      router.replace('/'+this.selectedDatabase+'/'+this.selectedTable+'/createrow');
    },
    // START:MODAL FUNCTIONS
    openEditModal( rowData ) {
      this.$store.commit('storeSelectedRow', { database: this.selectedDatabase, selectedTable: this.selectedTable, row: rowData } )
    },
    openConfirmModal(  rowData, idx ) {
      this.deleteableKey = Object.keys(rowData)[0];
      this.deleteableValue = rowData[Object.keys(rowData)[0]];

      this.displayedKey = Object.keys(rowData)[1];
      this.displayedValue = rowData[Object.keys(rowData)[1]];

      this.idx = idx;
      this.confirmModalVisible = true;
    },
    // END:MODAL FUNCTIONS
    // notify
    notifyVue(verticalAlign, horizontalAlign, color, msg, icon) {
      this.$notify({
        component: NotificationTemplate,
        message: msg,
        icon: icon,
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: this.type[color],
        // timeout: 6000
      });
    },
    removeRowId(obj){
      let itemWithoutRowId = JSON.parse(JSON.stringify(obj))
      delete itemWithoutRowId.rowid

      return itemWithoutRowId
    },
    getKeys(){
      this.globalSort = []

      for(let db in this.allKeys){
        if(this.allKeys[db].name == this.selectedDatabase) {
          for(let table in this.allKeys[db].tables) {
            if(this.allKeys[db].tables[table].name == this.selectedTable) {
              for(let key in this.allKeys[db].tables[table].keys) {

                  if(this.allKeys[db].tables[table].keys[key].columns.order == "desc")
                    this.allKeys[db].tables[table].keys[key].columns.order = "asc"

                  this.globalSort.push({
                    key: this.allKeys[db].tables[table].keys[key].columns,
                    name: this.allKeys[db].tables[table].keys[key].name
                  })
                  //console.log("global: ", this.globalSort)
                  //this.globalSortKey = this.allKeys[db].tables[table].keys[key].columns
                  //this.globalSortKeyName = this.allKeys[db].tables[table].keys[key].name


              }
            }
          }
        }
      }
    },
    async sortTable(limit = 10, position = 1) {
      //console.log("activeName: ", this.activeSortKeyName)
        if(this.activeSortKeyName !== null && this.activeSortKeyName != '') {
          const queryParams = '/?list=rows' + '&limit=' + limit + '&position=' + position + '&rowid=on' + '&key=' + this.activeSortKeyName + '&order=' + this.sortDirection;

          const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable + queryParams: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase +'/'+ this.selectedTable + queryParams;
          await axios.get(url)
          .then(res => {
            if( res.data.hasOwnProperty('row')) {
              this.table.rows = []
              this.table.rows = res.data.row

              this.dataIsLoaded = true
            }
          })
          .catch(error => {
            const vm = this
            if(error.response.data) {
              let errorMsg = error.response.data.replace('Error:', '<div class="error-text">Error -</div> ')
              vm.notifyVue('top', 'right', 4, errorMsg, 'tim-icons  icon-alert-circle-exc')
            } else {
              vm.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  Something went wrong!', 'tim-icons  icon-alert-circle-exc')
            }
            this.dataIsLoaded = false
          })
        }
    },
    globalSorting(items, index, isDesc) {
      for(let i in this.globalSort) {

        for(let x in this.globalSort[i].key) {
          if(this.globalSort[i].key[x].column == index[0]) {


            this.activeSortKeyName = this.globalSort[i].name
            this.sortDirection = this.globalSort[i].key[x].order

            const queryParams = this.buildQuery()

            let sortedElem = document.getElementsByClassName(this.globalSort[i].key[x].column);

            let sortableElem = document.getElementsByClassName("sortable");
            let activeElem = sortableElem[0]?.getElementsByClassName("active")
            activeElem[0]?.classList.remove("desc")

            sortedElem[0].classList.add("active")
            if(this.sortDirection == "asc") {
              sortedElem[0].classList.remove("desc")
              sortedElem[0].classList.add("asc")
            } else {
              sortedElem[0].classList.remove("asc")
              sortedElem[0].classList.add("desc")
            }



            this.sortTable(queryParams.limit, queryParams.position)

            if(this.globalSort[i].key[x].order == "asc") this.globalSort[i].key[x].order = "desc"
            else if(this.globalSort[i].key[x].order == "desc") this.globalSort[i].key[x].order = "asc"

            index[0] = null

            return this.table.rows;
          } else if (index?.length > 0 && index[0] !== null){

            this.activeSortKeyName = this.globalSort[i].name

            this.globalSort[i].key[x].order = "asc"
            this.sortDirection = "asc"

            items.sort((a, b) => {
              if (!isDesc[0]) {
                return a[index]
                  ?.toString()
                  ?.toLowerCase()
                  ?.localeCompare(b[index].toLowerCase())
              } else {
                return b[index]
                  ?.toString()
                  ?.toLowerCase()
                  ?.localeCompare(a[index].toLowerCase())
              }
            });
            let sortedElem = document.getElementsByClassName(this.globalSort[i].key[x].column);
            sortedElem[0]?.classList.remove("active")
          } else {

          }
        }
      }
      return items;
    },
    visibleSorting(items, index, isDesc) {
      this.activeSortKeyName = []
      items.sort((a, b) => {
        if (!isDesc[0]) {
          return a[index]
            ?.toString()
            ?.toLowerCase()
            ?.localeCompare(b[index].toLowerCase())
        } else {
          return b[index]
            ?.toString()
            ?.toLowerCase()
            ?.localeCompare(a[index].toLowerCase())
        }
      });
      return items;

    },
    goToPage() {
      if(this.goToPageData > this.table.pagination.pageCount) {
        this.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  The table has only '+this.table.pagination.pageCount+' pages!', 'tim-icons  icon-alert-circle-exc')
      } else if (this.goToPageData <= 0) {
        this.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  Please add a valid number!', 'tim-icons  icon-alert-circle-exc')
      } else {
        this.table.pagination.page = parseInt(this.goToPageData)
        this.paginate()
      }
    },
  },
  watch: {
    showRowsValue: function() {
      this.table.pagination.itemsPerPage = this.showRowsValue
      this.getPageCount();
      this.paginate();
    },
    sqlSelected: {
      handler: function (val) {
        if( val === false ) {
          this.tab = 0
        }
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
    //this.getKeys();
    this.getRowCount();
  }
}
</script>

<style lang="scss" scoped>

.information-dark-mode{
  .information-wrapper{
    .v-icon{
      margin-right: 10px;
      margin-bottom: 5px;
      color: #0098f0a1 !important;
    }
    span{
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
.information-white-mode{
  .information-wrapper{
    .v-icon{
      margin-right: 10px;
      margin-bottom: 5px;
      color: #194b7d !important;
    }
    span{
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }
}


.white-mode{
  .show-rows-text, .custom-select, .page-info{
    color: rgba(0, 0, 0, 0.87) !important;
  }
}

.current-state{
  color: rgba(0, 0, 0, 0.87) !important;
}

.show-rows{
  margin-bottom: 0 !important;
  border: 1px solid #8f909a;
  border-radius: 0.4285rem;
  padding-left: 10px !important;
  display: flex;
  margin-left: 20px !important;
  .custom-select{
    width: 70px !important;
  }
  .show-rows-text{
    display: flex;
    align-items: center;
  }
}
  .go-dark-mode-text{
    color: rgba(255, 255, 255, 0.7) !important;
  }
  .go-white-mode-text{
    color: rgba(0, 0, 0, 0.87) !important;
  }
.pagination-wrapper{
  display: flex;
  align-items: center;
  .go-dark-mode{
    .v-input__slot::before{
      border-color: #8f909a !important;
    }
    input{
      color: rgba(255, 255, 255, 0.7) !important;
    }
  }

  .go-white-mode{
    input{
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }

  .go-to-page{
    justify-content: flex-end;
    align-items: center;
    .v-input{
      margin-left:15px;
      max-width: 50px !important;
    }
    .v-input__slot{
      width: 50px !important;
    }
    #go-to-page-btn{
      color: #ffffff;
      font-weight: 600;
      margin-left: 15px;
      width: 40px;
      height: 40px;
      padding: 0;
    }
    width: 200px;
    display: flex;
  }
}
.current-state, .page-info{
  align-items: center;
  display: flex;
  color: rgba(255, 255, 255, 0.7) !important;
}

#pagination{
  margin-left: auto;
  .v-pagination{
    //justify-content: flex-end;
  }
  .v-pagination__item{
    box-shadow: unset !important;
    background-color: transparent;
  }
  .v-pagination__navigation{
    box-shadow: unset !important;
    background-color: transparent !important;
  }
  button:focus{
    outline: none !important;
  }
}
.pagination-dark-mode{
  .v-pagination__item{
    color: rgba(255, 255, 255, 0.7) !important;
  }
  .v-pagination__item--active{
    color: rgba(255, 255, 255, 0.7) !important;
    background-color: #0098f0a1 !important;
  }
  .v-pagination__navigation{
    i{
      color: rgba(255, 255, 255, 0.7) !important;
    }
  }
  .v-pagination__navigation--disabled{
    i{
      color: rgba(255, 255, 255, 0.3) !important;
    }
  }
}
.pagination-white-mode{
  .v-pagination__item--active{
    color: white !important;
    background-color: rgba(0, 0, 0, 0.2) !important;
  }
  .v-pagination__navigation--disabled{
    i{
      color: rgba(0, 0, 0, 0.3) !important;
    }
  }
}


.no-result{
  .main-icon{
    font-size: 1.5rem;
    text-align: center;
  }
}

.btn-search{
  pointer-events: none;
}

.v-component{
  #data-table{
    max-width: 100%;
    background-color: unset !important;

   /* #edit-btn, #delete-btn{
      color: #194b7d;
    }

    #edit-btn:hover, #delete-btn:hover{
      color: #0098f0 !important;
    }*/
    .v-data-table__wrapper{
      position: relative;
      clear: both;
      padding-bottom: 60px;
      overflow: auto;

      table{
        width: 100%;
        border-collapse: separate;
      }
    }

    .v-data-footer__select{
      display: none;
    }

    .v-btn.v-btn--disabled .v-btn__content i{
      color: #6c757d !important;
    }
    .v-data-footer{
      font-size: 20px;
      color: rgba(0, 0, 0, 0.57);
      border-top: unset !important;
      i{
        color: rgba(0, 0, 0, 0.57);
      }
    }

    tr>td:not(:last-child),
    tr>th:not(:last-child){
      min-width: 150px;
    }

    tbody{
      tr>td{
        word-break: break-all;
        border-color: rgba(0, 0, 0, 0.1);
        max-width: 1px !important;
      }

      tr{
        background-color: transparent !important;
        //color: hsla(0,0%,100%,.7) !important;
      }

      tr:nth-child(odd){
        background-color: rgba(0,0,0,.05) !important;
      }

      tr:hover td:not(.no-result-cell){
        background-color: #cae0f3;
      }

    }

    tbody > tr > td:last-child:not(.no-result-cell){
      background: linear-gradient(to right, transparent 0%, white 40%, white);
    }

    tbody > tr:hover > td:last-child:not(.no-result-cell){
      background: linear-gradient(to right, #cae0f3 0%, white 40%, white);
    }

    thead>tr>th{
      box-shadow: 0 1px black;
      max-width: 1px !important;
      vertical-align: middle;
      background-color: white;
      z-index: 1050;
      i {
        margin-left: 5px;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    thead>tr>th:last-child,
    tbody>tr>td:last-child{
      width: 50px !important;
    }

    tbody {

      tr:nth-child(odd) > td:last-child{
        background-color: rgba(0,0,0,.05) !important;
      }

      tr:nth-child(even) > td:last-child{
        background-color: transparent !important;
      }

    }
  }


  .tableview-dark-mode{
    tbody > tr > td:last-child:not(.no-result-cell){
      background: linear-gradient(to right, transparent 0%, #27293d 40%, #27293d) !important;
    }

    tbody{
      tr:hover td:not(.no-result-cell){
        background-color: #253e5f !important;
      }
      tr{
        color: hsla(0,0%,100%,.7);
      }
      tr>td{
        border-color: hsla(0,0%,100%,.1) !important;
      }
    }

    thead>tr>th{
      i{
        color: white !important;
      }
    }

    thead{
      tr>th{
        z-index: 1050;
        background-color: #27293d !important;
        box-shadow: 0 1px white !important;
        color: hsla(0,0%,100%,.7) !important;
      }

      tr>th:hover{
        color: white !important;
      }

      th.sortable.active{
        color: white !important;
      }
    }

    .v-btn.v-btn--disabled .v-btn__content i{
      color: #6c757d !important;
    }
    .v-data-footer{
      font-size: 20px;
      color:white !important;
      border-top: unset !important;
      i{
        color:white !important;
      }
    }
  }





  /* START: FIXED LAST COLUMN */
  table > tbody > tr > td:last-child,
  table > thead > tr > th:last-child {
    text-align: right;
    position: sticky !important;
    position: -webkit-sticky !important;
    right: 0;
    z-index: 1048;
  }
  table > thead > tr > th:last-child {
    z-index: 1049;
  }
  /* END: FIXED LAST COLUMN */
  .text-xs-right .v-menu__activator {
    justify-content: right
  }
  /* NOT LET THE HEADER BREAK TO MULTIPLE LINES */
  .v-data-table-header th {
    white-space: nowrap;
  }
  /* CSS BUGFOX FOR EDITABLE DIALOG */
  .v-data-table__wrapper tbody tr td {
    position: relative;
  }

  .v-menu__content{
    min-width: 151px;
    top: unset !important;
    left: unset !important;
    transform-origin: unset !important;
    z-index: 8;

  }

  .v-small-dialog__menu-content{
    max-height: 60px !important;
    overflow: hidden !important;
  }

  /*.v-data-table__wrapper tbody .v-menu.v-small-dialog {
    position: absolute;
    overflow:visible;
    width: 100%;
    z-index: 9999;
  }



  .v-menu__content.menuable__content__active.v-small-dialog__menu-content {
    top: 0 !important;
    left: 0 !important;
    min-width: 150px !important;
    width: 100%;
    //width: 200%;
  }*/

  .cell-controll {
    background: #da465c !important;
  }
}

#delete-modal {
  .modal-content {
    background: #1a232a;
    color: #fff;
  }
  .delete-confirm-btn {
    background: #da465c !important;
    border-color: #da465c !important;
    color: #ffffff !important;
  }
}

.white-content {
  #delete-modal {
    .modal-content {
      background: #ffffff;
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }
}


.tableview .page-selector {
  margin-top: -12px;
}

.tableview .page-selector.v-tabs .v-tab.v-tab--active {
  background: #da465c !important;
}

.tableview .page-selector.v-tabs .v-tab {
  background: #1f2931 !important;
}

.tableview .page-selector.v-tabs .v-tab:hover {
  background: #da465c !important;
}

.page-selector.v-tabs .v-tab--active:before,
.page-selector.v-tabs .v-tab--active:hover:before,
.page-selector.v-tabs .v-tab:focus:before {
  opacity: 0 !important;
}

.tableview .page-selector.v-tabs .v-tab:not(.v-tab--active):before {
  opacity: 0;
}


.v-window__container .v-window-item:first-child {
  background: #1f2931 !important;
  padding: 15px;
}

.white-content .v-window__container .v-window-item:first-child {
  background: transparent !important;
}

.card.h-100 > .card-body {
  padding: 0 !important;
}

.table-view .card-body .v-window.v-item-group.v-tabs-items {
  margin-top: 30px;
}

.tableview .theme--light.v-tabs-items {
  margin-top: 30px;
}


.v-component .tableview-dark-mode tbody > tr > td:last-child:not(.no-result-cell) {
  background: transparent !important;
}

.v-component .tableview-dark-mode tbody tr:hover td:not(.no-result-cell) {
  background-color: #da465c !important;
}

.v-component .tableview-dark-mode tbody tr:hover td:not(.no-result-cell) .tim-icons {
  color: #ffffff !important;
}


.v-component .tableview-dark-mode tbody > tr:hover > td:last-child {
  background: #da465c !important;
}

.tim-icons,
.information-dark-mode .information-wrapper .v-icon {
  color: #da465c !important;
}

.pagination-dark-mode .v-pagination__item--active,
.pagination-dark-mode .v-pagination__item:hover {
  background: #da465c !important;
}


</style>
