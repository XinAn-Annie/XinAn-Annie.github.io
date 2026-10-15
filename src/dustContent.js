export const dustCase = {
  headlineZh: '“画尘未尽”古画线上策展',
  headlineEn: 'Dust, Still Becoming: An Online Exhibition of Chinese Painting Restoration',
  subheadZh: '古画修复 × 体验交互',
  subheadEn: 'Painting Restoration × Interactive Experience',
  credits: [
    { labelZh: '项目背景', labelEn: 'Project Context', valueZh: '大一下《智能设计与软件》课程项目', valueEn: 'Freshman-year course project for Intelligent Design and Software' },
    { labelZh: '荣誉', labelEn: 'Honor', valueZh: '课程作业二等奖', valueEn: 'Second Prize, Course Project' },
    { labelZh: '指导教师', labelEn: 'Advisor', valueZh: '唐谈', valueEn: 'Tang Tan' },
  ],
  overview: {
    titleZh: '项目介绍', titleEn: 'Project Overview', headingZh: '从损伤、修复到数字重生', headingEn: 'From Damage and Repair to Digital Rebirth',
    paragraphs: [
      { zh: '《画尘未尽——古画修复与装裱》以古画修复过程为叙事线索，通过线上策展、AR 交互与数字技术，让观众沉浸式了解古画从损伤、修复到数字重生的完整过程。', en: 'Dust, Still Becoming: Chinese Painting Restoration and Mounting follows the restoration process as its narrative spine. Through an online exhibition, AR interaction and digital media, audiences encounter the complete journey of a painting—from damage and conservation to digital rebirth.' },
      { zh: '项目将传统古画修复工具进行 IP 化设计，并结合交互体验，将传统修复技艺转化为更具趣味性与参与感的数字文化体验。', en: 'Traditional restoration tools are reimagined as character IPs and embedded in interactive experiences, translating specialist craft knowledge into an accessible, playful and participatory digital cultural experience.' },
    ],
    route: [['寻灶', 'Trace the Damage'], ['铸器', 'Forge the Tools'], ['织补', 'Mend Through Time'], ['新生', 'Digital Rebirth']],
  },
  halls: [
    {
      code: '01', titleZh: '寻灶', titleEn: 'Trace the Damage', headingZh: '探寻古画之疮痍', headingEn: 'Reading the Wounds of an Ancient Painting', theme: 'moss',
      paragraphs: [
        { zh: '岁月侵蚀之下，古画承载着时间留下的痕迹。虫蛀、霉变、水渍、褪色与材料老化，使绢帛逐渐脆化，颜料层剥落，昔日山水逐渐失去光彩。', en: 'Time leaves visible wounds on ancient paintings. Insect damage, mold, water stains, fading and material aging weaken silk supports, lift pigment layers and dim once-vivid landscapes.' },
        { zh: '本展厅展示古画常见损伤类型，包括材料老化、物理损伤以及不当修复造成的问题，引导观众了解古画保护与修复的重要性。', en: 'The first hall introduces material deterioration, physical damage and problems caused by improper interventions, helping visitors understand why conservation begins with careful diagnosis.' },
      ],
      quoteZh: '虫蠹啃噬墨痕，霉斑漫漶朱砂。先寻病灶，探病因，方能让古画重拾春风。',
      quoteEn: 'Insects consume the ink; mold clouds the cinnabar. Only by locating the wound and tracing its cause can a painting recover its spring.',
    },
    {
      code: '02', titleZh: '铸器', titleEn: 'Forge the Tools', headingZh: '修复工具的灵兽化身', headingEn: 'Restoration Tools Reimagined as Spirit Companions', theme: 'paper',
      paragraphs: [
        { zh: '古画修复离不开传统工具的协作。本展厅将浆筛、马蹄刀、棕刷、排刷、压板、竹起子等修复工具进行拟人化设计，创造六个 IP 角色。', en: 'Painting conservation depends on a coordinated set of traditional tools. This hall personifies six of them—the paste sieve, horseshoe knife, palm brush, row brush, pressing board and bamboo lifter—as a cast of restoration companions.' },
        { zh: '通过 AR 交互展示，观众能够与修复工具 IP 进行互动，了解不同工具在古画修复流程中的作用，让传统修复技艺以数字化方式被重新感知。', en: 'AR brings the characters into the visitor’s space, revealing how each tool contributes to the restoration workflow and allowing traditional craft to be perceived anew through digital interaction.' },
      ],
      characters: [
        { nameZh: '排小刷', nameEn: 'Pai Xiaoshua / Row Brush', descZh: '以排刷为原型，辅助清洗与刷平画面。', descEn: 'Based on the row brush, assisting with cleaning and flattening the painting surface.' },
        { nameZh: '浆筛筛奶奶', nameEn: 'Grandma Jiangshai / Paste Sieve', descZh: '以浆筛为原型，负责筛滤浆糊，为补画奠定基础。', descEn: 'Filters restoration paste through a fine sieve, preparing a clean adhesive base for repair.' },
        { nameZh: '马小刀', nameEn: 'Ma Xiaodao / Horseshoe Knife', descZh: '以马蹄刀为原型，精准裁切纸张、绢、绫等修复材料。', descEn: 'Precisely cuts paper, silk and patterned mounting materials used in restoration.' },
        { nameZh: '竹小起', nameEn: 'Zhu Xiaoqi / Bamboo Lifter', descZh: '以竹起子为原型，处理纸张粘连等修复问题。', descEn: 'Uses a thin bamboo edge to separate adhered paper layers without damaging the painting core.' },
        { nameZh: '棕毛毛', nameEn: 'Zong Maomao / Palm Brush', descZh: '以棕刷为原型，均匀刷浆，使补纸与古画贴合。', descEn: 'Applies even pressure so repair paper bonds closely and smoothly to the original work.' },
        { nameZh: '压小胖', nameEn: 'Ya Xiaopang / Pressing Board', descZh: '以压板为原型，压实画面，消除气泡与褶皱。', descEn: 'Presses the repaired surface firmly, removing trapped air and wrinkles.' },
      ],
    },
    {
      code: '03', titleZh: '织补', titleEn: 'Mend Through Time', headingZh: '听修画人的千年独白', headingEn: 'A Restorer’s Dialogue Across a Thousand Years', theme: 'smoke',
      paragraphs: [
        { zh: '古画修复不仅是一项技术，更是一场与时间的对话。本展厅通过 AI 漫画与实拍视频结合，呈现古画修复师面对残损画作时的工作过程。', en: 'Painting restoration is not only a technical practice but also a dialogue with time. AI-generated visual storytelling is paired with documentary footage to portray the restorer’s encounter with a damaged work.' },
        { zh: '观众将跟随修复师视角，了解从病损观察、材料选择，到补缀、装裱的完整流程，感受传统工艺背后的耐心与匠心。', en: 'Visitors follow the restorer’s perspective from condition assessment and material selection to infilling, mending and mounting, encountering the patience and judgment embedded in the craft.' },
      ],
    },
    {
      code: '04', titleZh: '新生', titleEn: 'Digital Rebirth', headingZh: '数字技术赋予古画新的生命', headingEn: 'Digital Technology Gives Ancient Paintings New Life', theme: 'blue',
      paragraphs: [
        { zh: '二十一世纪，数字技术与 AI 模型正当时。在斑驳墨痕与褪色绢素之间，通过数字修复与智能技术，重新寻找沉淀千年的色彩记忆。', en: 'In the twenty-first century, digital tools and AI models offer new ways to recover color memories held within faded silk and weathered ink.' },
        { zh: '本展厅展示古画数字修复流程，包括古画修复软件与 Photoshop 修复实践，并呈现《滕王阁图》等古画修复成果。', en: 'The final hall presents a digital restoration workflow using purpose-built software and Photoshop, together with restored outcomes including the painting View of Prince Teng’s Pavilion.' },
      ],
      quoteZh: '于像素经纬之间，让失色峰峦重沐烟霞，让沉寂千年的文明重新焕发生机。',
      quoteEn: 'Across the warp and weft of pixels, faded peaks recover their mist and a civilization silent for centuries finds new life.',
    },
  ],
  keywords: [['古画修复', 'Painting Restoration'], ['数字策展', 'Digital Curation'], ['AR 交互', 'AR Interaction'], ['IP 设计', 'Character IP Design'], ['AI 辅助修复', 'AI-assisted Restoration'], ['传统文化数字化', 'Digitizing Traditional Culture']],
  media: {
    cover: '/media/dust-remains/dust-cover.png',
    teaser: '/media/dust-remains/dust-teaser.mp4', teaserPoster: '/media/dust-remains/dust-teaser-poster.jpg',
    tour: '/media/dust-remains/dust-exhibition-tour.mp4', tourPoster: '/media/dust-remains/dust-exhibition-tour-poster.jpg',
    hall01: '/media/dust-remains/hall-01-damage-overview.png',
    arSystem: '/media/dust-remains/hall-02-ar-system.png',
    characters: Array.from({ length: 6 }, (_, index) => ({ front: `/media/dust-remains/hall-02-character-${index + 1}-front.png`, back: `/media/dust-remains/hall-02-character-${index + 1}-back.png` })),
    hall03Images: [6, 1, 2, 3, 4, 5].map((index) => `/media/dust-remains/hall-03-process-${index}.${index === 3 || index === 4 || index === 5 ? 'jpg' : 'png'}`),
    restorerVideo: '/media/dust-remains/hall-03-restorer-story.mp4', restorerPoster: '/media/dust-remains/hall-03-restorer-story-poster.jpg',
    hall04Video: '/media/dust-remains/hall-04-digital-restoration.mp4', hall04Poster: '/media/dust-remains/hall-04-digital-restoration-poster.jpg',
  },
}
