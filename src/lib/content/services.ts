export type Service = {
  slug: string;
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
  body: string;
  bodyZh: string;
  image: string;
};

export const serviceTabOrder = [
  "air-freight",
  "sea-freight",
  "product-sourcing",
  "procurement-management",
  "supplier-verification",
  "factory-audits",
  "quality-inspection",
  "trade-financing-support",
  "express-shipping",
  "customs-clearance",
  "door-to-door",
] as const;

export const services: Service[] = [
  {
    slug: "product-sourcing",
    title: "Product sourcing",
    titleZh: "产品寻源",
    summary: "Supplier sourcing and negotiation across global markets.",
    summaryZh: "全球供应商寻源与谈判。",
    body: "We identify manufacturers that match your specifications, volume, and quality targets — then negotiate pricing and lead times on your behalf.",
    bodyZh: "我们根据规格、数量与质量目标匹配工厂，并代表您谈判价格与交期。",
    image: "/images/services/product-sourcing.jpg",
  },
  {
    slug: "procurement-management",
    title: "Procurement management",
    titleZh: "采购管理",
    summary: "End-to-end procurement oversight from PO to delivery.",
    summaryZh: "从订单到交付的端到端采购管理。",
    body: "Dedicated procurement managers coordinate purchase orders, production follow-up, and logistics so your team stays focused on growth.",
    bodyZh: "专属采购经理协调订单、生产跟进与物流，让您专注业务增长。",
    image: "/images/services/procurement-management.jpg",
  },
  {
    slug: "supplier-verification",
    title: "Supplier verification",
    titleZh: "供应商核验",
    summary: "Legitimacy and capability checks before you commit.",
    summaryZh: "下单前核验供应商合法性与能力。",
    body: "We verify business licenses, production capacity, export history, and commercial references to reduce supplier risk.",
    bodyZh: "核验营业执照、产能、出口记录与商业信誉，降低供应商风险。",
    image: "/images/services/supplier-verification.jpg",
  },
  {
    slug: "factory-audits",
    title: "Factory audits",
    titleZh: "工厂审核",
    summary: "On-site inspections and capability assessments.",
    summaryZh: "现场验厂与能力评估。",
    body: "Our China-based teams conduct structured factory audits covering quality systems, compliance, and operational readiness.",
    bodyZh: "中国团队开展结构化验厂，覆盖质量体系、合规与运营能力。",
    image: "/images/services/factory-audits.jpg",
  },
  {
    slug: "quality-inspection",
    title: "Quality inspection",
    titleZh: "质量检验",
    summary: "Pre-shipment inspection before cargo leaves the factory.",
    summaryZh: "出货前检验，确保质量。",
    body: "Inspect against your AQL and packing standards so defects are caught before freight is booked.",
    bodyZh: "按您的 AQL 与包装标准检验，避免带缺陷货物出运。",
    image: "/images/services/quality-inspection.jpg",
  },
  {
    slug: "trade-financing-support",
    title: "Trade financing support",
    titleZh: "贸易融资支持",
    summary: "Payment protection and financing guidance.",
    summaryZh: "支付保障与融资指导。",
    body: "We guide escrow, letters of credit, and structured payment milestones that protect both buyers and suppliers.",
    bodyZh: "指导托管、信用证与阶段性付款安排，保障买卖双方。",
    image: "/images/services/trade-financing-support.jpg",
  },
  {
    slug: "air-freight",
    title: "Air freight",
    titleZh: "空运",
    summary: "Fast shipping for time-critical cargo.",
    summaryZh: "时效敏感货物的快速空运。",
    body: "Priority air consolidation and door-to-airport or door-to-door options across major China–Africa lanes.",
    bodyZh: "中非主要航线优先空运拼货，支持机场到门或门到门。",
    image: "/images/services/air-freight.jpg",
  },
  {
    slug: "sea-freight",
    title: "Sea freight",
    titleZh: "海运",
    summary: "Cost-effective ocean shipping and consolidation.",
    summaryZh: "经济高效的海运与拼箱。",
    body: "FCL and LCL services with warehouse consolidation in Guangzhou and reliable East Africa port routing.",
    bodyZh: "整柜与拼箱服务，广州仓拼货，东非港口线路稳定可靠。",
    image: "/images/services/sea-freight.jpg",
  },
  {
    slug: "express-shipping",
    title: "Express shipping",
    titleZh: "快递运输",
    summary: "Urgent deliveries when every day counts.",
    summaryZh: "争分夺秒的紧急交付。",
    body: "Express lanes for samples, critical spare parts, and high-value parcels with full tracking visibility.",
    bodyZh: "样品、关键备件与高价值包裹的快递通道，全程可追踪。",
    image: "/images/services/express-shipping.jpg",
  },
  {
    slug: "customs-clearance",
    title: "Customs clearance",
    titleZh: "清关",
    summary: "Import and export documentation support.",
    summaryZh: "进出口单证与清关支持。",
    body: "HS classification guidance, duty estimation, and clearance coordination at origin and destination.",
    bodyZh: "HS 归类指导、关税估算，以及起运地与目的地清关协调。",
    image: "/images/services/customs-clearance.jpg",
  },
  {
    slug: "door-to-door",
    title: "Door-to-door delivery",
    titleZh: "门到门交付",
    summary: "End-to-end logistics from factory floor to your warehouse.",
    summaryZh: "从工厂到仓库的端到端物流。",
    body: "One partner owns pickup, export, ocean/air, clearance, and last-mile delivery into Uganda and beyond.",
    bodyZh: "提货、出口、海空运、清关到乌干达及周边末公里，一站完成。",
    image: "/images/services/door-to-door.jpg",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getServicesForTabs() {
  return serviceTabOrder
    .map((slug) => getService(slug))
    .filter((s): s is Service => Boolean(s));
}
