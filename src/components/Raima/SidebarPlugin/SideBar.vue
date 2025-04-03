<template>
  <div class="sidebar"
       :data="backgroundColor">
    <!--
            Tip 1: you can change the color of the sidebar's background using: data-background-color="white | black | darkblue"
            Tip 2: you can change the color of the active button using the data-active-color="primary | info | success | warning | danger"
        -->
    <sidebar-dashboard></sidebar-dashboard>
  </div>
</template>
<script>
  import SidebarDashboard from "./SidebarDashboard";

  export default {
    props: {
      backgroundColor: {
        type: String,
        default: "white"
      },
    },
    data () {
      return {
        showSideBar: false,
      }
    },
    components: {
      SidebarDashboard,
    },
    computed: {
      selectedDatabase() {
        return this.$route.params.database;
      },
      sqlSelected() {
        return this.$store.getters['database/getSQLPage'];
      },
      routeName () {
        return this.$route.name
      }
    },
  };
</script>
