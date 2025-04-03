<template>
    <card class="disk-usage">
        <template slot="header">
            <h3 class="card-title"><i class="tim-icons icon-chart-pie-36 text-success "></i> Disk usage</h3>
        </template>

        <div v-if="total_disk_usage" class="content-holder">
            <h5 class="disk-usage-label" >total disk usage</h5>
            <h3 class="disk-usage" >{{ total_disk_usage }}</h3>
        </div>


        <div>
            <pie-chart
            :styles="myStyles"
            :chart-data="diskUsageChart.chartData"
            :extra-options="diskUsageChart.extraOptions"
            chart-id="disk-usage-pie-chart"
            >
            </pie-chart>
        </div>
    </card>

    <!--<card class="disk-usage">
        <template slot="header">
          <h3 class="card-title"><i class="tim-icons icon-chart-pie-36 text-success "></i> Disk usage</h3>
        </template>

        <div v-if="total_disk_usage" class="content-holder">
            <h5 class="disk-usage-label" >total disk usage</h5>
            <h3 class="disk-usage" >{{ total_disk_usage }}</h3>
        </div>
    </card>-->

</template>

<script>
import axios from 'axios'

import PieChart from '@/components/Raima/Charts/PieChart';
import * as chartConfigs from '@/components/Raima/Charts/config';
import { convertUnit } from '@/helpers'
import config from '@/config';

export default {
    data() {
      return {
        total_disk_usage: null,
        databases: null,
        randomColors: ['#91b853', '#d9c086', '#e9aa5c', '#fbf58d', '#458578', '#9dc5a6', '#f3aa9f', '#b0c3af', '#f98870'],
        dbColors: [],
        diskUsageChart: {
            extraOptions: chartConfigs.diskUsageChartOptions,
            chartData: {
                labels: [],
                datasets: [
                {
                    label: 'Data One',
                    backgroundColor: [],
                    data: [],
                }
                ]
            },
        }
      }
    },
    components: {
		PieChart,
	},
    methods: {
        fetchDiskDatas() {
            const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdmadmin/?list=disk&databases=true&packfiles=true': config.schema + this.$store.getters["auth/api_address"] + '/rdmadmin/?list=disk&databases=true&packfiles=true';
            axios.get(url).then(res => {
                if( res.data.hasOwnProperty('total_disk_usage')) {

                    this.databases = res.data.databases

                    this.setBgColors(this.databases)

                    this.refreshChartDataWithApiValues(this.databases)

                    this.total_disk_usage = convertUnit(res.data.total_disk_usage)

                }
            }).catch(err => {

            })
        },
        randomIntFromInterval(min, max) { // min and max included
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        getRandomColor() {

          // get random index value
          const randomIndex = Math.floor(Math.random() * this.randomColors.length);

          // get random item
          const item = this.randomColors[randomIndex];

          // remove selected item from array
          this.randomColors = this.randomColors.filter(arr => arr !== item)

          return item;

        },
        setBgColors(databases){
            this.dbColors = []

            for(let i = 0; i < databases.length; i++){
                let color = this.getRandomColor()
                this.diskUsageChart.chartData.datasets[0].backgroundColor.push(color)

                this.dbColors.push({
                    name: databases[i].name,
                    color: color
                })
            }

            this.$store.commit('database/storeDatabaseColors', this.dbColors)

            return
        },
        refreshChartDataWithApiValues(databases) {
            if (databases == null && typeof databases !== 'object') return

            let values = []
            let keys = []

            for(let i in databases){
                values.push(databases[i].total_disk_usage)
                keys.push(databases[i].name)
            }

            this.diskUsageChart.chartData.datasets[0].data = values
            this.diskUsageChart.chartData.labels = keys

            return
        }

    },
    mounted() {
      this.fetchDiskDatas();
    },
    computed: {
        myStyles () {
            return {
                height: '170px',
                position: 'relative'
            }
        }
    }
}
</script>

<style>

</style>
