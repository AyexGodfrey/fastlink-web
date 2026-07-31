export type IndustryProject = {
  name: string;
  nameZh: string;
  result: string;
  resultZh: string;
};

export type Industry = {
  slug: string;
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
  body: string;
  bodyZh: string;
  image: string;
  projects: IndustryProject[];
};

export const industries: Industry[] = [
  {
    slug: "electronics-and-machinery",
    title: "Electronics and Machinery",
    titleZh: "电子与机械设备",
    summary:
      "Electronics, industrial machines, and manufacturing equipment.",
    summaryZh: "电子产品、工业机械与制造设备。",
    body: "From consumer electronics and components to general industrial and manufacturing machinery, we source, inspect, and move cargo with packing and documentation suited to each product — including ESD-aware handling for electronics and secure crating for machines and plant equipment.",
    bodyZh:
      "从消费电子与元器件，到通用工业与制造机械，我们按品类完成寻源、验货与运输——电子产品注重防静电包装，机械与厂房设备则采用稳固打托与加固。",
    image: "/images/industries/electronics-and-machinery.jpg",
    projects: [
      {
        name: "Kampala retail electronics replenishment",
        nameZh: "坎帕拉零售电子补货",
        result: "Monthly LCL consolidation with QC before seal — 98% sellable rate on arrival.",
        resultZh: "每月拼箱并在封柜前质检，到货可售率 98%。",
      },
      {
        name: "PCB prototype air lane",
        nameZh: "PCB 样品空运通道",
        result: "5-day China–Entebbe express for engineering samples.",
        resultZh: "工程样品中国至恩德培 5 日快递通道。",
      },
      {
        name: "CNC workshop equipment import",
        nameZh: "数控车间设备进口",
        result: "Sea freight and site delivery for machining centers and spare parts kits.",
        resultZh: "加工中心与备件套件海运及工地交付。",
      },
    ],
  },
  {
    slug: "construction",
    title: "Construction",
    titleZh: "建筑",
    summary: "Equipment, fixtures, and building materials.",
    summaryZh: "设备、配件与建材。",
    body: "Heavy and oversized cargo expertise for contractors importing machinery, steel products, and site materials.",
    bodyZh: "为承包商进口机械、钢材与工地材料提供重货与超尺货物能力。",
    image: "/images/industries/construction.jpg",
    projects: [
      {
        name: "Tower crane components — Mombasa corridor",
        nameZh: "塔吊部件 — 蒙巴萨走廊",
        result: "Out-of-gauge sea move with bonded trucking into Kampala.",
        resultZh: "超限海运并经保税汽运进入坎帕拉。",
      },
    ],
  },
  {
    slug: "agriculture",
    title: "Agriculture",
    titleZh: "农业",
    summary: "Farm machinery and agri supplies.",
    summaryZh: "农机与农资。",
    body: "We support importers of irrigation systems, processing equipment, and farm inputs with duty-aware planning.",
    bodyZh: "为灌溉系统、加工设备与农资进口商提供关税规划支持。",
    image: "/images/industries/agriculture.jpg",
    projects: [
      {
        name: "Irrigation pumps for eastern Uganda",
        nameZh: "乌干达东部灌溉泵",
        result: "Supplier audit + sea freight with spare-parts kit consolidation.",
        resultZh: "供应商审核 + 海运并拼装备件套件。",
      },
    ],
  },
  {
    slug: "renewable-energy",
    title: "Renewable energy",
    titleZh: "可再生能源",
    summary: "Solar products and energy equipment.",
    summaryZh: "太阳能产品与能源设备。",
    body: "Panels, inverters, batteries, and mounting systems — sourced and cleared with HS-aware documentation.",
    bodyZh: "组件、逆变器、电池与支架系统——按 HS 归类完成寻源与清关。",
    image: "/images/industries/renewable-energy.jpg",
    projects: [
      {
        name: "1MW solar kit import",
        nameZh: "1MW 光伏套件进口",
        result: "HS-aligned clearance and warehouse staging in Kampala.",
        resultZh: "HS 对齐清关并在坎帕拉仓暂存分拨。",
      },
    ],
  },
  {
    slug: "automotive",
    title: "Automotive",
    titleZh: "汽车",
    summary: "Parts and accessories for workshops and distributors.",
    summaryZh: "汽配与经销配件。",
    body: "Reliable replenishment lanes for aftermarket parts with multi-SKU packing and clear commercial invoices.",
    bodyZh: "售后配件稳定补货通道，支持多 SKU 包装与清晰商业发票。",
    image: "/images/industries/automotive.jpg",
    projects: [
      {
        name: "Aftermarket filter program",
        nameZh: "滤清器售后项目",
        result: "Quarterly sea consolidations with barcode carton labels.",
        resultZh: "季度海运拼箱并条码箱唛。",
      },
    ],
  },
  {
    slug: "consumer-goods",
    title: "Consumer goods",
    titleZh: "消费品",
    summary: "Retail-ready products for African markets.",
    summaryZh: "面向非洲市场的零售商品。",
    body: "We help brands and traders bring fashion, home, and FMCG products from China factories to store shelves.",
    bodyZh: "帮助品牌与贸易商将服装、家居与快消从中国工厂运至门店。",
    image: "/images/industries/consumer-goods.jpg",
    projects: [
      {
        name: "Homewares retail launch",
        nameZh: "家居零售上市",
        result: "Sourcing + QC + door delivery for 42 SKUs in one container.",
        resultZh: "42 个 SKU 寻源、质检与门到门整柜交付。",
      },
    ],
  },
  {
    slug: "medical-equipment",
    title: "Medical equipment",
    titleZh: "医疗设备",
    summary: "Healthcare products with careful handling.",
    summaryZh: "医疗健康产品的精细运输。",
    body: "Temperature-aware packing guidance and documentation support for clinics and distributors.",
    bodyZh: "为诊所与经销商提供温控包装指导与单证支持。",
    image: "/images/industries/medical-equipment.jpg",
    projects: [
      {
        name: "Clinic diagnostic devices",
        nameZh: "诊所诊断设备",
        result: "Air freight with shock-sensor packing and priority clearance.",
        resultZh: "空运并防震传感包装，优先清关。",
      },
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
