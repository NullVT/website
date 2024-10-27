import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

// Function to generate grid column classes based on max grid size
function generateGridColumns(maxGridSize) {
  const columns = {};
  for (let i = 1; i <= maxGridSize + 1; i++) {
    columns[i] = `${i}`;
  }
  return columns;
}

// Function to generate grid span classes
function generateGridSpans(maxGridSize) {
  const spans = {};
  for (let i = 1; i <= maxGridSize + 1; i++) {
    spans[`span-${i}`] = `span ${i} / span ${i}`;
  }
  return spans;
}

// Define max grid size here
const maxGridSize = 32;

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /^col-(start|end)-\d+$/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.rose[800],
        background: colors.zinc[800],
        base: colors.zinc[900],
        twitch: "#9146FF",
        youtube: "#FF0000",
      },
      gridTemplateColumns: {
        [maxGridSize]: `repeat(${maxGridSize}, minmax(0, 1fr))`, // Set grid template for max grid size
      },
      gridColumnStart: generateGridColumns(maxGridSize), // Generate grid column start
      gridColumnEnd: generateGridColumns(maxGridSize), // Generate grid column end
      gridColumn: generateGridSpans(maxGridSize), // Generate grid column span
    },
  },
  plugins: [],
};
