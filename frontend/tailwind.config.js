module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontSize: {
        'responsive-sm': '7.43333vw',
        'responsive-xsm': '4.43333vw',  // 5.43333vw Small screens to larger screens
        'responsive-xl': '2.398vw',
        'responsive-lg': '1vw',  // Extra-large screens
        'responsive-xs': '0.75rem',   // Extra small (12px) for small screens
        'responsive-md': '1rem',       // Medium (16px)
        'responsive-xl': '1.6rem',     // Extra large (20px)
        'responsive-2xl': '1.5rem',     // 2x Extra large (24px)
      },
      screens: {
        'xs': '605px',    // Custom small screen
        '2xl': '1440px',  // Custom large screen
        'screen-391': '415px'
      },
      container: {
        center: true,  // Center the container
        screens: {
          sm: '1800px',
          xs: '1800px',

        }
      }
    }
  },
  plugins: [],
}