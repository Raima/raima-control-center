<template>
    <card class="users-card">
        <template slot="header">
            <h3 class="card-title"><i class="tim-icons icon-single-02 text-success "></i> Users</h3>
        </template>
        <table class="table" v-if="users && users.length">
          <tbody>
            <tr v-for="(user, index) in users" :key="index" >
              <td>{{ user.name }}</td>
            </tr>
          </tbody>
        </table>
        <div class="no-content-holder" v-else>The are no connected users in this moment.</div>
    </card>
</template>

<script>
import axios from 'axios'
import config from '@/config'
// https://hostname:port/rdmadmin/?list=users
export default {
    data() {
      return {
        users: null,
        interval: false,
      }
    },
    methods: {
        fetchUsers() {
            const url = this.$store.getters["auth/port_number"]? config.schema + this.$store.getters["auth/api_address"] + ':' +  + this.$store.getters["auth/port_number"] + '/rdmadmin/?list=users': config.schema + this.$store.getters["auth/api_address"] + '/rdmadmin/?list=users';
            axios.get(url).then(res => {
              if( res.data.hasOwnProperty('Users')) {
                this.users = res.data.Users
              }
            }).catch(err => {

            })
        }
    },
    mounted() {
      this.fetchUsers();
      this.interval = setInterval(() => { 
        this.fetchUsers();
      }, 15000 );
    },
    beforeDestroy()  {
      clearInterval(this.interval)
      this.interval = false;
    }
}
</script>

<style>

</style>