
  document.addEventListener('DOMContentLoaded', function () {
 const isMobile = window.innerWidth <= 991
    new Splide('.splide.is-logos', {
      type: 'loop',
      gap: isMobile ? '2rem' : '5rem',
      arrows: false,
      pagination: false,
      drag: false,
      autoWidth: true,
      clones: 12,
      autoScroll: {
        speed: isMobile ? 1 : 0.7,
        pauseOnHover: false,
        pauseOnFocus: false,
      },
    }).mount({ AutoScroll: window.splide.Extensions.AutoScroll })

  })
