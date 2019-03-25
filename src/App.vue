<template>
  <!--  Project Manager - Vue app control
        M. Allen - 2019
  -->
  <v-app class="grey lighten-3">  
    <NavBar />  
    <v-content class="mx-4 mb-4  mt-2">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar';

export default {
  name: 'App',
  components: {NavBar},
  data () {
    return {
    }
  }
}
</script>
