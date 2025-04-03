// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
// összeakad vagy a template css-el vagy a bootstrappel
//import 'vuetify/dist/vuetify.min.css'
import vuetifyStyle from '../assets/sass/vuetify-style.scss'

Vue.use(Vuetify)

const opts = {}

export default new Vuetify(opts)