import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowUpRight, Github, Menu, MoveRight, Play, X } from 'lucide-react'
import { filters, projects } from './projects.js'
import optimizedMedia from './optimizedMedia.json'

const ease = [0.22, 1, 0.36, 1]
const mediaUrl = (src) => optimizedMedia.videos[src] || optimizedMedia.images[src]?.variants.at(-1)?.src || src

function MediaImage({ src, sizes = '(max-width: 820px) 100vw, 70vw', ...props }) {
  const data = optimizedMedia.images[src]
  if (!data) return <img src={src} {...props} />
  return <img
    src={data.variants.at(-1).src}
    srcSet={data.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', ')}
    sizes={sizes}
    width={data.width}
    height={data.height}
    {...props}
  />
}

function SplitText({ children, delay = 0 }) {
  return (
    <span className="split-line">
      <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, delay, ease }}>
        {children}
      </motion.span>
    </span>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function Bilingual({ zh, en, className = '' }) {
  return (
    <div className={`bilingual ${className}`}>
      <p lang="zh-CN">{zh}</p>
      <p lang="en">{en}</p>
    </div>
  )
}

function Artwork({ project, compact = false, variant = 'gallery' }) {
  if (variant === 'cover' && project.coverVideo) {
    return (
      <div
        className={`artwork artwork--video-cover artwork--${project.art} ${compact ? 'artwork--compact' : ''}`}
        style={{ '--accent': project.accent, '--dark': project.dark }}
        aria-label={`${project.titleEn} motion cover`}
      >
        <video src={mediaUrl(project.coverVideo)} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
        <div className="video-cover__veil" />
        <span className="video-cover__index">{project.index}</span>
        <span className="video-cover__label">MOTION COVER / {project.titleEn}</span>
      </div>
    )
  }

  if (variant === 'cover' && project.coverImage) {
    return (
      <div
        className={`artwork artwork--image-cover artwork--${project.art} ${compact ? 'artwork--compact' : ''}`}
        style={{ '--accent': project.accent, '--dark': project.dark }}
        aria-label={`${project.titleEn} image cover`}
      >
        <MediaImage src={project.coverImage} sizes="(max-width: 820px) 100vw, 50vw" alt={`${project.titleZh} / ${project.titleEn}`} loading="lazy" />
        <div className="video-cover__veil" />
        <span className="video-cover__index">{project.index}</span>
        <span className="video-cover__label">COVER / {project.titleEn}</span>
      </div>
    )
  }

  return (
    <div
      className={`artwork artwork--${project.art} ${compact ? 'artwork--compact' : ''}`}
      style={{ '--accent': project.accent, '--dark': project.dark }}
      aria-label={`Image placeholder for ${project.titleEn}`}
    >
      <div className="artwork__mesh" />
      <div className="artwork__disc artwork__disc--a" />
      <div className="artwork__disc artwork__disc--b" />
      <div className="artwork__scan" />
      <span className="artwork__label">IMAGE PLACEHOLDER</span>
      <span className="artwork__number">{project.index}</span>
      <strong>{project.titleEn}</strong>
      <span className="artwork__glyph">{project.titleZh.slice(0, 1)}</span>
    </div>
  )
}

function ProjectMedia({ item, index }) {
  return (
    <figure className={`case-media case-media--${item.type} ${index === 0 ? 'case-media--featured' : ''}`}>
      {item.type === 'video' ? (
        <video src={mediaUrl(item.src)} poster={mediaUrl(item.poster)} controls playsInline preload="metadata" />
      ) : (
        <MediaImage src={item.src} alt={`${item.label} / ${item.labelEn}`} loading="lazy" />
      )}
      <figcaption>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <Bilingual zh={item.label} en={item.labelEn} />
      </figcaption>
    </figure>
  )
}

function CaseParagraphs({ items }) {
  return <div className="xiangmai-copy">{items.map((item) => <Bilingual key={item.zh} zh={item.zh} en={item.en} />)}</div>
}

function BilingualList({ items, ordered = false }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag className={`xiangmai-list ${ordered ? 'xiangmai-list--ordered' : ''}`}>
      {items.map(([zh, en], index) => <li key={zh}><span>{String(index + 1).padStart(2, '0')}</span><Bilingual zh={zh} en={en} /></li>)}
    </Tag>
  )
}

function XiangmaiHeading({ code, titleZh, titleEn, headingZh, headingEn }) {
  return (
    <header className="xiangmai-heading">
      <span className="section-code">{code} / {titleEn.toUpperCase()}</span>
      <div>
        <h3 lang="zh-CN">{titleZh}</h3>
        <p>{titleEn}</p>
      </div>
      <Bilingual zh={headingZh} en={headingEn} className="xiangmai-heading__statement" />
    </header>
  )
}

function XiangmaiCase({ project }) {
  const content = project.caseStudy
  const arPlaceholders = [
    { key: 'map', zh: 'AR 导览地图', en: 'AR Guide Map', wide: true },
    ...content.ar.locations.map(([zh, en]) => ({ key: `scene-${zh}`, zh: `${zh} AR 导览`, en: `${en} AR Guide` })),
    ...content.ar.locations.map(([zh, en]) => ({ key: `ip-${zh}`, zh: `${zh} IP 形象`, en: `${en} IP Character` })),
  ]

  return (
    <div className="xiangmai-case">
      <section className="xiangmai-intro">
        <div className="xiangmai-intro__titles">
          <Bilingual zh={content.headlineZh} en={content.headlineEn} />
          <Bilingual zh={content.subheadZh} en={content.subheadEn} />
        </div>
        <div className="xiangmai-credits">
          {content.credits.map((credit) => (
            <article key={credit.labelZh}>
              <Bilingual zh={credit.labelZh} en={credit.labelEn} />
              <Bilingual zh={credit.valueZh} en={credit.valueEn} />
            </article>
          ))}
        </div>
      </section>

      <section className="xiangmai-section xiangmai-section--overview">
        <XiangmaiHeading code="02" {...content.overview} />
        <CaseParagraphs items={content.overview.paragraphs} />
        <div className="xiangmai-chain">{content.overview.chain.map(([zh, en], index) => <div key={zh}><span>{String(index + 1).padStart(2, '0')}</span><Bilingual zh={zh} en={en} /></div>)}</div>
      </section>

      <section className="xiangmai-section">
        <XiangmaiHeading code="03" {...content.research} />
        <div className="xiangmai-two-col"><CaseParagraphs items={content.research.paragraphs} /><BilingualList items={content.research.bullets} /></div>
        <div className="xiangmai-flow">{content.research.flow.map(([zh, en], index) => <div key={zh}><span>{String(index + 1).padStart(2, '0')}</span><Bilingual zh={zh} en={en} /></div>)}</div>
      </section>

      <section className="xiangmai-section xiangmai-section--dark">
        <XiangmaiHeading code="04" {...content.database} />
        <div className="xiangmai-two-col"><CaseParagraphs items={content.database.paragraphs} /><BilingualList items={content.database.bullets} /></div>
        <div className="xiangmai-stats">{content.database.stats.map(([value, zh, en]) => <div key={value}><strong>{value}</strong><Bilingual zh={zh} en={en} /></div>)}</div>
        <ProjectMedia item={project.media[0]} index={0} />
      </section>

      <section className="xiangmai-section">
        <XiangmaiHeading code="05" {...content.website} />
        <div className="xiangmai-two-col"><CaseParagraphs items={content.website.paragraphs} /><BilingualList items={content.website.outputs} /></div>
        <div className="xiangmai-platform-media">
          <ProjectMedia item={project.media[2]} index={0} />
          <ProjectMedia item={project.media[4]} index={1} />
          <ProjectMedia item={project.media[1]} index={2} />
        </div>
      </section>

      <section className="xiangmai-section xiangmai-section--ar">
        <XiangmaiHeading code="06" {...content.ar} />
        <CaseParagraphs items={content.ar.paragraphs} />
        <div className="xiangmai-chain">{content.ar.formula.map(([zh, en], index) => <div key={zh}><span>{String(index + 1).padStart(2, '0')}</span><Bilingual zh={zh} en={en} /></div>)}</div>
        <ProjectMedia item={project.media[3]} index={0} />
        <div className="xiangmai-location-table">
          <div className="xiangmai-location-table__head"><span>文化空间 / Cultural Site</span><span>对应文化产品 / Cultural Product</span></div>
          {content.ar.locations.map(([siteZh, siteEn, productZh, productEn], index) => <div key={siteZh}><span>{String(index + 1).padStart(2, '0')}</span><Bilingual zh={siteZh} en={siteEn} /><Bilingual zh={productZh} en={productEn} /></div>)}
        </div>
        <div className="xiangmai-placeholder-head"><span>AR IMAGE ARCHIVE</span><p>1 MAP + 6 AR GUIDES + 6 IP CHARACTERS</p></div>
        <div className="xiangmai-placeholders">
          {arPlaceholders.map((item, index) => <div className={item.wide ? 'xiangmai-placeholder xiangmai-placeholder--wide' : 'xiangmai-placeholder'} key={item.key}><span>IMAGE {String(index + 1).padStart(2, '0')}</span><div>+</div><Bilingual zh={item.zh} en={item.en} /></div>)}
        </div>
      </section>

      <section className="xiangmai-section xiangmai-section--education">
        <XiangmaiHeading code="07" {...content.education} />
        <div className="xiangmai-two-col"><CaseParagraphs items={content.education.paragraphs} /><BilingualList items={content.education.activities} /></div>
        <div className="xiangmai-outcomes">{content.education.outcomes.map(([value, zh, en]) => <article key={value}><strong>{value}</strong><Bilingual zh={zh} en={en} /></article>)}</div>
      </section>
    </div>
  )
}

function DustHeading({ hall }) {
  return (
    <header className="dust-heading">
      <span className="section-code">{hall.code} / EXHIBITION HALL</span>
      <div className="dust-heading__title"><h3 lang="zh-CN">{hall.titleZh}</h3><p>{hall.titleEn}</p></div>
      <Bilingual zh={hall.headingZh} en={hall.headingEn} className="dust-heading__statement" />
    </header>
  )
}

function DustVideo({ src, poster, zh, en }) {
  return (
    <figure className="dust-video">
      <video src={mediaUrl(src)} poster={mediaUrl(poster)} controls playsInline preload="metadata" />
      <figcaption><Bilingual zh={zh} en={en} /></figcaption>
    </figure>
  )
}

function DustCase({ project }) {
  const content = project.caseStudy
  const [hall01, hall02, hall03, hall04] = content.halls

  return (
    <div className="dust-case">
      <section className="dust-intro">
        <div className="dust-intro__cover"><MediaImage src={content.media.cover} alt={`${content.headlineZh} exhibition cover`} /></div>
        <div className="dust-intro__copy">
          <Bilingual zh={content.headlineZh} en={content.headlineEn} />
          <Bilingual zh={content.subheadZh} en={content.subheadEn} />
          <div className="dust-credits">{content.credits.map((credit) => <article key={credit.labelZh}><Bilingual zh={credit.labelZh} en={credit.labelEn} /><Bilingual zh={credit.valueZh} en={credit.valueEn} /></article>)}</div>
        </div>
      </section>

      <section className="dust-overview">
        <XiangmaiHeading code="02" {...content.overview} />
        <CaseParagraphs items={content.overview.paragraphs} />
        <div className="dust-route">{content.overview.route.map(([zh, en], index) => <div key={zh}><span>{String(index + 1).padStart(2, '0')}</span><Bilingual zh={zh} en={en} /></div>)}</div>
        <DustVideo src={content.media.tour} poster={content.media.tourPoster} zh="线上展览导览" en="Online Exhibition Tour" />
      </section>

      <section className="dust-hall dust-hall--moss">
        <DustHeading hall={hall01} />
        <div className="dust-hall__copy"><CaseParagraphs items={hall01.paragraphs} /><blockquote><p>{hall01.quoteZh}</p><p>{hall01.quoteEn}</p></blockquote></div>
        <figure className="dust-wide-image"><MediaImage src={content.media.hall01} alt="Exhibition Hall 1 damage analysis" loading="lazy" /><figcaption>HALL 01 / DAMAGE ATLAS</figcaption></figure>
      </section>

      <section className="dust-hall dust-hall--paper">
        <DustHeading hall={hall02} />
        <CaseParagraphs items={hall02.paragraphs} />
        <div className="dust-characters">
          {hall02.characters.map((character, index) => (
            <article className="dust-character" key={character.nameZh} tabIndex="0">
              <div className="dust-character__visual">
                <MediaImage className="dust-character__front" src={content.media.characters[index].front} alt={`${character.nameZh} character`} loading="lazy" />
                <MediaImage className="dust-character__back" src={content.media.characters[index].back} alt={`${character.nameZh} tool description`} loading="lazy" />
              </div>
              <div className="dust-character__caption"><span>{String(index + 1).padStart(2, '0')}</span><div><Bilingual zh={character.nameZh} en={character.nameEn} /><Bilingual zh={character.descZh} en={character.descEn} /></div></div>
            </article>
          ))}
        </div>
        <figure className="dust-wide-image dust-wide-image--light"><MediaImage src={content.media.arSystem} alt="AR interaction system for restoration tool characters" loading="lazy" /><figcaption>AR INTERACTION / TECHNICAL SYSTEM</figcaption></figure>
      </section>

      <section className="dust-hall dust-hall--smoke">
        <DustHeading hall={hall03} />
        <CaseParagraphs items={hall03.paragraphs} />
        <DustVideo src={content.media.restorerVideo} poster={content.media.restorerPoster} zh="修画人的千年独白" en="A Restorer’s Dialogue Across Time" />
        <div className="dust-process-grid">{content.media.hall03Images.map((src, index) => <figure key={src}><div className="dust-process-grid__media"><MediaImage src={src} alt={`Restoration narrative scene ${index + 1}`} /></div><figcaption>SCENE {String(index + 1).padStart(2, '0')}</figcaption></figure>)}</div>
      </section>

      <section className="dust-hall dust-hall--blue">
        <DustHeading hall={hall04} />
        <div className="dust-hall__copy"><CaseParagraphs items={hall04.paragraphs} /><blockquote><p>{hall04.quoteZh}</p><p>{hall04.quoteEn}</p></blockquote></div>
        <DustVideo src={content.media.hall04Video} poster={content.media.hall04Poster} zh="古画数字修复实践" en="Digital Painting Restoration Practice" />
      </section>

      <section className="dust-keywords">
        <span className="section-code">07 / PROJECT KEYWORDS</span>
        <div>{content.keywords.map(([zh, en], index) => <article key={zh}><span>{String(index + 1).padStart(2, '0')}</span><Bilingual zh={zh} en={en} /></article>)}</div>
      </section>
    </div>
  )
}

function Cursor() {
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const cursorX = useSpring(pointerX, { stiffness: 560, damping: 38 })
  const cursorY = useSpring(pointerY, { stiffness: 560, damping: 38 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const move = (event) => {
      pointerX.set(event.clientX - 8)
      pointerY.set(event.clientY - 8)
    }
    const over = (event) => setActive(Boolean(event.target.closest('a, button, [data-cursor]')))
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
    }
  }, [pointerX, pointerY])

  return <motion.div className={`cursor ${active ? 'cursor--active' : ''}`} style={{ x: cursorX, y: cursorY }} />
}

function Intro() {
  return (
    <motion.div className="intro" exit={{ y: '-100%' }} transition={{ duration: 0.9, ease }}>
      <motion.div className="intro__mark" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        AX
      </motion.div>
      <div className="intro__line"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, ease }} /></div>
      <div className="intro__meta"><span>PORTFOLIO / 2026</span><span>DESIGN × CULTURE × TECHNOLOGY</span></div>
    </motion.div>
  )
}

function ProjectCard({ project, onOpen, wide }) {
  const ref = useRef(null)
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 190, damping: 24 })
  const rotateY = useSpring(tiltY, { stiffness: 190, damping: 24 })

  const move = (event) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    tiltX.set(((event.clientY - rect.top) / rect.height - 0.5) * -4)
    tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 4)
  }

  return (
    <motion.article
      ref={ref}
      className={`project-card ${wide ? 'project-card--wide' : ''}`}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onPointerMove={move}
      onPointerLeave={() => { tiltX.set(0); tiltY.set(0) }}
      initial={{ opacity: 0, y: 72 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.9, ease }}
    >
      <button type="button" onClick={() => onOpen(project)} aria-label={`Open ${project.titleEn} project`}>
        <div className="project-card__visual">
          <Artwork project={project} variant="cover" />
          <span className="project-card__open">OPEN CASE <ArrowUpRight size={15} /></span>
        </div>
        <div className="project-card__head">
          <div className="project-card__title">
            <h3 lang="zh-CN">{project.titleZh}</h3>
            <p lang="en">{project.titleEn}</p>
          </div>
          <span>{project.year}</span>
        </div>
        <Bilingual zh={project.summaryZh} en={project.summaryEn} className="project-card__summary" />
      </button>
    </motion.article>
  )
}

function DigitalDesignCase({ project }) {
  const content = project.digitalCase

  return (
    <div className="digital-case">
      <section className="digital-case__intro">
        <div>
          <Bilingual zh={content.headline[0]} en={content.headline[1]} className="digital-case__headline" />
        </div>
        <div className="digital-case__credits">
          {content.credits.map(([labelZh, labelEn, valueZh, valueEn]) => (
            <article key={labelZh}>
              <Bilingual zh={labelZh} en={labelEn} />
              <Bilingual zh={valueZh} en={valueEn} />
            </article>
          ))}
        </div>
        <div className="digital-case__overview-copy">
          <div className="digital-case__language-column">
            <span>中文 / CHINESE</span>
            <p lang="zh-CN">{content.overview[0]}</p>
          </div>
          <div className="digital-case__language-column digital-case__language-column--english">
            <span>ENGLISH / 英文</span>
            <p lang="en">{content.overview[1]}</p>
          </div>
        </div>
      </section>

      <section className="digital-case__section">
        <span className="section-code">02 / DESIGN POSITION</span>
        <div className="digital-case__two-col">
          <Bilingual zh={content.insight[0]} en={content.insight[1]} className="digital-case__statement" />
          <Bilingual zh={content.contribution[0]} en={content.contribution[1]} />
        </div>
      </section>

      {content.media.length > 0 && (
        <section className="digital-case__section">
          <span className="section-code">03 / VISUAL STORY</span>
          <div className={`case__media-grid digital-case__media-grid ${project.id === 'haoshi' ? 'digital-case__media-grid--haoshi' : ''}`}>
            {content.media.map((item, index) => <ProjectMedia item={item} index={index} key={item.src} />)}
          </div>
        </section>
      )}

      <section className="digital-case__section digital-case__framework">
        <span className="section-code">{content.media.length > 0 ? '04' : '03'} / PROJECT FRAMEWORK</span>
        <div className="digital-case__framework-row">
          <Bilingual zh="真实项目材料" en="Verified project materials" />
          <Bilingual zh="中文叙事" en="Chinese narrative" />
          <Bilingual zh="英文说明" en="English explanation" />
        </div>
      </section>
    </div>
  )
}

function SpatialArchive({ project }) {
  return (
    <div className="spatial-archive">
      <div className="spatial-archive__intro"><span className="section-code">01 / SPATIAL STUDIES</span><p>以自然为依托，以空间为媒介，以材料为手段。</p></div>
      {project.spatialStudies.map((study) => (
        <section className="spatial-study" key={study.number}>
          <div className="spatial-study__heading"><span>{study.number} / 03</span><div><h3>{study.title}</h3><p>{study.en}</p></div><p lang="zh-CN">{study.description}</p></div>
          <div className="spatial-study__images">
            {study.images.map((src, index) => <figure key={src}><MediaImage src={src} alt={`${study.title} · 图 ${index + 1}`} loading="lazy" /><figcaption>{study.title} / {String(index + 1).padStart(2, '0')}</figcaption></figure>)}
          </div>
        </section>
      ))}
    </div>
  )
}

function FilmArchive({ project }) {
  const stripRef = useRef(null)
  const [active, setActive] = useState(0)
  const frames = project.filmFrames

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return undefined
    const wheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || strip.scrollWidth <= strip.clientWidth) return
      const atStart = strip.scrollLeft <= 0 && event.deltaY < 0
      const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2 && event.deltaY > 0
      if (atStart || atEnd) return
      event.preventDefault()
      strip.scrollLeft += event.deltaY
    }
    strip.addEventListener('wheel', wheel, { passive: false })
    return () => strip.removeEventListener('wheel', wheel)
  }, [])

  const goTo = (index) => {
    const next = Math.min(Math.max(index, 0), frames.length - 1)
    stripRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setActive(next)
  }

  const updateActive = () => {
    const strip = stripRef.current
    if (!strip) return
    const center = strip.scrollLeft + strip.clientWidth / 2
    const closest = [...strip.children].reduce((best, child, index) => Math.abs(child.offsetLeft + child.clientWidth / 2 - center) < Math.abs(strip.children[best].offsetLeft + strip.children[best].clientWidth / 2 - center) ? index : best, 0)
    setActive(closest)
  }

  return (
    <section className="film-archive" aria-label={`${project.titleZh}胶片画廊`}>
      <div className="film-archive__top"><span>VIEWFINDER / {project.titleEn.toUpperCase()}</span><span>{String(active + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}</span></div>
      <div className="film-archive__stage">
        <div className="film-archive__sprockets" aria-hidden="true" />
        <div className="film-archive__strip" ref={stripRef} onScroll={updateActive} tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1) } if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1) } }}>
          {frames.map((frame, index) => <figure className="film-frame" key={frame.src}>
            <div className="film-frame__image">{Math.abs(index - active) <= 1 && <MediaImage src={frame.src} alt={frame.label} sizes="(max-width: 820px) 84vw, 820px" />}</div>
            <figcaption><span>{String(index + 1).padStart(2, '0')}</span><strong>{frame.label}</strong><small>{frame.note}</small></figcaption>
          </figure>)}
        </div>
        <div className="film-archive__sprockets" aria-hidden="true" />
      </div>
      <div className="film-archive__controls"><p>滚轮、触控板或方向键浏览作品 / SCROLL TO ADVANCE THE FILM</p><div><button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="上一张作品"><ArrowLeft size={18} /></button><div className="film-archive__progress"><span style={{ width: `${((active + 1) / frames.length) * 100}%` }} /></div><button type="button" onClick={() => goTo(active + 1)} disabled={active === frames.length - 1} aria-label="下一张作品"><MoveRight size={18} /></button></div></div>
      {frames[active]?.description && <p className="film-archive__description" lang="zh-CN">{frames[active].description}</p>}
    </section>
  )
}

function GraphicArchive({ project }) {
  const [active, setActive] = useState(0)
  const displayRef = useRef(null)
  const frames = project.filmFrames
  const frame = frames[active]
  const choose = (index) => {
    setActive(index)
    if (window.matchMedia('(max-width: 820px)').matches) window.requestAnimationFrame(() => displayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <section className="graphic-archive" aria-label="平面设计作品索引">
      <div className="graphic-archive__header"><span className="section-code">01 / GRAPHIC DESIGN INDEX</span><p>点击索引，观看完整画面。</p><span>{String(active + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}</span></div>
      <div className="graphic-archive__layout">
        <div className="graphic-archive__index" role="group" aria-label="选择平面设计作品">
          {frames.map((item, index) => <button
            type="button"
            key={item.src}
            className={index === active ? 'graphic-archive__item graphic-archive__item--active' : 'graphic-archive__item'}
            aria-pressed={index === active}
            onClick={() => choose(index)}
          >
            <span className="graphic-archive__number">{String(index + 1).padStart(2, '0')}</span>
            <span className="graphic-archive__thumb">{Math.abs(index - active) <= 1 && <MediaImage src={item.src} sizes="64px" alt="" />}</span>
            <span className="graphic-archive__item-copy"><strong>{item.label}</strong><small>{item.note}</small></span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>)}
        </div>
        <div className="graphic-archive__display" ref={displayRef} tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); setActive((active + 1) % frames.length) } if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); setActive((active - 1 + frames.length) % frames.length) } }}>
          <div className="graphic-archive__stage">
            <AnimatePresence mode="wait">
              <motion.figure key={frame.src} initial={{ opacity: 0, y: 28, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -22, scale: .98 }} transition={{ duration: .45, ease }}>
                <MediaImage src={frame.src} sizes="(max-width: 820px) 90vw, 900px" alt={frame.label} />
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="graphic-archive__caption">
            <div><span>SELECTED WORK / {String(active + 1).padStart(2, '0')}</span><h3>{frame.label}</h3><p>{frame.note}</p></div>
            <div className="graphic-archive__actions"><button type="button" onClick={() => setActive((active - 1 + frames.length) % frames.length)} aria-label="上一件平面设计作品"><ArrowLeft size={17} /></button><button type="button" onClick={() => setActive((active + 1) % frames.length)} aria-label="下一件平面设计作品"><MoveRight size={17} /></button><a href={frame.src} target="_blank" rel="noreferrer">查看完整原图 <ArrowUpRight size={17} /></a></div>
          </div>
          {frame.description && <p className="graphic-archive__description" lang="zh-CN">{frame.description}</p>}
        </div>
      </div>
    </section>
  )
}

function ProjectView({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined
    document.body.classList.add('locked')
    const escape = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', escape)
    return () => {
      document.body.classList.remove('locked')
      window.removeEventListener('keydown', escape)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="case" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className={`case__page ${project.id === 'haoshi' ? 'case__page--haoshi' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.85, ease }}
          >
            <button type="button" className="case__close" onClick={onClose} aria-label="关闭作品详情"><X /><span>CLOSE</span></button>

            <header className="case__hero" style={{ '--accent': project.accent }}>
              <div className="case__index"><span>CASE {project.index}</span><span>{project.category}</span><span>{project.year}</span></div>
              <div className="case__title">
                <h2 id="case-title" lang="zh-CN">{project.titleZh}</h2>
                <p lang="en">{project.titleEn}</p>
              </div>
              <p className="case__role">{project.role}</p>
            </header>

            <main className="case__content">
              {!project.spatialStudies && !project.filmFrames && <section className="case__film" aria-label={project.introductionVideo ? 'Project introduction video' : 'Project introduction video placeholder'}>
                {project.introductionVideo ? (
                  <figure className="case__intro-video">
                    <video src={mediaUrl(project.introductionVideo)} poster={mediaUrl(project.introductionPoster)} controls playsInline preload="metadata" />
                    <figcaption><span>01 / INTRODUCTION FILM</span><strong>项目介绍视频<br />PROJECT INTRODUCTION</strong></figcaption>
                  </figure>
                ) : (
                  <div className="film-placeholder" style={{ '--accent': project.accent, '--dark': project.dark }}>
                    <div className="film-placeholder__pulse"><Play fill="currentColor" /></div>
                    <div className="film-placeholder__copy">
                      <span>01 / INTRODUCTION FILM</span>
                      <strong>PROJECT VIDEO<br />PLACEHOLDER</strong>
                      <small>项目介绍视频占位 · 16:9</small>
                    </div>
                    <span className="film-placeholder__time">00:00 — 02:30</span>
                  </div>
                )}
              </section>}

              {project.spatialStudies ? <SpatialArchive project={project} /> : project.id === 'graphic-archive' ? <GraphicArchive project={project} /> : project.filmFrames ? <FilmArchive project={project} /> : project.id === 'xiangmai' ? <XiangmaiCase project={project} /> : project.id === 'dust-remains' ? <DustCase project={project} /> : project.digitalCase ? <DigitalDesignCase project={project} /> : (
                <>
                  <section className="case__overview">
                    <span className="section-code">02 / OVERVIEW</span>
                    <Bilingual zh={project.summaryZh} en={project.summaryEn} className="case__summary" />
                    <div className="case__tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </section>

                  <section className="case__gallery">
                    <span className="section-code">03 / VISUAL STORY</span>
                    {project.media?.length ? (
                      <div className="case__media-grid">{project.media.map((item, index) => <ProjectMedia key={item.src} item={item} index={index} />)}</div>
                    ) : (
                      <>
                        <div className="case__image case__image--large"><Artwork project={project} compact /><span>IMAGE 01 / HERO VIEW</span></div>
                        <div className="case__image-row">
                          <div className="case__image"><Artwork project={project} compact /><span>IMAGE 02 / PROCESS</span></div>
                          <div className="case__image"><Artwork project={project} compact /><span>IMAGE 03 / DETAIL</span></div>
                        </div>
                      </>
                    )}
                  </section>

                  <section className="case__chapters">
                    <span className="section-code">04 / CASE STRUCTURE</span>
                    <ol>{project.chapters.map((chapter, index) => <li key={chapter}><span>{String(index + 1).padStart(2, '0')}</span><strong>{chapter}</strong><MoveRight /></li>)}</ol>
                  </section>
                </>
              )}

              <section className="case__next">
                <p>{project.spatialStudies || project.filmFrames ? '继续观看更多作品 / CONTINUE EXPLORING' : project.digitalCase ? '数字设计项目材料 / Digital design project materials' : 'More material will be added as the project archive is prepared.'}</p>
                <button type="button" onClick={onClose}>BACK TO ALL WORK <ArrowLeft /></button>
              </section>
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 28 })
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, 150])
  const heroScale = useTransform(scrollYProgress, [0, 0.22], [1, 0.92])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1250)
    return () => window.clearTimeout(timer)
  }, [])

  const visibleProjects = filter === 'All' ? projects : projects.filter((project) => project.category === filter)

  return (
    <div className="site-shell">
      <AnimatePresence>{loading && <Intro />}</AnimatePresence>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <Cursor />
      <div className="grain" aria-hidden="true" />

      <header className={`topbar ${menuOpen ? 'topbar--open' : ''}`}>
        <a className="brand" href="#top" onClick={() => setMenuOpen(false)}>AX<span>AN XIN</span></a>
        <nav className={menuOpen ? 'nav nav--open' : 'nav'} aria-label="Primary navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>Selected work</a>
          <a href="#practice" onClick={() => setMenuOpen(false)}>Practice</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <div className="topbar__meta"><span>HANGZHOU / CN</span><span>2026</span></div>
        <button type="button" className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero" id="top">
          <motion.div className="hero__inner" style={{ y: heroY, scale: heroScale }}>
            <div className="hero__note"><span>INTERACTION DESIGNER</span><span>ART & TECHNOLOGY</span></div>
            <h1>
              <SplitText>Designing</SplitText>
              <SplitText delay={0.08}><em>living</em> systems</SplitText>
              <SplitText delay={0.16}>for culture <i>&</i> people.</SplitText>
            </h1>
            <div className="hero__bottom">
              <p>Exploring how research, visual language and emerging technology can become meaningful human experiences.</p>
              <a className="hero__scroll" href="#work"><span>EXPLORE WORK</span><ArrowDown /></a>
            </div>
          </motion.div>
          <div className="hero__field" aria-hidden="true">
            <span className="hero__dot hero__dot--1" /><span className="hero__dot hero__dot--2" /><span className="hero__dot hero__dot--3" />
            <div className="hero__arc" />
          </div>
        </section>

        <section className="marquee" aria-label="Design disciplines">
          <div className="marquee__track">
            {[0, 1].map((copy) => <div className="marquee__group" key={copy} aria-hidden={copy === 1}><span>INTERACTION</span><b>✦</b><span>RESEARCH</span><b>✦</b><span>VISUAL SYSTEMS</span><b>✦</b><span>CREATIVE TECHNOLOGY</span><b>✦</b></div>)}
          </div>
        </section>

        <section className="work section" id="work">
          <Reveal className="section-head">
            <div><span className="section-code">01 / SELECTED WORK</span><h2>Work as an<br /><em>open process.</em></h2></div>
            <p>Projects move between cultural storytelling, intelligent tools, material research and digital products. Select a case to enter its visual narrative.</p>
          </Reveal>
          <div className="filters" role="group" aria-label="Filter projects">
            {filters.map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={filter === item ? 'filter filter--active' : 'filter'}><span>{item}</span><small>{item === 'All' ? projects.length : projects.filter((project) => project.category === item).length}</small></button>)}
          </div>
          <motion.div className="project-grid" layout>
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, index) => <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProjectCard project={project} onOpen={setSelectedProject} wide={index % 5 === 0} /></motion.div>)}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="practice section" id="practice">
          <Reveal className="practice__intro">
            <span className="section-code">02 / PRACTICE</span>
            <h2>One practice.<br /><em>Four lenses.</em></h2>
          </Reveal>
          <div className="practice__list">
            {[
              ['01', 'Research as a compass', '从真实情境、材料和人的行为出发，让证据决定方向。'],
              ['02', 'Systems as a language', '把复杂内容组织成清晰、可扩展、可理解的结构。'],
              ['03', 'Motion as meaning', '用动画呈现关系、状态与节奏，而不是装饰页面。'],
              ['04', 'Prototypes as questions', '通过可运行的原型不断提问、验证与修正。'],
            ].map(([number, title, text], index) => (
              <motion.article key={title} initial={{ opacity: 0, x: -42 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75, delay: index * 0.08, ease }}>
                <span>{number}</span><h3>{title}</h3><p lang="zh-CN">{text}</p><ArrowUpRight />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="about section" id="about">
          <span className="section-code">03 / ABOUT</span>
          <div className="about__grid">
            <Reveal><h2>I build bridges<br />between <em>tradition</em><br />and new tools.</h2></Reveal>
            <Reveal delay={0.12} className="about__copy">
              <p>I’m An Xin, an Art & Technology student at Zhejiang University. My work spans interaction design, creative coding, visual communication and material HCI.</p>
              <p lang="zh-CN">我是安馨，关注如何让技术、文化与人的真实体验发生联系，并将复杂系统转化为清晰、有温度、可以被体验的设计。</p>
              <div className="about__facts"><span>BASED IN HANGZHOU</span><span>ART × TECH</span><span>AVAILABLE FOR CONVERSATIONS</span></div>
            </Reveal>
          </div>
          <div className="about__portrait" aria-label="Portrait image placeholder"><span>PORTRAIT<br />PLACEHOLDER</span><small>个人照片占位 / 4:5</small></div>
        </section>
      </main>

      <footer className="footer section" id="contact">
        <span className="section-code">04 / CONTACT</span>
        <h2>Have a question,<br />an idea, or a<br /><em>strange possibility?</em></h2>
        <div className="footer__row">
          <p>Let’s turn it into something that can be seen, touched, tested or remembered.</p>
          <a href="https://github.com/XinAn-Annie" target="_blank" rel="noreferrer">GITHUB <Github /></a>
        </div>
        <div className="footer__meta"><span>© 2026 AN XIN</span><span>DESIGNED WITH CURIOSITY</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>

      <ProjectView project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  )
}

export default App
