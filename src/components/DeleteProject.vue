<template>
  <!--  Delete selected project 
        M. Allen - 2019
  -->
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn flat icon color="red lighten-1" slot="activator">
      <v-icon>delete</v-icon>
    </v-btn>
    <v-card class="delete-confirmation pb-2">
      <v-card-title class="red--text">
        <h2>Delete project</h2>
      </v-card-title>
      <v-card-text class="px-5">Project:
        <h3><em>{{ project.title }}</em></h3>
        <h3 class="mt-3 red--text">Warning!</h3>
        <p
          class="mt-2"
        >Once this project is deleted it cannot be recovered. Are you sure you want to continue?</p>
      </v-card-text>
      <v-spacer></v-spacer>
      <div class="px-5">
        <v-btn
          flat
          class="red white--text mx-0 mt-3"
          @click="deleteProject(project.id)"
        >Delete project</v-btn>
        <v-btn flat class="mx-1 mt-3" @click="dialog = false">Cancel</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import db from "@/fb";

export default {
  props: ["project"],
  name: "DeleteProject",
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    deleteProject() {
      // Delete document from firestore
      db.collection("projects")
        .doc(this.project.id)
        .delete()
        .then(() => {
          this.dialog = false;
          this.$emit("deletedProject");
        });
    }
  }
};
</script>

<style>
</style>