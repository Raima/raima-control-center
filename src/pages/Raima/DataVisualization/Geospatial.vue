<template>
  <div id="data-visualization" class="page-container" style="height: calc(100vh - 110px);">
    <v-row>
      <v-col>
        <card style="height: calc(100vh - 100px); overflow-y:scroll;">
          <v-row>
            <v-col class="d-flex text-center map-container" cols="12">
              <vue-google-heatmap
                v-if="mapIsPopulated"
                :lat="parseFloat(points[0].lat)"
                :lng="parseFloat(points[0].lng)"
                :initial-zoom=5
                :points="points"
                :height="700"
              />
            </v-col>
          </v-row>

        </card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config";

export default {
  name: "DataVisualization",
  data: () => ({
    show: false,
    mapIsPopulated: false,
    points: [],
  }),
  mounted() {
    this.fetchMapData();
  },
  computed: {
    darkmode() {
      return this.$store.getters["darkmode"];
    },
  },
  methods: {
    fetchMapData() {
      this.mapIsPopulated = false
      const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' + +this.$store.getters["auth/port_number"] + '/rdm/RDB/POINTSOFINTEREST/?list=rows': config.schema + this.$store.getters["auth/api_address"] + '/rdm/RDB/POINTSOFINTEREST/?list=rows';
      axios.get(url).then(response => {
        for(let i=0; i < response.data.row.length; i++) {
          this.points.push({
            lat: response.data.row[i].LOCATION.match(/\[(.*?)\]/)[1].split(',')[0],
            lng: response.data.row[i].LOCATION.match(/\[(.*?)\]/)[1].split(',')[1]
          });
        }
      }).catch(error => {
        const vm = this
      })
      this.mapIsPopulated = true
    },
  },
}
</script>
<style lang="scss" src="./DataVisualization.scss"></style>
