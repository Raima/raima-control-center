<template>
  <div class="login-container container-fluid" >
    <div class="row" style="height:100%;">
      <div class="col d-none d-sm-none d-md-block login-img-holder" >
      </div>
      <div class="col login-flex-container" >

        <div class="login-form-wrapper" >

          <!-- start:raima logo -->
          <img class="img-fluid brand-logo" style="" src="/img/raima-control.svg" />
          <!-- end:raima logo -->

          <h1 class="raima-theme-title">Connect to RaimaDB</h1>
          <p v-if="isDemo" class="" style="margin: 25px 0;">Try our RaimaDB demo to get a quick glance of some of the available features and view the contents of the various databases</p>

          <base-button v-if="isDemo" native-type="button" @click="demoLogin" slot="footer" type="primary" :block="true" fill  style="margin-top: 50px;" :loading="requestLoading">Go To Demo</base-button>
          <div v-if="isDemo" class="divider" style="margin: 50px 15px 50px 15px;" ></div>

          <h1 class="raima-theme-title">Or clone the repository</h1>
          <p v-if="isDemo" class="">Clone the repository from GitHub and connect it to your very own RDM instance!</p>
          <a class="red-link" v-if="isDemo" href="https://github.com/Raima/raima-control-center.git" target="_blank" >Check out the repository! </a>

          <p v-if="!isDemo" class="">Connect to your very own RDM instance to get a quick glance of the current status and view/manage the contents of your databases</p>
          <div v-if="!isDemo">
            <!-- START:LOGIN FORM -->
            <form id="loginFormDemo" method="POST" @submit.prevent="connectToServer">
              <div class="row" >

                <!-- START:ALERTS -->
                <div class="col-xl-12">

                  <base-alert v-if="message.type == 'success'" type="success" >
                    <span><b> Success - </b> {{ message.message }}</span>
                  </base-alert>
                  <base-alert v-if="message.type == 'error'" type="danger" >
                    <span><b> Error - </b> {{ message.message }}</span>
                  </base-alert>

                  <!-- START:SHOW ALL ERRORS -->
                  <fade-transition :duration="100" mode="out-in">
                    <base-alert v-if="$v.$anyError && $v.$anyDirty" type="danger" >
                      <div v-if="!$v.model.api_address.required && $v.model.api_address.$error" ><b> Error - </b> API address must not be empty</div>
                      <div v-if="!$v.model.port_number.required && $v.model.port_number.$error" ><b> Error - </b> Port number must not be empty</div>
                    </base-alert>
                  </fade-transition>
                  <!-- END:SHOW ALL ERRORS -->
                </div>
                <!-- END:ALERTS -->

                <!--
                <div class="col-md-12">
                  <base-input label="Company (disabled)"
                            placeholder="Company"
                            v-model="model.company"
                            disabled>
                  </base-input>
                </div>
                -->

                <div class="col-md-12 " >
                  <base-input
                    label="API address"
                    id="apiAddress"
                    :placeholder="isDemo ? 'app.raima.com' : 'Enter your API address'"
                    :class="{'is-invalid': $v.model.api_address.$error}"
                    v-model="model.api_address"
                    name="api_address"
                    :disabled="isDemo"
                  >
                  </base-input>
                  <p class="is-invalid" v-if="!$v.model.api_address.required && $v.model.api_address.$error">This field must not be empty</p>
                </div>

                <div class="col-md-12 " >
                  <base-input label="Port number"
                    id="portNumber"
                    :placeholder="isDemo ? '-' : '1 2 3'"
                    class="port-input"
                    :class="{'is-invalid': $v.model.port_number.$error}"
                    v-model="model.port_number"
                    name="port_number"
                    :disabled="isDemo"
                  >
                  </base-input>
                  <p class="is-invalid" v-if="!$v.model.port_number.required && $v.model.port_number.$error">This field must not be empty</p>
                </div>
              </div>
              <base-button id="sumitFromButton" native-type="submit" slot="footer" type="primary" :block="true" fill class="my-3" :loading="requestLoading" :disabled="isDemo">Connect</base-button>
            </form>
            <!-- END:LOGIN FROM -->
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import router from '@/router'
  import { BaseAlert } from '@/components/VueBlackDashboard';
  import { required, maxLength, maxValue, numeric } from 'vuelidate/lib/validators'
  import { FadeTransition } from 'vue2-transitions';
  import config from '@/config'

  export default {
    components: {
      BaseAlert,
      FadeTransition
    },
    props: {
      model: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data () {
      return {
        isDemo: (config.currentHostname === config.raimaHostname) ? true : false,
        message: {
          type: null,
          code: null,
          message: null
        },
        requestLoading: false,
      }
    },
    methods: {
      // reset datas
      resetMessage() {
        this.message = {
          type: null,
          code: null,
          message: null
        }
      },
      // api functions
      connectToServer() {
        // this.$v.$reset
        this.requestLoading = true;
        this.$v.$touch();
        this.resetMessage();
        if (this.$v.$anyError === false && !this.$v.$anyDirty === false) {
          this.requestLoading = true;

          const formData = {
            api_address: this.model.api_address,
            port_number: this.model.port_number
          }

          const responseMessage = this.$store.dispatch('auth/signin', formData)
          responseMessage.then((result) => {
            this.message = result
            this.requestLoading = false;
          })
        }
        else {
          this.requestLoading = false;
        }

      },
      demoLogin: function () {
        if (!this.isDemo) {
          window.location.href = 'https://app.raima.com';
          return;
        }
        this.resetMessage();
        //document.getElementById("apiAddress").disabled = true;
        //document.getElementById("portNumber").disabled = true;
        this.model.api_address = "app.raima.com";
        this.model.port_number = "";
        this.requestLoading = true;

        const formData = {
          api_address: this.model.api_address,
          port_number: this.model.port_number
        }

        const responseMessage = this.$store.dispatch('auth/signin', formData)
        responseMessage.then((result) => {
          this.message = result
          this.requestLoading = false;
        });
      }
    },
    validations: {
      model: {
        api_address: {
          required,
        },
        port_number: {
          required,
        },
      },
    },
    created() {
      //console.log('created');
    }
  }
</script>
<style>
</style>
