/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],  theme: {
    extend: {
      animation: {
        // Entrance animations
        fadeIn: "fadeIn 0.6s ease-out forwards",
        fadeInUp: "fadeInUp 0.6s ease-out forwards",
        fadeInDown: "fadeInDown 0.6s ease-out forwards",
        fadeInLeft: "fadeInLeft 0.6s ease-out forwards",
        fadeInRight: "fadeInRight 0.6s ease-out forwards",
        scaleIn: "scaleIn 0.5s ease-out forwards",
        bounceIn: "bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        slideInLeft: "slideInLeft 0.6s ease-out forwards",
        slideInRight: "slideInRight 0.6s ease-out forwards",
        rotateIn: "rotateIn 0.8s ease-out forwards",
        flipInX: "flipInX 0.8s ease-out forwards",
        flipInY: "flipInY 0.8s ease-out forwards",
        
        // Loading animations
        shimmer: "shimmer 2s infinite",
        breathe: "breathe 3s ease-in-out infinite",
        wiggle: "wiggle 2s ease-in-out infinite",
        rubberBand: "rubberBand 1s ease-out",
        typewriter: "typewriter 3s steps(40, end) forwards",
        blink: "blink 1s step-end infinite",
        
        // Enhanced existing animations
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        
        // Page transitions
        slideInFromTop: "slideInFromTop 0.6s ease-out forwards",
        slideInFromBottom: "slideInFromBottom 0.6s ease-out forwards",
        fadeSlideIn: "fadeSlideIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3) rotate(10deg)" },
          "50%": { opacity: "1", transform: "scale(1.05) rotate(-5deg)" },
          "70%": { transform: "scale(0.95) rotate(2deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        rotateIn: {
          "0%": { opacity: "0", transform: "rotate(-200deg) scale(0.8)" },
          "100%": { opacity: "1", transform: "rotate(0deg) scale(1)" },
        },
        flipInX: {
          "0%": { opacity: "0", transform: "perspective(400px) rotateX(-90deg)" },
          "40%": { transform: "perspective(400px) rotateX(-20deg)" },
          "60%": { transform: "perspective(400px) rotateX(10deg)" },
          "80%": { transform: "perspective(400px) rotateX(-5deg)" },
          "100%": { opacity: "1", transform: "perspective(400px) rotateX(0deg)" },
        },
        flipInY: {
          "0%": { opacity: "0", transform: "perspective(400px) rotateY(-90deg)" },
          "40%": { transform: "perspective(400px) rotateY(-20deg)" },
          "60%": { transform: "perspective(400px) rotateY(10deg)" },
          "80%": { transform: "perspective(400px) rotateY(-5deg)" },
          "100%": { opacity: "1", transform: "perspective(400px) rotateY(0deg)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        wiggle: {
          "0%, 7%": { transform: "rotateZ(0)" },
          "15%": { transform: "rotateZ(-15deg)" },
          "20%": { transform: "rotateZ(10deg)" },
          "25%": { transform: "rotateZ(-10deg)" },
          "30%": { transform: "rotateZ(6deg)" },
          "35%": { transform: "rotateZ(-4deg)" },
          "40%, 100%": { transform: "rotateZ(0)" },
        },
        rubberBand: {
          "0%": { transform: "scale3d(1, 1, 1)" },
          "30%": { transform: "scale3d(1.25, 0.75, 1)" },
          "40%": { transform: "scale3d(0.75, 1.25, 1)" },
          "50%": { transform: "scale3d(1.15, 0.85, 1)" },
          "65%": { transform: "scale3d(0.95, 1.05, 1)" },
          "75%": { transform: "scale3d(1.05, 0.95, 1)" },
          "100%": { transform: "scale3d(1, 1, 1)" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        slideInFromTop: {
          "0%": { opacity: "0", transform: "translateY(-100vh)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInFromBottom: {
          "0%": { opacity: "0", transform: "translateY(100vh)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeSlideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
        '5000': '5000ms',
      },
      fontFamily: {
        cairo: ["var(--font-cairo)"],
        roboto: ["var(--font-roboto)"],
      },
      colors: {
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(5, 150, 105, 0.3)',
        'glow-lg': '0 0 40px rgba(5, 150, 105, 0.4)',
        'lift': '0 20px 40px rgba(0, 0, 0, 0.1)',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '98': '0.98',
        '97': '0.97',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
