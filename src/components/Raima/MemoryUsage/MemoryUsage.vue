<template>
	<line-chart v-if="memoryUsageChart.chartData.datasets[1].data && memoryUsageChart.chartData.datasets[1].data.length > 0" style="height: 100%"
							chart-id="purple-line-chart-2"
							:chart-data="memoryUsageChart.chartData"
							:gradient-colors="memoryUsageChart.gradientColors"
							:gradient-stops="memoryUsageChart.gradientStops"
							:extra-options="memoryUsageChart.extraOptions">
	</line-chart>
</template>

<script>
import axios from 'axios'


import LineChart from '@/components/Raima/Charts/LineChart';
import * as chartConfigs from '@/components/Raima/Charts/config';
import config from '@/config';
import { convertUnit } from '@/helpers'
// https://localhost:21553/rdmadmin/?list=memory


export default {
	data() {
		return {
			memoryUsageChart: {
          extraOptions: chartConfigs.memoryUsageChartOptions,
          chartData: {
            labels: ['', '', '', '', ''],
						datasets: [{
              label: "Current",
              fill: true,
              borderColor: config.colors.primary,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.primary,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: config.colors.primary,
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
							data: [ 0, 0, 0, 0, 0],
            },
						{
              label: "Maximum",
              fill: true,
              borderColor: config.colors.teal,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.teal,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: config.colors.teal,
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
							data: [],
            }
						]
          },
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.2, 0],
			},
			memoryDatas: [],
			maximumMemory: null,
			interval: false,
		}
	},
	components: {
		LineChart,
	},
	methods: {
			fetchMemoryDatas() {
					const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdmadmin/?list=memory': config.schema + this.$store.getters["auth/api_address"] + '/rdmadmin/?list=memory';
					axios.get(url).then(res => {
							if( res.data.hasOwnProperty('Memory Usage')) {
									
									if( !this.maximumMemory ) {
										this.maximumMemory = res.data[ 'Memory Usage' ].Maximum
									}

									const currentDate = new Date();
									const hours = ( currentDate.getHours() < 10 ? '0' : '' ) + currentDate.getHours();
									const minutes = (new Date().getMinutes()<10? '0':'') + new Date().getMinutes();
									const seconds = (new Date().getSeconds()<10? '0':'') + new Date().getSeconds();
									this.memoryDatas.push( 
										{ date: hours + ":" + minutes + ":" + seconds, 
											current: res.data[ 'Memory Usage' ].Current }  );

									if( this.memoryUsageChart.chartData.datasets[1].data.length == 0 ){
										const initMaxMemory = res.data[ 'Memory Usage' ].Maximum;
										this.memoryUsageChart.chartData.datasets[1].data = [ initMaxMemory, initMaxMemory, initMaxMemory, initMaxMemory, initMaxMemory ];
										this.memoryUsageChart.chartData = Object.assign({}, this.memoryUsageChart.chartData);
									}
									
									this.memoryUsageChart.chartData.labels.push( hours + ":" + minutes + ":" + seconds );
									// this.memoryUsageChart.chartData.datasets[0].data.push( ( 1 - ( ( res.data[ 'Memory Usage' ].Maximum - res.data[ 'Memory Usage' ].Current ) / res.data[ 'Memory Usage' ].Maximum ) ) * 100 );
									this.memoryUsageChart.chartData.datasets[0].data.push( res.data[ 'Memory Usage' ].Current );
									this.memoryUsageChart.chartData.datasets[1].data.push( res.data[ 'Memory Usage' ].Maximum );

									if( this.memoryDatas.length > 5 ){
										this.memoryDatas = this.memoryDatas.slice(1).slice(-5);
									}

									if( this.memoryUsageChart.chartData.labels.length > 5 ){
										this.memoryUsageChart.chartData.labels = this.memoryUsageChart.chartData.labels.slice(1).slice(-5);
										this.memoryUsageChart.chartData.datasets[0].data = this.memoryUsageChart.chartData.datasets[0].data.slice(1).slice(-5);
										this.memoryUsageChart.chartData.datasets[1].data = this.memoryUsageChart.chartData.datasets[1].data.slice(1).slice(-5);
									}

									
									
									//console.log( this.memoryUsageChart.chartData.datasets[0].data );
							}
					}).catch(err => {

					})
			},
	},
	mounted() {
		/*
		console.log('mounted')
		this.fetchMemoryDatas2();
		this.interval = setInterval(() => { 
			this.fetchMemoryDatas2();
		}, 15000 );
		*/
		this.fetchMemoryDatas();
		this.interval = setInterval(() => { 
			this.fetchMemoryDatas();
		}, 15000 );
	},
	beforeDestroy() {
		clearInterval(this.interval)
		this.interval = false;
	},
}
</script>

<style>

</style>