// src/theme/index.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    purple: {
      50: "#f5eafe",
      100: "#e0c6fc",
      200: "#caa1fb",
      300: "#b47cf9",
      400: "#9e58f7",
      500: "#8833f5",
      600: "#6b29c4",
      700: "#4e1e93",
      800: "#311462",
      900: "#170731",
    },
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "medium",
      },
    },
  },
});

export default theme;
