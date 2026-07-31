export type KnowledgeArticle = {
  slug: string;
  category: string;
  title: string;
  titleZh: string;
  excerpt: string;
  excerptZh: string;
  body: string;
  bodyZh: string;
};

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: "uganda-pvoc-certificate-of-conformity",
    category: "PVoC / Standards",
    title: "What is PVoC in Uganda?",
    titleZh: "乌干达 PVoC 是什么？",
    excerpt:
      "PVoC is Uganda's pre-export inspection programme requiring a Certificate of Conformity (CoC) for many regulated imports before they leave the export country.",
    excerptZh:
      "PVoC 是乌干达的装运前检验制度，许多受管制进口货物须在出口国取得合格证明（CoC）后方可发运。",
    body: "PVoC (Pre-Export Verification of Conformity) is Uganda's programme—administered under the Uganda National Bureau of Standards (UNBS)—to check that regulated imports meet compulsory Uganda Standards before they leave the country of export.\n\nIn practice, many regulated products with a Free on Board (FOB) value of about USD 2,000 or more need a Certificate of Conformity (CoC) issued by a UNBS-appointed inspection body in the export country. Used motor vehicles follow a related road-worthiness track (Certificate of Road Worthiness).\n\nApplications are commonly lodged through the Uganda Electronic Single Window (UESW), where you select an authorised PVoC service provider. Typical steps: apply → document review → inspection and/or testing against applicable standards → CoC issuance → present CoC at Ugandan entry with your commercial documents.\n\nIf goods that should have been under PVoC arrive without a CoC, UNBS may require destination inspection and a surcharge commonly described as 15% of CIF value, plus inspection fees—an expensive delay you can avoid with planning.\n\nSome categories may be exempt (for example certain EAC-origin goods or specific industrial machinery not for resale). Exemptions are rule-based—confirm with UNBS or your clearing partner before assuming you are exempt.\n\nFast Link tip: decide PVoC early in the China procurement timeline. Build CoC lead time into production and booking so the container does not sail while paperwork is incomplete.\n\nThis guide is educational and based on publicly described UNBS/PVoC practice. Requirements change—always verify current rules with UNBS and your licensed clearing agent.",
    bodyZh:
      "PVoC（装运前合格评定）是乌干达国家标准局（UNBS）主导的制度，要求受管制进口货物在出口国即符合乌干达强制性标准。\n\n实务中，许多受管制产品在离岸价（FOB）约 2,000 美元及以上时，需由 UNBS 指定检验机构在出口国出具合格证明（CoC）。二手车则走相关的道路适航证明路径。\n\n申请通常通过乌干达电子单一窗口（UESW）提交并选择授权 PVoC 服务商。典型流程：申请 → 单证审核 → 检验/检测 → 出具 CoC → 入境时与商业单证一并提交。\n\n本应做 PVoC 却无 CoC 到港的货物，可能面临目的地检验，并常被描述为按 CIF 货值约 15% 加收附加费及检验费——延误与成本都很高。\n\n部分品类可能豁免（如特定东非共同体原产货物或不用于转售的工业设备等），豁免有明确条件，切勿自行假设。\n\nFast Link 建议：在中国采购排期中尽早纳入 PVoC，把出证时间算进生产与订舱，避免货已开航单证未齐。\n\n本文仅供教育参考，以公开的 UNBS/PVoC 实践说明为依据；规则会更新，请以 UNBS 及持牌清关代理的最新要求为准。",
  },
  {
    slug: "unbs-import-inspection-clearance",
    category: "PVoC / Standards",
    title: "What is the difference between PVoC and destination inspection in Uganda?",
    titleZh: "乌干达 PVoC 与目的地检验有什么区别？",
    excerpt:
      "PVoC checks goods in the export country before shipment; destination inspection happens on arrival in Uganda—often for lower-value goods or when no CoC was issued.",
    excerptZh:
      "PVoC 在出口国装运前检验；目的地检验在乌干达到港后进行——常见于低货值货物或未持 CoC 到港的情况。",
    body: "The key difference is timing and location: PVoC happens in the export country for regulated goods above the applicable value threshold, while destination inspection happens on arrival—especially for lower-value consignments, or for goods that should have had PVoC but arrived without a CoC.\n\nUNBS inspects imports to protect consumers and the environment from substandard products. Depending on product type and value, consignments may fall under PVoC, destination inspection, or both.\n\nAt entry points, expect document checks and, where needed, physical inspection. Samples may be drawn for laboratory testing. Incomplete standards paperwork is one of the most common reasons cargo sits longer than planned.\n\nPractical checklist before booking freight:\n1) Confirm whether your HS heading / product is under compulsory Uganda Standards.\n2) Confirm FOB value against the PVoC threshold.\n3) Appoint a UNBS-recognised PVoC provider early if required.\n4) Align commercial invoice descriptions with what will appear on the CoC.\n5) Keep packing lists accurate so inspection can match cartons quickly.\n\nFast Link coordinates factory readiness, documentation, and logistics so standards compliance does not become a last-minute scramble.\n\nVerify current UNBS notices—appointed agents and product lists are updated periodically.",
    bodyZh:
      "核心区别在于时间与地点：PVoC 在出口国完成，适用于达到货值门槛的受管制货物；目的地检验在到港后进行——尤其是低货值货物，或本应做 PVoC 却无 CoC 到港的货物。\n\nUNBS 检验进口货物，以保护消费者与环境免受不合格产品影响。视产品与货值，货物可能适用 PVoC、目的地检验，或两者兼有。\n\n口岸通常检查单证，必要时进行实物查验，并可能抽样送检。标准类单证不全，是货物滞留的常见原因。\n\n订舱前实用清单：\n1）确认产品/HS 是否落入强制性乌干达标准；\n2）对照 PVoC 货值门槛；\n3）如需尽早指定 UNBS 认可的 PVoC 机构；\n4）商业发票品名与 CoC 描述一致；\n5）装箱单准确，便于核对箱件。\n\nFast Link 可协调工厂准备、单证与物流，避免标准合规拖到最后一刻。\n\n请关注 UNBS 最新公告——指定机构与产品清单会不定期更新。",
  },
  {
    slug: "ura-asycuda-world-basics",
    category: "Customs Guides",
    title: "How does customs clearance work in Uganda?",
    titleZh: "乌干达清关是如何运作的？",
    excerpt:
      "Licensed clearing agents lodge declarations in URA's ASYCUDA World system, then taxes are paid via a Payment Registration Number (PRN) before cargo is released.",
    excerptZh:
      "持牌清关代理在 URA 的 ASYCUDA World 系统申报，进口商通过付款登记号（PRN）缴税后货物方可放行。",
    body: "Uganda customs clearance works through licensed clearing agents who lodge electronic declarations in ASYCUDA World, URA's customs system, followed by tax payment via a Payment Registration Number (PRN).\n\nMost importers appoint a licensed clearing agent to lodge entries. The agent captures the declaration, attaches scanned commercial documents, validates, and assesses the entry. Taxes are then paid against a Payment Registration Number (PRN)—many advisors recommend the importer pays the bank/PRN directly rather than handing cash to intermediaries.\n\nCore documents typically include: commercial invoice, packing list, bill of lading or air waybill, and where relevant Certificate of Origin, PVoC CoC, permits, and insurance.\n\nAfter assessment, amendments are restricted. If payment is not completed within the required window, system consequences can include TIN-related suspensions—so treat assessment as a commitment to finish payment promptly.\n\nFast Link works with destination clearance partners so freight arrival, document packs, and ASYCUDA timing stay aligned.\n\nAlways confirm current URA procedures on ura.go.ug; this is a practical overview, not official advice.",
    bodyZh:
      "乌干达清关由持牌清关代理在 ASYCUDA World 电子系统录入报关单，进口商再通过付款登记号（PRN）完成缴税后放行货物。\n\n多数进口商指定持牌清关代理录入报关单、上传扫描商业单证、校验并评估。税款按付款登记号（PRN）缴纳——许多建议主张进口商自行向银行/PRN 付款，而非将现金交给中间人。\n\n核心单证通常包括：商业发票、装箱单、提单/空运单，以及视情况所需的原产地证、PVoC CoC、许可证与保险单。\n\n评估后修改受限；若未在规定时间内完成付款，系统可能影响 TIN 状态——因此评估后应尽快完成缴税。\n\nFast Link 与目的地清关伙伴协作，使到货、单证包与 ASYCUDA 节奏对齐。\n\n请以 ura.go.ug 最新程序为准；本文为实务概览，非官方意见。",
  },
  {
    slug: "uganda-cif-duty-vat-overview",
    category: "Customs Guides",
    title: "How much is import duty and VAT in Uganda?",
    titleZh: "乌干达进口关税和增值税是多少？",
    excerpt:
      "Import duty depends on your HS code under the EAC Common External Tariff (often around 25% for finished goods), and VAT is typically 18% on customs value plus duty.",
    excerptZh:
      "进口关税按 HS 编码适用东非共同体共同对外关税（成品常被讨论在约 25%），增值税通常为完税价格加关税后的 18%。",
    body: "Import duty and VAT in Uganda depend on your HS code and CIF-based customs value: duty follows EAC Common External Tariff bands (finished goods are often discussed around 25%), and VAT is commonly 18% on customs value plus duty.\n\nUganda's import taxes generally start from a customs value built on CIF principles for entry into the East African Community—Cost, Insurance, and Freight up to the port of importation into the EAC (often Mombasa or Dar es Salaam for sea cargo).\n\nHigh-level components importers ask about most:\n• Import duty — often driven by the EAC Common External Tariff bands for your HS code (illustrative finished-goods rates are commonly discussed around 25%, with lower bands for intermediates/raw materials—always confirm your exact heading).\n• VAT — commonly discussed at 18% on a base that typically includes customs value plus duty (and other dutiable charges as applicable).\n• Other possible charges — withholding tax, excise (selected goods), infrastructure or environmental levies in specific cases.\n\nBecause duty and VAT sit on top of CIF-related value, cheap freight that arrives with incomplete insurance documentation—or a wrong HS code—can still create expensive surprises.\n\nUse Fast Link's import cost calculator for an indicative estimate from live rate cards and HS tariffs maintained in FLIMS, then ask sales for a formal quotation after cargo details are confirmed.\n\nTax rules and exemptions change. Confirm with URA and a licensed clearing agent for your shipment.",
    bodyZh:
      "乌干达进口关税与增值税取决于 HS 编码与 CIF 口径完税价格：关税适用东非共同体共同对外关税档位（成品常被讨论在约 25%），增值税实务中多为完税价格加关税后的 18%。\n\n乌干达进口税通常从东非共同体入境的 CIF 口径完税价格起算——即成本、保险与运费至 EAC 进口港（海运常见蒙巴萨或达累斯萨拉姆）。\n\n进口商最常问到的组成部分：\n• 进口关税——多由 HS 编码对应的东非共同体共同对外关税档位决定（成品常被讨论在约 25% 档，中间品/原料更低——务必核实具体税号）；\n• 增值税——实务中常按 18%，税基通常包含完税价格加关税等；\n• 其他可能费用——预扣税、特定货物消费税，以及个别情形下的基础设施或环境相关税费。\n\n由于关税与增值税建立在与 CIF 相关的税基上，运费看似便宜但保险/归类错误，仍可能带来高昂意外成本。\n\n可先用 Fast Link 进口成本计算器，基于 FLIMS 中操作员维护的运价与 HS 关税做示意估算，再由销售在货情确认后出具正式报价。\n\n税制与减免会变化，请以 URA 及持牌清关代理对您票货物的意见为准。",
  },
  {
    slug: "eac-certificate-of-origin",
    category: "Customs Guides",
    title: "What is an EAC Certificate of Origin and when do you need one?",
    titleZh: "什么是东共体原产地证，何时需要？",
    excerpt:
      "An EAC Certificate of Origin proves where goods were produced and can unlock reduced or zero preferential duty rates when origin rules are met.",
    excerptZh:
      "东共体原产地证证明货物生产地，符合原产地规则时可享受降低或零优惠关税。",
    body: "An EAC Certificate of Origin (COO) declares where goods were produced and is needed when you want to claim preferential duty rates under EAC, COMESA, or AfCFTA rules of origin.\n\nUnder preferential rules of origin for frameworks such as the East African Community (EAC), COMESA, or AfCFTA, qualifying goods may access reduced or zero preferential duty rates compared with the standard Common External Tariff.\n\nFor Uganda trade, URA has also taken on important roles around certificates of origin for exporters. Importers inbound from preferential partners should ensure the COO matches the commercial invoice and that the goods truly meet origin criteria—not just that a form exists.\n\nPreferential claims that fail scrutiny can lead to duty re-assessment and delays. When sourcing from China, EAC preferences usually do not apply; your focus is correct HS classification and standard import taxes. Preferences become relevant when goods genuinely originate in a preferential partner state.\n\nAsk your clearing agent early whether your corridor and supplier origin can support a preferential claim—and keep manufacturing evidence if origin is ever questioned.",
    bodyZh:
      "东共体原产地证（COO）声明货物在何处生产，当您要依据 EAC、COMESA 或 AfCFTA 原产地规则申请优惠税率时需要。\n\n在东非共同体（EAC）、COMESA 或 AfCFTA 等优惠原产地规则下，符合条件的货物可能适用低于普通共同对外关税的优惠税率。\n\n对乌干达贸易而言，URA 在出口原产地证方面也承担重要角色。从优惠伙伴进口时，应确保 COO 与商业发票一致，且货物真正满足原产地标准——不能仅有一份表格。\n\n优惠申报若经不起核查，可能导致补税与延误。从中国采购时，通常不适用 EAC 优惠，重点仍是正确 HS 归类与常规进口税；仅当货物确实原产于优惠伙伴国时，优惠才有意义。\n\n尽早向清关代理确认走廊与供应商原产地是否支持优惠申报，并保留生产证明以备核查。",
  },
  {
    slug: "mombasa-malaba-corridor",
    category: "Shipping Guides",
    title: "How long does shipping from China to Uganda via Mombasa take?",
    titleZh: "中国经蒙巴萨到乌干达海运需要多久？",
    excerpt:
      "Ocean transit is only part of the journey—port release, Malaba border crossing, and trucking to Kampala often add weeks beyond sailing time.",
    excerptZh:
      "海运航行只是一段——放箱、马拉巴边境与坎帕拉汽运常使总时效比纯航行多数周。",
    body: "Shipping from China to Uganda via Mombasa typically takes 8–12+ weeks door-to-door—ocean sailing is only part of the timeline, with port release, Malaba border processing, and trucking to Kampala adding significant time.\n\nMost sea cargo from China to Uganda moves through an East African ocean port—very often Mombasa—then trucks inland across the Kenya–Uganda border (commonly Malaba) toward Kampala warehouses or final delivery points.\n\nWhat lengthens door-to-door time beyond sailing days:\n• Port congestion and container release\n• Document readiness (BL, invoice, packing list, CoC, permits)\n• Border processing and weighbridge compliance\n• Last-mile delivery appointment windows\n\nAir freight into Entebbe compresses calendar time but increases cost per kilo—best for samples, stock-outs, and high-value low-volume cargo.\n\nFast Link designs the full chain: China warehouse consolidation, mode selection (AIR / SEA / ROAD / EXPRESS), and destination handoff so you see one timeline instead of fragmented handovers.",
    bodyZh:
      "中国经蒙巴萨至乌干达海运门到门通常需 8–12 周以上——航行只是一段，放箱、马拉巴边境与坎帕拉汽运会显著拉长总时效。\n\n中国至乌干达的海运多经东非港口（常见蒙巴萨），再经肯尼亚—乌干达边境（常见马拉巴）汽运至坎帕拉仓库或最终交货点。\n\n除航行天数外拉长门到门时效的因素包括：\n• 港口拥堵与放箱；\n• 单证齐备（提单、发票、装箱单、CoC、许可证）；\n• 边境处理与地磅合规；\n• 末公里预约窗口。\n\n空运入恩德培可压缩日历时间，但每公斤成本更高——适合样品、断货补货与高价值小批量。\n\nFast Link 设计全链路：中国仓拼货、运输方式选择（空运/海运/公路/快递）与目的地交接，让您看到一条完整时间线而非碎片化交接。",
  },
  {
    slug: "chargeable-weight-cbm",
    category: "Shipping Guides",
    title: "How is sea freight calculated by CBM?",
    titleZh: "海运如何按立方数（CBM）计费？",
    excerpt:
      "Sea freight is priced by CBM (cubic metres) or revenue tonnes—CBM equals length × width × height in metres, and light bulky cargo can cost more than dense pallets.",
    excerptZh:
      "海运按立方数（CBM）或计费吨计价——CBM 为长×宽×高（米），轻泡货可能比同公斤密货更贵。",
    body: "Sea freight is calculated by CBM (cubic metres): multiply length × width × height in metres, or divide cm dimensions by 1,000,000—and carriers bill the higher of actual weight and volume for LCL.\n\nAirlines and many express services bill the higher of actual weight and volumetric weight. A common air volumetric formula is length × width × height (cm) ÷ 6000 = volumetric kg. Chargeable weight = max(actual kg, volumetric kg).\n\nSea freight often prices by revenue tonnes or CBM (cubic metres). CBM = L×W×H (metres), or convert from cm by dividing by 1,000,000. For LCL, light cargo that fills space can cost more than a dense pallet of the same kilogram weight.\n\nFast Link's FLIMS rate cards store operator-updated AIR / SEA / ROAD / EXPRESS rates (per kg, per CBM, minima, fuel and fees). The website calculator uses those live masters—so keeping dimensions accurate is as important as weight.\n\nMeasure packed cartons, not product-only sizes, and include outer packaging in CBM.",
    bodyZh:
      "海运按立方数（CBM）计费：长×宽×高（米）相乘，或由厘米尺寸除以 1,000,000 换算——拼箱时承运人常按实际重与体积取高。\n\n空运与许多快递按实际重与体积重取高计费。常见空运体积重公式为长×宽×高（厘米）÷6000＝体积公斤。计费重＝max（实际公斤，体积公斤）。\n\n海运常按计费吨或立方数（CBM）计价。CBM＝长×宽×高（米），或由厘米换算除以 1,000,000。拼箱时，占体积的轻泡货可能比同公斤的密实托盘更贵。\n\nFast Link 的 FLIMS 费率卡保存操作员更新的空运/海运/公路/快递费率（公斤价、立方价、最低收费、燃油与杂费）。网站计算器读取这些实时主数据——尺寸准确性与重量同等重要。\n\n请量包装后外箱尺寸，把外包装计入 CBM。",
  },
  {
    slug: "air-vs-sea-china-africa",
    category: "Shipping Guides",
    title: "What is the difference between sea freight and air freight?",
    titleZh: "海运和空运有什么区别？",
    excerpt:
      "Sea freight costs less for bulk cargo but takes weeks; air freight arrives in days at a higher cost per kilo—best for urgent or high-value shipments.",
    excerptZh:
      "海运适合大批量、成本低但需数周；空运数日到港但每公斤更贵——适合紧急或高价值货物。",
    body: "The main difference is cost versus speed: sea freight wins on cost for bulk and non-urgent cargo, while air freight wins when stock-outs or sample cycles cost more than freight.\n\nExpress sits between them for parcels and critical parts. Road matters for regional legs after ocean discharge or cross-border trucking into Uganda.\n\nIn FLIMS and on this website, shipping modes align to operator rate cards: AIR, SEA, ROAD, and EXPRESS. Compare quotes using chargeable weight and, for sea, CBM. A light, bulky carton can be surprisingly expensive by air.\n\nBuild buffer for Chinese New Year and other factory holidays. Document corrections after sailing are slower and costlier than fixing paperwork before cargo leaves China.",
    bodyZh:
      "核心区别是成本与时效：大批量非紧急货物海运更划算；断货或样品周期成本高于运费时选空运。\n\n包裹与关键备件可选快递；海运卸港后的区域段或进入乌干达的跨境汽运则依赖公路。\n\n在 FLIMS 与本网站中，运输方式与操作员费率卡对齐：AIR、SEA、ROAD、EXPRESS。比较报价时使用计费重，海运同时看 CBM。轻泡货空运可能很贵。\n\n为中国春节等工厂假期预留缓冲。开航后再改单证，往往比出运前改好更慢更贵。",
  },
  {
    slug: "incoterms-china-sourcing",
    category: "Procurement Guides",
    title: "What do EXW, FOB, and CIF mean for China sourcing?",
    titleZh: "中国采购中 EXW、FOB、CIF 是什么意思？",
    excerpt:
      "Incoterms define who pays freight and bears risk—EXW puts maximum responsibility on the buyer, FOB at the Chinese port, and CIF includes carriage and insurance to a named port.",
    excerptZh:
      "贸易术语界定谁付运费、谁担风险——EXW 买方责任最大，FOB 在中国港口交货，CIF 含至指定港的运费与保险。",
    body: "EXW, FOB, and CIF are Incoterms that allocate cost and risk between buyer and seller when sourcing from China.\n\n• EXW — You arrange pickup from the factory; maximum buyer control, maximum buyer responsibility.\n• FOB — Seller delivers on board at the Chinese port; you control main carriage and insurance choices.\n• CIF — Seller pays carriage and insurance to a named destination port; useful when you want a simpler buy price, but still plan destination charges, clearance, and inland delivery.\n\nFor Uganda importers, FOB + a trusted forwarder (like Fast Link) often balances transparency and control. CIF can hide weak insurance or routing choices inside a single supplier price.\n\nWrite the Incoterm and named place clearly on the PO and commercial invoice. Ambiguous terms are a top cause of \"who pays this fee?\" disputes mid-shipment.",
    bodyZh:
      "EXW、FOB、CIF 是国际贸易术语，在中国采购中分配买卖双方的费用与风险。\n\n• EXW——您安排工厂提货；买方控制最多，责任也最大。\n• FOB——卖方在中国港口完成装船；您掌控干线运输与保险选择。\n• CIF——卖方支付至指定目的港的运费与保险；买价更简单，但仍需规划目的地费用、清关与内陆派送。\n\n对乌干达进口商，FOB + 可信货代（如 Fast Link）往往在透明度与控制力之间更平衡。CIF 可能把薄弱保险或路线选择藏进单一供应商报价。\n\n在采购订单与商业发票上写清术语与指定地点。术语含糊是运输途中“这笔费用谁付”纠纷的常见原因。",
  },
  {
    slug: "procurement-timeline",
    category: "Procurement Guides",
    title: "How long does China procurement to Kampala take?",
    titleZh: "从中国采购到坎帕拉需要多久？",
    excerpt:
      "A realistic door-to-door timeline is roughly 8–12+ weeks by sea—allowing 1–2 weeks for RFQ, 3–6 for production, then ocean transit, border, and clearance.",
    excerptZh:
      "海运门到门现实周期约 8–12 周以上——含 1–2 周询价、3–6 周生产，再加海运、边境与清关。",
    body: "China procurement to Kampala typically takes 8–12+ weeks by sea from RFQ to arrival, with air freight compressing transit to days.\n\nWeek 1–2: RFQ, shortlist, samples.\nWeek 3–6: Production (varies widely by product).\nWeek 7: Inspection, PVoC if required, and freight booking.\nWeek 8–12+: Ocean transit, port, border, and clearance (air is days, not weeks).\n\nBuild buffer for Chinese holidays and document corrections. Start UNBS/PVoC and HS classification before the goods are packed—not after the vessel sails.\n\nFast Link can own sourcing follow-up, inspection coordination, and door-to-door logistics inside one plan.",
    bodyZh:
      "从中国采购到坎帕拉，海运从询价到抵达通常需 8–12 周以上，空运可将运输段压缩至数天。\n\n第 1–2 周：询价、短名单、样品。\n第 3–6 周：生产（视产品差异很大）。\n第 7 周：验货、如需办理 PVoC，并订舱。\n第 8–12 周及以上：海运、港口、边境与清关（空运以天计）。\n\n为中国节假日与单证更正预留缓冲。在货物装箱前启动 UNBS/PVoC 与 HS 归类——而不是开航之后。\n\nFast Link 可将寻源跟进、验货协调与门到门物流纳入同一计划。",
  },
  {
    slug: "supplier-payment-milestones",
    category: "Procurement Guides",
    title: "How should you structure supplier payment for China imports?",
    titleZh: "中国进口应如何安排供应商付款？",
    excerpt:
      "Split payments—such as 30% deposit and 70% after inspection—reduce risk compared with 100% advance to an unverified supplier.",
    excerptZh:
      "分期付款（如 30% 定金、70% 验货后）比向未核验供应商 100% 预付风险更低。",
    body: "The safest approach is split payment milestones—typically 30% deposit and 70% after inspection or against BL copy—rather than 100% advance to an unverified supplier.\n\nCommon structures for China sourcing:\n• 30% deposit / 70% before shipment (after inspection)\n• 30% / 70% against BL copy\n• Escrow or trade-assurance style holds for new suppliers\n• Letters of credit for larger banked transactions\n\nTie the balance release to quality inspection results and, where needed, PVoC readiness. Never wire 100% advance to an unverified beneficiary whose company name does not match the licence and bank account.\n\nFast Link can support verification, inspection, and payment sequencing alongside logistics so money and cargo move on the same plan.",
    bodyZh:
      "较安全的做法是分期付款——常见 30% 定金、70% 验货后或凭提单副本付尾款——而非向未核验供应商 100% 预付。\n\n中国采购常见结构：\n• 30% 定金 / 70% 装运前（验货后）\n• 30% / 70% 凭提单副本\n• 新供应商采用托管或贸易保障式资金安排\n• 较大银行交易使用信用证\n\n将尾款放款与质检结果挂钩，并在需要时与 PVoC 准备进度对齐。切勿向未经核验、公司名与执照/银行账户不一致的收款方 100% 预付。\n\nFast Link 可在物流之外支持核验、验货与付款节奏，使资金与货物在同一计划上推进。",
  },
  {
    slug: "supplier-verification-checklist",
    category: "Supplier Verification Guides",
    title: "How do you verify a China supplier before paying?",
    titleZh: "付款前如何核验中国供应商？",
    excerpt:
      "Match the legal company name to bank details, check the license and factory address, start with a trial order, and tie balance payment to inspection.",
    excerptZh:
      "核对公司名与账户、查验执照与工厂地址、先小单试单，并将尾款与验货结果挂钩。",
    body: "Before paying a China supplier, verify that the legal company name matches bank beneficiary details, confirm the business license and factory address, and start with a small trial order tied to pre-shipment inspection.\n\n1) Confirm the legal company name matches bank beneficiary details.\n2) Request a recent business license and export records.\n3) Verify the factory address with a video or on-site audit.\n4) Start with a small trial order and pre-shipment inspection.\n5) Prefer structured payment milestones over 100% advance to unknown parties.\n\nAdd a sixth when selling into Uganda: ask whether the factory has experience preparing documents for UNBS PVoC and accurate commercial invoices that match HS descriptions.",
    bodyZh:
      "付款前须核验：公司法定名称与收款账户一致、营业执照与工厂地址真实，并先小单试单且将尾款与装运前检验挂钩。\n\n1）确认公司法定名称与收款账户一致。\n2）索取最新营业执照与出口记录。\n3）通过视频或现场验厂核实地址。\n4）先小单试单并做装运前检验。\n5）对陌生供应商避免 100% 预付，采用阶段性付款。\n\n销往乌干达时再加第六项：询问工厂是否有为 UNBS PVoC 准备单证的经验，以及商业发票品名是否能与 HS 描述一致。",
  },
  {
    slug: "uganda-import-basics",
    category: "Import Guides",
    title: "What do you need to import into Uganda for the first time?",
    titleZh: "首次进口乌干达需要准备什么？",
    excerpt:
      "You need commercial documents, correct HS classification, import duty and VAT planning, and often a PVoC Certificate of Conformity for regulated goods.",
    excerptZh:
      "需商业单证、正确 HS 归类、关税与增值税规划，以及对受管制货物常见的 PVoC 合格证明。",
    body: "First-time Uganda importers need commercial documents (invoice, packing list, BL or AWB), correct HS classification, duty and VAT planning, and often a PVoC Certificate of Conformity for regulated goods.\n\nWork with a partner who can estimate duty and VAT before you confirm supplier pricing—landed cost surprises are the most common reason new importers lose margin.\n\nStart with a clear product specification, confirm Incoterms, decide on inspection, and map whether UNBS PVoC applies. Fast Link can coordinate sourcing, inspection, ocean freight via Mombasa, clearance into Kampala, and door delivery.\n\nUse the import cost calculator on this site for an indicative estimate, then request a formal quote from sales.",
    bodyZh:
      "首次进口乌干达需准备商业单证（发票、装箱单、提单/空运单）、正确 HS 归类、关税与增值税规划，以及对受管制货物常见的 PVoC 合格证明。\n\n在确认供应商价格前先估算关税与增值税——落地成本失控是新进口商亏损的最常见原因。\n\n从清晰的产品规格开始，确认贸易术语，决定是否验货，并判断是否适用 UNBS PVoC。Fast Link 可协调寻源、验货、经蒙巴萨海运、坎帕拉清关与门到门交付。\n\n可先用本站进口成本计算器做示意估算，再向销售索取正式报价。",
  },
  {
    slug: "hs-codes-explained",
    category: "Customs Guides",
    title: "What is an HS code and why does it matter?",
    titleZh: "什么是 HS 编码，为什么重要？",
    excerpt:
      "An HS code classifies your product for customs—it determines import duty rate, VAT base, PVoC scope, and how fast clearance proceeds.",
    excerptZh:
      "HS 编码为海关归类产品——决定进口税率、增值税税基、PVoC 范围与清关速度。",
    body: "An HS code is a Harmonized System classification number that tells customs what your product is—it drives duty rates, VAT, PVoC scope, and clearance speed.\n\nFormat examples you will see on commercial invoices include six-digit headings such as 8517.12 (smartphones) or longer national tariff lines.\n\nA wrong code can delay cargo or create under/over-payment risk. Share clear product descriptions, materials, and intended use with your logistics partner.\n\nOn Fast Link's calculator, enter HS codes in a format like 8517.12. Our FLIMS tariff tables use operator-uploaded HS duty percentages by destination country so website estimates stay aligned with sales quotations.\n\nWhen in doubt, ask for a classification review before you print commercial invoices and book freight.",
    bodyZh:
      "HS 编码是协调制度下的产品归类号码，向海关说明货物类别——直接影响税率、增值税、PVoC 范围与清关速度。\n\n商业发票上常见六位品目如 8517.12（智能手机），或更长的本国税则号列。\n\n归类错误可能导致延误或短/溢缴风险。请向物流伙伴提供清晰的品名、材质与用途。\n\n在 Fast Link 计算器中，请按 8517.12 这类格式填写 HS。我们的 FLIMS 关税表由操作员按目的国上传税率，使网站估算与销售报价保持一致。\n\n若有疑问，在打印商业发票与订舱前先做归类复核。",
  },
  {
    slug: "trade-financing-options",
    category: "Industry News",
    title: "What payment options reduce China import risk?",
    titleZh: "哪些付款方式能降低中国进口风险？",
    excerpt:
      "Escrow, letters of credit, and purchase-order financing spread payment risk—pair them with supplier verification and pre-shipment inspection.",
    excerptZh:
      "托管、信用证与采购订单融资可分散付款风险——宜与供应商核验及装运前检验配合使用。",
    body: "Escrow, letters of credit, and purchase-order financing are the main payment options that reduce China import risk by holding funds until milestones are met.\n\nEscrow and trade assurance help when trust is still forming. Letters of credit suit larger banked transactions. Purchase-order financing can unlock cash flow once a reputable buyer commitment exists.\n\nPair financing structure with operational controls: supplier verification, pre-shipment inspection, and PVoC readiness for Uganda-bound regulated goods.\n\nFast Link advises on structures that fit your shipment size—then executes logistics around that payment plan.",
    bodyZh:
      "托管、信用证与采购订单融资是降低中国进口风险的主要方式，可在达成节点后再释放资金。\n\n信任建立阶段可用托管与贸易保障；较大银行交易适合信用证；有可靠买方承诺时可用采购订单融资。\n\n将融资结构与运营控制结合：供应商核验、装运前检验，以及对运往乌干达的受管制货物做好 PVoC 准备。\n\nFast Link 根据货量建议结构，并围绕付款计划执行物流。",
  },
];

export function getArticle(slug: string) {
  return knowledgeArticles.find((a) => a.slug === slug);
}

const SEARCH_SYNONYMS: Record<string, string[]> = {
  pvoc: ["certificate of conformity", "coc", "pre-export verification", "合格证明"],
  customs: ["clearance", "asycuda", "ura", "清关"],
  duty: ["tariff", "import tax", "关税"],
  vat: ["value added tax", "增值税", "tax"],
  cbm: ["cubic metre", "cubic meter", "volume", "立方", "chargeable weight"],
  incoterms: ["fob", "cif", "exw", "trade terms", "贸易术语"],
  hs: ["hs code", "harmonized system", "classification", "归类", "tariff code"],
  sea: ["ocean", "shipping", "海运", "fcl", "lcl", "container"],
  air: ["airfreight", "空运", "awb", "air freight"],
  uganda: ["kampala", "entebbe", "乌干达"],
  china: ["sourcing", "procurement", "中国", "采购"],
};

function expandSearchTerms(q: string): string[] {
  const trimmed = q.trim();
  const lower = trimmed.toLowerCase();
  const terms = new Set<string>([lower, trimmed]);
  for (const [key, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    const keyHit =
      lower.includes(key) || synonyms.some((s) => lower.includes(s.toLowerCase()));
    if (keyHit) {
      terms.add(key);
      for (const s of synonyms) terms.add(s.toLowerCase());
    }
  }
  return [...terms];
}

export function searchArticles(q: string) {
  const needle = q.trim();
  if (!needle) return knowledgeArticles;
  const terms = expandSearchTerms(needle);
  return knowledgeArticles.filter((a) =>
    terms.some(
      (term) =>
        a.title.toLowerCase().includes(term) ||
        a.titleZh.includes(term) ||
        a.excerpt.toLowerCase().includes(term) ||
        a.excerptZh.includes(term) ||
        a.category.toLowerCase().includes(term) ||
        a.body.toLowerCase().includes(term) ||
        a.bodyZh.includes(term),
    ),
  );
}
