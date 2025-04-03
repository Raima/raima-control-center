import { convertUnit } from '@/helpers'

export const basicOptions = {
  maintainAspectRatio: false,
  responsive: true,
};

export let memoryUsageChartOptions = {
  ...basicOptions,
  legend: {
    display: true,
    pointStyle: true,
    labels:{
      fontColor: "#9a9a9a",
    },
    onClick: (e) => e.stopPropagation(),
  },
  tooltips: {
    backgroundColor: '#f5f5f5',
    titleFontColor: '#333',
    bodyFontColor: '#666',
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest",
    callbacks: {
      label: function(tooltipItem, data) {
        // var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
        var datasetLabel = 'Memory Usage';
        return datasetLabel + ' : ' + convertUnit(tooltipItem.yLabel);
      }
    }
  },
  scales: {
    yAxes: [{
      barPercentage: 1.6,
      gridLines: {
        drawBorder: false,
        color: 'rgba(29,140,248,0.0)',
        zeroLineColor: "transparent",
      },
      ticks: {
        suggestedMin: 0,
        suggestedMax: 100,
        padding: 20,
        fontColor: "#9a9a9a",
        callback: function(value, index, values) {
          return convertUnit(value);
        }
      },
    }],

    xAxes: [{
      barPercentage: 1.6,
      gridLines: {
        drawBorder: false,
        color: 'rgba(225,78,202,0.1)',
        zeroLineColor: "transparent",
      },
      ticks: {
        padding: 20,
        fontColor: "#9a9a9a"
      }
    }]
  }
}

export let diskUsageChartOptions = {
  ...basicOptions,
  legend: {
    display: false,
  },
  tooltips: {
    backgroundColor: '#f5f5f5',
    titleFontColor: '#333',
    bodyFontColor: '#666',
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest",
    callbacks: {
      label: function(tooltipItem, data) {
        // var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
        var indice = tooltipItem.index;

        return data.labels[indice] + ': ' + convertUnit(data.datasets[0].data[indice]);
      }
    }
  },
  elements: {
    arc: { borderWidth: 0 }
  }
  
  
}
