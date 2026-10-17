export const hciResearchCases = {
  millihygro: {
    eyebrow: 'MATERIAL HCI / SHAPE-CHANGING INTERFACE',
    fullTitle: 'MilliHygro: Programmable Milli-Scale Shape-Changing Interfaces via Halftone-Printed Cellophane for Local Moisture Interaction',
    titleZh: '微湿度驱动微米材料形变探究',
    credits: [
      ['投稿状态', 'Status', 'CHI 2027（CCF·A）· 在审', 'CHI 2027 (CCF-A) · Under Review'],
      ['作者顺位', 'Authorship', '第三作者', 'Third Author'],
      ['指导老师', 'Advisor', '王冠云', 'Guanyun Wang'],
    ],
    overview: [
      '项目围绕微湿度驱动的微米级材料形变展开，通过材料表征、设计空间与变形库的系统研究，提炼可复用的设计指南。可穿戴原型进一步展示了这种机制在智能可穿戴设备、触觉交互和环境响应系统中的交互可能性，为局部湿度驱动的形状变化界面提供新的实现路径。',
      'This project investigates milli-scale material deformation driven by localized moisture. Through material characterization, a structured design space, and a library of deformation behaviors, the research develops reusable design guidelines. Wearable prototypes demonstrate how humidity-driven shape change can support smart wearables, tactile interaction, and environmentally responsive systems.',
    ],
    contribution: [
      '我在项目中全程与第一作者讨论并推进研究，共同构建项目逻辑框架；负责大量实验性工作与部分论文图表绘制。同时，我独立搭建了整个 Design Tool 的前后端框架，并给出后续模型更新的完整工作流程。',
      'I worked closely with the first author throughout the project to advance the research and co-develop its overall logic. I conducted substantial experimental work, contributed to figures for the paper, independently built the front-end and back-end framework of the complete Design Tool, and established a full workflow for future model updates.',
    ],
    mediaSections: [],
  },
  pixelfold: {
    eyebrow: 'COMPUTATIONAL FABRICATION / PAPER ROBOTICS',
    fullTitle: 'PixelFold: A Pixelated Paper Robot with Weighted Pixels and a Single-Sheet Unfolding Structure',
    titleZh: '加权像素与单张展开结构的像素化纸机器人',
    credits: [
      ['投稿状态', 'Status', 'CHI 2027（CCF·A）Poster · 拟投', 'CHI 2027 (CCF-A) Poster · Planned Submission'],
      ['作者顺位', 'Authorship', '第一作者', 'First Author'],
      ['指导老师', 'Advisor', '王冠云', 'Guanyun Wang'],
    ],
    overview: [
      'PixelFold 围绕体素化、展开与交互三个部分展开，致力于构建从三维模型处理到折纸结果生成及交互操作的完整设计工具。项目以加权像素和单张展开结构为核心，将三维形态、结构约束与可制造的纸面展开流程组织在同一系统中。',
      'PixelFold connects voxelization, unfolding, and interaction in an integrated design tool that moves from 3D model processing to foldable paper outputs and interactive operation. Centered on weighted pixels and a single-sheet unfolding structure, the system brings together 3D form, structural constraints, and a fabrication-ready paper workflow.',
    ],
    contribution: [
      '我负责整个项目的统筹安排，独立完成加权体素化算法的设计与实现，并对展开算法进行优化，承担大量实验、功能验证和流程完善工作。目前，我正进一步探索展开效果与效率的优化，以及交互功能的设计与实现，持续推进项目整体逻辑与工具框架的完善。',
      'I lead the overall project, independently designed and implemented the weighted voxelization algorithm, optimized the unfolding algorithm, and conducted extensive experiments, functional validation, and workflow refinement. I am continuing to improve unfolding quality and efficiency while designing and implementing the interaction workflow and strengthening the overall tool framework.',
    ],
    mediaSections: [
      {
        code: '03',
        titleZh: '体素化流程',
        titleEn: 'Voxelization Process',
        noteZh: '四张图片依次展示从三维模型输入、加权体素计算到结构生成的关键步骤。',
        noteEn: 'Four images are reserved for the key steps from 3D model input and weighted voxel calculation to structural generation.',
        count: 4,
        labelZh: '流程图',
        labelEn: 'PROCESS',
        labels: [
          ['上传模型', 'MODEL UPLOAD'],
          ['体素化', 'VOXELIZATION'],
          ['贴图', 'TEXTURE MAPPING'],
          ['体素统一', 'VOXEL UNIFICATION'],
        ],
        images: [
          '/assets/02/PixelFold/step/1.png',
          '/assets/02/PixelFold/step/2.png',
          '/assets/02/PixelFold/step/3.png',
          '/assets/02/PixelFold/step/4.png',
        ],
      },
      {
        code: '04',
        titleZh: '生成效果',
        titleEn: 'Generated Outcomes',
        noteZh: '六张图片用于展示不同模型、结构与折叠结果的最终效果。',
        noteEn: 'Six images are reserved for final outcomes across different models, structures, and folded results.',
        count: 6,
        labelZh: '效果图',
        labelEn: 'OUTCOME',
        cropCount: 6,
        cropAspect: '2545 / 1156',
        images: [
          '/assets/02/PixelFold/show/1.png',
          '/assets/02/PixelFold/show/2.png',
          '/assets/02/PixelFold/show/3.png',
          '/assets/02/PixelFold/show/4.png',
          '/assets/02/PixelFold/show/5.png',
          '/assets/02/PixelFold/show/6.png',
        ],
      },
    ],
  },
}
