import { Line, mixins } from 'vue-chartjs';

export default {
  name: 'line-chart',
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    extraOptions: Object,
    gradientColors: {
      type: Array,
      default: () => ['rgba(72,72,176,0.2)', 'rgba(72,72,176,0.0)', 'rgba(119,52,169,0)'],
      validator: val => {
        return val.length > 2;
      }
    },
    gradientStops: {
      type: Array,
      default: () => [1, 0.4, 0],
      validator: val => {
        return val.length > 2;
      }
    }
  },
  data() {
    return {
      ctx: null,
      interval: false,
    };
  },
  methods: {
    updateGradients(chartData) {
      if(!chartData) return;
      const ctx = this.ctx || document.getElementById(this.chartId).getContext('2d');
      const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(this.gradientStops[0], this.gradientColors[0]);
      gradientStroke.addColorStop(this.gradientStops[1], this.gradientColors[1]);
      gradientStroke.addColorStop(this.gradientStops[2], this.gradientColors[2]);
      chartData.datasets.forEach(set => {
        set.backgroundColor = gradientStroke;
      });
    }
  },
  /*
  watch: {
    chartData: {
      deep: true,
      handler( newdata, olddata ){
        console.log( newdata.labels )
        console.log( olddata.labels )
        // this.$data._chart.update()
      }
    }
  },
  */
  mounted() {
    this.$watch('chartData', (newVal, oldVal) => {
      this.updateGradients(this.chartData);
      if (!oldVal) {
        this.renderChart(
          this.chartData,
          this.extraOptions
        );
      }
    }, { immediate: true });
    
  },
  beforeCreate(){
    Chart.Legend.prototype.afterFit = function() {
      this.height = this.height + 10;
    };
  },
  created() {
    this.interval = setInterval(() => {
      this.$data._chart.update()
    }, 15000);
  },
  beforeDestroy()  {
    clearInterval(this.interval)
    this.interval = false;
  }
};
