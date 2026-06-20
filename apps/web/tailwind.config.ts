import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "var(--color-primary-bg)",
        "secondary-bg": "var(--color-secondary-bg)",
        "tertiary-bg": "var(--color-tertiary-bg)",
        surface: "var(--color-surface)",
        "panel-bg": "var(--color-panel-bg)",
        "glass-bg": "var(--color-glass-bg)",
        "primary-accent": "var(--color-primary-accent)",
        "secondary-accent": "var(--color-secondary-accent)",
        "tertiary-accent": "var(--color-tertiary-accent)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        success: "var(--color-success)",
        info: "var(--color-info)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        "text-disabled": "var(--color-text-disabled)",
        "text-accent": "var(--color-text-accent)",
        "border-primary": "var(--color-border-primary)",
        "border-secondary": "var(--color-border-secondary)",
        "border-accent": "var(--color-border-accent)",
        "border-hover": "var(--color-border-hover)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-glass": "var(--gradient-glass)",
        "gradient-panel": "var(--gradient-panel)",
      },
      boxShadow: {
        "neon-cyan": "var(--shadow-neon-cyan)",
        "neon-cyan-strong": "var(--shadow-neon-cyan-strong)",
        panel: "var(--shadow-panel)",
        glass: "var(--shadow-glass)",
      },
      fontFamily: {
        sans: ["var(--font-family-primary)"],
        mono: ["var(--font-family-mono)"],
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
