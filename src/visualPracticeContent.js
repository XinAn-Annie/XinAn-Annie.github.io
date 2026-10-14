const image = (category, slide, picture) => `/media/visual-practice/${category}/slide-${String(slide).padStart(2, '0')}-picture-${String(picture).padStart(3, '0')}.png`

export const spatialStudies = [
  {
    number: '01', title: '麦穗纹样', en: 'Nature pattern',
    description: '以麦穗一面芒刺聚拢、一面须子舒展的形态为创作母题。提炼四组纹样，以不同走向的线性元素串联，再进行重复、重构与旋转。色彩参考彩色玻璃，以蓝青、红橘两组与黄色过渡组织画面。',
    images: [image('spatial', 1, 3), image('spatial', 1, 4), image('spatial', 1, 6), image('spatial', 1, 5)],
  },
  {
    number: '02', title: 'Cube', en: 'Constructing a nested spatial structure',
    description: '20 × 20 × 20 cm。以纸板、木棍与玻璃纸为媒介，裁切与穿插打破正方体边界。彩色塑料片在不同视角下叠合，形成不同深浅的绿色。',
    images: [image('spatial', 2, 3), image('spatial', 2, 2), image('spatial', 2, 4), image('spatial', 2, 5), image('spatial', 2, 6)],
  },
  {
    number: '03', title: 'The Lost Atlantis', en: '9-Square · The Fusion of Materials',
    description: '小组共同完成的材料与空间构成练习。我主要负责塑料棍结构支撑搭建和胶带部分。',
    images: [image('spatial', 3, 2), image('spatial', 3, 3), image('spatial', 3, 1), image('spatial', 3, 4)],
  },
]

export const paintingFrames = [1, 2, 3, 4, 5].map((picture, index) => ({
  src: image('painting', 4, picture),
  label: `手绘作品 ${String(index + 1).padStart(2, '0')}`,
  note: '2024–2025 手绘作品选',
}))

export const photographyFrames = [
  ...[1, 2, 3, 4, 5].map((picture) => ({ src: image('photography', 5, picture), label: '摄影作品', note: '2024–2025 摄影作品选' })),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((picture) => ({ src: image('photography', 6, picture), label: '风光摄影', note: '风光摄影作品选' })),
]

export const graphicFrames = [
  { src: image('graphic-design', 7, 1), label: '潮涌新青年', note: '浙江省大学生运动会徽标设计 · 三等奖', description: '青年于时代浪潮中奔跑，化身为鹰，搏击长空。多彩渐变寓意青春的无限可能。' },
  { src: image('graphic-design', 8, 1), label: '甲卜五辞', note: '甲骨文文创设计', description: '以甲骨文与古代占卜文化为灵感，将文字、占卜和几何图形融入书签设计。' },
  { src: image('graphic-design', 9, 14), label: '香息', note: '米兰设计周展板 · 项目视觉', description: '为非遗制香沉浸式体验项目制作展板，呈现设计背景、用户调研、用户旅程与服务蓝图。' },
  { src: image('graphic-design', 9, 189), label: '香息 · 界面探索', note: '展板原始嵌入图像' },
  { src: image('graphic-design', 9, 211), label: '香息 · 交互界面', note: '展板原始嵌入图像' },
  { src: image('graphic-design', 9, 292), label: '香息 · 场景', note: '展板原始嵌入图像' },
  { src: image('graphic-design', 10, 1), label: '凌云户外俱乐部', note: '秋季纳新海报 · 社团海报设计' },
]
