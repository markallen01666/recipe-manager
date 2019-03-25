<template>
  <!--  Team members
        M. Allen - 2019
  -->
  <div class="team">
    <h1 class="subheading grey--text">Team</h1>
    <v-container class="mx-5 mb-5">
      
      <v-layout row wrap>
        <!-- Show card with avatar for each team member -->
        <v-flex xs12 sm6 md4 lg3 v-for="person in team" :key="person.name">
          <v-card flat class="text-xs-center ma-3">
            <v-responsive class="pt-4">
              <v-avatar size="100" class="grey lighten-2">
                <img :src="person.avatar">
              </v-avatar>
            </v-responsive>
            <v-card-text>
              <div class="subheading">{{person.name}}</div>
              <div class="grey--text">{{person.role}}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn flat color="grey">
                <v-icon small left>message</v-icon>
                <span>Message</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      team: [
        {name: "Woody Allen", role: "Project Leader", avatar: "/avatar-1.png"},
        {name: "John Smith", role: "Programmer", avatar: "/avatar-2.png"},
        {name: "David N Sansom", role: "Interactive Media Designer", avatar: "/avatar-3.png"},
        {name: "Albert Brown", role: "Programmer", avatar: "/avatar-4.png"},
        {name: "Lucie Allen", role: "Senior Test Engineer", avatar: "/avatar-5.png"}
      ]
    }
  }
}
</script>