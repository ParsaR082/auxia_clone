
document.addEventListener("DOMContentLoaded", (event) => {
  const isMobile = window.innerWidth <= 991

document.querySelector('.navbar1_menu-button').addEventListener('click', e => {
  document.body.style.overflow = e.currentTarget.classList.contains('w--open') ? 'auto' :
    'hidden';
});

// DARK 
const PHONE =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/699f379fafdf222597c9c357_phone%20badge.svg'
const EMAIL =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/699f379f8d354d4f979b1315_email%20badge.svg'
const LAPTOP =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/69aa1107d91189e65af5d2bb_laptop-dark.svg'
const CROSS =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/69aaed691c6710fc0f9739a0_close-icon.svg'

function createGridNetwork({
  canvasId,
  rows = 20,
  baseDotRatio = 0.27,
  sequences = []
}) {
  const canvas = document.getElementById(canvasId)
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  const imageCache = {}
  sequences.forEach(seq => {

    if (seq.icon && !imageCache[seq.icon]) {
      const img = new Image()
      img.src = seq.icon
      imageCache[seq.icon] = img
    }

    seq.points.forEach(p => {
      if (p.icon && !imageCache[p.icon]) {
        const img = new Image()
        img.src = p.icon
        imageCache[p.icon] = img
      }
    })

  })

  const letterToIndex = str =>
    str.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1

  const getMaxCol = () => {
  let max = 0

  sequences.forEach(seq => {
    seq.points.forEach(p => {
      if (!p || !p.coord) return

      const match = p.coord.match(/^([A-Z]+)(\d+)$/)
      if (!match) return

      const col = letterToIndex(match[1])
      if (col > max) max = col
    })
  })

  return max + 1
}

  const state = {
    bgDots: [],
    sequences: sequences.map(seq => ({
      iconScale: 0,
      segments: seq.points.slice(1).map(() => ({ progress: 0 })),
      dots: seq.points.slice(1).map(() => ({ scale: 0 }))
    }))
  }

  function buildGridState() {
    const containerWidth = canvas.offsetWidth
    const cols = getMaxCol()
    const gap = containerWidth / cols

    const dots = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          row: r,
          col: c,
          scale: 0
        })
      }
    }
    return dots
  }

  function draw() {
    const containerWidth = canvas.offsetWidth
    const cols = getMaxCol()
    const gap = containerWidth / cols
    const dotSize = gap * baseDotRatio
    const height = rows * gap

    canvas.width = containerWidth * dpr
    canvas.height = height * dpr
    canvas.style.width = containerWidth + 'px'
    canvas.style.height = height + 'px'

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const parseCoord = coord => {
      const match = coord.match(/^([A-Z]+)(\d+)$/)
      const col = letterToIndex(match[1])
      const row = parseInt(match[2], 10) - 1
      return {
        x: col * gap + gap / 2,
        y: row * gap + gap / 2
      }
    }

    const drawDot = (x, y, color, scale = 1) => {
      ctx.beginPath()
      ctx.arc(x, y, (dotSize / 2) * scale, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }

    const drawLine = (p1, p2, progress = 1) => {
      const x = p1.x + (p2.x - p1.x) * progress
      const y = p1.y + (p2.y - p1.y) * progress
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(x, y)
      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.stroke()
    }

    state.bgDots.forEach(dot => {
      drawDot(
        dot.col * gap + gap / 2,
        dot.row * gap + gap / 2,
        'rgba(255,255,255,0.1)',
        dot.scale
      )
    })

    sequences.forEach((seq, index) => {
      const seqState = state.sequences[index]
      const points = seq.points

      if (seq.icon && imageCache[seq.icon]?.complete) {
        const start = parseCoord(points[0].coord)
        const size = gap * 0.9 * seqState.iconScale
        ctx.drawImage(
          imageCache[seq.icon],
          start.x - size / 2,
          start.y - size / 2,
          size,
          size
        )
      }

      for (let i = 1; i < points.length; i++) {
        const prev = parseCoord(points[i - 1].coord)
        const current = parseCoord(points[i].coord)

        drawLine(prev, current, seqState.segments[i - 1].progress)

        if (points[i].icon && imageCache[points[i].icon]?.complete) {

          const size = gap * 0.9 * seqState.dots[i - 1].scale

          ctx.drawImage(
            imageCache[points[i].icon],
            current.x - size / 2,
            current.y - size / 2,
            size,
            size
          )

        } else if (points[i].color) {

          drawDot(
            current.x,
            current.y,
            points[i].color,
            seqState.dots[i - 1].scale
          )

        }
      }
    })
  }

  state.bgDots = buildGridState()

  const master = gsap.timeline({
    scrollTrigger: {
      trigger: canvas,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })

  if (isMobile) {
  state.bgDots.forEach(dot => dot.scale = 1)
  draw()
} else {
  master.to(state.bgDots, {
    scale: 1,
    duration: 0.6,
    stagger: {
      amount: 0.6,
      from: 'start',
      grid: '[1, 0]'
    },
    ease: 'power2.out',
    onUpdate: draw
  })
}

  state.sequences.forEach((seqState, index) => {
    const seqTl = gsap.timeline({ onUpdate: draw })

    seqTl.to(seqState, {
      iconScale: 1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })

    seqState.segments.forEach((segment, i) => {
      seqTl.to(segment, {
        progress: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.1')

      seqTl.to(seqState.dots[i], {
        scale: 1,
        duration: 0.35,
        ease: 'back.out(1.7)'
      }, '<0.15')
    })

    master.add(seqTl, index === 0 ? '<0.2' : '<0.2')
  })

  let resizeTimeout
  if (!isMobile) {
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        state.bgDots = buildGridState()
        draw()
      }, 100)
    })
  }

  draw()
}

createGridNetwork({
  canvasId: 'network',
  rows: 9,
  sequences: [
  {
    icon: PHONE,
    points: [
      { coord: isMobile ? 'A6' : 'B5', color: 'white' },
      { coord: isMobile ? 'C7' : 'D6', color: 'white' },
      { coord: isMobile ? 'D5' : 'F5', icon: CROSS }
    ]
  },
  {
    icon: PHONE,
    points: [
      { coord: isMobile ? 'J1' : 'AE1', color: 'white' },
      { coord: isMobile ? 'H6' : 'AB5', color: 'white' },
      { coord: isMobile ? 'I8' : 'AB8', color: 'white' },
      { coord: isMobile ? 'F9' : 'W9', color: 'white' },
      { coord: isMobile ? 'I2' : 'AB2', icon: CROSS }
    ]
  },
  {
    icon: EMAIL,
    points: [
      { coord: isMobile ? 'A2' : 'E2', color: 'white' },
      { coord: isMobile ? 'D2' : 'I2', color: 'white' },
      { coord: isMobile ? 'F4' : 'O7', color: 'white' },
      { coord: isMobile ? 'G3' : 'V3', color: 'white' },
      { coord: isMobile ? 'J6' : 'Z6', icon: CROSS }
    ]
  },
  {
    icon: EMAIL,
    points: [
      { coord: isMobile ? 'G2' : 'S2', color: 'white' },
      { coord: isMobile ? 'I4' : 'T8', icon: CROSS }
    ]
  },
  {
    icon: LAPTOP,
    points: [
  { coord: isMobile ? 'C1' : 'I1', color: 'white' },
  { coord: isMobile ? 'F7' : 'M7', color: 'white' },
  { coord: isMobile ? 'C9' : 'K9', color: 'white' },
  { coord: isMobile ? 'B5' : 'I7', color: 'white' },
  isMobile ? { coord: 'F2', icon: CROSS } : { coord: 'F8', color: 'white' },
  isMobile ? null : { coord: 'M2', icon: CROSS }
].filter(Boolean)
  }]
})


// BLUE 
const PHONE2 =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/699f5b7e5e7199fd00ab6ffd_phone%20blue.svg'
const EMAIL2 =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/699f5b7e87333795656729ae_email%20blue.svg'
const LAPTOP2 =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/69aa10fa2fc64be7bfc9287e_laptop-blue.svg'
const MESSAGE =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/699f5b7e8f1eb466e9a164b1_message%20blue.svg'
const PERSON =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/699f5b7ecefdaad6bd0f8b66_person.svg'
const CHECKMARK =
  'https://cdn.prod.website-files.com/6998a7a4efcd66d9f2857e79/699f5b7e366b78446268cb7d_checkmark.svg'

function createOrganizedNetwork({
  canvasId,
  rows = 9,
  baseDotRatio = 0.27,
  sequences = []
}) {
  const canvas = document.getElementById(canvasId)
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  const imageCache = {}
  sequences.forEach(seq => {
    seq.points.forEach(p => {
      if (p.icon && !imageCache[p.icon]) {
        const img = new Image()
        img.src = p.icon
        imageCache[p.icon] = img
      }
    })
  })

  const letterToIndex = str =>
    str.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1

  const getMaxCol = () => {
  let max = 0

  sequences.forEach(seq => {
    seq.points.forEach(p => {
      if (!p || !p.coord) return

      const match = p.coord.match(/^([A-Z]+)(\d+)$/)
      if (!match) return

      const col = letterToIndex(match[1])
      if (col > max) max = col
    })
  })

  return max + 1
}

  const state = {
    bgDots: [],
    sequences: sequences.map(seq => ({
      segments: seq.points.slice(1).map(() => ({ progress: 0 })),
      nodes: seq.points.map(() => ({ scale: 0 })),
      overshoot: seq.overshoot ? { progress: 0 } : null
    }))
  }

  function buildBg() {
    const width = canvas.parentElement.offsetWidth
    const cols = getMaxCol()
    const gap = width / cols

    const dots = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({ row: r, col: c, scale: 0 })
      }
    }
    return dots
  }

  function draw() {
    const containerWidth = canvas.parentElement.offsetWidth
    const cols = getMaxCol()
    const gap = containerWidth / cols
    const dotSize = gap * baseDotRatio
    const height = rows * gap

    canvas.width = containerWidth * dpr
    canvas.height = height * dpr
    canvas.style.width = containerWidth + 'px'
    canvas.style.height = height + 'px'

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const parseCoord = coord => {
      const match = coord.match(/^([A-Z]+)(\d+)$/)
      const col = letterToIndex(match[1])
      const row = parseInt(match[2], 10) - 1
      return {
        x: col * gap + gap / 2,
        y: row * gap + gap / 2
      }
    }

    const drawDot = (x, y, color, scale = 1) => {
      ctx.beginPath()
      ctx.arc(x, y, (dotSize / 2) * scale, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }

    const drawLine = (p1, p2, progress = 1) => {
      const x = p1.x + (p2.x - p1.x) * progress
      const y = p1.y + (p2.y - p1.y) * progress
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(x, y)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#F0EFE3'
      ctx.stroke()
    }

    state.bgDots.forEach(dot => {
      drawDot(
        dot.col * gap + gap / 2,
        dot.row * gap + gap / 2,
        'rgba(255,255,255,0.1)',
        dot.scale
      )
    })

    sequences.forEach((seq, sIndex) => {
      const seqState = state.sequences[sIndex]
      const points = seq.points

      for (let i = 1; i < points.length; i++) {
        const prev = parseCoord(points[i - 1].coord)
        const current = parseCoord(points[i].coord)
        drawLine(prev, current, seqState.segments[i - 1].progress)
      }

      if (seqState.overshoot) {
        const last = parseCoord(points[points.length - 1].coord)
        ctx.beginPath()
        ctx.moveTo(last.x, last.y)
        ctx.lineTo(
          last.x + (containerWidth - last.x) * seqState.overshoot.progress,
          last.y
        )
        ctx.lineWidth = 2
        ctx.strokeStyle = '#F0EFE3'
        ctx.stroke()
      }

      points.forEach((p, i) => {
        const pos = parseCoord(p.coord)

        if (p.icon && imageCache[p.icon]?.complete) {
          const size = gap * 0.9 * seqState.nodes[i].scale
          ctx.drawImage(
            imageCache[p.icon],
            pos.x - size / 2,
            pos.y - size / 2,
            size,
            size
          )
        }

        if (p.dot) {
          drawDot(
            pos.x,
            pos.y,
            p.color || '#F0EFE3',
            seqState.nodes[i].scale
          )
        }
      })
    })
  }

  state.bgDots = buildBg()

  const master = gsap.timeline({
    scrollTrigger: {
      trigger: canvas,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })

 if (isMobile) {
  state.bgDots.forEach(dot => dot.scale = 1)
  draw()
} else {
  master.to(state.bgDots, {
    scale: 1,
    duration: 0.6,
    stagger: {
      amount: 0.6,
      from: 'start',
      grid: '[1, 0]'
    },
    ease: 'power2.out',
    onUpdate: draw
  })
}

  state.sequences.forEach((seqState, index) => {
    const seqTl = gsap.timeline({ onUpdate: draw })

    seqTl.to(seqState.nodes[0], {
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)'
    })

    for (let i = 1; i < seqState.nodes.length; i++) {
      seqTl.to(seqState.segments[i - 1], {
        progress: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.15')

      seqTl.to(seqState.nodes[i], {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(1.7)'
      }, '<0.15')
    }

    if (seqState.overshoot) {
      seqTl.to(seqState.overshoot, {
        progress: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    master.add(seqTl, index === 0 ? '<0.2' : '<50%')
  })

  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      state.bgDots = buildBg()
      draw()
    }, 100)
  })

  draw()
}

createOrganizedNetwork({
  canvasId: 'organizedNetwork',
  rows: 9,
  sequences: [
  {
    overshoot: true,
    points: [
      { coord: isMobile ? 'A3' : 'A3', icon: PERSON },
      { coord: isMobile ? 'C2' : 'E2', icon: PHONE2 },
      { coord: isMobile ? 'D3' : 'I2', dot: true },
      { coord: isMobile ? 'E2' : 'M1', icon: EMAIL2 },
      { coord: isMobile ? 'G2' : 'Q2', dot: isMobile ? false : true, icon: isMobile ? MESSAGE : null },
      { coord: isMobile ? 'H3' : 'U2', dot: isMobile ? true : false, icon: isMobile ? null : MESSAGE },
      { coord: isMobile ? 'J2' : 'Y3', dot: isMobile ? false : true, icon: isMobile ? CHECKMARK : null},
      isMobile ? null : { coord: 'AC2', icon: CHECKMARK }
    ].filter(Boolean)
  },
  {
    overshoot: true,
    points: [
      { coord: isMobile ? 'A5' : 'A5', icon: PERSON },
      { coord: isMobile ? 'C5' : 'E5', dot: true },
      { coord: isMobile ? 'D6' : 'I5', icon: isMobile ? MESSAGE : PHONE2 },
      { coord: isMobile ? 'F5' : 'M6', icon: isMobile ? PHONE2 : MESSAGE },
      { coord: isMobile ? 'I5' : 'Q5', dot: true },
      { coord: isMobile ? 'J5' : 'U5', dot: isMobile ? false : true, icon: isMobile ? CHECKMARK : null },
      isMobile ? null : { coord: 'Y6', dot: true },
      isMobile ? null : { coord: 'AC5', icon: CHECKMARK }
    ].filter(Boolean)
  },
  {
    overshoot: true,
    points: [
      { coord: isMobile ? 'A7' : 'A7', icon: PERSON },
      { coord: isMobile ? 'C7' : 'E7', icon: LAPTOP2 },
      { coord: isMobile ? 'E7' : 'I7', dot: true },
      { coord: isMobile ? 'F8' : 'M8', icon: EMAIL2 },
      { coord: isMobile ? 'H7' : 'Q7', dot: isMobile ? false : true, icon: isMobile ? EMAIL2 : null },
      { coord: isMobile ? 'J7' : 'U7', dot: isMobile ? false : true, icon: isMobile ? CHECKMARK : null },
      isMobile ? null : { coord: 'Y7', icon: MESSAGE },
      isMobile ? null : { coord: 'AC7', icon: CHECKMARK }
    ].filter(Boolean)
  }]
})
const counterEl = document.querySelector('.automations_counter')
const finalVal = parseInt(counterEl.textContent.replace(/\D/g, ''), 10) || 0
let counterObj = { val: 0 }
const automationsText = new SplitText('.automations_text', { types: 'chars',
  autoSplit: true })

gsap.timeline({
  scrollTrigger: {
    trigger: '.section_automations',
    start: 'center bottom',
    end: 'center center',
    scrub: 1,
  }
})
.from('.automations_h', {
  scale: 2,
  yPercent: 50,
  xPercent: -30,
  duration: 0.5,
  opacity: 0,
  filter: 'blur(20px)',
  ease: 'none'
})
.to(counterObj, {
  val: finalVal,
  duration: 0.5,
  ease: 'none',
  onUpdate: () => {
    const value = Math.round(counterObj.val)
    counterEl.textContent = value < 10 ? `0${value}` : value
  }
}, '<')
  .from('.automations_text', {
    opacity: 0,
    filter: 'blur(3px)',
    y: 15,
    duration: 0.6,
    ease: 'power2.out'
  }, '<50%')  
  
gsap.timeline({
    scrollTrigger: {
      trigger: '.section_automations',
      start: 'center center',
      end: '+=60%',
      pin: true,
      scrub: 1,
    }
  })
  .to('.automations_behind', {
    yPercent: -100,
    y: isMobile ? '100vh' : '100dvh',
    duration: 1,
    ease: 'none'
  })

gsap.utils.toArray('[automations-bottom]').forEach(section => {
  const name = section.querySelector('.automations_name')
  const spacer = section.querySelector('.automations_spacer')
  const tag = section.querySelector('.automations_tag')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'bottom bottom',
      toggleActions: 'play none none none'
    }
  })

  tl.from(spacer, {
      scaleX: 0,
      duration: 1.5,
      ease: 'power4.out'
    })
    .from(name, {
      xPercent: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'back.out(0.5)',
    }, '<')
    .from(tag, {
      xPercent: -100,
      opacity: 0,
      duration: 1.5,
      ease: 'back.out(0.5)',
    }, '<')
})

gsap.utils.toArray('.heading-style-h2, [fd-h2]').forEach(el => {
  if (el.hasAttribute('prevent')) return
  gsap.from(el, {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 80%'
    }
  })
})
gsap.utils.toArray('[fd-paragraph]').forEach(el => {
  if (el.closest('.legal_rich')) return
  gsap.from(el, {
    y: 20,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 80%'
    }
  })
})

gsap.utils.toArray('[fd-fade-children]').forEach(el => {
  gsap.set(el.children, { opacity: 0, y: 25 })

  gsap.to(el.children,
  {
    opacity: 1,
    y: 0,
    duration: 1.5,
    stagger: 0.12,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 80%'
    }
  })
})

gsap.utils.toArray('[fd-fade]').forEach(el => {
  gsap.fromTo(el,
  {
    opacity: 0,
    y: 20
  },
  {
    opacity: 1,
    y: 0,
    duration: 1.3,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 80%'
    }
  })
})

const splides = document.querySelectorAll('.splide.is-case-studies')

splides.forEach((el, index) => {

  const direction = index % 2 === 0 ? 1 : -1

  const instance = new Splide(el, {
    type: 'loop',
    gap: '8px',
    pagination: false,
    autoWidth: true,
    arrows: false,
    drag: false,
    autoScroll: {
      speed: 1 * direction,
      pauseOnHover: true,
      pauseOnFocus: false,
    },
  }).mount(window.splide.Extensions)


})

const processWrap = document.querySelectorAll('.process_wrap')
const processSteps = document.querySelectorAll('.process_steps')
const processLinesWrap = document.querySelectorAll('.process_lines-wrap')
const processCTA = document.querySelectorAll('.process_cta')
const processP = document.querySelectorAll('.process_text')
const processVLine = document.querySelectorAll('.process_progress-vertical')
const tagText = new SplitText('.process_tag-text', {
  types: 'chars, words',
  charsClass: 'tag-char',
  autoSplit: true
})
gsap.timeline({
    scrollTrigger: {
      trigger: '.process_step1',
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: 1,
    },
    defaults: {
      ease: 'none'
    }
  })
  .from('.process_start', { opacity: 0, yPercent: 100 })
  .from(processCTA[0], { opacity: 0, yPercent: 100 }, '<50%')
  .from('.process_progress-horizontal, .process_lines-wrap', { opacity: 0 })
  .to('.process_step1 .process_progress', {
    width: '100%',
    transformOrigin: 'left center'
  }, '<')
  .to(processCTA[0], {
    color: 'white',
    backgroundColor: '#0b4fff',
    borderColor: '#0b4fff'
  })


processSteps.forEach(step => {
  const cta = step.querySelector('.process_cta')
  const text = step.querySelector('.process_text')
  const sibling = step.querySelector('[data-card]')

  gsap.timeline({
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
        end: 'top 60%',
        scrub: 1
      },
      defaults: {
        ease: 'none'
      }
    })
    .from(cta, { opacity: 0, duration: 0.5 })
    .to({}, { duration: 0.5 })
    .to(cta, {
      color: 'white',
      backgroundColor: '#0b4fff',
      borderColor: '#0b4fff'
    })
    .from(text, { y: 32, opacity: 0, filter: 'blur(5px)' }, '<0.1')
    .from(sibling, { y: 32, opacity: 0, filter: 'blur(5px)' }, '<')
})

if (!isMobile) {
  processLinesWrap.forEach((wrap) => {
    const whiteLine = wrap.querySelector('#process-blue')
    const chars = wrap.querySelectorAll('.tag-char')
    const tag = wrap.querySelector('.process_tag')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top 45%',
        end: 'bottom 50%',
        scrub: 1
      }
    })

    tl.from(whiteLine, {
        drawSVG: 0,
        ease: 'none'
      })
      .from(chars, {
        opacity: 0,
        filter: 'blur(2px)',
        duration: 0.5,
        ease: 'none'
      }, '<35%')
  })
} else {
  processLinesWrap.forEach((wrap) => {
    const chars = wrap.querySelectorAll('.tag-char')
    const tag = wrap.querySelector('.process_tag')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top 30%',
        end: 'bottom 70%',
        scrub: 1
      }
    })

    tl
      .from(chars, {
        opacity: 0,
        filter: 'blur(2px)',
        stagger: {
          from: 'center',
          each: 0.005
        },
        ease: 'none',
      })
  })
}
if (!isMobile) {
  processVLine.forEach((line) => {

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: line.parentElement,
        start: 'top 50%',
        end: 'bottom 60%',
        scrub: 1
      }
    })

    tl.to(line.querySelector('.process_progress2'), {
      height: '100%',
      ease: 'none'
    })
  })
} else {
  const lines = gsap.utils.toArray('.process_line-mbl, .process_card2-line')
  lines.forEach((line) => {
    gsap.to(line.querySelector('.process_progress2'), {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: line,
        start: 'top center',
        end: 'bottom 70%',
        scrub: 1,
      }
    })
  })

  const blueLines = gsap.utils.toArray('.process_lines-mbl')

blueLines.forEach(line => {

  const path = line.querySelector('#process-m-blue')
  if (!path) return

  const inverse = path.hasAttribute('data-inverse')

  gsap.fromTo(path,
    { drawSVG: inverse ? '100% 100%' : '0% 0%' },
    {
      drawSVG: inverse ? '0% 100%' : '0% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: line,
        start: 'top 50%',
        end: 'bottom 70%',
        scrub: 1
      }
    }
  )

})


}

const parallaxConfig = [
  { attr: 'parallax-large', min: 300, max: 400 },
  { attr: 'parallax-medium', min: 150, max: 250 },
  { attr: 'parallax-small', min: 5, max: 20 },
]

parallaxConfig.forEach(({ attr, min, max }) => {
  document.querySelectorAll(`[${attr}]`).forEach((card) => {
    const from = gsap.utils.random(min, max)
    const to = gsap.utils.random(min, max)

    gsap.timeline({
      scrollTrigger: {
        trigger: card.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    }).fromTo(card, { yPercent: from }, { yPercent: -to, ease: 'none' })
  })
})

gsap.from('.process_card3 > *', {
  scrollTrigger: {
    trigger: '.process_card3',
    start: 'top center',
    toggleActions: 'play none none reverse'
  },
  x: gsap.utils.random(64, -64),
  opacity: 0,
  filter: 'blur(10px)',
  duration: 1.5,
  stagger: 0.1,
  ease: 'power4.out'
})

const projectBrief = document.querySelector('[project-brief]')
if (projectBrief) {
const projectTop = gsap.utils.toArray(
  projectBrief.querySelectorAll('.process_step2-top')
)

// projectBriefP

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: projectBrief,
    start: 'top center',
    toggleActions: 'play none none reverse'
  }
})

tl
  .from(projectBrief.querySelector('.process_h'), {
    yPercent: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
  })
  .from(projectBrief.querySelector('p'), {
    yPercent: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
  }, '<0.2')
  .from(projectBrief.querySelectorAll('.process_step2-border'), {
    width: '0%',
    duration: 1.2,
    ease: 'power1.inOut'
  }, '<0.1')

  .from(projectBrief.querySelectorAll('.process_step2-progress'), {
    width: '0%',
    duration: 1.2,
    stagger: 0.1,
    ease: 'power1.inOut'
  }, '<0.2')
projectTop.forEach(top => {
  tl.from(top.querySelectorAll('*'), {
    y: 32,
    opacity: 0,
    duration: 1,
    stagger: 0.05,
    ease: 'power4.out'
  }, '<0.05')
})
}

if (!isMobile) {
gsap.timeline({
    scrollTrigger: {
      trigger: '.process_card2',
      start: 'top 70%',
      end: 'bottom 80%',
      scrub: 1
    }
  })
  .from('.process_step3-card', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    stagger: {
      from: 'center',
      each: 0.1
    },
    ease: 'back.out(1.7)'
  })
  .from('[step3-l1]', {
    scaleY: 0,
    transformOrigin: '50% 0%',
    duration: 1,
    stagger: {
      from: 'center',
      each: 0.1
    },
    ease: 'power4.out'
  }, '-=0.2')
  .from('.process_step-card1.is-alt', {
    y: -10,
    opacity: 0,
    duration: 1,
    stagger: {
      from: 'center',
      each: 0.1
    },
    ease: 'power4.out'
  }, '-=0.1')
  .from('.process_card2 .hero_step3-img', {
    scale: 1.5,
    opacity: 0,
    duration: 1,
    stagger: {
      from: 'center',
      each: 0.1
    },
    ease: 'power4.out'
  }, '<')
  .from('[step3-l2]', {
    scaleY: 0,
    transformOrigin: '50% 0%',
    duration: 2,
    stagger: {
      from: 'edges',
      each: 0.2,
    },
    ease: 'power3.inOut'
  }, '-=0.2')
  .from('.process_step3-tag', {
    y: (i, el) => {
      const progress = el.closest('.process_step3-item')
        ?.querySelector('.process_step3-progress')

      return progress ? -progress.offsetHeight : -100
    },
    scale: 0,
    opacity: 0,
    transformOrigin: '50% 0%',
    duration: 2,
    stagger: {
      from: 'edges',
      each: 0.2
    },
    ease: 'power3.inOut'
  }, '<')
} else {
  gsap.utils.toArray('.process_step3-col').forEach(col => {

  const card = col.querySelector('.process_step3-card')
  const progress = col.querySelectorAll('.process_step3-progress')
  const card1 = col.querySelector('.process_step-card1')
  const tag = col.querySelector('.process_step3-tag')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: col,
      start: 'top 70%',
      end: 'bottom 70%',
      scrub: 1
    }
  })

  tl.from(card, {
    opacity: 0,
    duration: 0.3
  })

  tl.fromTo(progress[0],
    { clipPath: 'inset(0% 0% 100% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4 }
  )

  tl.from(card1, {
    opacity: 0,
    duration: 0.3
  })

  tl.fromTo(progress[1],
    { clipPath: 'inset(0% 0% 100% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4 }
  )

  tl.from(tag, {
    opacity: 0,
    scale: 0,
    transformOrigin: 'top center',
    duration: 0.3
  })

})
}

const message = document.querySelectorAll('.process_card4-message')
message.forEach((msg) => {

  gsap.timeline({
      scrollTrigger: {
        trigger: msg,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    })
    .from(msg, {
      scale: 0,
      opacity: 0,
      transformOrigin: 'right top',
      duration: 0.6,
      ease: 'back.inOut(0.5)'
    })
})
const card4Wrap = document.querySelectorAll('.process_card4-wrap')
card4Wrap.forEach((msg) => {

  gsap.timeline({
      scrollTrigger: {
        trigger: msg,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    })
    .from(msg, {
      scale: 0,
      opacity: 0,
      transformOrigin: 'left top',
      duration: 0.6,
      ease: 'back.inOut(0.5)'
    })
})

if (card4Wrap.length) {
gsap.timeline({
    scrollTrigger: {
      trigger: card4Wrap[0],
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  })
  .from(card4Wrap[0].querySelectorAll('.process_card4-topper > *'), {
    y: 20,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  })
  .from('#msg1-line', {
    drawSVG: 0,
    duration: 1.2,
    ease: 'power3.out'
  }, '-=0.5')
  .from('#msg1-grad, #msg1-text', {
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  }, '<0.3')
}

if (card4Wrap.length > 1) {
const card4Wrap2 = card4Wrap[1].querySelector('.process_card4-topper')
gsap.timeline({
    scrollTrigger: {
      trigger: card4Wrap[1],
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    }
  })
  .from(card4Wrap2.children, {
    y: 20,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power3.out'
  })
}

const projectPlan = document.querySelector('[project-plan]')

if (projectPlan) {
const projectPlanTop = gsap.utils.toArray(
  projectPlan.querySelectorAll('.process_step2-top')
)

// projectPlanP

const projectPlantl = gsap.timeline({
  scrollTrigger: {
    trigger: projectPlan,
    start: 'top 70%',
    toggleActions: 'play none none reverse'
  }
})

projectPlantl
  .from(projectPlan.querySelector('.process_h'), {
    yPercent: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
  })
  .from(projectPlan.querySelector('p'), {
    yPercent: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
  }, '<0.2')
  .from(projectPlan.querySelectorAll('.process_step2-border'), {
    width: '0%',
    duration: 1.2,
    ease: 'power1.inOut'
  }, '<0.1')
  .from(projectPlan.querySelectorAll('.process_step2-progress'), {
    width: '0%',
    duration: 1.2,
    stagger: 0.1,
    ease: 'power1.inOut'
  }, '<0.2')

projectPlanTop.forEach(top => {
  projectPlantl.from(top.querySelectorAll('*'), {
    y: 32,
    opacity: 0,
    duration: 1,
    stagger: 0.05,
    ease: 'power4.out'
  }, '<0.05')
})
}

const trustedCards = gsap.utils.toArray('.trusted_card')

trustedCards.forEach((card, index) => {
  const line = card.querySelector('.trusted_line')
  const icon = card.querySelector('.trusted_icon')
  const heading = card.querySelector('.heading-style-h3')
  const text = card.querySelector('.text-style-supermuted')

  gsap.set(line, { height: '0%' })
  gsap.set(icon, { opacity: 0, y: 32 })
  gsap.set(heading, { y: 20, opacity: 0 })
  gsap.set(text, { y: 20, opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: 'top 70%',
    },
    delay: index * 0.2
  })

  tl.to(line, {
      height: '100%',
      duration: 1,
      ease: 'power3.out'
    })
    .to(icon, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '<0.2')
    .to(heading, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power4.out'
    }, '<0.1')
    .to(text, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power4.out'
    }, '<0.2')
})




});
