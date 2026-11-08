
/* AUXIA HERO — desktop (>991px) + mobile (<=991px) */

/* ---------- DESKTOP ---------- */
window.addEventListener('load', () => {
  const isMobile = window.innerWidth <= 991

  gsap.ticker.lagSmoothing(0)

  const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.2,
    effects: true
  })

  if (!isMobile) {
    const h1 = new SplitText('.heading-style-h1', {
      types: 'lines',
      mask: 'lines',
      linesClass: 'h1-lines',
      autoSplit: true
    })

    

    const p1 = new SplitText('.hero_main .hero_p', {
      types: 'lines',
      mask: 'lines',
      autoSplit: true
    })

    const TAG_MUTED = { color: '#c3c2b2', backgroundColor: '#f0efe3', borderColor: '#e2e1d3' }
    const TAG_ACTIVE = { color: '#0b4fff', backgroundColor: '#d8dade', borderColor: '#d8dade' }

    gsap.set('.hero_tag', { scale: 0, opacity: 0, ...TAG_MUTED })

    const lineATl = gsap.timeline({ defaults: { ease: 'none' } })
      .from('.hero_lines-left', {
        xPercent: -100,
        duration: 1
      })
      .from('#hero-lw', {
        drawSVG: 0,
        duration: 1.5,
        onStart: () => {
          gsap.to('.hero_tag', {
            scale: 1,
            opacity: 1,
            duration: 1,
            delay: 0.6,
            stagger: 0.3,
            ease: 'power4.out'
          })
        }
      })
      .from('.hero_lines-right', {
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 1
      }, '-=0.3')

    gsap.set('#hero-lb', { drawSVG: '0% 0%' })
    gsap.set('[hero-l1]', { xPercent: -100 })
    gsap.set('[hero-l2]', { clipPath: 'inset(0% 100% 0% 0%)' })

    function createLineBTl() {
      return gsap.timeline({ defaults: { ease: 'none' } })
        .set('[hero-l1], [hero-l2], #hero-lb', { opacity: 1 })
        .fromTo('[hero-l1]', { xPercent: -100 }, {
          xPercent: 0,
          duration: 1
        })
        .fromTo('#hero-lb', { drawSVG: '0% 0%' }, {
          drawSVG: '0% 100%',
          duration: 1.5
        })
        .fromTo('[hero-l2]', { clipPath: 'inset(0% 100% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1
        }, '-=0.3')
    }

    function createLineBUndraw() {
      return gsap.timeline({ defaults: { ease: 'none' } })
        .to('[hero-l1]', {
          xPercent: 100,
          duration: 1
        })
        .to('#hero-lb', {
          drawSVG: '100% 100%',
          duration: 1.5,
          onStart: () => {
            gsap.to('.hero_tag-text-wrap', {
              width: 0,
              duration: 1,
              delay: 0.6,
              stagger: 0.3,
              ease: 'power4.out'
            })
            gsap.to('.hero_tag', {
              ...TAG_MUTED,
              duration: 1.2,
              delay: 0.6,
              stagger: 0.3,
              ease: 'power4.out'
            })
          }
        })
        .to('[hero-l2]', {
          clipPath: 'inset(0% 0% 0% 100%)',
          duration: 1
        }, '-=0.3')
    }

    const workflowItems = gsap.utils.toArray('.hero_visual .hero_step2-list-item')

    workflowItems.forEach(item => {
      const spinner = item.querySelector('img.hero_step2-list-icon')

      item._enabledColor = getComputedStyle(item).color
      item._enabledBorder = getComputedStyle(item).borderColor
      if (spinner) spinner._display = getComputedStyle(spinner).display
    })

    gsap.to('.hero_visual .hero_step2-list-item img.hero_step2-list-icon', {
      rotation: 360,
      duration: 1,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%'
    })

    // Three stacked variant cards — one per cycle.
    const variantWraps = gsap.utils.toArray('.hero_visual .hero_step4 [data-step-last]')

    variantWraps.slice(1).forEach(el => {
      gsap.set(el, { position: 'absolute', top: 0, left: 0 })
    })

    function createPromptTl() {
      const scope = document.querySelector('.hero_visual .hero_step1-wrapper')
      if (!scope) return gsap.timeline()

      const content = scope.querySelector('.hero_step1-box')
      const items = scope.querySelectorAll('.hero_step1-box > *')

      const tl = gsap.timeline()

      tl.set(content, { autoAlpha: 0, filter: 'blur(10px)', y: 0 }, 0)
        .set(items, { y: '1em', opacity: 0 }, 0)

      tl.to(content, {
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out'
        }, 0)
        .to(items, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out'
        }, 0.2)

      return tl
    }

    function createAgentWorkflowTl() {
      const scope = document.querySelector('.hero_visual .hero_step2')
      if (!scope) return gsap.timeline()

      const content = scope.querySelector('.hero_step2-list')
      const items = gsap.utils.toArray(scope.querySelectorAll('.hero_step2-list-item'))

      const tl = gsap.timeline()

      tl.set(content, { autoAlpha: 0, filter: 'blur(10px)', y: 0 }, 0)
        .set(items, { y: '1em', opacity: 0, color: '#c3c2b2', borderColor: '#e2e1d3' }, 0)

      items.forEach(item => {
        const done = item.querySelector('.hero_step2-list-icon.is-done')
        const spinner = item.querySelector('img.hero_step2-list-icon')

        if (done) tl.set(done, { display: 'none' }, 0)
        if (spinner) tl.set(spinner, { display: spinner._display || 'block' }, 0)
      })

      tl.to(content, {
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out'
        }, 0)
        .to(items, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out'
        }, 0.2)

      items.forEach((item, i) => {
        const done = item.querySelector('.hero_step2-list-icon.is-done')
        const spinner = item.querySelector('img.hero_step2-list-icon')
        const t = 1.4 + i * 0.35

        tl.to(item, {
          color: item._enabledColor,
          borderColor: item._enabledBorder,
          duration: 0.5,
          ease: 'power2.out'
        }, t)
        if (done) tl.set(done, { display: 'flex' }, t)
        if (spinner) tl.set(spinner, { display: 'none' }, t)
      })

      return tl
    }

    // All items reveal; only items[cycle] lights up.
    function createDecisioningTl(cycle) {
      const scope = document.querySelector('.hero_visual .hero_step3')
      if (!scope) return gsap.timeline()

      const content = scope.querySelector('.hero_step3-list')
      const items = gsap.utils.toArray(scope.querySelectorAll('.hero_step3-list > *'))
      const persons = scope.querySelectorAll('.hero_step1-person')
      const texts = scope.querySelectorAll('.hero_step3-text')

      const tl = gsap.timeline()

      tl.set(content, { autoAlpha: 0, filter: 'blur(10px)', y: 0 }, 0)
        .set(items, { y: '1em', opacity: 0 }, 0)
        .set(persons, { color: '#c3c2b2' }, 0)
        .set(texts, { color: '#c3c2b2' }, 0)

      tl.to(content, {
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out'
        }, 0)
        .to(items, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out'
        }, 0.2)

      const active = items[cycle]

      if (active) {
        const person = active.querySelector('.hero_step1-person')
        const text = active.querySelector('.hero_step3-text')
        const t = 1 + cycle * 0.15

        if (person) tl.to(person, {
          color: '#0b4fff',
          duration: 0.8,
          ease: 'power2.out'
        }, t)
        if (text) tl.to(text, {
          color: '#232323',
          duration: 0.8,
          ease: 'power2.out'
        }, t)
      }

      return tl
    }

    function createVariantTl(cycle) {
      const content = variantWraps[cycle]
      if (!content) return gsap.timeline()

      const img = content.querySelector('.hero_step3-img')
      const infoItems = content.querySelectorAll('.hero_step3-info > *')

      const tl = gsap.timeline()

      tl.set(variantWraps, { autoAlpha: 0 }, 0)
        .set(content, { filter: 'blur(10px)', y: 0 }, 0)
        .set(img, { scale: 1.2 }, 0)
        .set(infoItems, { y: 10, opacity: 0 }, 0)

      tl.to(content, {
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out'
        }, 0)
        .to(img, {
          scale: 1,
          duration: 1.5,
          ease: 'power3.out'
        }, 0)
        .to(infoItems, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out'
        }, 0.3)

      return tl
    }

    const stepContents = '.hero_visual .hero_step1-box, .hero_visual .hero_step2-list, .hero_visual .hero_step3-list, .hero_visual .hero_step4 [data-step-last]'

    function addPhaseIn(tl, cycle, pos) {
      tl.add(createLineBTl(), pos)
        .fromTo('.hero_tag-text-wrap', { width: 0 }, {
          width: 'auto',
          duration: 1,
          stagger: 0.3,
          ease: 'power4.out',
          immediateRender: false
        }, '<0.9')
        .fromTo('.hero_tag', TAG_MUTED, {
          ...TAG_ACTIVE,
          duration: 1.2,
          stagger: 0.3,
          ease: 'power4.out',
          immediateRender: false
        }, '<')
        .add(createPromptTl(), '<0.2')
        .add(createAgentWorkflowTl(), '<0.4')
        .add(createDecisioningTl(cycle), '<0.4')
        .add(createVariantTl(cycle), '<0.4')
        .to({}, { duration: 1 })
    }

    function addPhaseOut(tl) {
      tl.add(createLineBUndraw(), '-=0.5')
        .to(stepContents, {
          autoAlpha: 0,
          filter: 'blur(5px)',
          y: 32,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out'
        }, '<0.3')
        .to({}, { duration: 0.3 })
    }

    gsap.set('.hero_tag-text-wrap', { width: 0 })
    gsap.set(stepContents, { autoAlpha: 0 })
    gsap.set('[data-bg-text2], [data-bg-text3]', { autoAlpha: 0 })

    const preloaderTlA = gsap.timeline()
      .set('.page-wrapper', { opacity: 1 })

    const preloaderTlB = gsap.timeline({ repeat: -1 })
      .set('[hero-l1], [hero-l2], #hero-lb', { opacity: 0 })

    addPhaseIn(preloaderTlB, 0, 0)
    addPhaseOut(preloaderTlB)
    addPhaseIn(preloaderTlB, 1, '-=0.5')
    addPhaseOut(preloaderTlB)
    addPhaseIn(preloaderTlB, 2, '-=0.5')
    addPhaseOut(preloaderTlB)

    preloaderTlB
      .set('[hero-l1], [hero-l2], #hero-lb', { opacity: 0 })
      .set('[data-bg-text1]', { autoAlpha: 0 })

    preloaderTlA
      .set('[hero-l1], [hero-l2], #hero-lb', { opacity: 0 })
      .from('.nav_fixed', {
        yPercent: -100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
      }, 0.3)
      .from('.heading-style-h1', {
        y: 32,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
      }, 0.5)
      .from('.hero_main .hero_p', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
      }, '<0.3')
      .from('.hero_main .button-group', {
        y: 32,
        filter: 'blur(10px)',
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
      }, '<0.3')
      .add(lineATl, 0)
      .from('[data-bg-text1]', {
        y: -32,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power4.out'
      }, 1.7)
      .from('[data-bg-text1]', {
        height: '0%',
        duration: 1,
        stagger: 0.3,
        ease: 'power4.out'
      }, '<')
      .from('[data-bg-text1] .hero_bg-text', {
        y: -10,
        opacity: 0,
        filter: 'blur(5px)',
        duration: 1,
        stagger: 0.3,
        ease: 'power4.out'
      }, '<0.3')
      .add(preloaderTlB)
  }
})

/* ---------- MOBILE ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const heroMain = document.querySelector('.hero_main')
  if (!heroMain) return

  const isMobile = window.innerWidth <= 991
  if (!isMobile) return

  gsap.utils.toArray('.hero_steps-content').forEach(parent => {
    Array.from(parent.children).slice(1).forEach(el => {
      gsap.set(el, { position: 'absolute', top: 0, left: 0 })
    })
  })

  const h1 = new SplitText('.heading-style-h1', {
    types: 'lines',
    mask: 'lines',
    linesClass: 'h1-lines'
  })
  const p1 = new SplitText('.hero_main .hero_p', {
    types: 'lines',
    mask: 'lines'
  })

  gsap.set('.h1-lines-mask', { paddingBottom: 10, marginBottom: -10 })
  gsap.set('.page-wrapper', { opacity: 1 })

  const heroMobile = document.querySelector('.hero_mobile')
  const mCards = heroMobile.querySelector('.hero_m-cards')
  const cards = gsap.utils.toArray(heroMobile.querySelectorAll('.hero_m-card-wrap'))
  const tags = gsap.utils.toArray(heroMobile.querySelectorAll('.hero_tag'))
  const lineFills = gsap.utils.toArray(heroMobile.querySelectorAll('.hero_m-line'))
  const tagWraps = tags.map(t => t.querySelector('.hero_tag-text-wrap'))

  const M_TAG_MUTED = { color: '#c3c2b2', backgroundColor: '#f0efe3' }
  const M_TAG_ACTIVE = { color: '#0b4fff', backgroundColor: '#d8dade' }

  const mWorkflow = gsap.utils.toArray(cards[1].querySelectorAll('.hero_step2-list-item'))
  const mPersonas = gsap.utils.toArray(cards[2].querySelectorAll('.hero_step1-person'))
  const mPersonaTexts = gsap.utils.toArray(cards[2].querySelectorAll('.hero_step3-text'))

  mWorkflow.forEach(it => {
    const sp = it.querySelector('img.hero_step2-list-icon')
    it._enabledColor = getComputedStyle(it).color
    it._enabledBorder = getComputedStyle(it).borderColor
    if (sp) sp._disp = getComputedStyle(sp).display
  })

  gsap.to(cards[1].querySelectorAll('img.hero_step2-list-icon'), {
    rotation: 360,
    duration: 1,
    ease: 'none',
    repeat: -1,
    transformOrigin: '50% 50%'
  })

  const mVariantWraps = gsap.utils.toArray(cards[3].querySelectorAll('[data-step-last]'))

  mVariantWraps.slice(1).forEach(el => {
    gsap.set(el, { position: 'absolute', top: 0, left: 0 })
  })

  const contents = [
    cards[0].querySelector('.hero_step1-box'),
    cards[1].querySelector('.hero_step2-list'),
    cards[2].querySelector('.hero_step3-list'),
    ...mVariantWraps
  ]

  gsap.set(lineFills, { width: '0%' })
  gsap.set(tagWraps, { width: 0 })
  gsap.set(tags, M_TAG_MUTED)
  gsap.set(contents, { autoAlpha: 0 })

  gsap.timeline({ onComplete: () => sequence(0) })
    .from('.hero_mobile > *', { y: 32, opacity: 0, duration: 1, stagger: 0.1, ease: 'power4.out' })
    .from('.navbar1_container', {
      yPercent: -100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    }, 0.3)
    .from('.heading-style-h1', {
      y: 32,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    }, 0.5)
    .from('.hero_main .hero_p', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    }, '<0.3')
    .from('.hero_main .button-group', {
      y: 32,
      filter: 'blur(10px)',
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    }, '<0.3')

  function createMPromptTl() {
    const content = contents[0]
    const items = cards[0].querySelectorAll('.hero_step1-box > *')

    const tl = gsap.timeline()

    tl.set(content, { autoAlpha: 0, filter: 'blur(10px)', y: 0 }, 0)
      .set(items, { y: '1em', opacity: 0 }, 0)

    tl.to(content, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power3.out'
      }, 0)
      .to(items, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      }, 0.2)

    return tl
  }

  function createMWorkflowTl() {
    const content = contents[1]
    const items = mWorkflow

    const tl = gsap.timeline()

    tl.set(content, { autoAlpha: 0, filter: 'blur(10px)', y: 0 }, 0)
      .set(items, { y: '1em', opacity: 0, color: '#c3c2b2', borderColor: '#e2e1d3' }, 0)

    items.forEach(item => {
      const done = item.querySelector('.hero_step2-list-icon.is-done')
      const spinner = item.querySelector('img.hero_step2-list-icon')

      if (done) tl.set(done, { display: 'none' }, 0)
      if (spinner) tl.set(spinner, { display: spinner._disp || 'block' }, 0)
    })

    tl.to(content, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power3.out'
      }, 0)
      .to(items, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      }, 0.2)

    items.forEach((item, i) => {
      const done = item.querySelector('.hero_step2-list-icon.is-done')
      const spinner = item.querySelector('img.hero_step2-list-icon')
      const t = 1.4 + i * 0.35

      tl.to(item, {
        color: item._enabledColor,
        borderColor: item._enabledBorder,
        duration: 0.5,
        ease: 'power2.out'
      }, t)
      if (done) tl.set(done, { display: 'flex' }, t)
      if (spinner) tl.set(spinner, { display: 'none' }, t)
    })

    return tl
  }

  function createMDecisioningTl(cycle) {
    const content = contents[2]
    const items = gsap.utils.toArray(cards[2].querySelectorAll('.hero_step3-list > *'))

    const tl = gsap.timeline()

    tl.set(content, { autoAlpha: 0, filter: 'blur(10px)', y: 0 }, 0)
      .set(items, { y: '1em', opacity: 0.3 }, 0)
      .set(mPersonas, { color: '#c3c2b2' }, 0)
      .set(mPersonaTexts, { color: '#c3c2b2' }, 0)

    tl.to(content, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power3.out'
      }, 0)
      .to(items, {
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      }, 0.2)

    const active = items[cycle]

    if (active) {
      const person = active.querySelector('.hero_step1-person')
      const text = active.querySelector('.hero_step3-text')
      const t = 1 + cycle * 0.15

      tl.to(active, { opacity: 1, duration: 0.8, ease: 'power2.out' }, t)
      if (person) tl.to(person, { color: '#0b4fff', duration: 0.8, ease: 'power2.out' }, t)
      if (text) tl.to(text, { color: '#232323', duration: 0.8, ease: 'power2.out' }, t)
    }

    return tl
  }

  function createMVariantTeaseTl(cycle) {
    const content = mVariantWraps[cycle]
    if (!content) return gsap.timeline()

    const img = content.querySelector('.hero_step3-img')
    const infoItems = content.querySelectorAll('.hero_step3-info > *')

    const tl = gsap.timeline()

    tl.set(mVariantWraps, { autoAlpha: 0 }, 0)
      .set(content, { filter: 'blur(10px)', y: 0 }, 0)
      .set(img, { scale: 1.2 }, 0)
      .set(infoItems, { y: 10, opacity: 0.3 }, 0)

    tl.to(content, {
        autoAlpha: 0.3,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power3.out'
      }, 0)

    return tl
  }

  function createMVariantActiveTl(cycle) {
    const content = mVariantWraps[cycle]
    if (!content) return gsap.timeline()

    const img = content.querySelector('.hero_step3-img')
    const infoItems = content.querySelectorAll('.hero_step3-info > *')

    const tl = gsap.timeline()

    tl.to(content, {
        autoAlpha: 1,
        duration: 1.5,
        ease: 'power3.out'
      }, 0)
      .to(img, {
        scale: 1,
        duration: 1.5,
        ease: 'power3.out'
      }, 0)
      .to(infoItems, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      }, 0.3)

    return tl
  }

  // Rebuilt each pass so step3/step4 can advance to the next item.
  function sequence(cycle) {
    const tl = gsap.timeline({ onComplete: () => sequence((cycle + 1) % 3) })

    tl.addLabel('in')

    tl.to(lineFills[0], { width: '100%', duration: 0.5, ease: 'power4.out' }, 'in')
      .to(tags[0], { ...M_TAG_ACTIVE, duration: 0.5, ease: 'power4.out' }, 'in+=0.4')
      .to(tagWraps[0], { width: 'auto', duration: 1, ease: 'power4.out' }, '<')
      .add(createMPromptTl(), 'in+=0.6')
      .add(createMWorkflowTl(), 'in+=1.0')
      .add(createMVariantTeaseTl(cycle), 'in+=1.4')

    const viewW = mCards.offsetWidth
    const last = cards[cards.length - 1]
    const stripW = last.offsetLeft + last.offsetWidth

    function slideX(i) {
      const centered = cards[i].offsetLeft - (viewW - cards[i].offsetWidth) / 2
      return -Math.max(0, Math.min(centered, stripW - viewW))
    }

    const slideAt = ['in+=1.6', 'in+=4.9', 'in+=7.9']

    for (let i = 1; i <= 3; i++) {
      tl.to(lineFills[i], { width: '100%', duration: 1, ease: 'power4.out' }, slideAt[i - 1])
        .to(mCards, { x: slideX(i), duration: 1, ease: 'power4.out' }, '<')
        .to(tags[i], { ...M_TAG_ACTIVE, duration: 0.5, ease: 'power4.out' }, '<0.5')
        .to(tagWraps[i], { width: 'auto', duration: 1, ease: 'power4.out' }, '<')
        .to(tagWraps[i - 1], { width: 0, duration: 1, ease: 'power4.out' }, '<')

      if (i === 2) tl.add(createMDecisioningTl(cycle), slideAt[i - 1])
      if (i === 3) tl.add(createMVariantActiveTl(cycle), slideAt[i - 1])
    }

    tl.to(lineFills[4], { width: '100%', duration: 1, ease: 'power4.out' }, 'in+=9.7')

    tl.addLabel('out', 'in+=11.7')
      .to(lineFills, { opacity: 0, duration: 1, ease: 'power4.out' }, 'out')
      .to(contents, {
        autoAlpha: 0,
        filter: 'blur(5px)',
        y: 32,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      }, 'out+=0.3')
      .to(tagWraps, { width: 0, duration: 1, ease: 'power4.out' }, 'out+=0.3')
      .to(tags, { ...M_TAG_MUTED, duration: 1.2, ease: 'power4.out' }, '<')
      .to(mCards, { x: 0, duration: 1, ease: 'power4.out' }, 'out+=0.8')
      .set(lineFills, { width: '0%' })
      .set(lineFills, { opacity: 1 })
      .to({}, { duration: 0.8 })
  }
})
