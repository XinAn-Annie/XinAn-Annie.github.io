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
const wideProjectIds = new Set(['painting-genome', 'little-tiger', 'spatial'])
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

function ResponsivePicture({ src, sizes, ...props }) {
  const data = optimizedMedia.images[src]
  if (!data) return <img src={src} {...props} />
  const srcSet = (variants) => variants?.map((variant) => `${variant.src} ${variant.width}w`).join(', ')
  return (
    <picture>
      {data.avifVariants?.length > 0 && <source type="image/avif" srcSet={srcSet(data.avifVariants)} sizes={sizes} />}
      <source type="image/webp" srcSet={srcSet(data.variants)} sizes={sizes} />
      <img src={data.variants.at(-1).src} width={data.width} height={data.height} {...props} />
    </picture>
  )
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

function InteractiveWord({ children }) {
  return (
    <span className="interactive-word" aria-label={children}>
      {Array.from(children).map((letter, index) => (
        <span key={`${letter}-${index}`} aria-hidden="true">{letter}</span>
      ))}
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
        {project.art === 'factory' ? (
          <div className="video-cover__phone" aria-hidden="true">
            <div className="video-cover__screen">
              <video src={mediaUrl(project.coverVideo)} autoPlay muted loop playsInline preload="metadata" />
              <div className="video-cover__veil" />
            </div>
          </div>
        ) : (
          <>
            <video src={mediaUrl(project.coverVideo)} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
            <div className="video-cover__veil" />
          </>
        )}
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
        <ResponsivePicture src={project.coverImage} sizes="(max-width: 820px) 100vw, 50vw" alt={`${project.titleZh} / ${project.titleEn}`} loading="lazy" />
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
      {project.id !== 'spatial' && <strong>{project.titleEn}</strong>}
      {project.id !== 'spatial' && <span className="artwork__glyph">{project.titleZh.slice(0, 1)}</span>}
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
  const arMedia = [
    ['/media/xiangmai/ar/01-sisters-pavilion.png', '/media/xiangmai/ar/01-fermented-rice-bun-ip.png'],
    ['/media/xiangmai/ar/02-wenbi-peak.png', '/media/xiangmai/ar/02-torreya-ip.png'],
    ['/media/xiangmai/ar/03-jixian-hall.png', '/media/xiangmai/ar/03-sweet-potato-starch-ip.png'],
    ['/media/xiangmai/ar/04-shen-ancestral-hall.png', '/media/xiangmai/ar/04-changpo-tofu-ip.png'],
    ['/media/xiangmai/ar/05-shi-jianwu-hometown.png', '/media/xiangmai/ar/05-rice-ip.png'],
    ['/media/xiangmai/ar/06-zhuomu-workshop.png', '/media/xiangmai/ar/06-kiwifruit-ip.png'],
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
          <div className="xiangmai-website-showcase">
            <div className="xiangmai-website-stack">
              <ProjectMedia item={project.media[4]} index={1} />
              <figure className="xiangmai-function-map">
                <ResponsivePicture src="/media/xiangmai/xiangmai-website-function-map.png" sizes="(max-width: 820px) 100vw, 46vw" alt="文村网站功能结构图" loading="lazy" />
                <figcaption><span>WEBSITE FUNCTION MAP</span><Bilingual zh="文村网站功能结构" en="Website function structure" /></figcaption>
              </figure>
            </div>
            <ProjectMedia item={project.media[1]} index={2} />
          </div>
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
        <div className="xiangmai-placeholder-head"><span>AR IMAGE ARCHIVE</span><p>1 MAP + 6 CULTURAL SITES + 6 IP CHARACTERS</p></div>
        <figure className="xiangmai-ar-map">
          <ResponsivePicture src="/media/xiangmai/ar/ar-guide-map.png" sizes="(max-width: 820px) 100vw, 90vw" alt="乡脉智绘 AR 导览地图" loading="lazy" />
          <figcaption><span>00 / MAP</span><Bilingual zh="文村 AR 导览地图" en="Wencun AR Guide Map" /></figcaption>
        </figure>
        <div className="xiangmai-ar-pairs">
          {content.ar.locations.map(([siteZh, siteEn, productZh, productEn], index) => (
            <article className="xiangmai-ar-pair" key={siteZh}>
              <div className="xiangmai-ar-pair__media">
                <figure>
                  <ResponsivePicture src={arMedia[index][0]} sizes="(max-width: 820px) 58vw, 30vw" alt={`${siteZh} AR 场景预览`} loading="lazy" />
                  <span>AR GUIDE</span>
                </figure>
                <figure>
                  <ResponsivePicture src={arMedia[index][1]} sizes="(max-width: 820px) 38vw, 18vw" alt={`${productZh} IP 形象`} loading="lazy" />
                  <span>IP CHARACTER</span>
                </figure>
              </div>
              <div className="xiangmai-ar-pair__caption"><span>{String(index + 1).padStart(2, '0')}</span><Bilingual zh={`${siteZh} × ${productZh}`} en={`${siteEn} × ${productEn}`} /></div>
            </article>
          ))}
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
            <h3 lang="en">{project.titleEn}</h3>
            <p lang="zh-CN">{project.titleZh}</p>
            <small lang="en">{project.role}</small>
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

      <section className={`digital-case__section ${['little-tiger', 'skills'].includes(project.id) ? 'digital-case__section--spaced' : ''}`}>
        <span className="section-code">02 / DESIGN POSITION</span>
        <div className="digital-case__two-col">
          <Bilingual zh={content.insight[0]} en={content.insight[1]} />
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

    </div>
  )
}

function ResearchMediaPlaceholder({ number, labelZh, labelEn, appendNumber = true, cropAspect, accent, dark, src }) {
  const displayZh = appendNumber ? `${labelZh} ${number}` : labelZh
  const displayEn = appendNumber ? `${labelEn} ${String(number).padStart(2, '0')}` : labelEn
  return (
    <figure className="research-placeholder" style={{ '--accent': accent, '--dark': dark }}>
      {src ? (
        <div
          className={`research-placeholder__canvas research-placeholder__canvas--image ${cropAspect ? 'research-placeholder__canvas--crop' : ''}`}
          style={cropAspect ? { '--crop-aspect': cropAspect } : undefined}
        >
          <ResponsivePicture src={src} sizes="(max-width: 820px) 100vw, 30vw" alt={displayZh} loading="lazy" />
        </div>
      ) : (
        <div className="research-placeholder__canvas" role="img" aria-label={`${displayZh} 占位`}>
          <span className="research-placeholder__axis research-placeholder__axis--x" />
          <span className="research-placeholder__axis research-placeholder__axis--y" />
          <span className="research-placeholder__node research-placeholder__node--a" />
          <span className="research-placeholder__node research-placeholder__node--b" />
          <strong>{String(number).padStart(2, '0')}</strong>
          <small>MEDIA RESERVED</small>
        </div>
      )}
      <figcaption>
        <span>{String(number).padStart(2, '0')}</span>
        <Bilingual zh={displayZh} en={displayEn} />
      </figcaption>
    </figure>
  )
}

function HCIResearchCase({ project }) {
  const content = project.researchCase

  return (
    <div className="research-case" style={{ '--research-accent': project.accent, '--research-dark': project.dark }}>
      <section className="research-case__intro">
        <span className="section-code">{content.eyebrow}</span>
        <h3>{content.fullTitle}</h3>
        <p lang="zh-CN">{content.titleZh}</p>
        <div className="research-case__credits">
          {content.credits.map(([labelZh, labelEn, valueZh, valueEn]) => (
            <article key={`${labelZh}-${valueZh}`}>
              <Bilingual zh={labelZh} en={labelEn} />
              <Bilingual zh={valueZh} en={valueEn} />
            </article>
          ))}
        </div>
      </section>

      <section className="research-case__narrative">
        <span className="section-code">02 / RESEARCH OVERVIEW</span>
        <div className="research-case__copy-grid">
          <div>
            <span>研究概述 / OVERVIEW</span>
            <Bilingual zh={content.overview[0]} en={content.overview[1]} />
          </div>
          <div>
            <span>个人贡献 / CONTRIBUTION</span>
            <Bilingual zh={content.contribution[0]} en={content.contribution[1]} />
          </div>
        </div>
      </section>

      {content.mediaSections.map((section) => (
        <section className="research-case__media" key={section.code}>
          <header>
            <span className="section-code">{section.code} / {section.titleEn}</span>
            <div><h3 lang="zh-CN">{section.titleZh}</h3><p>{section.titleEn}</p></div>
            <Bilingual zh={section.noteZh} en={section.noteEn} />
          </header>
          <div className={`research-case__placeholder-grid research-case__placeholder-grid--${section.count}`}>
            {Array.from({ length: section.count }, (_, index) => (
              <ResearchMediaPlaceholder
                key={`${section.code}-${index}`}
                number={index + 1}
                labelZh={section.labels?.[index]?.[0] ?? section.labelZh}
                labelEn={section.labels?.[index]?.[1] ?? section.labelEn}
                appendNumber={!section.labels?.[index]}
                cropAspect={index < (section.cropCount ?? 0) ? section.cropAspect : undefined}
                accent={project.accent}
                dark={project.dark}
                src={section.images?.[index]}
              />
            ))}
          </div>
        </section>
      ))}

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
                <ResponsivePicture src={frame.src} sizes="(max-width: 820px) 90vw, 900px" alt={frame.label} />
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

function PaintingGenomeCase({ project }) {
  const content = project.paintingGenomeCase
  const [activeAbility, setActiveAbility] = useState(0)
  const active = content.abilities[activeAbility]

  const moveLens = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const artwork = event.currentTarget.querySelector('.genome-lens__artwork').getBoundingClientRect()
    event.currentTarget.style.setProperty('--lens-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`)
    event.currentTarget.style.setProperty('--lens-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`)
    event.currentTarget.style.setProperty('--art-x', `${((event.clientX - artwork.left) / artwork.width) * 100}%`)
    event.currentTarget.style.setProperty('--art-y', `${((event.clientY - artwork.top) / artwork.height) * 100}%`)
  }

  return (
    <article className="genome-case">
      <section className="genome-intro">
        <div className="genome-intro__statement">
          <span className="section-code">01 / PROJECT POSITION</span>
          <Bilingual zh={content.headlineZh} en={content.headlineEn} />
        </div>
        <div className="genome-intro__body">
          <Bilingual zh={content.overviewZh} en={content.overviewEn} />
          <div className="genome-credits">
            {content.credits.map((item) => <article key={item.labelEn}><Bilingual zh={item.labelZh} en={item.labelEn} /><Bilingual zh={item.valueZh} en={item.valueEn} /></article>)}
          </div>
        </div>
      </section>

      <section className="genome-lens">
        <header>
          <div><span className="section-code">02 / VISUAL ENTRY</span><h3>从一幅画进入多重线索</h3><p>One painting, multiple layers of evidence.</p></div>
        </header>
        <div className="genome-lens__stage" onPointerMove={moveLens} tabIndex="0" role="img" aria-label="古画分析镜交互示意，移动指针可探索画面">
          <div className="genome-lens__artwork">
            <img className="genome-lens__base" src="/optimized/painting-genome/magnolia-study.webp" width="1440" height="994" alt="枇杷果枝古画" loading="lazy" />
            <img className="genome-lens__detail" src="/optimized/painting-genome/group-17.webp" width="5760" height="3976" alt="枇杷果枝古画的分析标注" loading="lazy" />
          </div>
          <div className="genome-lens__glass" aria-hidden="true"><span>VISUAL<br />EVIDENCE</span></div>
          <span className="genome-lens__hint">MOVE TO INSPECT / 移动探索</span>
        </div>
      </section>

      <section className="genome-pipeline">
        <span className="section-code">03 / ANALYSIS PIPELINE</span>
        <div className="genome-pipeline__heading"><h3>看见、解析、关联、再理解。</h3><p>SEE · PARSE · CONNECT · INTERPRET</p></div>
        <ol>
          {content.pipeline.map((item) => <li key={item.code}><span>{item.code}</span><strong>{item.zh}</strong><em>{item.en}</em><small>{item.note}</small><MoveRight aria-hidden="true" /></li>)}
        </ol>
      </section>

      <section className="genome-abilities">
        <header>
          <div><span className="section-code">04 / FOUR ABILITIES</span><h3>四种能力，同一条视觉叙事。</h3></div>
          <Bilingual zh="选择一个分析维度，观看真实界面片段。视频为网页轻量版本，原始素材保持不变。" en="Choose an analysis dimension to view the interface in motion. These are web-optimized derivatives; the original footage remains unchanged." />
        </header>
        <div className="genome-console">
          <div className="genome-console__tabs" role="tablist" aria-label="画基因功能演示">
            {content.abilities.map((item, index) => <button
              key={item.code}
              type="button"
              role="tab"
              aria-selected={activeAbility === index}
              aria-controls="genome-ability-panel"
              className={activeAbility === index ? 'genome-console__tab genome-console__tab--active' : 'genome-console__tab'}
              onClick={() => setActiveAbility(index)}
            >
              <span>{item.code}</span><div><strong>{item.titleZh}</strong><small>{item.titleEn}</small></div><MoveRight size={18} />
            </button>)}
          </div>
          <div className="genome-console__panel" id="genome-ability-panel" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div key={active.src} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .42, ease }}>
                <div className="genome-console__screen">
                  <video src={active.src} poster={active.poster} controls autoPlay muted loop playsInline preload="metadata" />
                  <span>{active.signal}</span>
                </div>
                <div className="genome-console__caption"><span>{active.code} / {active.titleEn.toUpperCase()}</span><Bilingual zh={active.descriptionZh} en={active.descriptionEn} /></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </article>
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
              {!project.spatialStudies && !project.filmFrames && !project.paintingGenomeCase && project.id !== 'skills' && <section className="case__film" aria-label={project.introductionVideo ? 'Project introduction video' : 'Project introduction video placeholder'}>
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

              {project.spatialStudies ? <SpatialArchive project={project} /> : project.id === 'graphic-archive' ? <GraphicArchive project={project} /> : project.filmFrames ? <FilmArchive project={project} /> : project.paintingGenomeCase ? <PaintingGenomeCase project={project} /> : project.id === 'xiangmai' ? <XiangmaiCase project={project} /> : project.id === 'dust-remains' ? <DustCase project={project} /> : project.digitalCase ? <DigitalDesignCase project={project} /> : project.researchCase ? <HCIResearchCase project={project} /> : (
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
                <div className="case__next-copy">
                  <p lang="zh-CN">继续观看更多作品</p>
                  <p lang="en">CONTINUE EXPLORING</p>
                </div>
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
          <a href="#work" onClick={() => setMenuOpen(false)}><span>01</span><span>Selected work</span></a>
          <a href="#practice" onClick={() => setMenuOpen(false)}><span>02</span><span>Practice</span></a>
          <a href="#about" onClick={() => setMenuOpen(false)}><span>03</span><span>About</span></a>
          <a href="#contact" onClick={() => setMenuOpen(false)}><span>04</span><span>Contact</span></a>
        </nav>
        <div className="topbar__meta"><span>HANGZHOU / CN</span><span>2026</span></div>
        <button type="button" className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero" id="top">
          <motion.div className="hero__inner" style={{ y: heroY, scale: heroScale }}>
            <div className="hero__note"><span>INTERACTION DESIGNER</span><span>ART & TECHNOLOGY</span></div>
            <h1 className="hero__title"><SplitText><InteractiveWord>Portfolio</InteractiveWord></SplitText></h1>
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
            <div><span className="section-code">01 / SELECTED WORK</span><h2>Work as an <em>open process.</em></h2></div>
            <p>Projects move between cultural storytelling, intelligent tools, material research and digital products. Select a case to enter its visual narrative.</p>
          </Reveal>
          <div className="filters" role="group" aria-label="Filter projects">
            {filters.map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={filter === item ? 'filter filter--active' : 'filter'}><span>{item}</span><small>{item === 'All' ? projects.length : projects.filter((project) => project.category === item).length}</small></button>)}
          </div>
          <motion.div className="project-grid" layout>
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project) => <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProjectCard project={project} onOpen={setSelectedProject} wide={wideProjectIds.has(project.id)} /></motion.div>)}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="practice section" id="practice">
          <Reveal className="practice__intro">
            <span className="section-code">02 / PRACTICE</span>
            <h2>One practice. <em>Four lenses.</em></h2>
          </Reveal>
          <div className="practice__list">
            {[
              ['01', 'Research as a compass', '从真实情境、材料和人的行为出发，让证据决定方向。'],
              ['02', 'Systems as a language', '把复杂内容组织成清晰、可扩展、可理解的结构。'],
              ['03', 'Motion as meaning', '用动画呈现关系、状态与节奏，而不是装饰页面。'],
              ['04', 'Prototypes as questions', '通过可运行的原型不断提问、验证与修正。'],
            ].map(([number, title, text], index) => (
              <motion.article key={title} initial={{ opacity: 0, x: -42 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75, delay: index * 0.08, ease }}>
                <span>{number}</span><h3>{title}</h3><p lang="zh-CN">{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="about section" id="about">
          <article className="about-page about-page--profile">
            <div className="about-page__masthead">
              <span className="section-code">03 / ABOUT ME</span>
              <span>PAGE 01 / 02 · PERSONAL</span>
            </div>

            <Reveal className="about-profile__title">
              <p>HELLO, I’M</p>
              <h2>AN <em>XIN.</em></h2>
            </Reveal>

            <Reveal delay={0.08} className="about-profile__photo">
              <img src="/media/about/an-xin-cutout.png" alt="安馨的个人生活照 / Portrait of An Xin" width="750" height="937" />
            </Reveal>

            <Reveal delay={0.12} className="about-profile__intro">
              <span>PROFILE / 基本信息</span>
              <dl>
                <div><dt><span lang="zh-CN">姓名</span><small>NAME</small></dt><dd><span lang="zh-CN">安馨</span><small>AN XIN</small></dd></div>
                <div><dt><span lang="zh-CN">年龄</span><small>AGE</small></dt><dd><span lang="zh-CN">20 岁</span><small>20 YEARS OLD</small></dd></div>
                <div><dt><span lang="zh-CN">就读</span><small>STUDY</small></dt><dd><span lang="zh-CN">浙江大学</span><small>ZHEJIANG UNIVERSITY</small></dd></div>
                <div><dt><span lang="zh-CN">主修</span><small>MAJOR</small></dt><dd><span lang="zh-CN">艺术与科技</span><small>ART &amp; TECHNOLOGY</small></dd></div>
                <div><dt><span lang="zh-CN">辅修</span><small>MINOR</small></dt><dd><span lang="zh-CN">竺可桢学院创新创业管理强化班</span><small>INNOVATION &amp; ENTREPRENEURSHIP MANAGEMENT · CHU KOCHEN HONORS COLLEGE</small></dd></div>
              </dl>
            </Reveal>

            <Reveal delay={0.18} className="about-profile__hobbies">
              <span>OFF THE CLOCK / 兴趣爱好</span>
              <ul aria-label="兴趣爱好 / Hobbies">
                <li><span lang="zh-CN">猫咪脑袋</span><small>CAT PERSON</small><i>ฅ^•ﻌ•^ฅ</i></li>
                <li><span lang="zh-CN">摄影</span><small>PHOTOGRAPHY</small></li>
                <li><span lang="zh-CN">旅行</span><small>TRAVEL</small></li>
                <li><span lang="zh-CN">爬山</span><small>HIKING</small></li>
                <li><span lang="zh-CN">骑行</span><small>CYCLING</small></li>
                <li><span lang="zh-CN">热爱生活</span><small>LOVING LIFE</small></li>
              </ul>
            </Reveal>

            <p className="about-page__scribble" aria-hidden="true">curious by default!</p>
          </article>

          <article className="about-page about-page--cv">
            <div className="about-page__masthead">
              <span>HONORS + SKILLS</span>
              <span>PAGE 02 / 02 · CV</span>
            </div>

            <Reveal className="about-cv__heading">
              <span>WHAT I’VE EARNED &amp; LEARNED</span>
              <h3>Honors <em>&amp;</em> toolbox.</h3>
            </Reveal>

            <div className="about-cv__columns">
              <section className="about-cv__honors" lang="zh-CN">
                <Reveal className="about-cv__label"><span>01</span><h4>荣誉与奖项</h4></Reveal>
                {[
                  ['2024—2026', '国家奖学金 · 浙江大学一等奖学金', '连续两学年获得'],
                  ['2024—2026', '优秀学生 · 学业优秀标兵 · 创新创业标兵', '含优秀团员、社会工作标兵、劳动实践标兵'],
                  ['2025', '“文化之光”项目优秀通讯员', '寒假社会实践'],
                  ['2025.12', '浙江省大学生运动会徽标设计', '三等奖 · 唯一负责人'],
                  ['2026.04', '蒲公英大学生创新大赛', '三等奖 · 第一负责人'],
                  ['2026.06', '浙江省大学生广告大赛 H5 游戏设计', '三等奖 · 第一负责人'],
                ].map(([year, title, meta], index) => (
                  <Reveal delay={index * 0.035} className="about-cv__honor" key={`${year}-${title}`}>
                    <time>{year}</time><div><h5>{title}</h5><p>{meta}</p></div>
                  </Reveal>
                ))}
              </section>

              <section className="about-cv__skills" lang="zh-CN">
                <Reveal className="about-cv__label"><span>02</span><h4>个人技能</h4></Reveal>
                {[
                  ['研究与项目', '算法开发 · 实验验证 · 交互工具搭建 · 项目推进与迭代'],
                  ['视觉与 UI', 'Illustrator · Photoshop · Figma'],
                  ['编程与计算设计', 'HTML · CSS · JavaScript · Three.js · Python · FastAPI · NumPy · SciPy'],
                  ['三维建模', '酷家乐 · Rhino · Blender'],
                  ['影像制作', '剪映 · After Effects · 相机拍摄 · Lightroom'],
                  ['科研与开发', 'Zotero · Obsidian · Git · GitHub · Visual Studio Code'],
                  ['AI 与 AR', '阿里云百炼 · Coze 智能体 · KiviCube AR'],
                ].map(([title, tools], index) => (
                  <Reveal delay={index * 0.035} className="about-cv__skill" key={title}>
                    <h5>{title}</h5><p>{tools}</p>
                  </Reveal>
                ))}
              </section>
            </div>
          </article>
        </section>
      </main>

      <footer className="footer section" id="contact">
        <span className="section-code">04 / CONTACT</span>
        <h2>Let’s make <em>something memorable.</em></h2>
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
