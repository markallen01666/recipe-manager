<template>
  <!--  Dashboard to display projects 
        M. Allen - 2019
  -->
  <div class="dashboard">
    <!-- Display message following successful update of project information -->
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Project successfully updated!</span>
      <v-btn flat color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <h1 class="subheading grey--text">Dashboard</h1>
    <!-- Sort/search options -->
    <v-container class="mx-5 mb-5">
      <v-layout row class="mb-3">
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('title')" slot="activator">
            <v-icon small left>folder</v-icon>
            <span class="caption text-lowercase">By project</span>
          </v-btn>
          <span>Sort projects by project title</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('person')" slot="activator">
            <v-icon small left>person</v-icon>
            <span class="caption text-lowercase">By person</span>
          </v-btn>
          <span>Sort projects by person</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('due')" slot="activator">
            <v-icon small left>date_range</v-icon>
            <span class="caption text-lowercase">By date</span>
          </v-btn>
          <span>Sort projects by due date</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('status')" slot="activator">
            <v-icon small left>info</v-icon>
            <span class="caption text-lowercase">By status</span>
          </v-btn>
          <span>Sort projects by status</span>
        </v-tooltip>
      </v-layout>
      <v-layout row>
        <v-flex xs12 md4 class="mr-3">
          <v-text-field label="Search" prepend-icon="search" v-model="search"></v-text-field>
        </v-flex>
      </v-layout>

      <!-- Build expansion panel for information relating to each project -->
      <v-expansion-panel>
        <v-expansion-panel-content v-for="(project, index) in filteredProjects" :key="project.id">
          <v-flex class="mt-4 mb-3">
          <EditPopup
            v-if="showEditCard"
            @hidePopup="showEditCard = !showEditCard"
            :project="project"
            @updatedProject="updatedProject($event, index)"
          />
          </v-flex>
          <div slot="header">
            <v-layout row wrap :class="`pa-3 project ${project.status}`">
              <v-flex xs12 md6>
                <div class="caption grey--text">Project title</div>
                <div>{{project.title}}</div>
              </v-flex>
              <v-flex xs6 sm4 md2>
                <div class="caption grey--text">Person</div>
                <div>{{project.person}}</div>
              </v-flex>
              <v-flex xs6 sm4 md2>
                <div class="caption grey--text">Due by</div>
                <div>{{format(new Date(project.due), "Do MMM YYYY")}}</div>
              </v-flex>
              <v-flex xs2 sm4 md2>
                <div>
                  <v-chip
                    small
                    :class="`${project.status} white--text caption my-2`"
                  >{{project.status}}</v-chip>
                </div>
              </v-flex>
            </v-layout>
          </div>
          <v-card v-if="!showEditCard">
            <v-card-text class="mx-4 mb-4 px-4 grey--text">
              <v-layout>
                <v-flex xs10>
                  <div>{{project.content}}</div>
                </v-flex>
                <v-flex xs2>
                  <v-tooltip top>
                    <v-btn
                      flat
                      icon
                      color="green"
                      @click="showEditCard = !showEditCard"
                      slot="activator"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <span>Edit project</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <v-btn
                      flat
                      icon
                      color="red"
                      @click="deleteProject(project.id)"
                      slot="activator"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                    <span>Delete project</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </div>
</template>

<script>
import format from "date-fns/format";
import db from "@/fb";
import searchMixin from "../mixins/searchMixin";
import EditPopup from "../components/EditPopup.vue";
import Popup from "../components/Popup.vue";

export default {
  components: { EditPopup, Popup },
  data() {
    return {
      format,
      projects: [],
      search: "",
      showEditCard: false,
      snackbar: false,
      dialog: false
    };
  },
  methods: {
    sortBy(prop) {
      // sort projects by selected criteria
      this.projects.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
    },
    editProject(id) {
      // Edit document in firestore
      db.collection("projects")
        .doc(id)
        .delete()
        .then(() => {
          this.projects = this.projects.filter(project => {
            return project.id != id;
          });
        });
    },
    deleteProject(id) {
      // Delete document from firestore
      db.collection("projects")
        .doc(id)
        .delete()
        .then(() => {
          this.projects = this.projects.filter(project => {
            return project.id != id;
          });
        });
    },
    updatedProject(payload, index) {
      // Update displayed project info
      this.snackbar = true;                           // Display successful update message
      this.editIndex = null;                          // Clear edit card index number
      this.projects.splice(index, 1, payload);        // Use splice to force re-rendering of project expansion card
    }
  },
  computed: {
    filteredProjects: function() {
      // Filter displayed projects based on user entered search string
      return this.projects.filter(project => {
        return (
          project.title.toLowerCase().match(this.search.toLowerCase()) ||
          project.person.toLowerCase().match(this.search.toLowerCase()) ||
          project.status.toLowerCase().match(this.search.toLowerCase()) ||
          project.content.toLowerCase().match(this.search.toLowerCase()) ||
          format(project.due, "Do MMM YYYY")
            .toLowerCase()
            .match(this.search.toLowerCase())
        );
      });
    }
  },
  created() {
    db.collection("projects").onSnapshot(res => {
      // Read firebase database and push documents to "projects" array
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.projects.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        }
      });
    });
  }
};
</script>

<style>
.project.complete {
  border-left: 4px solid #3cd1c2;
}
.project.ongoing {
  border-left: 4px solid orange;
}
.project.overdue {
  border-left: 4px solid tomato;
}
.project.pending {
  border-left: 4px solid grey;
}
.v-chip.complete {
  background: #3cd1c2;
}
.v-chip.ongoing {
  background: orange;
}
.v-chip.overdue {
  background: tomato;
}
.v-chip.pending {
  background: grey;
}
</style>
