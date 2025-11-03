import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores do design system Concapay
        void: "#070D27",
        voidLight: "#20304C",
        opulent: "#0250F4",
        azure: "#0692F2",
        glitter: "#43BCFF",
        frost: "#E3E8F4",
        // Cores do shadcn/ui (mantidas para compatibilidade)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // Adicionando escala do design system
          50: "#E3E8F4",
          100: "#43BCFF",
          500: "#0692F2",
          700: "#0250F4",
          900: "#070D27",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          // Adicionando escala do design system
          100: "#20304C",
          500: "#8492a6",
          700: "#273444",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        primary: ['Exo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        secondary: ['Exo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Exo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'brand-xs': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }], // 14px
        'brand-sm': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],     // 16px
        'brand-md': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }], // 18px
        'brand-lg': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],  // 20px
        'brand-xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],   // 24px
        'brand-2xl': ['2rem', { lineHeight: '1.3', letterSpacing: '0' }],    // 32px
        'brand-3xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0' }],  // 40px
        'brand-4xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0' }],    // 48px
        'brand-5xl': ['3.5rem', { lineHeight: '1.2', letterSpacing: '0' }],  // 56px
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '4xl': '2rem',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

