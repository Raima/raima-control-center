<template>
  <div class="login-container container-fluid" >
    <div class="row" style="height:100%;">
      <div class="col d-none d-sm-none d-md-block login-img-holder" >
      </div>
      <div class="col login-flex-container" >
        <!--
        <img class="img-fluid brand-logo" style="max-width: 150px;
              position: absolute;
              left: 75px;
              top: 75px;
            }" src="/assets/Raima_Logo_Vector.png" />
        -->
        <div class="login-form-wrapper" >
          
          <!-- start:raima logo -->
          <img class="img-fluid brand-logo" style="max-width: 150px;
              position: absolute;
              top: -75px;
            }" src="/assets/Raima_Logo_Vector.png" />
          <!-- end:raima logo -->

          <h1 class="raima-theme-title">Connect</h1>
          <p class="">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div class="divider" ></div>

          <div>
            <!-- START:LOGIN FORM -->
            <form method="POST" @submit.prevent="connectToServer">
              <div class="row">
                
                <!-- START:ALERTS -->
                <div class="col-xl-12">


                  <!--
                  <base-alert class="d-block" type="primary" dismissible>
                    <span><b> Primary - </b> This is a regular notification made with ".alert-primary"</span>
                  </base-alert>
                  <base-alert class="d-block" type="info" dismissible>
                    <span><b> Info - </b> This is a regular notification made with ".alert-info"</span>
                  </base-alert>
                  -->

                  <base-alert v-if="message.type == 'success'" type="success" >
                    <span><b> Success - </b> {{ message.message }}</span>
                  </base-alert>
                  <!--
                  <base-alert type="warning" dismissible>
                    <span><b> Warning - </b> This is a regular notification made with ".alert-warning"</span>
                  </base-alert>
                  -->
                  <base-alert v-if="message.type == 'error'" type="danger" >
                    <span><b> Danger - </b> {{ message.message }}</span>
                  </base-alert>

                  <!-- START:SHOW ALL ERRORS -->
                  <fade-transition :duration="100" mode="out-in">
                    <base-alert v-if="$v.$anyError && $v.$anyDirty" type="danger" >
                      <div v-if="!$v.model.api_address.required && $v.model.api_address.$error" ><b> Danger - </b> API address must not be empty</div>
                      <div v-if="!$v.model.port_number.required && $v.model.port_number.$error" ><b> Danger - </b> Port number must not be empty</div>
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

                <div class="col-md-12 mb-3">
                  <base-input label="API address"
                            placeholder="Enter your API address"
                            :class="{'is-invalid': $v.model.api_address.$error}"
                            v-model="model.api_address" >
                  </base-input>
                  <p class="invalid" v-if="!$v.model.api_address.required && $v.model.api_address.$error">This field must not be empty</p>
                </div>

                <div class="col-md-12 mb-3">
                  <base-input label="Port number"
                            placeholder="1 2 3"
                            class="port-input"
                            :class="{'is-invalid': $v.model.port_number.$error}"
                            v-model="model.port_number" >
                  </base-input>
                  <p class="invalid" v-if="!$v.model.port_number.required && $v.model.port_number.$error">This field must not be empty</p>
                </div>
              </div>
              <base-button native-type="submit" slot="footer" type="primary" :block="true" fill class="my-3">Connect</base-button>
            </form>
            <!-- END:LOGIN FROM -->
            <!--START:DEMO SECTION -->
            
            
            <!-- START:TEXT-DIVIDER 
            <div class="text-divider">
              <div></div>
              <div>or try demo version</div>
              <div></div>
            </div>
            <!-- END:TEXT-DIVIDER

            <base-button slot="footer" type="primary" :block="true" fill class="my-3" :class="['btn-simple', 'disabled']">Demo</base-button>
            <!-- END:DEMO SECTION -->
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
        message: {
          type: null,
          code: null,
          message: null
        }
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
        this.$v.$touch()
        this.resetMessage();
        if (this.$v.$anyError === false && !this.$v.$anyDirty === false) {
          console.log( this.model );

          const formData = {
            api_address: this.model.api_address,
            port_number: this.model.port_number
          }
          const responseMessage = this.$store.dispatch('auth/signin', formData)
          responseMessage.then((result) => {
            console.log(result);
            this.message = result
          })
          
          //console.log('connect to server')
          //router.replace('/dashboard')
        }
        
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
