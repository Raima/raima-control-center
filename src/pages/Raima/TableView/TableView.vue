<template>
  <div class="page-container">
    <card class="h-100" style="overflow: auto;">

    <!-- START:CARD HEADER -->
    <div slot="header">
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
              <select class="custom-select" name="datatable_filter_column" v-model="filterSelectedColumn">
                <option v-for="(filterColumn, index) in filterColumns" :value="index" >{{ filterColumn.title }}</option>
              </select>
            </div>
            <input type="text" 
                   class="form-control" 
                   aria-label="Text input with dropdown button" 
                   name="datatable_filter_query" 
                   v-model="filterQuery" >
            <div class="input-group-append">
              <button class="btn btn-primary btn-link btn-search" type="button" id="button-addon2" @click="filterDatatable" ><i class="tim-icons icon-zoom-split"></i></button>
            </div>
          </div>
          <!-- END:SEARCH BOX -->
        </div>
        <!-- END:CONTROL-SECTION -->
      </div> 

    </div>
    <!-- END:CARD HEADER -->
    <!-- <table id="dataTable" class="stripe row-border order-column" style="width:100%; margin-bottom: 30px;" > -->
    <table id="dataTable" class="table table-striped table-hover" style="width:100%; margin-bottom: 0;" ref="carousel_or_anything">
    </table>
    <!-- START:MODAL -->
    <modal :show.sync="confirmModalVisible" :centered="true" modal-classes="modal-dialog-centered modal-sm">
     <template slot="header">
        <h5 class="modal-title" id="dataTableModalLabel">Remove datas</h5>
     </template>
     <div class="py-4 text-center" >
      <i class="far fa-trash-alt fa-4x mb-4"></i>
      <div class="text-center"><strong>Are you sure you want to delete, all affected rows where the column "{{ deleteableKey }}" value is "{{ deleteableValue }}" ?</strong></div>
     </div>
     <template slot="footer">
         <base-button class="animation-on-hover" type="warning" @click="removeRecord(deleteableKey, deleteableValue)" >Delete</base-button>
         <base-button simple  type="primary" @click="confirmModalVisible = false">Cancel</base-button>
     </template>
    </modal>
    <!-- END:MODAL -->
    </card>
  </div>
</template>
<script>
import axios from 'axios'
import router from '@/router'
import Modal from '@/components/VueBlackDashboard/Modal';
import NotificationTemplate from '@/pages/VueBlackDashboard/Notifications/NotificationTemplate';
import config from '@/config';

export default {
    /*
    props: {
        rows: null
    },
    */
    components: {
      Modal
    }, 
    data() {
      return {
        type: ["", "info", "success", "warning", "danger"],
        datatable: null,
        table: {
            headers: [],
            rows: [],
        },
        confirmModalVisible: false,
        // table filters
        filterSelectedColumn: 0,
        filterQuery: null,
        deleteableKey: null,
        deleteableValue: null,
      }
    },
    computed: {
        database: function () {
          return this.$route.params.database;
        },
        selectedDatabase() {
          // return this.$store.getters["selectedDatabase"]
          return this.$route.params.database;
        },
        selectedTable: function () {
          return this.$route.params.table;
        },
        filterColumns: function() {
          var result = this.table.headers.filter(obj => {
            return obj.searchable === true
          })
          return result;
        },
        editableRowsIndexes: function() {
          var editableIndexes = [];
          this.table.headers.forEach((link, index) => {
            if(link.className == "inline-editable") {
              editableIndexes.push( index );
            }
          });
          return editableIndexes;
        }
    },
    watch: {
      filterSelectedColumn: function (val) {
        this.filterReset();
      },
      filterQuery: function (val) {
        //console.log(val);
        this.filterDatatable();
      },
    },
    methods: {
      goToInsertForm() {
        router.replace('/'+this.database+'/'+this.selectedTable+'/createrow');
      },
      // START:MODAL FUNCTIONS 
      openEditModal( rowData ) {
        this.$store.commit('storeSelectedRow', { database: this.database, selectedTable: this.selectedTable, row: rowData } )
      },
      openConfirmModal(  $keyName, $keyValue ) {
        // console.log('delete ' + id + '. row')
        this.deleteableKey = $keyName;
        this.deleteableValue = $keyValue;
        this.confirmModalVisible = true;
      },
      // END:MODAL FUNCTIONS
      /* START:API CALL FUNCTIONS */
      fetchRows() {
        // https://localhost:21553/rdm/BICYCLE_DB/Manufacturer/?list=rows
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + this.database +'/'+ this.selectedTable +'/?list=rows': config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.database +'/'+ this.selectedTable +'/?list=rows';
        axios.get(url).then(res => {
          // console.log( res.data );
          if( res.data.hasOwnProperty('row')) {
            if(this.table.headers.length == 0) {
              Object.keys(res.data.row[0]).forEach((value, key) => {
                if( this.table.headers.length == 0) {
                  this.table.headers.push({ "data" : value, "title": value, className: "", orderable: true, searchable: true });
                }
                else {
                  this.table.headers.push({ "data" : value, "title": value, className: "inline-editable", orderable: true, searchable: true });
                }
                
              })
              this.table.headers.push({ data : "", title: "", className: "controll-cell text-center" ,orderable: false, searchable: false, defaultContent: '<a href="#" class="link btn-delete"><i class="far fa-trash-alt"></i></a>', width: "60px", });
              this.table.headers.push({ data : "", title: "", className: "controll-cell text-center", orderable: false, searchable: false, defaultContent: '<a href="#" class="link btn-edit"><i class="tim-icons icon-pencil"></i></a>', width: "60px" });
            }
            this.table.rows = res.data.row
            this.initDatatable();
          }
        }).catch(err => {

        })
        // console.log( this.table );
      },
      updateValue( $keyName, $keyValue, $newValue ) {
        // console.log( 'keyname : ' + $keyName + ' keyvalue : ' + $keyValue + ' newvalue : ');
        // console.log( $newValue );
        // https://hostname:port/rdm/dbname/tablename/?key=keyname&start=keyvalue[;keyvalue]
        const vm = this
        // axios.put(config.schema + this.$store.getters["auth/api_address"] + ':' + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + $keyName + '&value=' + $keyValue + '[;' + $keyValue + ']', $newValue )
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + $keyName + '&value=' + $keyValue: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + $keyName + '&value=' + $keyValue;
        axios.put(url, $newValue )
        .then(res => {
          // console.log( res );
          vm.notifyVue('top', 'right', 2, 'Changes successfully saved!', 'tim-icons icon-check-2')
        })
        .catch( (error) => {
          // console.log(error);
          vm.notifyVue('top', 'right', 4, 'Something went wrong!', 'tim-icons  icon-alert-circle-exc')
        });
      },
      removeRecord( $keyName, $keyValue ) {
        const vm = this
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' + this.$store.getters["auth/port_number"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + $keyName + '&value=' + $keyValue: config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + this.selectedDatabase + '/' + this.selectedTable + '/?key=' + $keyName + '&value=' + $keyValue;
        axios.delete(url)
        .then(res => {
          // console.log( res );
          vm.notifyVue('top', 'right', 2, 'Datas successfully removed!', 'tim-icons icon-check-2')
          vm.confirmModalVisible = false;
          vm.datatable.destroy();
          vm.fetchRows();
        })
        .catch( (error) => {
          // console.log(error);
          vm.notifyVue('top', 'right', 4, 'Something went wrong!', 'tim-icons  icon-alert-circle-exc')
        });
      },
      /* END:API CALL FUNCTIONS */
      initDatatable() {
        const vm =  this;
        var table = jQuery(this.$refs.carousel_or_anything).DataTable({
          pageLength: 25,
          dom: "<'row'<'col-sm-5'l><'col-sm-7 paginator-container'p>>" +"<'row table-content'<'col-sm-12'tr>>" +"<'row custom-dataTable-footer-container'<'col-sm-5'i><'col-sm-7 paginator-container'p>>",
          keys: {
            columns: vm.editableRowsIndexes
          },
          data :  this.table.rows,
          columns : this.table.headers,
          scrollY: '58vh',
          scrollX: true,
          fixedHeader: true,
          fixedColumns: true,
          fixedColumns:   {
              leftColumns: 1,
              rightColumns: 2
          },
          oLanguage: {
            oPaginate: {
              sNext: '<i class="fas fa-chevron-right"></i>',
              sPrevious: '<i class="fas fa-chevron-left"></i>'
            }
          },
          initComplete: function(settings, json) {
            // START:DATATABLES INLINE EDIT FUNCTIONS
            var oldRowValues = null;
            var newRowValues = null;
            $( "#dataTable" ).on("key-focus", function ( e, datatable, cell ) {
                oldRowValues = _.clone( datatable.row( cell.index().row ).data() );
                const originalValue =  cell.data();
                cell.data( '<input type="text" class="cell-input" value="' + cell.data() + '" /> ' )
                const orignalInputValue = $(cell.node()).find("input").val();
                $(cell.node()).find("input").focus().val("").val(orignalInputValue);
            });

            $( "#dataTable" ).on("key-blur", function ( e, datatable, cell ) {
                const value = $(cell.node()).find("input").val();
                var rowData = datatable.row( cell.index().row ).data();
                // console.log( rowData );
                cell.data(value);
                newRowValues = rowData;
                vm.updateValue( Object.keys(oldRowValues)[0], oldRowValues[Object.keys(oldRowValues)[0]], rowData );
            });
            // END:INLINE EDIT FUNCTIONS 
          },
          drawCallback: function( settings ) {
            // START:buttons click handle
            $( "#dataTable tbody td" ).on( "click", "a.btn-edit", function() {
              table.cell.blur();
              var rowData = table.row( $(this).parents('tr') ).data();
              vm.openEditModal( rowData );
            });
            $( "#dataTable tbody td" ).on( "click", "a.btn-delete", function() {
              table.cell.blur();
              var rowData = table.row( $(this).parents('tr') ).data();
              vm.openConfirmModal( Object.keys(rowData)[0], rowData[Object.keys(rowData)[0]] );
            });
            // END:buttons click handle
            $("#dataTable tbody td.inline-editable").on('keydown', 'input.cell-input:focus', function (event) {
              if (event.keyCode === 13) {
                table.cell.blur();
              }
            });
          }
        });

        /*
        $(window).click(function() {
          //Hide the menus if visible
          table.cell.blur();
        });
        */
        //table-content

        $(document).on("click", function(event){
          if(!$(event.target).closest(".table-content tbody").length){
            // Showing the hint message
            table.cell.blur();
            // $(".hint").html("A click <b>outside</b> the dropdown is detected.");
          }
        });
       
        this.datatable = table


        /*
        table
        .on( 'key', function ( e, datatable, key, cell, originalEvent ) {
          console.log( '<div>Key press: '+key+' for cell <i>'+cell.data()+'</i></div>' );
        } )
        .on( 'key-focus', function ( e, datatable, cell ) {
          console.log( '<div>Cell focus: <i>'+cell.data()+'</i></div>' );
        } )
        .on( 'key-blur', function ( e, datatable, cell ) {
          console.log( '<div>Cell blur: <i>'+cell.data()+'</i></div>' );
        } )
        */
      },
      filterDatatable() {
        this.datatable.columns( this.filterSelectedColumn ).search( this.filterQuery ).draw();
      },
      filterReset() {
        this.filterQuery = '';
        this.datatable.search( '' ).columns().search( '' ).draw();
      },
      // notify
      notifyVue(verticalAlign, horizontalAlign, color, msg, icon) {
        this.$notify({
          component: NotificationTemplate,
          message: msg,
          icon: icon,
          horizontalAlign: horizontalAlign,
          verticalAlign: verticalAlign,
          type: this.type[color],
          timeout: 6000
        });
      },
    },
    mounted() {
        this.fetchRows();
    },
    created() {
      // console.log($route.params.database);
      /*
      setTimeout(function(){
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
            $($.fn.dataTable.tables( true ) ).css('width', '100%');
            $($.fn.dataTable.tables( true ) ).DataTable().columns.adjust().draw();
        } );
      }, 500);
      */
    }
}
</script>