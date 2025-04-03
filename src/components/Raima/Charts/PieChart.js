import { Pie, mixins } from 'vue-chartjs';

export default {
  name: 'pie-chart',
  extends: Pie,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: Object,
    extraOptions: Object,
  },
  data() {
    return {

    }
  },
  methods: {
    renderPieChart: function() {
      this.renderChart(this.chartData, this.extraOptions)
    }
  },
  mounted () {
    this.$watch('chartData', (newVal, oldVal) => {
      if (oldVal) {
        this.renderPieChart();
      }
    }, { deep: true });
  },

  beforeCreate(){

  },
  created() {

  },
  beforeDestroy()  {

  }
};
