export const paintingGenomeCase = {
  headlineZh: '让古画成为可探索的视觉知识。',
  headlineEn: 'Turning historic paintings into explorable visual knowledge.',
  overviewZh: '参考《ArtEyer: Enriching GPT-based agents with contextual data visualizations for fine art authentication》的视觉驱动、知识解析与交互体验理念，构建面向古画学习、研究与鉴赏的多模态智能平台。用户上传古画图像后，可在同一界面中探索色彩、题跋、印章与技法线索，并结合大语言模型及外部知识库获得辅助解读。',
  overviewEn: 'Inspired by ArtEyer’s visual, contextual and interactive approach, Painting Genome is a multimodal platform for learning from and researching historic Chinese paintings. It brings color, inscription, seal and technique cues into one exploratory interface, with optional language-model and external-knowledge support.',
  credits: [
    { labelZh: '项目周期', labelEn: 'Duration', valueZh: '2025.06—2026.10', valueEn: 'June 2025—October 2026' },
    { labelZh: '指导老师', labelEn: 'Advisor', valueZh: '唐谈', valueEn: 'Tang Tan' },
    { labelZh: '个人职责', labelEn: 'Role', valueZh: '独立完成模型训练、后端搭建与 Debug 调试', valueEn: 'Independent model training, backend development and debugging' },
  ],
  pipeline: [
    { code: '01', zh: '上传古画', en: 'Upload painting', note: 'IMAGE INPUT' },
    { code: '02', zh: '视觉解析', en: 'Visual parsing', note: 'COLOR · TEXT · SEAL · TECHNIQUE' },
    { code: '03', zh: '知识补充', en: 'Knowledge grounding', note: 'LLM · EXTERNAL KNOWLEDGE' },
    { code: '04', zh: '交互探索', en: 'Interactive reading', note: 'VISUAL EVIDENCE' },
  ],
  abilities: [
    {
      code: '01', titleZh: '颜色分析', titleEn: 'Color Analysis',
      src: '/optimized/painting-genome/ability-color.mp4', poster: '/optimized/painting-genome/ability-color-poster.jpg',
      descriptionZh: '通过 K-means 聚类提取画面代表色，呈现色彩分布，并辅助推测原始色彩。',
      descriptionEn: 'K-means clustering extracts representative colors, visualizes their distribution and supports cautious inference about original colors.',
      signal: 'K-MEANS / COLOR DISTRIBUTION',
    },
    {
      code: '02', titleZh: '题跋文字', titleEn: 'Inscription Text',
      src: '/optimized/painting-genome/ability-inscription.mp4', poster: '/optimized/painting-genome/ability-inscription-poster.jpg',
      descriptionZh: '以自训练模型定位题跋区域，再衔接文字识别，为图像内容与文本语境的联合分析提供线索。',
      descriptionEn: 'A custom-trained detector locates inscription regions before text recognition, connecting visual content with textual context.',
      signal: 'DETECTION / OCR PIPELINE',
    },
    {
      code: '03', titleZh: '印章检测', titleEn: 'Seal Detection',
      src: '/optimized/painting-genome/ability-seal.mp4', poster: '/optimized/painting-genome/ability-seal-poster.jpg',
      descriptionZh: '识别画面中的印章区域，将位置线索纳入作品信息的综合阅读。',
      descriptionEn: 'Seal regions are detected and positioned as additional visual evidence for contextual reading.',
      signal: 'REGION DETECTION / EVIDENCE',
    },
    {
      code: '04', titleZh: '技法分析', titleEn: 'Technique Analysis',
      src: '/optimized/painting-genome/technique-analysis-4444.mp4', poster: '/optimized/painting-genome/ability-technique-poster.jpg',
      descriptionZh: '结合画面线索与模型分析展示技法相对倾向，作为学习与鉴赏的辅助信息。',
      descriptionEn: 'Visual cues and model analysis present relative technique tendencies as supporting information for study and appreciation.',
      signal: 'RELATIVE TENDENCY / VISUAL CUES',
    },
  ],
}
