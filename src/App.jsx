import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Github, Menu, X } from 'lucide-react'
import { filters, projects } from './projects.js'

const ease = [0.22, 1, 0.36, 1]

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function MagneticLink({ href, children, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18 })
  const springY = useSpring(y, { stiffness: 260, damping: 18 })

  const move = (event) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.22)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.22)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.a>
  )
}

function ProjectVisual({ project, compact = false }) {
  return (
    <div
      className={`project-visual ${compact ? 'project-visual--compact' : ''}`}
      style={{ '--accent': project.accent, '--ink': project.ink }}
      aria-hidden="true"
    >
      <div className="project-visual__grid" />
      <div className="project-visual__orb project-visual__orb--one" />
      <div className="project-visual__orb project-visual__orb--two" />
      <div className="project-visual__ring" />
      <span className="project-visual__index">AX/{project.index}</span>
      <span className="project-visual__word">{project.english}</span>
      <span className="project-visual__symbol">{project.title.slice(0, 1)}</span>
    </div>
  )
}

function TiltCard({ project, onOpen }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 180, damping: 22 })
  const rotateY = useSpring(ry, { stiffness: 180, damping: 22 })

  const move = (event) => {
    const rect = ref.current.getBoundingClientRect()
    rx.set(((event.clientY - rect.top) / rect.height - 0.5) * -7)
    ry.set(((event.clientX - rect.left) / rect.width - 0.5) * 7)
  }

  return (
    <motion.article
      ref={ref}
      className="project-card"
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={move}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
      initial={{ opacity: 0, y: 54 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.8, ease }}
    >
      <button className="project-card__button" onClick={() => onOpen(project)} aria-label={`打开 ${project.title} 项目详情`}>
        <div className="project-card__media">
          <ProjectVisual project={project} />
          <span className="project-card__view">View case <ArrowUpRight size={16} /></span>
        </div>
        <div className="project-card__meta">
          <div>
            <span className="eyebrow">{project.category}</span>
            <h3>{project.title}</h3>
          </div>
          <span className="project-card__number">{project.index}</span>
        </div>
        <p>{project.summary}</p>
      </button>
    </motion.article>
  )
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined
    const close = (event) => event.key === 'Escape' && onClose()
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', close)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', close)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.7, ease }}
          >
            <button className="modal__close" onClick={onClose} aria-label="关闭项目详情"><X /></button>
            <div className="modal__hero">
              <div className="modal__heading">
                <span className="eyebrow">Case study · {project.category}</span>
                <h2 id="project-title">{project.title}</h2>
                <p className="modal__english">{project.english}</p>
              </div>
              <ProjectVisual project={project} compact />
            </div>
            <div className="modal__body">
              <div>
                <span className="eyebrow">Overview</span>
                <p className="modal__summary">{project.summary}</p>
                <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <div>
                <span className="eyebrow">Story structure</span>
                <ol className="chapter-list">
                  {project.chapters.map((chapter, index) => (
                    <li key={chapter}><span>{String(index + 1).padStart(2, '0')}</span>{chapter}</li>
                  ))}
                </ol>
              </div>
            </div>
            <p className="modal__notice">当前为结构预览版。项目图片、时间、角色和团队分工将在公开前逐项核对并补充。</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  const [filter, setFilter] = useState('全部')
  const [selectedProject, setSelectedProject] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cursorActive, setCursorActive] = useState(false)
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const cursorX = useSpring(pointerX, { stiffness: 520, damping: 34 })
  const cursorY = useSpring(pointerY, { stiffness: 520, damping: 34 })
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 160])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.25])

  useEffect(() => {
    const move = (event) => {
      pointerX.set(event.clientX - 8)
      pointerY.set(event.clientY - 8)
    }
    const over = (event) => setCursorActive(Boolean(event.target.closest('a, button')))
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
    }
  }, [pointerX, pointerY])

  const visibleProjects = filter === '全部' ? projects : projects.filter((project) => project.category === filter)

  return (
    <div className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <motion.div className={`cursor ${cursorActive ? 'cursor--active' : ''}`} style={{ x: cursorX, y: cursorY }} />
      <div className="noise" aria-hidden="true" />

      <header className={menuOpen ? 'topbar topbar--menu' : 'topbar'}>
        <a className="brand" href="#top" aria-label="返回首页">安馨<span>/ AN XIN</span></a>
        <nav className={menuOpen ? 'nav nav--open' : 'nav'} aria-label="主导航">
          {['Work', 'Practice', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="打开导航">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <motion.div className="hero__content" style={{ y: heroY, opacity: heroOpacity }}>
            <div className="hero__kicker"><span className="status-dot" /> Available for conversations · Hangzhou</div>
            <h1>
              <span>Designing</span>
              <span className="hero__serif">between</span>
              <span>culture <i>&</i> code.</span>
            </h1>
            <div className="hero__footer">
              <p>Designer working across AI, interaction and culture. 把复杂技术转化为可理解、可体验的设计。</p>
              <MagneticLink href="#work" className="round-link" aria-label="浏览作品"><ArrowDownRight /></MagneticLink>
            </div>
          </motion.div>
          <div className="hero__orbit hero__orbit--one" aria-hidden="true" />
          <div className="hero__orbit hero__orbit--two" aria-hidden="true" />
        </section>

        <section className="ticker" aria-label="能力方向">
          <div className="ticker__track">
            {[0, 1].map((copy) => (
              <div key={copy} className="ticker__group" aria-hidden={copy === 1}>
                <span>Interaction Design</span><b>✦</b><span>AI Prototyping</span><b>✦</b><span>Visual Storytelling</span><b>✦</b><span>Material HCI</span><b>✦</b>
              </div>
            ))}
          </div>
        </section>

        <section className="work section" id="work">
          <Reveal className="section-heading">
            <div><span className="eyebrow">Selected work · 01—08</span><h2>Ideas made<br/><em>tangible.</em></h2></div>
            <p>从数字产品到材料界面，从文化叙事到 AI 原型。每个项目都从一个具体问题开始。</p>
          </Reveal>

          <div className="filters" role="group" aria-label="作品分类">
            {filters.map((item) => (
              <button key={item} className={filter === item ? 'filter filter--active' : 'filter'} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>

          <motion.div className="project-grid" layout>
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project) => (
                <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <TiltCard project={project} onOpen={setSelectedProject} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="practice section" id="practice">
          <Reveal className="section-heading section-heading--light">
            <div><span className="eyebrow">Design practice</span><h2>Four lenses,<br/><em>one practice.</em></h2></div>
            <p>以人为主导，以技术为媒介。我的工作不止于界面，而是从研究、系统、叙事到原型的连续过程。</p>
          </Reveal>
          <div className="practice-list">
            {[
              ['01', 'Interaction & Product', '从真实情境与行为出发，构建设计逻辑、流程与体验。'],
              ['02', 'Creative Coding & AI', '用可运行的原型检验概念，让技术成为设计材料。'],
              ['03', 'Visual Communication', '通过图形、动效与叙事结构，让复杂信息清晰可感。'],
              ['04', 'Research & Strategy', '把分散证据转译为机会空间、系统框架与行动方向。'],
            ].map(([number, title, text], index) => (
              <motion.article key={title} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.7, ease }}>
                <span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowUpRight />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="about section" id="about">
          <Reveal className="about__label"><span className="eyebrow">About / 关于我</span></Reveal>
          <div className="about__grid">
            <Reveal><p className="about__statement">Curious about how technology can feel <em>human.</em></p></Reveal>
            <Reveal delay={0.12} className="about__copy">
              <p>我是安馨，浙江大学艺术与科技专业学生。我的实践横跨交互与产品设计、创意编程、AI 原型、视觉传播和材料 HCI。</p>
              <p>我关注如何把技术、文化与人的真实体验连接起来，并通过清晰的系统结构和有温度的视觉语言，将复杂技术转化为可理解、可体验的设计。</p>
              <a href="https://github.com/XinAn-Annie" target="_blank" rel="noreferrer">GitHub profile <ArrowUpRight size={17} /></a>
            </Reveal>
          </div>
        </section>

        <section className="archive" aria-label="创作归档">
          <p>Creative archive</p>
          <div className="archive__words">
            <span>Spatial</span><i>✦</i><span>Painting</span><i>✦</i><span>Photography</span><i>✦</i><span>Visual Experiments</span>
          </div>
          <p className="archive__note">Archive imagery will be added after public-use review.</p>
        </section>
      </main>

      <footer className="footer section" id="contact">
        <span className="eyebrow">Next conversation</span>
        <h2>Let’s make<br/><em>something alive.</em></h2>
        <div className="footer__bottom">
          <p>目前公开联系入口暂使用 GitHub，邮箱和公开版 CV 待确认后补充。</p>
          <MagneticLink href="https://github.com/XinAn-Annie" className="contact-link">GitHub <Github size={22} /></MagneticLink>
        </div>
        <div className="footer__meta"><span>© 2026 AN XIN</span><a href="#top">Back to top <ArrowLeft size={14} /></a></div>
      </footer>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  )
}

export default App
