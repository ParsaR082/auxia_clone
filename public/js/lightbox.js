
document.querySelectorAll('[lightbox]').forEach(slide => {
  slide.addEventListener('click', () => {
    const value = slide.getAttribute('data-slide')
    if (!value) return

    const target = document.querySelector(`[data-video="${value}"]`)
    if (!target) return

    const close = target.querySelector('.review_close')

    if (window.lenis) window.lenis.stop()
    else document.body.style.overflow = 'hidden'

    let player
    if (!target._plyr) {
      const videoEl = target.querySelector('.reviews_video')
      if (!videoEl) return

      player = new Plyr(videoEl, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'fullscreen'
        ],
        muted: false,
        playsinline: true,
        hideControls: true,
        clickToPlay: true,
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1
        }
      })
      target._plyr = player

      player.on('ready', () => player.play())
    } else {
      player = target._plyr
      player.muted = false
      player.play()
    }

    const plyrRoot = target.querySelector('.plyr')
    if (!plyrRoot) return

    gsap.set(target, { display: 'flex', autoAlpha: 0 })
    gsap.set(plyrRoot, { scale: 0.5, autoAlpha: 0 })
    if (close) gsap.set(close, { scale: 0, rotation: -20, autoAlpha: 0 })

    const tl = gsap.timeline()
    tl.to(target, {
      autoAlpha: 1,
      duration: 0.25,
      ease: 'power2.out'
    })
      .to(plyrRoot, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.6,
        ease: 'power3.out',
        transformOrigin: 'center center'
      }, '<')

    if (close) {
      tl.to(close, {
        scale: 1,
        rotation: 0,
        autoAlpha: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, '<0.15')
    }
  })
})

document.querySelectorAll('[review-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest('[data-video]')
    if (!container) return

    const plyrRoot = container.querySelector('.plyr')
    if (container._plyr) container._plyr.pause()

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(container, { display: 'none' })
        if (window.lenis) window.lenis.start()
        else document.body.style.overflow = 'auto'
      }
    })

    if (plyrRoot) {
      tl.to(plyrRoot, {
        scale: 0.5,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    tl.to(container, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power2.out'
    }, plyrRoot ? '<' : 0)
  })
})
