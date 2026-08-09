export type FinancingTopic = {
  slug: string;
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
  detail: string;
  detailZh: string;
  points: string[];
  pointsZh: string[];
};

export const financingTopics: FinancingTopic[] = [
  {
    slug: "import-po-financing",
    title: "Import and PO Financing",
    titleZh: "进口与采购订单融资",
    summary:
      "Structures that unlock cash flow around confirmed purchase orders and inbound shipments.",
    summaryZh: "围绕确认采购订单与进口货运的融资结构，释放现金流。",
    detail:
      "Import and purchase-order (PO) financing helps importers bridge the gap between placing an order in China and receiving — then selling — goods in East Africa. Once a credible PO and supplier plan are in place, financing partners can support deposits, production balances, or freight so your working capital is not locked for the full lead time.\n\nAMG does not replace your bank. We structure the commercial path — verified suppliers, clear Incoterms, inspection gates, and shipping evidence — so financing conversations are grounded in real cargo and real milestones. That makes it easier for you (and your lender or trade partner) to fund confirmed orders with confidence.\n\nThis solution suits growing distributors and project buyers who win demand ahead of cash, or who need to place larger POs without starving day-to-day operations.",
    detailZh:
      "进口与采购订单（PO）融资，帮助进口商弥合在中国下单与货物抵达东非并销售之间的资金缺口。一旦有可信的采购订单与供应商计划，融资伙伴可支持定金、生产尾款或运费，避免营运资金在整段交期内被占用。\n\nAMG 不替代您的银行。我们把商业路径做扎实——核验供应商、明确贸易术语、设定验货节点与货运凭证——让融资沟通建立在真实货物与真实节点上，便于您（及贷款方或贸易伙伴）更有信心地为确认订单提供资金。\n\n适合订单增长快于现金流的经销商与项目采购方，或需要加大下单规模又不想挤压日常运营资金的买家。",
    points: [
      "Cash-flow support tied to confirmed POs and shipment plans",
      "Commercial documentation ready for bank or trade-partner review",
      "Milestones aligned with production, inspection, and freight",
      "Works alongside AMG sourcing and logistics execution",
    ],
    pointsZh: [
      "与确认订单及运输计划挂钩的现金流支持",
      "便于银行或贸易伙伴审核的商业单证准备",
      "与生产、验货、货运对齐的付款与放款节点",
      "可与 AMG 寻源与物流执行协同推进",
    ],
  },
  {
    slug: "supplier-payment-management",
    title: "Supplier Payment Management",
    titleZh: "供应商付款管理",
    summary:
      "Coordinated deposits, balances, and release schedules tied to inspection and delivery milestones.",
    summaryZh: "与验货及交付节点挂钩的定金、尾款与放款节奏协调。",
    detail:
      "Supplier payment management keeps money movement in step with what actually happens at the factory and on the shipping lane. Instead of wiring large sums on vague promises, you define deposits, progress payments, and final balances against inspection results, packing completion, and document release.\n\nAMG coordinates the operational triggers — QC reports, photos, packing lists, and booking status — so payment schedules stay fair to both sides. Suppliers get clarity on when funds land; buyers keep leverage until quality and readiness are proven.\n\nThis is especially valuable for new supplier relationships, multi-SKU containers, and orders where quality or compliance risk would make a single upfront payment uncomfortable.",
    detailZh:
      "供应商付款管理让资金流转与工厂生产、出运进度同步。与其按模糊承诺大额打款，不如把定金、进度款与尾款绑定在验货结果、完工包装与单证放行等节点上。\n\nAMG 协调运营触发条件——质检报告、照片、装箱单与订舱状态——让付款节奏对双方都公平：供应商清楚何时收款，买家在质量与出货准备达标前仍保留制衡。\n\n尤其适合新供应商关系、多 SKU 拼柜，以及不宜一次性大额预付的高质检或合规风险订单。",
    points: [
      "Payment schedules mapped to inspection and shipping milestones",
      "Clear deposit / balance rules for both buyer and supplier",
      "Operational evidence before major fund releases",
      "Reduces disputes caused by vague payment timing",
    ],
    pointsZh: [
      "付款节奏映射验货与出运节点",
      "买卖双方清晰的定金与尾款规则",
      "大额放款前提供运营证据",
      "减少因付款时间模糊引发的争议",
    ],
  },
  {
    slug: "escrow-services",
    title: "Escrow Services",
    titleZh: "托管服务",
    summary:
      "Funds released against agreed milestones — protecting both buyer and supplier.",
    summaryZh: "按约定节点放款，保障买卖双方。",
    detail:
      "Escrow holds purchase funds with an agreed release process so neither side carries all the risk. The buyer shows seriousness by placing funds; the supplier proceeds knowing payment is secured — but money only moves when milestones such as inspection pass, cargo handover, or document presentation are met.\n\nWe help you design escrow terms that match real logistics: what evidence is required, who confirms it, and what happens if goods fail QC or sailing is delayed. Escrow is not one product for every deal — the right structure depends on order size, trust level, and Incoterms.\n\nUse escrow when you are building trust with a new factory, funding a high-value first order, or need a neutral path between parties who will not accept open account terms.",
    detailZh:
      "托管服务按约定流程保管货款，避免单方承担全部风险。买家通过入金表明诚意，供应商在确认款项有保障后推进生产——但资金仅在验货通过、货物交接或单证提交等节点达成后释放。\n\n我们协助设计贴合真实物流的托管条款：需要哪些证据、由谁确认，以及验货不合格或船期延误时如何处理。托管并非一刀切方案，合适结构取决于订单规模、信任程度与贸易术语。\n\n适合与新工厂建立信任、高价值首单，或双方无法接受赊销时需要中立路径的交易。",
    points: [
      "Neutral fund holding with milestone-based release",
      "Protects buyers from premature full payment",
      "Gives suppliers confidence to produce and ship",
      "Terms designed around inspection and logistics evidence",
    ],
    pointsZh: [
      "中立资金托管，按节点放款",
      "避免买家过早全额付款",
      "增强供应商排产与出货信心",
      "条款围绕验货与物流证据设计",
    ],
  },
  {
    slug: "trade-assurance-risk-mitigation",
    title: "Trade Assurance and Risk Mitigation",
    titleZh: "贸易保障与风险缓释",
    summary:
      "Assurance frameworks plus verification, inspection, and payment design as one control system.",
    summaryZh: "贸易保障框架，结合核验、验货与付款设计，形成完整风控体系。",
    detail:
      "Trade assurance and risk mitigation combine contractual protection with operational controls. Assurance frameworks set expectations for quality, delivery, and remedy if something goes wrong; risk mitigation makes those expectations enforceable through supplier verification, factory audits, pre-shipment inspection, HS/compliance readiness, and payment terms that only unlock when controls pass.\n\nAMG treats assurance and mitigation as one system — not paperwork on one side and logistics on the other. For Uganda-bound cargo this often includes PVoC / UNBS readiness, accurate commercial invoices, and corridor planning so documentary or quality failures do not surface only at the border.\n\nChoose this path when the relationship, product category, or shipment value means a single missed control could wipe out margin — or when you want a repeatable playbook for every China–Africa order.",
    detailZh:
      "贸易保障与风险缓释把合同保护与运营控制结合在一起。保障框架明确质量、交期与出问题时的救济；风险缓释则通过供应商核验、验厂、出货前检验、HS/合规准备，以及仅在控制点通过后才放行的付款条款，让这些约定可执行。\n\nAMG 把保障与缓释视为同一体系——而不是一边只做文件、一边只做物流。对运往乌干达的货物，常包括 PVoC/UNBS 准备、准确商业发票与走廊路径规划，避免质量或单证问题到边境才暴露。\n\n适合关系、品类或货值导致一次失控就可能吞噬利润的场景，或希望为中国—非洲每一票货建立可复制风控流程的买家。",
    points: [
      "Supplier verification and inspection before major commitment",
      "Assurance terms aligned with real shipment milestones",
      "Compliance-aware planning for destination markets",
      "Payment and logistics controls working together",
    ],
    pointsZh: [
      "重大承诺前完成供应商核验与检验",
      "保障条款与真实出运节点对齐",
      "面向目的市场的合规规划",
      "付款与物流控制协同生效",
    ],
  },
];

export function getFinancingTopic(slug: string) {
  return financingTopics.find((t) => t.slug === slug);
}
