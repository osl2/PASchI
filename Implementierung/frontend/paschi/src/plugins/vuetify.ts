/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import { aliases, fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";
import "@fortawesome/fontawesome-free/css/all.css";
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: "fa",
    aliases,
    sets: {
      fa,
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#0b738b",
          interaction: "#ff8d00",
          secondary: "#3770a1",
          white: "#FFFFFF",
          green: "#13a343",
        },
      },
    },
    variations: {
      colors: ["primary", "secondary", "white"],
      lighten: 5,
      darken: 5,
    },
  },
});
