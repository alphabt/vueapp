<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-container class="fill-height" fluid >
      <v-main>
        <v-row align="center" justify="center" >
          <v-col class="fill-width">
            <canvas id="the-canvas" style="height: 100%; width: 100%"></canvas>
          </v-col>
        </v-row>
      </v-main>
    </v-container>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
  import { Component, Prop, Watch } from "vue-property-decorator";

  @Component({ })
  export default class Layout extends Vue {

    @Prop()
    source: string;

    drawer: boolean = false;
    onmounted: () => any;

    created() {
      this.$vuetify.theme.dark = true;
    }

    mounted() {
      if( this.onmounted ) this.onmounted();
    }
  }
</script>
