'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleHelp, Globe2, Menu, Moon, Satellite, Sun, Waves, X } from 'lucide-react'

const creators = [
  { name: 'Anandhu Krishnan', role: 'Project lead', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-14%20at%2019.22.34-JMqO1KGAaVAyOIB22BpsUwjYWNAOKE.jpeg', detail: 'Bringing the mission, the people and the story into focus.' },
  { name: 'Alen Shince', role: 'Research & development', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-14%20at%2018.24.47-Q62Cs6eWO7VfpJ5BoqhW5Z9kwC906A.jpeg', detail: 'Turning satellite observations into meaningful signals.' },
  { name: 'Christy Rony', role: 'Data & science', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cb59d7e4-ea1d-47b5-9fa9-95a17ffdd9ef-WW7HneCrHnkJYLcNVglRUwUDrNe0DM.jpeg', detail: 'Exploring what radar can reveal about a changing Earth.' },
  { name: 'Abhirami Achary', role: 'Experience & design', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6bbde60b-8fc0-4e65-a4dc-dc8058b83865-l9m46MBishZDQyNsWcRWrLkZ6Tcaj6.jpeg', detail: 'Making complex earth science clear, inviting and human.' },
  { name: 'Jaya Neeraja S', role: 'Story & impact', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-15%20at%2010.49.07-ndEa6gH71S1LFg5VRcizvLWADHjRlu.jpeg', detail: 'Connecting global observations to the communities they touch.' },
]

const chapters = [
  { n: '01', title: 'A planet in motion.', text: 'Earth is always changing. Most of that change is too gradual, too vast, or too subtle to notice from the ground.', stat: 'EVERY DAY', label: 'the surface shifts' },
  { n: '02', title: 'See beneath the surface.', text: 'Synthetic Aperture Radar sends pulses through clouds and darkness, then listens for the echoes. It measures change with remarkable precision.', stat: 'DAY & NIGHT', label: 'through clouds' },
  { n: '03', title: 'Two frequencies. One Earth.', text: 'NASA’s L-band and ISRO’s S-band see the world differently. Together, they reveal more about ecosystems, water and the ground beneath us.', stat: 'L + S', label: 'complementary radar' },
]

export default function Page() {
  const [dark, setDark] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCreator, setActiveCreator] = useState(0)

  useEffect(() => {
    const saved = window.localStorage.getItem('sar-pulse-theme')
    const useDark = saved ? saved === 'dark' : !window.matchMedia('(prefers-color-scheme: light)').matches
    setDark(useDark)
    document.documentElement.classList.toggle('light', !useDark)
    document.documentElement.classList.toggle('dark', useDark)
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible')
    }), { threshold: 0.16 })
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    const updateProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight
      document.documentElement.style.setProperty('--scroll', range > 0 ? String(window.scrollY / range) : '0')
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    window.localStorage.setItem('sar-pulse-theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('light', !next)
    document.documentElement.classList.toggle('dark', next)
  }

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="SAR-Pulse home"><span className="brand-mark"><Satellite size={17} /></span><span>SAR<span className="brand-dash">—</span>PULSE</span></a>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
          <button onClick={() => goTo('mission')}>The mission</button><button onClick={() => goTo('how-it-works')}>How it works</button><button onClick={() => goTo('impact')}>Why it matters</button><button onClick={() => goTo('crew')}>Our team</button>
        </nav>
        <div className="top-actions"><span className="mission-pill"><i /> NASA × ISRO · NISAR</span><button className="icon-button theme-button" onClick={toggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
      </header>

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-image" /><div className="hero-shade" />
        <div className="hero-meta"><span><span className="live-dot" /> EARTH OBSERVATION / 01</span><span>NASA · ISRO · 2026</span></div>
        <div className="hero-content"><p className="eyebrow"><span className="eyebrow-line" />A new perspective on our living planet</p><h1 id="hero-title">The ground<br />beneath <em>us</em><span className="period">.</span></h1><p className="hero-copy">A changing world leaves a signal. Meet the space mission learning how to read it.</p><div className="hero-actions"><button className="button-primary" onClick={() => goTo('mission')}>Explore the mission <ArrowDownRight size={16} /></button><span className="hero-note"><span className="tiny-orbit">↗</span> SCROLL TO DISCOVER</span></div></div>
        <div className="hero-caption"><span>01 / 05</span><span className="caption-line" /><span>OBSERVE · UNDERSTAND · ACT</span></div>
        <div className="hero-coordinates">34°03′N&nbsp; 118°15′W<br />EARTH · ORBIT 752 KM</div>
      </section>

      <section className="mission section-pad" id="mission">
        <div className="section-kicker reveal"><span>01</span><span className="kicker-rule" /><span>THE MISSION</span></div>
        <div className="mission-grid"><div className="reveal"><p className="eyebrow accent-text">A new way to watch the world</p><h2>Some of Earth’s biggest stories happen <em>quietly.</em></h2></div><div className="mission-description reveal"><p>Ground can rise and fall by millimetres. Floodwater can redraw a coastline overnight. Forests can change long before the change is visible from the road.</p><p>NISAR is built to notice. A joint mission by NASA and ISRO, it will scan nearly all of Earth’s land and ice every 12 days—making a dynamic planet easier to understand.</p><a className="text-link" href="https://nisar.jpl.nasa.gov/" target="_blank" rel="noreferrer">Meet the NISAR mission <ArrowUpRight size={15} /></a></div></div>
        <div className="mission-facts reveal"><div className="fact"><span className="fact-number">12<span>d</span></span><span className="fact-label">REPEAT CYCLE<br />near-global coverage</span></div><div className="fact"><span className="fact-number">2</span><span className="fact-label">RADAR BANDS<br />L-band + S-band</span></div><div className="fact"><span className="fact-number">24<span>cm</span></span><span className="fact-label">L-BAND WAVELENGTH<br />deeper vegetation insight</span></div><div className="fact fact-note"><Globe2 size={20} /><span>One shared view<br />of our changing Earth.</span></div></div>
      </section>

      <section className="story" id="how-it-works">
        <div className="story-visual"><div className="story-visual-backdrop" /><div className="radar-grid" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="radar-center"><div className="radar-core"><Satellite size={24} strokeWidth={1.4} /></div></div><div className="radar-signal signal-one" /><div className="radar-signal signal-two" /><div className="visual-label label-top">NISAR / SAR SCAN</div><div className="visual-label label-bottom">L-BAND + S-BAND // 12-DAY CYCLE</div><div className="visual-coordinate">34.0522° N<br />118.2437° W</div></div>
        <div className="story-copy"><div className="section-kicker reveal"><span>02</span><span className="kicker-rule" /><span>HOW IT WORKS</span></div><div className="story-intro reveal"><p className="eyebrow accent-text">A signal from space</p><h2>Radar doesn’t<br />wait for <em>sunlight.</em></h2><p>Unlike cameras, radar sees through clouds and in darkness. It sends a signal to Earth and measures what comes back—detecting changes that are almost impossible to see with the naked eye.</p></div><div className="story-steps">{chapters.map((chapter) => <article className="story-step reveal" key={chapter.n}><span className="step-number">{chapter.n}</span><div><h3>{chapter.title}</h3><p>{chapter.text}</p></div><span className="step-stat">{chapter.stat}<small>{chapter.label}</small></span></article>)}</div></div>
      </section>

      <section className="bands section-pad" id="impact"><div className="section-kicker reveal"><span>03</span><span className="kicker-rule" /><span>TWO VIEWS. MORE DETAIL.</span></div><div className="bands-heading reveal"><h2>Different wavelengths.<br /><em>Deeper understanding.</em></h2><p>Like listening to Earth in two distinct tones, NISAR’s paired radars bring complementary strengths to a shared global picture.</p></div><div className="band-cards"><article className="band-card band-l reveal"><div className="band-top"><span className="band-tag"><span className="band-dot" /> NASA · L-BAND</span><span className="band-wavelength">~24 cm</span></div><div className="wave-graphic wave-long"><Waves size={88} strokeWidth={0.7} /></div><div className="band-copy"><span className="band-index">01 / LONGER WAVELENGTH</span><h3>See through<br />the canopy.</h3><p>L-band radar can penetrate vegetation to reveal what’s happening beneath forest canopies—supporting insight into biomass, ice and ground movement.</p></div><div className="band-footer"><span>DEEPER PENETRATION</span><ArrowUpRight size={16} /></div></article><article className="band-card band-s reveal"><div className="band-top"><span className="band-tag"><span className="band-dot" /> ISRO · S-BAND</span><span className="band-wavelength">~9 cm</span></div><div className="wave-graphic wave-short"><Waves size={88} strokeWidth={0.7} /></div><div className="band-copy"><span className="band-index">02 / SHORTER WAVELENGTH</span><h3>Notice the<br />finer texture.</h3><p>S-band adds sensitivity to finer surface structures, complementing L-band for a richer view of vegetation, soil and surface change.</p></div><div className="band-footer"><span>FINER SURFACE DETAIL</span><ArrowUpRight size={16} /></div></article></div></section>

      <section className="impact-story section-pad"><div className="impact-top reveal"><div><div className="section-kicker"><span>04</span><span className="kicker-rule" /><span>FROM SIGNAL TO SIGNIFICANCE</span></div><h2>Measure change.<br /><em>Make it matter.</em></h2></div><p>When we can see change clearly, we can ask better questions—and make more informed decisions for the places and people who depend on a healthy planet.</p></div><div className="impact-grid"><article className="impact-card impact-flood reveal"><div className="impact-card-bg" /><div className="impact-number">01</div><div className="impact-card-copy"><span>WATER & EXTREME EVENTS</span><h3>When water<br />moves in.</h3><p>Track floods and changing coastlines, even when clouds hide the view.</p></div><ArrowUpRight className="impact-arrow" size={18} /></article><article className="impact-card impact-forest reveal"><div className="impact-card-bg" /><div className="impact-number">02</div><div className="impact-card-copy"><span>ECOSYSTEMS & ICE</span><h3>Living systems<br />in motion.</h3><p>Observe forests, glaciers and the landscapes that sustain us.</p></div><ArrowUpRight className="impact-arrow" size={18} /></article><article className="impact-card impact-ground reveal"><div className="impact-card-bg" /><div className="impact-number">03</div><div className="impact-card-copy"><span>GROUND & INFRASTRUCTURE</span><h3>A slower kind<br />of change.</h3><p>Notice gradual land movement and the evolving ground beneath communities.</p></div><ArrowUpRight className="impact-arrow" size={18} /></article></div><div className="data-note reveal"><span className="data-indicator"><Check size={12} /></span><p><strong>Built on open science.</strong> NISAR data will be freely available to researchers, decision-makers and curious minds everywhere.</p><a href="https://www.earthdata.nasa.gov/" target="_blank" rel="noreferrer">Explore Earthdata <ArrowUpRight size={14} /></a></div></section>

      <section className="closing section-pad"><div className="closing-orbit" /><div className="closing-content reveal"><span className="closing-kicker"><span className="live-dot" /> ONE PLANET. MANY SIGNALS.</span><h2>Look closer.<br />See <em>the change.</em></h2><p>We built SAR-Pulse to make a powerful new view of Earth feel a little more human—and a lot more possible.</p><button className="button-primary" onClick={() => goTo('crew')}>Meet the people behind it <ArrowDownRight size={16} /></button></div><div className="closing-index">A NASA SPACE APPS CHALLENGE PROJECT<br />EARTH OBSERVATION · 2026</div></section>

      <footer className="crew-footer" id="crew"><div className="footer-head"><div><div className="section-kicker"><span>05</span><span className="kicker-rule" /><span>THE PEOPLE BEHIND THE PULSE</span></div><h2>Made by people<br />who <em>look closer.</em></h2></div><div className="crew-controls"><p>Five perspectives.<br />One shared curiosity.</p><div className="control-buttons"><button className="icon-button" onClick={() => setActiveCreator((activeCreator + creators.length - 1) % creators.length)} aria-label="Previous creator"><ArrowLeft size={16} /></button><button className="icon-button" onClick={() => setActiveCreator((activeCreator + 1) % creators.length)} aria-label="Next creator"><ArrowRight size={16} /></button></div></div></div><div className="crew-grid">{creators.map((creator, index) => <article className={`creator-card ${index === activeCreator ? 'creator-active' : ''}`} key={creator.name} onMouseEnter={() => setActiveCreator(index)}><div className="creator-image-wrap"><img src={creator.image} alt={`Portrait of ${creator.name}`} loading="lazy" /><span className="creator-index">0{index + 1}</span><span className="creator-image-arrow"><ArrowUpRight size={16} /></span></div><div className="creator-info"><p className="creator-role">{creator.role}</p><h3>{creator.name}</h3><p className="creator-detail">{creator.detail}</p></div></article>)}</div><div className="footer-bottom"><a className="brand" href="#home"><span className="brand-mark"><Satellite size={16} /></span><span>SAR<span className="brand-dash">—</span>PULSE</span></a><p>Dancing with the SARs · NASA Space Apps Challenge</p><span className="footer-credit">NASA / JPL-CALTECH · ISRO · EARTHDATA</span><a className="back-top" href="#home">BACK TO TOP <ArrowUpRight size={13} /></a></div></footer>
      <div className="scroll-progress" aria-hidden="true"><span /></div>
    </main>
  )
}
