/* ============================================================
   个人网站交互逻辑
   1) 视角切换（招聘者 / 产品运营 / 技术伙伴 / 漫游者）
   2) 深耕展开（grid 0fr→1fr 平滑过渡，Apple 风格）
   3) 关于我：星球 → 开启探索 → 六维能力雷达
   4) AI 生成摘要（流式打字机效果）
   5) 中英双语切换（i18n，默认中文）
   6) 阅读进度条
   7) 滚动淡入（IntersectionObserver）
   ============================================================ */

/* ---------- 双语词典（英文全量；中文动态文案另列） ---------- */
const I18N = {
  en: {
    "nav.brand": "Yang Fujie",
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.aiAgent": "AI Agent",
    "nav.projects": "Automation",
    "nav.education": "Education",
    "nav.research": "Research",
    "nav.skills": "Skills",
    "nav.contact": "Contact",

    "hero.eyebrow": "Hi, I'm",
    "hero.name": "Yang Fujie",
    "hero.title": "M.S. in Management Science & Engineering · Ad Strategy Ops / Data Analytics",
    "hero.tagline": "M.S. candidate at Beijing Institute of Technology (via recommended admission), currently an Ad Strategy Operator for Meituan's Core Local Commerce, focused on sinking markets. Skilled at SQL/Python data analysis, translating business into measurable metrics, and exploring LLM Agent deployment in advertising.",
    "hero.btnExperience": "View Experience",
    "hero.btnAgent": "AI Agent Build",
    "hero.scrollHint": "Scroll down, or switch perspectives to dive deeper ↓",
    "hero.maimai": "Maimai",

    "about.title": "About Me",
    "about.lead": "Click the planet to unlock my capability radar and AI resume summary.",
    "explore.btn": "Start Exploring",
    "explore.hint": "Click the center to start exploring my capabilities ↓",
    "about.radarNote": "Six capabilities self-assessed from project outcomes and business results. Click to generate an AI summary ↓",
    "about.genSummary": "✨ Generate My Resume Summary",

    "exp.title": "Work Experience",

    "meituan.date": "2026.05 — Present",
    "meituan.link": "Meituan",
    "meituan.orgSuffix": " · Core Local Commerce - Sinking Markets",
    "meituan.role": "Ad Strategy Ops",

    "view.recruiter": "Recruiter",
    "view.product": "Product Ops",
    "view.tech": "Tech Partner",
    "view.roamer": "Explorer",
    "view.hint": "The same Meituan experience, viewed from different angles →",

    "p.waimai.title": "Sinking-market Food Delivery Ad Strategy",
    "p.waimai.recruiter": "<strong>Results:</strong> Launched \"order-rebate + auto Dianjin bidding\" in July, lifting <strong>penetration +12%</strong> and <strong>revenue +8.6%</strong> MoM; the strategy spans new-activation / existing-upsell / churn-recall phases, directly driving ad cash revenue and monetization rate.",
    "p.waimai.product": "<strong>Strategy:</strong> Three lifecycle phases — cold-start for new merchants, penetration/ARPU tiering for existing upsell, churn-warning for recall; products: Dianjin / Platinum / One-stop Promotion.",
    "p.waimai.tech": "<strong>System:</strong> Monitoring on MTD revenue, monetization rate <code>MR = revenue ÷ verified GTV</code>, ARPU and penetration; SQL + Python scheduled pulls with auto-alerts for weekly / monthly reviews.",
    "p.waimai.roamer": "<strong>Story:</strong> Started with sinking-market food-delivery ads, mapped the new / existing / churn structure, then phased in the strategy; the July launch delivered results and a replicable playbook.",
    "p.waimai.detailH": "Deep Dive (within Meituan's ad system)",
    "p.waimai.li1": "<strong>Ad product matrix:</strong> Dianjin (CPC, basic slots), Platinum (higher-priority slots), One-stop (smart hosting) — matched by merchant tier.",
    "p.waimai.li2": "<strong>Core metrics:</strong> ad cash revenue, verified GTV (successful redemption), monetization rate MR, ARPU, penetration; track MTD revenue & MR YoY / MoM.",
    "p.waimai.li3": "<strong>Merchant tiering:</strong> differentiated ops for KA / CKA / city-merchants; partner management sets monthly revenue & monetization targets.",
    "p.waimai.li4": "<strong>Special analysis:</strong> tourist vs non-tourist cities diverge from the macro trend in delivery / in-restaurant ads and are modeled separately.",

    "p.shangou.title": "Flash-sale Ad Product Ops (Owner)",
    "p.shangou.recruiter": "<strong>Results:</strong> In H2 shifted CPC to OCPX, raising planned <strong>revenue +11%</strong>; the pilot hit <strong>8% first-month penetration</strong>; owned the full online ad flow for flash-sale merchants.",
    "p.shangou.product": "<strong>Strategy:</strong> Category targeting moved from CPC to <em>OCPX (conversion bidding)</em>; better fits merchants wanting conversions over impressions.",
    "p.shangou.tech": "<strong>System:</strong> Built a category-targeting model & OCPX bidding logic with a pilot dashboard splitting penetration / revenue by category / city to find high-potential zones.",
    "p.shangou.roamer": "<strong>Story:</strong> Took over flash-sale online ads solo, found the CPC efficiency ceiling, pushed CPC → OCPX, iterated and got H2 pilot results.",
    "p.shangou.detailH": "Deep Dive",
    "p.shangou.li1": "<strong>CPC → OCPX:</strong> from click-based to conversion-based (order / redemption) bidding, cutting wasted impressions.",
    "p.shangou.li2": "<strong>Category targeting:</strong> differentiated bidding & creatives for high-frequency categories (supermarket, flowers, digital).",
    "p.shangou.li3": "<strong>Pilot design:</strong> small gray-release → dashboard-validated penetration / revenue → scaled replication.",

    "p.geo.title": "GEO Ad Commercialization (0→1)",
    "p.geo.recruiter": "<strong>Results:</strong> Designed GEO ad commercialization from scratch; <strong>accumulated pipeline revenue &gt; ¥10M</strong> with a shippable product portfolio & pricing.",
    "p.geo.product": "<strong>Strategy:</strong> Benchmarked domestic / overseas GEO pricing, defined a <em>product mix & pricing ladder</em> matching KA / CKA / city-merchant budgets.",
    "p.geo.tech": "<strong>System:</strong> Geo-targeted reach (in-store / nearby); pricing model combines merchant tier & radius, integrated with Dianjin / Platinum.",
    "p.geo.roamer": "<strong>Story:</strong> Started blank, benchmarked globally, then defined our mix & pricing ladder, translating local-commerce edge into sellable ad products.",
    "p.geo.detailH": "Deep Dive",
    "p.geo.li1": "<strong>Pricing benchmark:</strong> compared domestic / overseas GEO / LBS products (e.g. in-store, nearby-push) on billing & tiers.",
    "p.geo.li2": "<strong>Product mix:</strong> packages by objective (impression / in-store / conversion) matched to KA / CKA / city-merchant budgets.",
    "p.geo.li3": "<strong>Affordability match:</strong> base package for city-merchants, value-added + dedicated service for CKA / KA.",

    "p.bridge.title": "Ad Sales Cockpit (Productivity Tool)",
    "p.bridge.recruiter": "<strong>Results:</strong> Designed a 3-tier \"HQ – City Manager – Sales Desk\" architecture pushing AI strategy straight to HQ, fixing fragmented partner management in sinking markets.",
    "p.bridge.product": "<strong>Strategy:</strong> Clarified per-tier <em>data rights & function boundaries</em>, aligned on AI-strategy delivery, turning ad-hoc reporting into a standardized HQ-direct flow.",
    "p.bridge.tech": "<strong>System:</strong> Each tier maps to its own data view & permissions; the data model lets HQ see the whole, cities see efficiency, sales see execution.",
    "p.bridge.roamer": "<strong>Story:</strong> Saw fragmented partner management & long reporting chains, so designed the 3 tiers to push strategy one-click from HQ to the front-line sales desk.",
    "p.bridge.detailH": "Deep Dive",
    "p.bridge.li1": "<strong>3 tiers:</strong> HQ (regional overview) → City Manager (city efficiency) → Sales Desk (BD executes strategy).",
    "p.bridge.li2": "<strong>Permission boundaries:</strong> tier-based data granularity & functions, avoiding over-access and metric drift.",
    "p.bridge.li3": "<strong>AI strategy delivery:</strong> HQ generates strategy, city managers break it down, sales desk executes and feeds results back.",

    "wps.date": "2025.09 — 2025.12",
    "wps.link": "Kingsoft Office (WPS)",
    "wps.orgSuffix": " · Marketing Mgmt Center",
    "wps.role": "Data Strategy Ops",
    "wps.desc": "<strong>Healthcare industry research:</strong> independently led the 2026 healthcare office-software market review & forecast, building a \"province – industry value-tier\" model.<br /><strong>Market analysis:</strong> led B / G year-end conservative & sprint forecasts, computed three-year B-end market growth and competitor share.<br /><strong>Cyclic monitoring:</strong> built a CRM weekly / monthly / quarterly tracking system; flagged 45 anomaly records worth &gt; ¥1M.",
    "shuidi.date": "2024.10 — 2025.02",
    "shuidi.link": "Waterdrop Inc.",
    "shuidi.orgSuffix": " · IT Internal Control",
    "shuidi.role": "Financial Data Analysis",
    "shuidi.desc": "Supported Deloitte on the US-listed financial annual audit, processing 100M+ rows of \"Shui Di Chou\" / \"Shui Di Bao\" 2024 data; used SQL to extract time-phased policy data and 300+ anomaly records, classified and attributed them against business rules, identified 6 high-growth periods and 4 risk points, supporting the 2025 strategy adjustment.",

    "agent.title": "AI Agent Build",
    "agent.lead": "Abstracting partner ad ops into an AI loop of \"data collection → diagnosis → strategy → feedback\", orchestrated via LLM Agents for L2 AI-ization.",
    "agent.node1": "Data Collection",
    "agent.node2": "Diagnosis",
    "agent.node3": "Strategy",
    "agent.node4": "Feedback",
    "agent.m1label": "Task Efficiency",
    "agent.m1note": "From manual tier-by-tier dispatch & analysis to a one-minute Agent overview",
    "agent.m2label": "Accuracy",
    "agent.m2note": "Improved accuracy of diagnosis & ad-product recommendations",
    "agent.m3label": "Sinking-market Partners",
    "agent.m3note": "Real-business-scenario feedback data powering strategy iteration",
    "agent.archSubtitle": "Three-tier Product Architecture (click to expand)",
    "agent.archHQname": "HQ",
    "agent.archHQtag": "Regional overview",
    "agent.archHQdesc": "HQ oversees the whole business dashboard: monitors each region's MTD revenue, monetization rate MR, penetration and ARPU YoY / MoM; generates AI strategy and pushes it one-click, shifting from ad-hoc reporting to a standardized HQ-direct operation.",
    "agent.archCityName": "City Manager",
    "agent.archCityTag": "City efficiency",
    "agent.archCityDesc": "City managers receive HQ strategy and break it down to city partners & BDs: they see city-level penetration / revenue structure, locate inefficient partners, and translate strategy into executable actions.",
    "agent.archSalesName": "Sales Desk",
    "agent.archSalesTag": "BD executes",
    "agent.archSalesDesc": "The sales desk is the front-line BD workbench: it receives HQ-pushed strategy & recommendations, and — combined with real-time partner data — suggests concrete actions (which ad product to push, how to allocate budget) and feeds execution results back.",

    "auto.title": "Automation & Projects",
    "auto.c1title": "WeCom Automation Alerts",
    "auto.c1desc": "Pushes data anomalies & daily reports to ops groups via WeCom Webhook, cutting manual sync cost.",
    "auto.c1detailH": "Technical Details",
    "auto.c1li1": "Python scheduled tasks + WeCom bot Webhook pushes.",
    "auto.c1li2": "Monitors MTD revenue / monetization anomalies, triggers alert cards and @s the owner.",
    "auto.c1li3": "Auto-generates daily / weekly reports and broadcasts them in groups.",
    "auto.c2title": "Sinking-market Ad Strategy Dashboard",
    "auto.c2desc": "A Python + SQL auto-monitoring dashboard for revenue / monetization, powering weekly & monthly reviews.",
    "auto.c3title": "Education Policy Weekly System",
    "auto.c3desc": "Tracks Beijing Haidian K12 special-enrollment programs, structures weekly policy & admission briefs.",

    "edu.title": "Education",
    "edu.bit.org": "Beijing Institute of Technology (recommended admission)",
    "edu.bit.role": "Management Science & Engineering · M.S.",
    "edu.bit.desc": "Core courses: complex-systems modeling & simulation, game theory & auction mechanism design, risk analysis & crisis management, operations research.<br />Honors: academic special-achievement scholarship, Xiaomi special-achievement scholarship, outstanding student leader, four-year consecutive major scholarship, academic-role model, triple-A student.<br />Skills: SQL / Python (data analytics), LLM deployment (Agent orchestration / automation workflows), ArcGIS / Origin / Stata (research visualization).",
    "edu.cugb.org": "China University of Geosciences (Beijing)",
    "edu.cugb.role": "Economics · B.S.",
    "edu.cugb.desc": "GPA 3.83 / 4.00 (ranked 1st in class, 3rd in major).<br />Certificates: CET-4, CET-6 (488), IELTS 6.5.<br />Competitions: National Mathematics Competition (1st prize, national), National Elite Business Challenge (3rd prize, national), National Energy Economics Competition (3rd prize, Beijing); 10 university-level sports / arts awards.",

    "research.kicker": "CHAPTER 04 / Research",
    "research.title": "How undergraduate training becomes<br />quantifiable research capability?",
    "research.lead": "From a national innovation project to a first-author SCI Q1 paper: linking economics, energy, environment and public health, training the ability to \"disentangle complex variables, then quantify their relationships.\"",
    "research.tab1": "PM2.5 Coal-consumption Emissions",
    "research.tab2": "ESEE Coordination & Public Health",
    "paper1.badge": "SCI Q1 · First Author",
    "paper1.journal": "Science of the Total Environment",
    "paper1.title": "Spatiotemporal variation & drivers of PM2.5 emissions<br />from coal consumption in the Central Plains Megalopolis",
    "paper1.stat1": "Impact Factor · CAS Q1 Top",
    "paper1.stat2": "Prefecture cities",
    "paper1.stat3": "Years panel data",
    "paper1.step1n": "Problem",
    "paper1.step1": "The Central Plains Megalopolis grew fast amid severe air pollution, yet the spatiotemporal variation and drivers of coal-consumption PM2.5 emissions remained unclear.",
    "paper1.step2n": "Data",
    "paper1.step2": "Based on coal-consumption data and emission factors, accounted PM2.5 emissions for 30 prefecture cities, 2000–2020.",
    "paper1.step3n": "Method",
    "paper1.step3": "Spatial autocorrelation (Moran's I) tests agglomeration → Spatial Durbin Model (SDM) quantifies direct & spillover effects.",
    "paper1.step4n": "Conclusion",
    "paper1.step4": "Coal-consumption PM2.5 emissions show significant spatial clustering and strong spillover; most factors exert direct or indirect effects.",
    "paper1.value": "<strong>Value:</strong> Provides a quantitative basis for cross-city joint prevention, industrial green transition and environmental-governance technology.",
    "paper1.link": "Read Original ↗ <span class=\"case-link__doi\">doi.org/10.1016/j.scitotenv.2024.173778</span>",
    "paper2.badge": "SCI Q1 · Co-author",
    "paper2.journal": "Journal of Cleaner Production",
    "paper2.title": "Spatial impact of China's city Economy-Society-Energy-Environment<br />coordination on public health",
    "paper2.stat1": "Top clean-production journal · CAS Q1 Top",
    "paper2.stat2": "Prefecture cities",
    "paper2.stat3": "Years panel data",
    "paper2.step1n": "Problem",
    "paper2.step1": "How do the economy, society, energy and environment systems coordinate, and how do they affect public health through spatial spillover?",
    "paper2.step2n": "Data",
    "paper2.step2": "PCA + entropy weight measured ESEE development for 278 Chinese cities, 2012–2021.",
    "paper2.step3n": "Method",
    "paper2.step3": "Coupling coordination model quantifies the four-system coordination → Spatial Durbin Model estimates impact on local & neighboring public health.",
    "paper2.step4n": "Conclusion",
    "paper2.step4": "ESEE coordination shows a local public-health effect of 0.5082 and a neighboring effect of 2.0240, stronger in small cities.",
    "paper2.value": "<strong>Value:</strong> Provides policy references for regional cooperation, balancing development gaps and improving public health.",
    "paper2.link": "Read Original ↗ <span class=\"case-link__doi\">doi.org/10.1016/j.jclepro.2024.143442</span>",
    "research.mini1n": "Methods",
    "research.mini1": "Emission accounting, spatial autocorrelation, Spatial Durbin Model, coupling coordination, PCA / entropy weight.",
    "research.mini2n": "Value",
    "research.mini2": "Environmental regulation, joint prevention, public health, regional-balance, green transition.",
    "research.mini3n": "Training",
    "research.mini3": "Long-panel cleaning, causal identification, ArcGIS / Origin viz, SCI writing.",

    "skills.title": "Skills",
    "skills.tag1": "SQL / Python (Data Analytics)",
    "skills.tag2": "LLM Deployment (Agent Orchestration)",
    "skills.tag3": "ArcGIS / Origin / Stata",
    "skills.tag4": "Ad Strategy Ops",
    "skills.tag5": "GEO Ad Commercialization",
    "skills.tag6": "Data Modeling & Forecasting",
    "skills.tag7": "CRM Data Monitoring",
    "skills.tag8": "Game Theory & Operations Research",

    "contact.title": "Contact",
    "contact.summary": "At Meituan, I push one step beyond \"just getting things done\" — through business-process analysis I build a top-down, full-chain view, and consolidate it into an <b>AI Agent automation system that precisely improves efficiency and lowers error rates.</b><br />If you work on ad strategy, data systems, LLM deployment or growth, I'd love to talk.",
    "contact.strength1tag": "Data-driven",
    "contact.strength1": "SQL / Python on 100M+ rows, breaking business into measurable metric systems — see the structure before optimizing.",
    "contact.strength2tag": "Commercialization",
    "contact.strength2": "From GEO commercialization 0→1 to ad-strategy efficiency gains — results-oriented, able to turn instinct into a replicable playbook.",
    "contact.strength3tag": "LLM · Agent",
    "contact.strength3": "Independently orchestrate LLM Agents & automation workflows, turning diagnosis and strategy recommendation into standardized AI processes.",
    "contact.welcomeLead": "I welcome conversations on:",
    "contact.tag1": "Product",
    "contact.tag2": "Operations",
    "contact.tag3": "Commercialization",
    "contact.tag4": "Market",
    "contact.tag5": "Data Analytics",
    "contact.tag6": "LLM Deployment",
    "contact.tag7": "Ad Strategy",
    "contact.tag8": "Collaboration",
    "contact.emailLabel": "Email",
    "contact.locationLabel": "Based in",
    "contact.location": "Beijing",
    "contact.sendBtn": "Send Email",
    "contact.caption": "Stay curious, and keep exploring.",
    "footer": "© 2026 Yang Fujie · Built with static HTML/CSS/JS · with perspective switching & deep-dive interactions"
  },
  zh: {
    "btn.explore": "深入了解 ↕",
    "btn.collapse": "收起 ↕",
    "agent.replay": "启动回放",
    "agent.replayStop": "停止回放",
    "about.genSummary": "✨ 生成我的简历摘要",
    "genSummary.loading": "AI 生成中…",
    "genSummary.regen": "✨ 重新生成"
  }
};
let currentLang = "zh";
let isPlaying = false;
function t(key) {
  const dict = I18N[currentLang];
  if (dict && dict[key] != null) return dict[key];
  return key;
}
const zhHtmlCache = new WeakMap();
function applyLang(lang) {
  currentLang = lang;
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    const key = el.getAttribute("data-i18n");
    if (!zhHtmlCache.has(el)) zhHtmlCache.set(el, el.innerHTML);
    el.innerHTML = (lang === "en" && I18N.en[key] != null) ? I18N.en[key] : zhHtmlCache.get(el);
  });
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  const genBtn = document.getElementById("genSummary");
  if (genBtn && !genBtn.disabled) genBtn.textContent = t("about.genSummary");
  document.querySelectorAll(".project-card .expand-btn").forEach(function (btn) {
    const container = btn.closest(".project-card");
    const detail = container && container.querySelector(".project-detail");
    const open = detail && detail.classList.contains("is-open");
    btn.textContent = open ? t("btn.collapse") : t("btn.explore");
  });
  const replayLabel = document.querySelector("#replayBtn .replay-label");
  if (replayLabel) replayLabel.textContent = isPlaying ? t("agent.replayStop") : t("agent.replay");
}

document.addEventListener("DOMContentLoaded", function () {
  document.documentElement.classList.add("js");

  /* ---------- 1. 视角切换 ---------- */
  const viewBtns = document.querySelectorAll(".view-btn");
  const meituanCards = document.querySelectorAll("#meituan .project-card");

  viewBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      viewBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      const view = btn.dataset.view;
      meituanCards.forEach(function (card) {
        card.querySelectorAll(".view-pane").forEach(function (pane) {
          pane.hidden = pane.dataset.pane !== view;
        });
      });
    });
  });

  /* ---------- 2. 深耕展开：把内容包进 .detail-inner，用 .is-open 平滑展开 ---------- */
  document.querySelectorAll(".project-detail, .layer-detail").forEach(function (detail) {
    const inner = document.createElement("div");
    inner.className = "detail-inner";
    while (detail.firstChild) inner.appendChild(detail.firstChild);
    detail.appendChild(inner);
    detail.removeAttribute("hidden");
  });

  document.querySelectorAll(".expand-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const container = btn.closest(".project-card, .arch-layer");
      if (!container) return;
      const detail = container.querySelector(".project-detail, .layer-detail");
      if (!detail) return;
      const willShow = !detail.classList.contains("is-open");
      detail.classList.toggle("is-open", willShow);
      btn.setAttribute("aria-expanded", String(willShow));
      if (container.classList.contains("arch-layer")) {
        btn.textContent = willShow ? "−" : "+";
      } else {
        btn.textContent = willShow ? t("btn.collapse") : t("btn.explore");
      }
    });
  });

  /* ---------- 3. 关于我：星球 → 能力雷达 ---------- */
  const RADAR = [
    { name: "数据分析", val: 0.95 },
    { name: "营销策略", val: 0.83 },
    { name: "产品运营", val: 0.88 },
    { name: "AI / Agent", val: 0.85 },
    { name: "自动化", val: 0.82 },
    { name: "商业洞察", val: 0.80 },
  ];

  function buildRadar() {
    const cx = 200, cy = 200, R = 140, n = RADAR.length;
    const ang = (i) => (-90 + (i * 360) / n) * (Math.PI / 180);
    const pt = (i, r) => (cx + r * Math.cos(ang(i))).toFixed(1) + "," + (cy + r * Math.sin(ang(i))).toFixed(1);

    let grid = "";
    [0.25, 0.5, 0.75, 1].forEach(function (lv) {
      let pts = [];
      for (let i = 0; i < n; i++) pts.push(pt(i, R * lv));
      grid += '<polygon class="radar-grid" points="' + pts.join(" ") + '"/>';
    });

    let axesLines = "", labels = "";
    for (let i = 0; i < n; i++) {
      axesLines += '<line class="radar-axis" x1="' + cx + '" y1="' + cy +
        '" x2="' + (cx + R * Math.cos(ang(i))).toFixed(1) +
        '" y2="' + (cy + R * Math.sin(ang(i))).toFixed(1) + '"/>';
      const lx = cx + (R + 22) * Math.cos(ang(i));
      const ly = cy + (R + 22) * Math.sin(ang(i));
      const cos = Math.cos(ang(i));
      const anchor = Math.abs(cos) < 0.3 ? "middle" : (cos > 0 ? "start" : "end");
      labels += '<text class="radar-label" x="' + lx.toFixed(1) + '" y="' + (ly + 4).toFixed(1) +
        '" text-anchor="' + anchor + '">' + RADAR[i].name + "</text>";
    }

    let dpts = [];
    for (let i = 0; i < n; i++) dpts.push(pt(i, R * RADAR[i].val));
    let dots = "";
    for (let i = 0; i < n; i++) {
      const x = (cx + R * RADAR[i].val * Math.cos(ang(i))).toFixed(1);
      const y = (cy + R * RADAR[i].val * Math.sin(ang(i))).toFixed(1);
      dots += '<circle class="radar-dot" cx="' + x + '" cy="' + y + '" r="3.2"/>';
    }

    document.getElementById("radarSvg").innerHTML =
      '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">' +
      grid + axesLines +
      '<polygon class="radar-poly radar-data" points="' + dpts.join(" ") + '"/>' +
      dots + labels +
      "</svg>";

    document.getElementById("capLegend").innerHTML =
      RADAR.map(function (d) { return "<span>" + d.name + "</span>"; }).join("");
  }

  const exploreBtn = document.getElementById("exploreBtn");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", function () {
      const explore = document.getElementById("explore");
      const radarWrap = document.getElementById("radarWrap");
      explore.classList.add("is-leaving");
      setTimeout(function () {
        explore.style.display = "none";
        radarWrap.classList.add("is-in");
        buildRadar();
        const poly = document.querySelector(".radar-poly");
        if (poly) {
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { poly.classList.add("is-shown"); });
          });
        }
      }, 480);
    });
  }

  /* ---------- 4. AI 生成摘要（流式打字机，多份随机） ---------- */
  const genBtn = document.getElementById("genSummary");
  if (genBtn) {
    // 2-3 份内容相近但视角略不同的自述，每次点击随机抽一份（避免连续重复）
    const summaries = [
      "我是杨富杰，北京理工大学管理科学与工程硕士（保研），现于美团核心本地商业从事下沉市场广告策略运营。\n\n" +
      "在美团，问题不再是“把需要做的东西做出来”，而是透过业务流程与分析，搭建自上而下的全链路视角，形成可精准提效、低错误率的 AI Agent 自动化体系。\n\n" +
      "我习惯用 SQL / Python 把亿级数据拆成可量化的指标——收入、货币化率、ARPU、渗透率——让每一个策略都有迹可循。从外卖广告的渗透率提升，到闪购由 CPC 转向 OCPX 的提收，再到 GEO 广告从 0 到 1 的商业化，我逐渐形成“先看清结构、再分阶段落地”的运营打法。\n\n" +
      "而真正让我投入的，是把这套打法翻译成 AI Agent：总部定策略、城市经理拆效率、销售执行台给动作，让一线直接承接标准化的能力；再把数据异常与日报用企微 Webhook 自动推送，把重复的同步交给机器。本科经济学的训练让我重视口径与因果，SCI 一区一作的科研经历则磨出了从复杂系统里找关键变量的耐心。",

      "我是杨富杰，北理工管科硕士，目前在美团做下沉市场广告策略运营。\n\n" +
      "在美团，我越来越清楚：问题不再是“把任务做完”，而是透过业务流程与分析，搭建自上而下的全链路视角，沉淀出可精准提效、低错误率的 AI Agent 自动化体系。\n\n" +
      "我擅长把模糊的业务目标拆成可量化的指标体系——收入、货币化率、ARPU、渗透率——用 SQL / Python 处理亿级数据去找答案。外卖渗透率提升、闪购 CPC 转 OCPX 提收、GEO 广告 0→1 商业化，背后是同一套“先看清结构、再分阶段落地”的打法。\n\n" +
      "更让我兴奋的是把这套打法变成 Agent：总部出策略、城市经理拆效率、销售执行台给动作，配合企微自动化把异常与日报自动推送。经济学教我重视因果，SCI 一区的科研训练给了我拆解复杂系统的耐心与方法。",

      "我是杨富杰，北京理工大学管理科学与工程硕士，现于美团核心本地商业负责下沉市场广告策略运营。\n\n" +
      "在美团，问题不再是“把需求实现出来”，而是透过业务流程与分析，搭建自上而下的全链路视角，形成可精准提效、低错误率的 AI Agent 自动化体系。\n\n" +
      "我的工作起点是数据：用 SQL / Python 把亿级量级拆成收入、货币化率、ARPU、渗透率这些可追踪的指标，让策略不再凭手感。外卖、闪购、GEO 三条线的提效，共同沉淀出“先看清结构、再分阶段落地”的方法论。\n\n" +
      "我把它进一步工程化——搭建总部、城市经理、销售执行台三层 AI Agent，把经营诊断与策略推荐做成标准流程，再用企微 Webhook 把日报和异常自动同步。本科经济学与 SCI 一区科研，给了我做口径严谨、能在复杂系统里抓关键变量的底子。"
    ];

    const summariesEn = [
      "I'm Yang Fujie, M.S. candidate in Management Science & Engineering at BIT (via recommended admission), currently an Ad Strategy Operator for Meituan's Core Local Commerce in sinking markets.\n\n" +
      "At Meituan, the problem is no longer just 'getting things built'; it's building a top-down, full-chain view through business-process analysis, forming an AI Agent automation system that precisely improves efficiency and lowers error rates.\n\n" +
      "I'm used to breaking 100M+ rows of data into measurable metrics with SQL / Python — revenue, monetization rate, ARPU, penetration — so every strategy leaves a trace. From lifting food-delivery penetration, to shifting flash-sale from CPC to OCPX for revenue gains, to building GEO commercialization from 0 to 1, I've formed a playbook of 'see the structure first, then phase in execution.'\n\n" +
      "What really pulls me in is translating that playbook into AI Agents: HQ sets strategy, city managers drive efficiency, the sales desk executes — letting the front line directly inherit standardized capability; then WeCom Webhook auto-pushes anomalies and daily reports, handing repetitive sync to machines. My economics training taught me to respect definitions and causality; my first-author SCI Q1 research honed the patience to find key variables in complex systems.",

      "I'm Yang Fujie, M.S. in Management Science & Engineering from BIT, currently running sinking-market ad-strategy operations at Meituan.\n\n" +
      "At Meituan I've grown clearer that the problem is no longer 'finishing the task,' but building a top-down, full-chain view through business-process analysis, consolidating an AI Agent automation system that precisely improves efficiency and lowers error rates.\n\n" +
      "I'm good at breaking vague business goals into measurable metric systems — revenue, monetization rate, ARPU, penetration — and using SQL / Python on 100M+ rows to find answers. Food-delivery penetration lift, flash-sale CPC→OCPX revenue gains, GEO 0→1 commercialization — all share the same playbook of 'see the structure first, then phase in execution.'\n\n" +
      "What excites me more is turning that playbook into Agents: HQ issues strategy, city managers drive efficiency, the sales desk executes, with WeCom automation pushing anomalies and daily reports. Economics taught me to respect causality; my SCI Q1 research gave me the patience and method to disassemble complex systems.",

      "I'm Yang Fujie, M.S. in Management Science & Engineering at BIT, now leading sinking-market ad-strategy operations for Meituan's Core Local Commerce.\n\n" +
      "At Meituan, the problem is no longer 'implementing the requirement,' but building a top-down, full-chain view through business-process analysis, forming an AI Agent automation system that precisely improves efficiency and lowers error rates.\n\n" +
      "My work starts with data: SQL / Python breaks 100M+ rows into trackable metrics — revenue, monetization rate, ARPU, penetration — so strategy no longer relies on feel. Efficiency gains across food delivery, flash-sale and GEO together distilled a methodology of 'see the structure first, then phase in execution.'\n\n" +
      "I engineered it further — building a three-tier AI Agent of HQ, city managers and sales desk, turning diagnosis and strategy recommendation into a standard process, then syncing daily reports and anomalies via WeCom Webhook. My economics background and SCI Q1 research gave me rigorous definitions and the ability to grab key variables from complex systems."
    ];

    let lastIdx = -1;
    genBtn.addEventListener("click", function () {
      const box = document.getElementById("summaryBox");
      const textEl = document.getElementById("summaryText");
      box.hidden = false;
      genBtn.disabled = true;
      genBtn.textContent = t("genSummary.loading");
      textEl.textContent = "";
      // 随机抽一份，多份时避免与上次相同
      let idx;
      do { idx = Math.floor(Math.random() * summaries.length); }
      while (summaries.length > 1 && idx === lastIdx);
      lastIdx = idx;
      const fullSummary = (currentLang === "en" ? summariesEn : summaries)[idx];
      let i = 0;
      // 先给一个「思考」停顿，再开始流式输出，增强 Agent 实时感
      setTimeout(function () {
        const timer = setInterval(function () {
          textEl.textContent = fullSummary.slice(0, i);
          i++;
          if (i > fullSummary.length) {
            clearInterval(timer);
            genBtn.disabled = false;
            genBtn.textContent = t("genSummary.regen");
          }
        }, 18);
      }, 520);
    });
  }

  /* ---------- 5. 中英双语切换 ---------- */
  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-lang]");
      if (!btn) return;
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      langToggle.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("is-active", b.dataset.lang === lang);
      });
      applyLang(lang);
    });
  }
  applyLang("zh");

  /* ---------- 6. 阅读进度条 ---------- */
  const progress = document.getElementById("progress");
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop || document.body.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    progress.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- 7. 滚动淡入 ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const orbit = entry.target.querySelector(".research-orbit");
          if (orbit) orbit.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
    document.querySelectorAll(".research-orbit").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 8. 科研节点展开 ---------- */
  document.querySelectorAll(".orbit-detail").forEach(function (detail) {
    const inner = document.createElement("div");
    inner.className = "detail-inner";
    while (detail.firstChild) inner.appendChild(detail.firstChild);
    detail.appendChild(inner);
    detail.removeAttribute("hidden");
  });

  document.querySelectorAll(".orbit-node__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const node = btn.closest(".orbit-node");
      const detail = node.querySelector(".orbit-detail");
      const willShow = !detail.classList.contains("is-open");

      detail.classList.toggle("is-open", willShow);
      btn.setAttribute("aria-expanded", String(willShow));
      btn.textContent = willShow ? "收起详情" : "展开详情";
      node.classList.toggle("is-active", willShow);
    });
  });

  /* ---------- 9. AI Agent 流程回放 ---------- */
  const replayBtn = document.getElementById("replayBtn");
  const agentLoop = document.querySelector(".agent-loop");
  const loopNodes = document.querySelectorAll(".loop-node");
  const metricBigs = document.querySelectorAll(".metric-card__big[data-target]");
  const metricTos = document.querySelectorAll(".metric-card__to[data-target]");
  const particles = [
    document.getElementById("animP1"),
    document.getElementById("animP2"),
    document.getElementById("animP3"),
    document.getElementById("animP4")
  ];
  let cycleTimer = null;
  let numbersAnimated = false;

  function animateNumber(el, target, duration, suffix) {
    const start = performance.now();
    const from = parseFloat(el.textContent) || 0;
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = from + (target - from) * ease;
      if (target % 1 === 0) {
        el.textContent = Math.round(val).toLocaleString() + suffix;
      } else {
        el.textContent = val.toFixed(2) + suffix;
      }
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // 单个播放周期；结束后若仍在播放则自动进入下一周期（循环）
  function runCycle() {
    if (!isPlaying) return;
    loopNodes.forEach(function (n) { n.classList.remove("is-active"); });

    // 依次激活节点 + 粒子运动
    const delays = [0, 1200, 2400, 3600];
    delays.forEach(function (d, i) {
      setTimeout(function () {
        if (!isPlaying) return;
        if (particles[i] && particles[i].beginElement) particles[i].beginElement();
        loopNodes[i].classList.add("is-active");
      }, d);
    });

    // 数据数字动画（仅首次滚动，后续周期保持最终值）
    if (!numbersAnimated) {
      setTimeout(function () {
        if (!isPlaying) return;
        metricBigs.forEach(function (el) {
          animateNumber(el, parseFloat(el.dataset.target), 1200, "");
        });
        metricTos.forEach(function (el) {
          if (el.dataset.textTo) {
            el.textContent = el.dataset.textTo;
          } else if (el.dataset.target) {
            animateNumber(el, parseFloat(el.dataset.target), 1200, "%");
          }
        });
        numbersAnimated = true;
      }, 4200);
    }

    // 一个周期约等于 6200ms，结束后若仍播放则再次启动
    cycleTimer = setTimeout(function () {
      if (!isPlaying) return;
      runCycle();
    }, 6600);
  }

  function runReplay() {
    if (isPlaying) return;
    isPlaying = true;
    replayBtn.classList.add("is-playing");
    replayBtn.querySelector(".replay-label").textContent = t("agent.replayStop");
    agentLoop.classList.add("is-playing");
    runCycle();
  }

  function stopReplay() {
    isPlaying = false;
    clearTimeout(cycleTimer);
    replayBtn.classList.remove("is-playing");
    replayBtn.querySelector(".replay-label").textContent = t("agent.replay");
    agentLoop.classList.remove("is-playing");
    loopNodes.forEach(function (n) { n.classList.remove("is-active"); });
  }

  if (replayBtn && agentLoop) {
    replayBtn.addEventListener("click", function () {
      if (isPlaying) stopReplay(); else runReplay();
    });
  }

  /* ---------- 10. 科研论文标签切换 ---------- */
  const researchTabs = document.querySelectorAll(".research-tab");
  const researchCases = document.querySelectorAll(".research-case");
  researchTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const target = tab.dataset.tab;
      researchTabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      researchCases.forEach(function (c) {
        const active = c.dataset.case === target;
        c.classList.toggle("is-active", active);
        c.hidden = !active;
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
    });
  });

  /* ---------- 年份 ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
