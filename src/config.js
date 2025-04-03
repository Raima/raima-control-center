export default {
  colors: {
    default: "#344675",
    primary: "#379e70",
    info: "#1d8cf8",
    danger: "#fd5d93",
    teal: "#0098f0",//"#e3d622",
    primaryGradient: ['rgba(0, 152, 240, 0.1)', 'rgba(53, 183, 125, 0)', 'rgba(119,52,169,0)'],
  },
  schema: (window?.location?.protocol? window.location.protocol + "//" : 'https://'),
  currentHostname: (window?.location?.hostname? window.location.hostname : 'localhost'),
  raimaHostname: 'app.raima.com', // app.raima.com, use localhost for develpment
}
