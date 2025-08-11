/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Comfortaa', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-teal': '#5fb3a3',
        'secondary-orange': '#ff5722',
        'light-teal': '#7fc7bc',
        'dark-bg': '#1a1a1a',
        'off-white': '#f8f9fa',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
}
