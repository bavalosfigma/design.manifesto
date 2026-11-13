<script setup>
import { DialRoot } from 'dialkit/vue'
import 'dialkit/styles.css'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import CodeTrail from './components/CodeTrail.vue'

const open = ref(false)
const shown = ref(false)
const triggerEl = ref(null)
const closeEl = ref(null)
const scrollerEl = ref(null)
const index = ref(0)
const meter = ref(0)
const pull = ref(0)
const pulling = ref(false)
const dragging = ref(false)
const settling = ref(false)
const commentsOn = ref(false)
const commentsKey = ref(0)
const cursorsOn = ref(false)
const cursorsKey = ref(0)
const drawerOpen = ref(false)
const drawerCloseEl = ref(null)
const drawerTriggerEl = ref(null)
const posts = [
  { id: 'still-open', title: 'The files people still open: How multiplayer became the product' },
  { id: 'material', title: 'Getting into the same file: How live cursors made collaboration a material' },
  { id: 'manipulation', title: 'How code came to the canvas without letting go of direct manipulation' },
  { id: 'direction', title: 'When speed is cheap: The direction behind Figma Make' },
  { id: 'crit', title: 'The anatomy of a crit: How feedback rewrote the feature' },
  { id: 'tool', title: 'Code, craft, and the making of the tool behind the feature' },
  { id: 'ego', title: 'How a low-ego team brought shaders to the canvas' },
  { id: 'config', title: 'What we heard at Config, and the release that followed' },
]
const videoOpen = ref(false)
const videoShown = ref(false)
const videoCloseEl = ref(null)
const videoTriggerEl = ref(null)
const videoEl = ref(null)
const videoSrc = ref('/codelayer.mp4')
const videoLabel = ref('Code on the canvas')
const codeOn = ref(false)
const codeKey = ref(0)
let codeTimer = 0
let videoReturnEl = null
let drawerReturnsFocus = true
let modelReturnsFocus = true
const modelOpen = ref(false)
const modelCloseEl = ref(null)
const modelTriggerEl = ref(null)
const copyEl = ref(null)
const introEl = ref(null)
let commentsTimer = 0
let cursorsTimer = 0
let videoCloseTimer = 0

const commentPalette = [
  { color: '#007BE5', ink: '#fff' },
  { color: '#14AE5C', ink: '#fff' },
  { color: '#FF24BD', ink: '#fff' },
  { color: '#667799', ink: '#fff' },
  { color: '#F24822', ink: '#fff' },
  { color: '#FFCD29', ink: '#141414' },
  { color: '#9747FF', ink: '#fff' },
]

const comments = [
  { x: '3%', y: '4%', d: '0s', name: 'Maya Chen', initials: 'MC', time: '2m', text: 'Multiplayer still feels like magic. Don’t ever sand this down.', reaction: '🙌 18' },
  { x: '36%', y: '1%', d: '0.08s', name: 'Jonah Hale', initials: 'JH', time: '6m', text: 'Direct manipulation is the whole point. Protect it.', reaction: '' },
  { x: '67%', y: '7%', d: '0.16s', name: 'Priya Shah', initials: 'PS', time: '11m', text: 'We said this at Config. You actually shipped it.', reaction: '💛 9' },
  { x: '18%', y: '24%', d: '0.05s', name: 'Noor Alvarez', initials: 'NA', time: '18m', text: 'CMD+D, riff, critique, ship. The culture is in the file.', reaction: '' },
  { x: '52%', y: '20%', d: '0.22s', name: 'Sam Okonkwo', initials: 'SO', time: '27m', text: 'Model-agnostic was the right call. The canvas is the moat.', reaction: '🔥 14' },
  { x: '79%', y: '28%', d: '0.12s', name: 'Ren Park', initials: 'RP', time: '34m', text: 'Low-ego, high-craft. You can feel it in the product.', reaction: '' },
  { x: '-2%', y: '46%', d: '0.28s', name: 'Avery Quinn', initials: 'AQ', time: '41m', text: 'Shipping with the community, not at them. Keep going.', reaction: '👏 7' },
  { x: '28%', y: '44%', d: '0.18s', name: 'Lila Brooks', initials: 'LB', time: '1h', text: 'This is the 2.0 moment. Underdog energy, durable tools.', reaction: '' },
  { x: '58%', y: '50%', d: '0.34s', name: 'Chris Adeyemi', initials: 'CA', time: '1h', text: 'Crit jam yesterday changed the feature. That’s the north star.', reaction: '👀 5' },
  { x: '82%', y: '54%', d: '0.1s', name: 'Mei Laurent', initials: 'ML', time: '2h', text: 'When everyone can move fast, taste is the differentiator.', reaction: '' },
  { x: '6%', y: '68%', d: '0.4s', name: 'Omar Farouk', initials: 'OF', time: '2h', text: 'Came for the canvas. Stayed because people actually listen.', reaction: '💬 11' },
  { x: '34%', y: '72%', d: '0.26s', name: 'Tess Nguyen', initials: 'TN', time: '3h', text: 'Side projects are welcome here. That says everything.', reaction: '' },
  { x: '64%', y: '66%', d: '0.46s', name: 'Hugo Berg', initials: 'HB', time: '4h', text: 'Don’t automate the making. Amplify it.', reaction: '✨ 21' },
  { x: '12%', y: '88%', d: '0.32s', name: 'Anika Das', initials: 'AD', time: '5h', text: 'Portfolio over buzzwords. A hiring note that gets it.', reaction: '' },
  { x: '46%', y: '84%', d: '0.5s', name: 'Felix Moreau', initials: 'FM', time: '6h', text: 'Collaboration is the default and you can feel it.', reaction: '🙌 8' },
  { x: '74%', y: '86%', d: '0.2s', name: 'Imani Cole', initials: 'IC', time: '8h', text: 'Community feedback isn’t a metric here. It’s the compass.', reaction: '' },
].map((comment, index) => ({ ...comment, ...commentPalette[index % commentPalette.length] }))

const photos = [
  { src: '/photos/01.jpg', alt: 'People arranging flowers around a low table by the windows' },
  { src: '/photos/02.jpg', alt: 'Two people arranging sweet peas at a blue table' },
  { src: '/photos/03.jpg', alt: 'A talk projected on a screen, the slide reading Disable Taste' },
  { src: '/photos/04.jpg', alt: 'A person standing in front of a wide landscape painting' },
  { src: '/photos/05.jpg', alt: 'A speaker presenting a slide titled The New Workflows' },
  { src: '/photos/06.jpg', alt: 'Two people smiling beside an espresso bar sign' },
  { src: '/photos/07.jpg', alt: 'A woman leading a workshop beside a whiteboard' },
  { src: '/photos/08.jpg', alt: 'A crowd gathered in a workshop room' },
  { src: '/photos/09.jpg', alt: 'A large group seated and standing together for a photo' },
]

const scrim = computed(() => Math.max(0.25, 1 - pull.value / 460))

let closeTimer = 0
let ignoreClick = false
let scrollAnim = 0
let drag = null
let meterObserver = null

function holdSnap(el, held) {
  el.style.scrollSnapType = held ? 'none' : ''
}

function afterPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

function settleTo(left) {
  const el = scrollerEl.value
  if (!el) return
  cancelAnimationFrame(scrollAnim)
  const start = el.scrollLeft
  const delta = left - start
  if (Math.abs(delta) < 0.5) {
    el.scrollLeft = left
    holdSnap(el, false)
    settling.value = false
    return
  }
  holdSnap(el, true)
  settling.value = true
  const duration = Math.min(380, Math.max(180, Math.abs(delta) * 0.42))
  const t0 = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - t0) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    el.scrollLeft = start + delta * eased
    if (t < 1) scrollAnim = requestAnimationFrame(step)
    else {
      el.scrollLeft = left
      holdSnap(el, false)
      settling.value = false
    }
  }
  scrollAnim = requestAnimationFrame(step)
}

async function openLightbox() {
  clearTimeout(closeTimer)
  index.value = 0
  pull.value = 0
  pulling.value = false
  dragging.value = false
  settling.value = false
  shown.value = true
  await nextTick()
  if (scrollerEl.value) scrollerEl.value.scrollLeft = 0
  await afterPaint()
  open.value = true
}

function toggle() {
  if (open.value) close()
  else openLightbox()
}

function close() {
  if (!open.value) return
  open.value = false
  pull.value = 0
  pulling.value = false
  clearTimeout(closeTimer)
  closeTimer = window.setTimeout(() => {
    shown.value = false
    triggerEl.value?.focus()
  }, 860)
}

function toggleDrawer() {
  if (drawerOpen.value) closeDrawer()
  else drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

function onDrawerOutsidePointerDown(event) {
  if (!drawerOpen.value) return
  const target = event.target
  if (!(target instanceof Node)) return
  if (document.getElementById('dent-drawer')?.contains(target)) return
  if (drawerTriggerEl.value?.contains(target)) return
  drawerReturnsFocus = false
  closeDrawer()
}

async function openVideo(src = '/codelayer.mp4', label = 'Code on the canvas', returnEl) {
  clearTimeout(videoCloseTimer)
  const switching = videoShown.value && videoSrc.value !== src
  videoSrc.value = src
  videoLabel.value = label
  videoReturnEl = returnEl ?? videoTriggerEl.value
  if (!videoShown.value) videoShown.value = true
  await nextTick()
  const video = videoEl.value
  if (video) {
    if (switching) video.load()
    video.currentTime = 0
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.play().catch(() => {})
    }
  }
  await afterPaint()
  const wasOpen = videoOpen.value
  videoOpen.value = true
  if (wasOpen) videoCloseEl.value?.focus()
}

function closeVideo() {
  if (!videoOpen.value) return
  videoOpen.value = false
  videoEl.value?.pause()
  clearTimeout(videoCloseTimer)
  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 860
  const returnEl = videoReturnEl
  videoCloseTimer = window.setTimeout(() => {
    videoShown.value = false
    returnEl?.focus()
  }, delay)
}

function openWalkthrough(post) {
  drawerReturnsFocus = false
  closeDrawer()
  openVideo('/walthrough.mov', post.title, drawerTriggerEl.value)
}

const cursorAssets = [
  { src: '/cursors/Property%201=cursor-multiplayer-purple.svg', d: '0.02s', dx: 78, dy: 52 },
  { src: '/cursors/Property%201=cursor-multiplayer-yellow.svg', d: '0.24s', dx: -92, dy: 40 },
  { src: '/cursors/Property%201=cursor-multiplayer-green.svg', d: '0.1s', dx: 46, dy: 96 },
  { src: '/cursors/Property%201=cursor-multiplayer-blue.svg', d: '0.36s', dx: -70, dy: -84 },
  { src: '/cursors/Property%201=cursor-multiplayer-pink.svg', d: '0.16s', dx: 88, dy: -44 },
  { src: '/cursors/Property%201=cursor-multiplayer-red.svg', d: '0.3s', dx: -96, dy: -36 },
  { src: '/cursors/Property%201=cursor-multiplayer-gray.svg', d: '0.44s', dx: 72, dy: 36 },
]

const cursorSpots = [
  { x: 0, y: 0 },
  { x: 1, y: 0.01 },
  { x: 0, y: 0.4 },
  { x: 1, y: 0.52 },
  { x: 0.04, y: 1 },
  { x: 0.96, y: 0.98 },
  { x: 0.14, y: 0.2 },
]

const cursors = ref([])

function placeCursors() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const marginX = 8
  const marginY = 8
  const cursorW = 140
  const cursorH = 80
  const spanX = Math.max(vw - marginX * 2 - cursorW, 1)
  const spanY = Math.max(vh - marginY * 2 - cursorH, 1)
  const scale = Math.min(1, Math.min(vw, vh) / 860)

  cursors.value = cursorAssets.map((cursor, index) => {
    const spot = cursorSpots[index]
    const x = Math.min(1, Math.max(0, spot.x + (Math.random() - 0.5) * 0.04))
    const y = Math.min(1, Math.max(0, spot.y + (Math.random() - 0.5) * 0.04))
    return {
      src: cursor.src,
      d: cursor.d,
      x: `${marginX + x * spanX}px`,
      y: `${marginY + y * spanY}px`,
      dx: `${Math.round(cursor.dx * scale)}px`,
      dy: `${Math.round(cursor.dy * scale)}px`,
    }
  })
}

function showComments() {
  cursorsOn.value = false
  codeOn.value = false
  clearTimeout(cursorsTimer)
  clearTimeout(codeTimer)
  commentsKey.value += 1
  commentsOn.value = true
  clearTimeout(commentsTimer)
  commentsTimer = window.setTimeout(() => {
    commentsOn.value = false
  }, 3700)
}

function showCode() {
  commentsOn.value = false
  cursorsOn.value = false
  clearTimeout(commentsTimer)
  clearTimeout(cursorsTimer)
  codeKey.value += 1
  codeOn.value = true
  clearTimeout(codeTimer)
  codeTimer = window.setTimeout(() => {
    codeOn.value = false
  }, 3700)
}

function toggleModel() {
  if (modelOpen.value) closeModel()
  else modelOpen.value = true
}

function closeModel() {
  modelOpen.value = false
}

function onModelOutsidePointerDown(event) {
  if (!modelOpen.value) return
  const target = event.target
  if (!(target instanceof Node)) return
  if (document.getElementById('policy-drawer')?.contains(target)) return
  if (modelTriggerEl.value?.contains(target)) return
  modelReturnsFocus = false
  closeModel()
}

function showCursors() {
  commentsOn.value = false
  codeOn.value = false
  clearTimeout(commentsTimer)
  clearTimeout(codeTimer)
  placeCursors()
  cursorsKey.value += 1
  cursorsOn.value = true
  clearTimeout(cursorsTimer)
  cursorsTimer = window.setTimeout(() => {
    cursorsOn.value = false
  }, 6400)
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    if (videoOpen.value) closeVideo()
    else if (open.value) close()
    else if (modelOpen.value) closeModel()
    else closeDrawer()
    return
  }
  if (!open.value) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    go(1)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    go(-1)
  }
}

function syncKeys() {
  window.removeEventListener('keydown', onKeydown)
  if (open.value || videoOpen.value || drawerOpen.value || modelOpen.value) window.addEventListener('keydown', onKeydown)
}

function syncOverflow() {
  document.body.style.overflow = open.value || videoOpen.value ? 'hidden' : ''
}

function go(dir) {
  const el = scrollerEl.value
  if (!el?.clientWidth) return
  const current = Math.round(el.scrollLeft / el.clientWidth)
  const next = Math.min(photos.length - 1, Math.max(0, current + dir))
  settleTo(next * el.clientWidth)
}

function syncMeter() {
  const root = document.scrollingElement || document.documentElement
  const range = root.scrollHeight - root.clientHeight
  const progress = range > 0 ? root.scrollTop / range : 0
  meter.value = Math.min(100, Math.max(0, progress * 100))
  syncIntro(root)
}

function syncIntro(root = document.scrollingElement || document.documentElement) {
  const intro = introEl.value
  if (!intro) return
  const distance = 140
  const t = Math.min(1, Math.max(0, (root.scrollTop - 300) / distance))
  const eased = t * t * (3 - 2 * t)
  intro.style.opacity = (1 - eased).toFixed(3)
  intro.style.setProperty('--intro-scale', (1 - eased * 0.48).toFixed(4))
  intro.style.setProperty('--intro-blur', `${(eased * 18).toFixed(2)}px`)
}

function onScroll() {
  const el = scrollerEl.value
  if (!el || !el.clientWidth) return
  index.value = Math.round(el.scrollLeft / el.clientWidth)
}

function onPointerDown(event) {
  if (event.button || event.pointerType !== 'mouse') return
  if (event.target.closest('button')) return
  cancelAnimationFrame(scrollAnim)
  settling.value = false
  event.preventDefault()
  event.currentTarget.setPointerCapture?.(event.pointerId)
  drag = {
    id: event.pointerId,
    x: event.clientX,
    lastX: event.clientX,
    lastT: performance.now(),
    scroll: scrollerEl.value?.scrollLeft ?? 0,
    vx: 0,
    moved: false,
  }
}

function onPointerMove(event) {
  if (!drag || event.pointerId !== drag.id) return
  const el = scrollerEl.value
  if (!el) return
  const dx = event.clientX - drag.x
  if (!drag.moved && Math.abs(dx) < 3) return
  drag.moved = true
  dragging.value = true
  holdSnap(el, true)
  const now = performance.now()
  const dt = Math.max(8, now - drag.lastT)
  const instant = (event.clientX - drag.lastX) / dt
  drag.vx = drag.vx * 0.65 + instant * 0.35
  drag.lastX = event.clientX
  drag.lastT = now
  const max = Math.max(0, el.scrollWidth - el.clientWidth)
  el.scrollLeft = Math.min(max, Math.max(0, drag.scroll - dx))
}

function onPointerUp(event) {
  if (!drag || event.pointerId !== drag.id) return
  const moved = drag.moved
  const vx = drag.vx
  const origin = drag.scroll
  drag = null
  dragging.value = false
  if (!moved) {
    if (scrollerEl.value) holdSnap(scrollerEl.value, false)
    return
  }
  ignoreClick = true
  const el = scrollerEl.value
  if (!el?.clientWidth) return
  const width = el.clientWidth
  const page = Math.round(origin / width)
  let next = Math.round(el.scrollLeft / width - vx * 0.22)
  next = Math.min(page + 1, Math.max(page - 1, next))
  next = Math.min(photos.length - 1, Math.max(0, next))
  settleTo(next * width)
}

function onScrimClick() {
  if (ignoreClick) {
    ignoreClick = false
    return
  }
  close()
}

watch(modelOpen, async (isOpen) => {
  syncKeys()
  syncOverflow()
  window.removeEventListener('pointerdown', onModelOutsidePointerDown, true)
  if (isOpen) window.addEventListener('pointerdown', onModelOutsidePointerDown, true)
  await nextTick()
  const restore = modelReturnsFocus
  modelReturnsFocus = true
  if (isOpen) modelCloseEl.value?.focus()
  else if (restore) modelTriggerEl.value?.focus()
})

onMounted(() => {
  syncMeter()
  window.addEventListener('scroll', syncMeter, { passive: true })
  meterObserver = new ResizeObserver(syncMeter)
  meterObserver.observe(document.documentElement)
  if (copyEl.value) meterObserver.observe(copyEl.value)
})

watch(open, async (isOpen) => {
  syncKeys()
  syncOverflow()
  await nextTick()
  if (isOpen) closeEl.value?.focus()
})

watch(videoOpen, async (isOpen) => {
  syncKeys()
  syncOverflow()
  await nextTick()
  if (isOpen) videoCloseEl.value?.focus()
})

watch(drawerOpen, async (isOpen) => {
  syncKeys()
  window.removeEventListener('pointerdown', onDrawerOutsidePointerDown, true)
  if (isOpen) window.addEventListener('pointerdown', onDrawerOutsidePointerDown, true)
  await nextTick()
  const restore = drawerReturnsFocus
  drawerReturnsFocus = true
  if (isOpen) drawerCloseEl.value?.focus()
  else if (restore) drawerTriggerEl.value?.focus()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('pointerdown', onDrawerOutsidePointerDown, true)
  window.removeEventListener('pointerdown', onModelOutsidePointerDown, true)
  clearTimeout(commentsTimer)
  clearTimeout(cursorsTimer)
  clearTimeout(codeTimer)
  clearTimeout(closeTimer)
  clearTimeout(videoCloseTimer)
  cancelAnimationFrame(scrollAnim)
  meterObserver?.disconnect()
  window.removeEventListener('scroll', syncMeter)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="stage" :class="{ 'is-open': drawerOpen, 'is-model': modelOpen }">
    <div class="canvas">
    <div class="bottom-fade" aria-hidden="true"></div>
    <div class="read-meter" aria-hidden="true">
      <div
        class="read-meter-bar"
        :style="{ width: meter + '%' }"
      ></div>
    </div>
    <div class="intro">
      <p ref="introEl" class="name type-title-medium">figma.design</p>
    </div>
    <div class="column">
      <article ref="copyEl" class="type-title-medium">
      <p>
        We believe the future of creative work is <mark ref="triggerEl" class="phrase hl hl-lilac" role="button" tabindex="0" :aria-expanded="open" aria-controls="photo-lightbox" @click="toggle" @keydown.enter.prevent="toggle" @keydown.space.prevent="toggle">collaborative, human-centered</mark><span class="anno">(1)</span>, and deeply hands-on. In an era racing to automate, Figma exists to amplify the creative mind—putting <mark ref="videoTriggerEl" class="phrase hl hl-green" role="button" tabindex="0" @click="showCode" @keydown.enter.prevent="showCode" @keydown.space.prevent="showCode">code on the canvas</mark><span class="anno">(2)</span>, keeping direct manipulation at the core, and treating <mark class="phrase hl hl-yellow" role="button" tabindex="0" @click="showComments" @keydown.enter.prevent="showComments" @keydown.space.prevent="showComments">community feedback as a north star</mark><span class="anno">(3)</span>. We’re building the best place on earth to make visual and creative tools: a company of world‑class, low‑ego makers who balance data with craft and intuition, work hard without glorifying burnout, and are led by people who care—about design, about people, and about the long game. Config reflects our heart: we listen, we learn, and we ship what helps the community push the frontier of expression and impact.
      </p>
      <p>
        Join Figma if you want to <mark ref="drawerTriggerEl" class="phrase hl hl-lilac" role="button" tabindex="0" :aria-expanded="drawerOpen" aria-controls="dent-drawer" @click="toggleDrawer" @keydown.enter.prevent="toggleDrawer" @keydown.space.prevent="toggleDrawer">leave a distinct dent</mark><span class="anno">(4)</span>—not just ride a hype cycle. While frontier labs chase automation and singleplayer chat, we’re building expressive, multiplayer tools where <mark class="phrase hl hl-green" role="button" tabindex="0" @click="showCursors" @keydown.enter.prevent="showCursors" @keydown.space.prevent="showCursors">collaboration is the default</mark><span class="anno">(5)</span>. We’re <mark ref="modelTriggerEl" class="phrase hl hl-yellow" role="button" tabindex="0" :aria-expanded="modelOpen" aria-controls="policy-drawer" @click="toggleModel" @keydown.enter.prevent="toggleModel" @keydown.space.prevent="toggleModel">model‑agnostic</mark><span class="anno">(6)</span> on purpose: the landscape changes weekly, and the real moat is product experience, not allegiance to a single model. We value speed, but we prize <mark class="hl hl-cyan">direction and differentiation</mark><span class="anno">(7)</span> even more—because when anyone can move fast, what matters is choosing the right hill and crafting something unmistakably great. This is our <mark class="hl hl-lilac">Figma 2.0 moment</mark><span class="anno">(8)</span>: augmenting, not replacing; designing with and for people; turning underdog spirit into durable invention.
      </p>
      <p>
        Our Design team is a culture of <mark class="hl hl-green">Thoughtful, Curious Makers</mark><span class="anno">(9)</span> who riff together and keep egos out of the room. We ask why before we decide how, we <mark class="hl hl-yellow">CMD+D</mark><span class="anno">(10)</span> and play with ideas, we praise each other quickly, and we sweat the details without taking ourselves too seriously. We don’t overrotate on metrics; we combine signal, craft, and community sense to make better calls. <mark class="hl hl-cyan">The joy of making things</mark><span class="anno">(11)</span>—together—is what binds us: from side projects to shipped features, from rituals to reviews, from sketch to system.
      </p>
      <p>
        If this sounds like you, bring your whole creative self. Be <mark class="hl hl-lilac">AI‑forward</mark><span class="anno">(12)</span> and show how new tools elevate your taste, speed, and range. Think for yourself, show your iterations, and don’t be afraid to <mark class="hl hl-green">build your own tools</mark><span class="anno">(13)</span>—we love makers who expand the medium. Come ready to collaborate in crit jams, lead with humility, and learn fast. Your portfolio speaks loudest here, but your generosity and curiosity seal the deal. If you want to help millions make better things, and you want to do it with leaders and teammates who care as much as you do, <mark class="hl hl-yellow">come build with us</mark><span class="anno">(14)</span>.
      </p>
      <a class="roles" href="https://www.figma.com/careers/" target="_blank" rel="noopener noreferrer">See open roles</a>
      </article>
    </div>
    </div>
    <aside
      id="dent-drawer"
      class="drawer"
      role="dialog"
      aria-label="Behind the scenes"
      :aria-hidden="!drawerOpen"
      :inert="!drawerOpen"
    >
      <div class="drawer-panel">
        <div class="post-list">
          <button v-for="post in posts" :key="post.id" type="button" class="post" @click="openWalkthrough(post)">
            <span class="post-thumb" aria-hidden="true"></span>
            <span class="post-title type-title-medium">{{ post.title }}</span>
          </button>
        </div>
      </div>
      <button ref="drawerCloseEl" type="button" class="close type-title-medium" @click="closeDrawer">Close</button>
    </aside>
    <div
      v-if="shown"
      id="photo-lightbox"
      class="lightbox"
      :class="{ 'is-open': open, 'is-pulling': pulling, 'is-dragging': dragging, 'is-settling': settling }"
      role="dialog"
      aria-modal="true"
      aria-label="Photos"
      :style="{ '--pull': pull + 'px', '--scrim': scrim }"
    >
      <div class="lightbox-scrim"></div>
      <div
        class="lightbox-sheet"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div class="lightbox-bar">
          <button ref="closeEl" type="button" class="lightbox-close" aria-label="Close" @click="close">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1.2 1.2l9.6 9.6M10.8 1.2L1.2 10.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <p class="lightbox-count">{{ index + 1 }} of {{ photos.length }}</p>
        <div ref="scrollerEl" class="lightbox-scroller" @scroll.passive="onScroll">
          <figure v-for="photo in photos" :key="photo.src" class="lightbox-slide" @click="onScrimClick">
            <img :src="photo.src" :alt="photo.alt" draggable="false" @click.stop />
          </figure>
        </div>
      </div>
    </div>
    <div
      v-if="videoShown"
      id="code-film"
      class="lightbox"
      :class="{ 'is-open': videoOpen }"
      role="dialog"
      aria-modal="true"
      :aria-label="videoLabel"
      style="--pull: 0px"
    >
      <div class="lightbox-scrim"></div>
      <div class="lightbox-sheet">
        <div class="lightbox-bar">
          <button ref="videoCloseEl" type="button" class="lightbox-close" aria-label="Close" @click="closeVideo">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1.2 1.2l9.6 9.6M10.8 1.2L1.2 10.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <figure class="lightbox-slide" @click="closeVideo">
          <video
            ref="videoEl"
            :src="videoSrc"
            :title="videoLabel"
            controls
            playsinline
            preload="metadata"
            @click.stop
          ></video>
        </figure>
      </div>
    </div>
    <aside
      id="policy-drawer"
      class="policy-drawer"
      role="dialog"
      aria-label="Model-agnostic and the Figma AI policy"
      :aria-hidden="!modelOpen"
      :inert="!modelOpen"
    >
      <div class="policy-panel">
        <h2 class="policy-term">model-agnostic</h2>
        <p class="policy-pos">adjective</p>
        <p class="policy-def">Not tied to a single model. The landscape changes weekly, so the product is built to keep working as models come and go. The moat is the experience, not allegiance to one lab.</p>
        <h2 class="policy-term">Figma AI policy</h2>
        <p>You keep what you put in and what comes back. Prompts, images, files, and the output — including code — are your content. You hold the rights to both. Figma holds the rights to the platform.</p>
        <p>Training is optional, and an admin holds the switch. Figma uses customer content to train models only when Content Training is on. Turn it off, and content and edits added after that date are not used. Starter and Professional teams start on. Organization and Enterprise start off. Accounts for education and for government are not used for training.</p>
        <p>What you make here does not train someone else’s model. Third-party model providers cannot use content you upload or create in Figma to train their own models. They delete inputs and outputs after processing, and there is no data connection back to the model’s maker.</p>
        <p>Output is a draft. Figma does not check it for accuracy, and it is not Figma’s view. It may not be unique. The same prompt can come back different. You review it before you rely on it.</p>
        <p>Some features act on your behalf, inside Figma or in other systems. Using them authorizes that. You set the access, you watch the task, and you are responsible for what it does.</p>
        <p class="policy-source">
          <a href="https://www.figma.com/legal/ai-terms/" target="_blank" rel="noopener noreferrer">Figma AI Terms</a>
          <span>Effective October 30, 2026</span>
          <a href="https://www.figma.com/ai/our-approach/" target="_blank" rel="noopener noreferrer">How Figma builds AI</a>
        </p>
      </div>
      <button ref="modelCloseEl" type="button" class="close type-title-medium" @click="closeModel">Close</button>
    </aside>
    <div v-if="cursorsOn" :key="cursorsKey" class="cursors-layer" aria-hidden="true">
      <div
        v-for="cursor in cursors"
        :key="cursor.src"
        class="presence"
        :style="{
          left: cursor.x,
          top: cursor.y,
          animationDelay: cursor.d,
          '--dx': cursor.dx,
          '--dy': cursor.dy,
        }"
      >
        <img class="presence-cursor" :src="cursor.src" alt="" />
      </div>
    </div>
    <div v-if="codeOn" :key="codeKey" id="code-takeover" class="code-layer" aria-hidden="true">
      <div class="comments-scrim"></div>
      <CodeTrail />
    </div>
    <div v-if="commentsOn" :key="commentsKey" class="comments-layer" aria-hidden="true">
      <div class="comments-scrim"></div>
      <div
        v-for="comment in comments"
        :key="comment.name"
        class="fig-comment"
        :style="{ left: comment.x, top: comment.y, animationDelay: comment.d }"
      >
        <div class="fig-card">
          <div class="fig-top">
            <span class="fig-avatar" :style="{ background: comment.color, color: comment.ink }">{{ comment.initials }}</span>
            <span class="fig-name">{{ comment.name }}</span>
            <span class="fig-time">{{ comment.time }}</span>
          </div>
          <p class="fig-text">{{ comment.text }}</p>
          <div v-if="comment.reaction" class="fig-reaction">{{ comment.reaction }}</div>
          <div class="fig-reply">Reply</div>
        </div>
      </div>
    </div>
  </div>
  <DialRoot position="top-right" theme="system" />
</template>
