<template>
  <div class="dashboard" >
    <div class="row">
      <!-- START:COL-LG-4 -->
      <div class="col-lg-4">
        <card type="chart">
          <template slot="header">
            <h3 class="card-title"><i class="tim-icons icon-chart-bar-32 text-success "></i> Memory usage</h3>
          </template>
          <div class="chart-area">
           <memory-usage></memory-usage>
          </div>
        </card>
      </div>
      <!-- END:COL-LG-4 -->

      <!-- START:COL-LG-4 -->
      <div class="col-lg-4" :class="{'text-right': isRTL}">
        <disk-usage></disk-usage>
      </div>
      <!-- END:COL-LG-4 -->
      <!-- START:COL-LG-4 -->
      <div class="col-lg-4" :class="{'text-right': isRTL}">
        <users-list></users-list>
      </div>
      <!-- END:COL-LG-4 -->
    </div>
    <div class="row" >
      <!-- START:COL-8 -->
      <div class="col-lg-4 col-md-12">
        <databases-list></databases-list>
      </div>
      <!-- END:COL-8 -->

      <!-- START:COL-4 -->
      <div class="col-lg-8 col-md-12">
        <tfs-configuration-options></tfs-configuration-options>
      </div>
      <!-- END:COL-4 -->
    </div>
  </div>
</template>
<script>
  import * as chartConfigs from '@/components/Raima/Charts/config';
  import UserTable from './UserTable';
  import config from '@/config';
  import DiskUsage from '@/components/Raima/DiskUsage/DiskUsage.vue';
  import UsersList from '@/components/Raima/UsersList/UsersList.vue';
  import TFSConfigurationOptions from '@/components/Raima/TFSConfigurationOptions/TFSConfigurationOptions.vue';
  import DatabasesList from '@/components/Raima/DatabasesList/DatabasesList.vue';
  import MemoryUsage from '@/components/Raima/MemoryUsage/MemoryUsage.vue';

  export default {
    components: {
      UserTable,
      DiskUsage,
      UsersList,
      'tfs-configuration-options': TFSConfigurationOptions,
      DatabasesList,
      MemoryUsage,
    },
    data() {
      return {
        
      }
    },
    computed: {
      enableRTL() {
        return this.$route.query.enableRTL;
      },
      isRTL() {
        return this.$rtl.isRTL;
      },
    },
    methods: {
      // used for example purposes
      getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
    },
    mounted() {
      this.i18n = this.$i18n;
      if (this.enableRTL) {
        this.i18n.locale = 'ar';
        this.$rtl.enableRTL();
      }
    },
    created() {},
    beforeDestroy() {
      if (this.$rtl.isRTL) {
        this.i18n.locale = 'en';
        this.$rtl.disableRTL();
      }
    }
  };
</script>
<style>

</style>
