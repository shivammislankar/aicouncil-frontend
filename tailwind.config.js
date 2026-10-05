export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: "rgb(var(--card))",
        border: "rgb(var(--border))",
        accent: "rgb(var(--accent))",
        input: "rgb(var(--input))",
        muted: "rgb(var(--muted))",
        "muted-foreground": "rgb(var(--muted-foreground))",
        destructive: "rgb(var(--destructive))",
      },
    },
  },
  plugins: [],
};
