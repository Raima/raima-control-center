<template>
  <div id="sql-editor" class="page-container" style="height: calc(100vh - 110px);">
    <v-row class="sql-row">
      <v-col
        cols="2"
        sm="2"
        md="2"
      >
        <card class="h-100" style="height: calc(100vh - 100px) !important;overflow: auto;">
          <v-treeview
            v-if="renderComponent"
            v-show="true"
            v-model="databaseValue"
            :items="items"
            activatable
            item-key="name"
            :active.sync="active"
            :open.sync="open"
            open-on-click
          >
            <template slot="label" slot-scope="{ item }">
              {{ item.name }} <span style="font-size: 10px;color: #da465c !important"
                                    v-if="item.type">[ {{ item.type }} ]</span>
              <template class="ml-2" v-if="item.children && !item.children[0].children[0]?.type">
                <i @click="fetchRows(item)" class="fas fa-plug"></i>
              </template>
            </template>
          </v-treeview>
          <div class="text-center mt-5" v-if="!renderComponent">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </card>
      </v-col>
      <v-col :cols="7" class="sql-container" :class="syntaxToggle ? 'syntax-hide' : 'syntax-show'" style="height: calc(100vh - 90px); overflow-y:hidden;">
        <card>
          <v-row>
            <v-col class="d-flex text-center" cols="12">
              <v-scroll-y-transition mode="out-in">
                <v-card class="sql-card" style="width:100%;" flat>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-row no-gutters>
                          <v-col cols="10">
                            <v-tabs id="sql-query-tabs" v-model="tab" hide-slider show-arrows background-color="transparent" color="basil"
                                    grow height="30" next-icon="mdi-arrow-right-bold-box-outline"
                                    prev-icon="mdi-arrow-left-bold-box-outline">
                              <v-tab v-for="n in length" :key="n" dark width="50" class="hoveredTab"
                                     @mouseover="selectItem(n)">
                                  <span class="caption font-weight-bold">
                                    SQL Tab {{ n }}
                                  </span>
                                <v-btn v-if="length > 1" class="ml-5 font-weight-bold" color="error" @click="length--"
                                       small icon>
                                  <i v-show="n === selectedTab" class="fas fa-times-circle"></i>
                                </v-btn>
                              </v-tab>
                              <v-tab @click="length++">
                                <i class="fas fa-plus-square"></i>
                              </v-tab>
                            </v-tabs>
                          </v-col>
                          <v-col cols="2">
                            <base-button class="sql-btn mr-2" type="primary" fill @click="runQuery()" >
                              <i class="fa fa-play mr-1" aria-hidden="true"></i> Run
                            </base-button>
                            <base-button class="sql-btn" type="primary" fill @click="downloadQuery()" >
                              <i class="fa fa-save mr-1" aria-hidden="true"></i> Save
                            </base-button>
                          </v-col>
                        </v-row>
                        <v-row class="mt-3">
                          <textarea style="width: 100%;" id="txt" ref="txt" class="txt">
                           select * from
                           </textarea>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-scroll-y-transition>
            </v-col>
          </v-row>
        </card>
        <card style="overflow-y:scroll; height: calc(100vh - 50%)">
          <div class="v-component">
            <v-data-table
              id="data-table"
              :class="(darkmode) ? 'tableview-dark-mode' : 'white-mode'"
              :headers="table.headers"
              :items="table.rows"
              :mobile-breakpoint="0"
              fixed-header
              :footer-props="{
                showCurrentPage: true,
                disableItemsPerPage: true
              }"
              hide-default-footer
            />
          </div>
        </card>
      </v-col>
      <button @click="syntaxToggle = !syntaxToggle" class="syntax-toggle" :class="syntaxToggle ? 'syntax-hide' : 'syntax-show'">
        <p><</p>
      </button>
      <v-col class="syntax-wrapper" :class="syntaxToggle ? 'syntax-hide' : 'syntax-show'" cols="3">
        <Syntax @copyQuery="copyFromHistory" :history-list="historyList"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import Syntax from "./components/Syntax.vue"
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/neo.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/mode/sql/sql.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import NotificationTemplate from '@/pages/VueBlackDashboard/Notifications/NotificationTemplate';
import { escape } from 'sqlstring';
import config from '@/config';

export default {
  name: "SQLEditor",
  components: {Syntax},
  data: () => ({
    syntaxToggle: false,
    type: ["", "info", "success", "warning", "danger"],
    defaultProps: {
      children: 'children',
      label: 'label'
    },
    renderComponent: true,
    active: [],
    open: [],
    databaseValue: [],
    queryCode: null,
    length: 1,
    tab: null,
    selectedTab: null,
    selectedDatabase: null,
    selectedTable: [],
    items: [],
    commands: [
      { className: "sql", text: "SELECT" },
      { className: "sql", text: "FROM" },
      { className: "sql", text: "WHERE" },
      { className: "sql", text: "INNER" },
      { className: "sql", text: "JOIN" },
      { className: "sql", text: "UNION" },
      { className: "sql", text: "EXEC" },
      { className: "sql", text: "INSERT" },
      { className: "sql", text: "INTO" },
      { className: "sql", text: "VALUES" },
      { className: "sql", text: "UPDATE" },
      { className: "sql", text: "DELETE" },
      { className: "sql", text: "GROUP" },
      { className: "sql", text: "BY" },
      { className: "sql", text: "HAVING" },
      { className: "sql", text: "IS" },
      { className: "sql", text: "DISTINCT" },
      { className: "sql", text: "OUTER" },
      { className: "sql", text: "TOP" },
      { className: "sql", text: "EXISTS" },
      { className: "sql", text: "WHEN" },
      { className: "sql", text: "CASE" },
      { className: "sql", text: "CAST" },
      { className: "sql", text: "IN" },
      { className: "sql", text: "LIKE" },
      { className: "sql", text: "BEGIN" },
      { className: "sql", text: "CALL" },
      { className: "sql", text: "CLOSE" },
      { className: "sql", text: "WHILE" },
      { className: "sql", text: "OPEN" },
    ],
    editor: null,
    headers: [
      {text: 'Name', value: 'name'},
      {text: 'ID', value: 'ID'},
      {text: 'Text', value: 'text'},
    ],
    content: '',
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
    historyList: [],
    responseTable: null,
  }),
  mounted() {
    this.fetchTables();
    this.editor = CodeMirror.fromTextArea(this.$refs.txt, {
      tabSize: 4,
      mode: "text/x-mysql",
      theme: "panda-syntax",
      lineNumbers: true,
      line: true,
      lineWrapping: true,
      hintOptions: {
        completeSingle: false,
        hint: this.hint
      },
      extraKeys: {
        "Ctrl-Space": editor => {
          editor.showHint();
        }
      }
    });
    this.editor.on("keypress", editor => {
      editor.showHint();
    });
  },
  computed: {
    darkmode() {
      return this.$store.getters["darkmode"];
    },
  },
  methods: {
    suggest(searchString) {
      let token = searchString;
      if (searchString.startsWith(".")) token = searchString.substring(1);
      else token = searchString.toLowerCase();
      let result = [];
      let N = this.commands.length;
      for (let i = 0; i < N; i++) {
        let keyword = this.commands[i].text.toLowerCase();
        let suggestion = null;
        if (keyword.startsWith(token)) {
          suggestion = Object.assign({ score: N + (N - i) }, this.commands[i]);
        } else if (keyword.includes(token)) {
          suggestion = Object.assign({ score: N - i }, this.commands[i]);
        }
        if (suggestion) result.push(suggestion);
      }
      if (searchString.startsWith(".")) {
        result.forEach(s => {
          if (s.className == "column") s.score += N;
          else if (s.className == "sql") s.score -= N;
          return s;
        });
      }
      return result.sort((a, b) => b.score - a.score);
    },
    hint(editor) {
      let cur = editor.getCursor();
      let token = editor.getTokenAt(cur);
      let searchString = token.string;
      return {
        list: this.suggest(searchString),
        from: CodeMirror.Pos(cur.line, token.start),
        to: CodeMirror.Pos(cur.line, token.end)
      };
    },
    connectDatabase(item) {
      console.log(item)
    },
    selectItem(item) {
      this.selectedTab = item
    },
    downloadQuery() {
      const url = window.URL.createObjectURL(new Blob([this.editor.getValue()]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'sql_query.sql')
      document.body.appendChild(link)
      link.click()
    },
    fetchTables() {
      const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdmadmin/?list=databases&tables=on&columns=off&keys=off&refs=off': config.schema + this.$store.getters["auth/api_address"] + '/rdmadmin/?list=databases&tables=on&columns=off&keys=off&refs=off';
      axios.get(url).then(response => {
        this.items = response.data.databases.map(item => {
          return {
            name: item.name,
            children: item.tables,
          }
        })
        for (let i=0; i < this.items.length; i ++) {
          this.commands.push({
            className: 'database',
            text:  this.items[i].name
          });
        }
      }).catch(error => {
        const vm = this
        if (error.response.data) {
          let errorMsg = error.response.data.replace('Error:', '<div class="error-text">Error -</div> ')
          vm.notifyVue('top', 'right', 4, errorMsg, 'tim-icons  icon-alert-circle-exc')
        } else {
          vm.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  Something went wrong!', 'tim-icons  icon-alert-circle-exc')
        }
        this.dataIsLoaded = false
      })
    },
    runQuery() {
      if (this.selectedDatabase) {
        this.table.headers = []
        this.table.rows = []
        const query = encodeURIComponent((this.editor.getValue()).trim())
        this.historyList.push(this.editor.getValue())
        const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' + +this.$store.getters["auth/port_number"] + '/RDMSQL/' + this.selectedDatabase + '/?query=' + query: config.schema + this.$store.getters["auth/api_address"] + '/RDMSQL/' + this.selectedDatabase + '/?query=' + query;
        axios.get(url).then(response => {
          if (this.editor.getValue().includes('INSERT') || this.editor.getValue().includes('UPDATE') || this.editor.getValue().includes('DELETE')) {
            const vm = this
            vm.notifyVue('top', 'right', 1, 'Your transaction is successful', 'tim-icons  icon-check-2')
          }
          Object.keys(response.data.row[0]).forEach((value, key) => {
            this.table.headers.push({ text: value, value: value, class: value});
          })
          this.table.rows = response.data.row
        }).catch(error => {
          const vm = this
          if (error.response.data) {
            let errorMsg = error.response.data.replace('Error:', '<div class="error-text">Error -</div> ')
            vm.notifyVue('top', 'right', 4, errorMsg, 'tim-icons  icon-alert-circle-exc')
          } else {
            vm.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  Something went wrong!', 'tim-icons  icon-alert-circle-exc')
          }
          this.dataIsLoaded = false
        })
      }
      else {
        const vm = this
        vm.notifyVue('top', 'right', 4, '<div class="error-text">Error -</div>  Please select a database to run a query!', 'tim-icons  icon-alert-circle-exc')
      }
    },
    fetchRows(value) {
      this.commands.push({
        className: 'table',
        text:  value.name
      });
      this.renderComponent = false;
      let selectedValue = null
      this.selectedDatabase = value.name;
      const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' + +this.$store.getters["auth/port_number"] + '/rdm/' + value.name + '/?list=tables&columns=on': config.schema + this.$store.getters["auth/api_address"] + '/rdm/' + value.name + '/?list=tables&columns=on';
      axios.get(url).then(response => {
        this.responseTable = response.data.tables.map(item => {
          return {
            name: item.name,
            children: item.columns
          }
        })
        for (let x = 0; x < this.responseTable[0].children.length; x++) {
          this.commands.push({
            className: 'column',
            text: this.responseTable[0].children[x].name
          });
        }
        for (let i = 0; i < this.items.length; i++) {
          for (let x = 0; x < this.items[i].children.length; x++) {
            if (this.selectedTable.length && this.selectedTable[0].name === this.items[i].children[x].name) {
              this.selectedTable = []
              delete  this.items[i].children[x].children
            }
          }
        }
        this.selectedTable.push(this.responseTable[0])
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].name === value.name) {
            for (let x = 0; x < this.items[i].children.length; x++) {
              this.items[i].children[x].children = this.responseTable.find(item => item.name === this.items[i].children[x].name).children
            }
          }
        }
        this.$nextTick(() => {
          this.renderComponent = true;
        })
      })
      this.open = [];
      this.open.push(this.selectedDatabase, value.name);
    },
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
    copyFromHistory ($event) {
      this.editor.setValue($event)
    }
  },
}
</script>

<style src="./SQLEditor.scss" lang="scss"/>
