<template>
  <!--  Edit selected project 
        M. Allen - 2019
  -->
  <div>
  <v-dialog max-width="600px" v-model="dialog">
    <v-tooltip>
      <v-btn flat icon color="green" slot="activator">
        <v-icon>edit</v-icon>
      </v-btn>
      <span>Edit project</span>
    </v-tooltip>

    <v-card>
      <v-card-title>
        <h2 class="green--text">Edit project</h2>
      </v-card-title>
      <v-card-text>
        <!-- Form to change project information -->
        <v-form class="px-3" ref="form">
          <v-text-field label="Title" v-model="title" prepend-icon="folder" :rules="inputRules"></v-text-field>
          <v-text-field label="Person" v-model="person" prepend-icon="person" :rules="inputRules"></v-text-field>
          <v-radio-group v-model="status" row prepend-icon="info">
            <v-radio label="Pending" value="pending"></v-radio>
            <v-radio label="Complete" value="complete"></v-radio>
            <v-radio label="Ongoing" value="ongoing"></v-radio>
            <v-radio label="Overdue" value="overdue"></v-radio>
          </v-radio-group>

          <v-textarea label="Information" v-model="content" prepend-icon="edit" :rules="inputRules"></v-textarea>

          <v-menu>
            <v-text-field
              :value="formattedDate"
              slot="activator"
              label="Due date"
              prepend-icon="date_range"
              :rules="inputRules"
            ></v-text-field>
            <v-date-picker v-model="due"></v-date-picker>
          </v-menu>

          <v-spacer></v-spacer>

          <v-btn flat class="success mx-0 mt-3" @click="submit" :loading="loading">Update project</v-btn>
          <v-btn flat class="mx-1 mt-3" @click="$emit('hidePopup', '')">Cancel</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
import format from "date-fns/format";
import db from "@/fb";

export default {
  props: ["project"],
  data() {
    return {
      inputRules: [v => v.length >= 3 || "Minimum length is three characters"],
      dialog: false,
      loading: false,
      title: this.project.title,
      person: this.project.person,
      content: this.project.content,
      due: this.project.due,
      status: this.project.status
    };
  },
  methods: {
    submit() {
      // Update database and re-render project expansion panel content
      if (this.$refs.form.validate()) {
        this.loading = true;
        // Revised project information
        let updatedProject = {
          title: this.title,
          person: this.person,
          content: this.content,
          due: this.due,
          status: this.status,
          id: this.project.id
        };
        // Update firebase database and close project edit popup
        db.collection("projects")
          .doc(this.project.id)
          .update(updatedProject)
          .then(() => {
            this.dialog = this.loading = false;
            this.$emit("updatedProject", updatedProject);
          });
      }
    }
  },
  computed: {
    formattedDate() {
      // Format date displayed
      return this.project.due ? format(this.project.due, "Do MMM YYYY") : "";
    }
  }
};
</script>