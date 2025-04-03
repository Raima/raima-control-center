<template>
  <div id="data-visualization" class="page-container" style="height: calc(100vh - 110px);">
    <v-row>
      <v-col>
        <card>
          <v-row>
            <v-col class="d-flex text-center" cols="12">
              <div id="chart">
                <v-row>
                  <v-col cols="12">
                    <apexchart v-if="chartIsPopulated" :options="chartOptionsTEMP" :series="chartDataTEMP"></apexchart>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </card>
        <card>
          <v-row>
            <v-col class="d-flex text-center" cols="12">
              <div id="chart">
                <v-row>
                  <v-col cols="12">
                    <apexchart v-if="chartIsPopulated" :options="chartOptionsHUMIDITY" :series="chartDataHUMIDITY"></apexchart>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </card>
        <card>
          <v-row>
            <v-col class="d-flex text-center" cols="12">
              <div id="chart">
                <v-row>
                  <v-col cols="12">
                    <apexchart v-if="chartIsPopulated" :options="chartOptionsWINDSPEED" :series="chartDataWINDSPEED"></apexchart>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import VueApexCharts from 'vue-apexcharts'
import config from "@/config";

export default {
  name: "DataVisualization",
  components: {
    ApexCharts: VueApexCharts,
  },
  data: () => ({
    show: false,
    mapIsPopulated: false,
    chartIsPopulated: false,
    points: [],
    series: [{
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    },{
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    chartDataTEMP: [
      {
        name: "TEMP",
        data: []
      }
    ],
    chartDataHUMIDITY: [
      {
        name: "HUMIDITY",
        data: []
      }
    ],
    chartDataWINDSPEED: [
      {
        name: "WINDSPEED",
        data: []
      }
    ],
    chartOptionsTEMP: {
      colors: ['#da465c'],
      chart: {
        height: 350,
        type: 'area',
        zoom: {
          enabled: true
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(value) {
          return value + ' ℃';
        }
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'TEMP Chart',
        align: 'left'
      },
      grid: {
        borderColor: 'hsla(0, 0%, 100%, 0.1)',
        row: {
          colors: ['rgba(0, 0, 0, 0.15)', 'transparent'],
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          gradientToColors: ['rgba(218,70,92,0.4)'],
          stops: [1, 0.2, 0]
        }
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return value + ' ℃';
          }
        },
      }
    },
    chartOptionsHUMIDITY: {
      colors: ['#1d8cf8'],
      chart: {
        height: 350,
        type: 'area',
        zoom: {
          enabled: true
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(value) {
          return value.toFixed(2).toString().split(".")[1] + ' %';
        }
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'HUMIDITY Chart',
        align: 'left'
      },
      grid: {
        borderColor: 'hsla(0, 0%, 100%, 0.1)',
        row: {
          colors: ['rgba(0, 0, 0, 0.15)', 'transparent'],
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          gradientToColors: ['rgba(29,140,248,0.4)'],
          stops: [1, 0.2, 0]
        }
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return value.toFixed(2).toString().split(".")[1] + ' %';
          }
        },
      }
    },
    chartOptionsWINDSPEED: {
      colors: ['#379e70'],
      chart: {
        height: 350,
        type: 'area',
        zoom: {
          enabled: true
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(value) {
          return value + ' m/s';
        }
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'WINDSPEED Chart',
        align: 'left'
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          gradientToColors: ['rgba(55,158,112,0.4)'],
          stops: [1, 0.2, 0]
        }
      },
      grid: {
        borderColor: 'hsla(0, 0%, 100%, 0.1)',
        row: {
          colors: ['rgba(0, 0, 0, 0.15)', 'transparent'],
        },
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return value + ' m/s';
          }
        },
      }
    },
  }),
  mounted() {
    this.fetchChartData();
  },
  computed: {
    darkmode() {
      return this.$store.getters["darkmode"];
    },
  },
  methods: {
    fetchChartData() {
      this.chartIsPopulated = false;
      const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' + +this.$store.getters["auth/port_number"] + '/rdm/WEATHERHISTORY/HISTORY/?list=rows&limit=10&position=1&rowid=on': config.schema + this.$store.getters["auth/api_address"] + '/rdm/WEATHERHISTORY/HISTORY/?list=rows&limit=10&position=1&rowid=on';
      axios.get(url).then(response => {
        for(let i=0; i < response.data.row.length; i++) {
          this.chartDataTEMP[0].data.push((Math.floor(response.data.row[i].TEMP * 100) / 100))
          this.chartDataHUMIDITY[0].data.push(Math.floor(response.data.row[i].HUMIDITY * 100) / 100)
          this.chartDataWINDSPEED[0].data.push(Math.floor(response.data.row[i].WINDSPEED * 100) / 100)
          this.chartOptionsTEMP.xaxis.categories.push(response.data.row[i].TDATE.split(' ')[1].slice(0,-8))
          this.chartOptionsHUMIDITY.xaxis.categories.push(response.data.row[i].TDATE.split(' ')[1].slice(0,-8))
          this.chartOptionsWINDSPEED.xaxis.categories.push(response.data.row[i].TDATE.split(' ')[1].slice(0,-8))
          this.chartOptionsTEMP = {...this.chartOptionsTEMP}
          this.chartOptionsHUMIDITY = {...this.chartOptionsHUMIDITY}
          this.chartOptionsWINDSPEED = {...this.chartOptionsWINDSPEED}
        }
      }).catch(error => {
        const vm = this
      })
      this.chartIsPopulated = true
    }
  },
}
</script>
<style lang="scss" src="./DataVisualization.scss"></style>
