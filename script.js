/* ============================================================
   个人网站交互逻辑
   1) 视角切换（招聘者 / 产品运营 / 技术伙伴 / 漫游者）
   2) 深耕展开（grid 0fr→1fr 平滑过渡，Apple 风格）
   3) 关于我：星球 → 开启探索 → 六维能力雷达
   4) AI 生成摘要（流式打字机效果）
   5) 亮 / 暗主题手动切换
   6) 阅读进度条
   7) 滚动淡入（IntersectionObserver）
   ============================================================ */

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
        btn.textContent = willShow ? "收起 ↕" : "深入了解 ↕";
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

    let lastIdx = -1;
    genBtn.addEventListener("click", function () {
      const box = document.getElementById("summaryBox");
      const textEl = document.getElementById("summaryText");
      box.hidden = false;
      genBtn.disabled = true;
      genBtn.textContent = "AI 生成中…";
      textEl.textContent = "";
      // 随机抽一份，多份时避免与上次相同
      let idx;
      do { idx = Math.floor(Math.random() * summaries.length); }
      while (summaries.length > 1 && idx === lastIdx);
      lastIdx = idx;
      const fullSummary = summaries[idx];
      let i = 0;
      // 先给一个「思考」停顿，再开始流式输出，增强 Agent 实时感
      setTimeout(function () {
        const timer = setInterval(function () {
          textEl.textContent = fullSummary.slice(0, i);
          i++;
          if (i > fullSummary.length) {
            clearInterval(timer);
            genBtn.disabled = false;
            genBtn.textContent = "✨ 重新生成";
          }
        }, 18);
      }, 520);
    });
  }

  /* ---------- 5. 主题切换 ---------- */
  const html = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  function syncIcon() {
    const t = html.getAttribute("data-theme");
    toggle.textContent = t === "light" ? "☀️" : "🌙";
  }
  toggle.addEventListener("click", function () {
    const t = html.getAttribute("data-theme");
    let next;
    if (t === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      next = prefersDark ? "light" : "dark";
    } else if (t === "dark") {
      next = "light";
    } else {
      next = "dark";
    }
    html.setAttribute("data-theme", next);
    syncIcon();
  });
  syncIcon();

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
  let isPlaying = false;
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
    replayBtn.querySelector(".replay-label").textContent = "停止回放";
    agentLoop.classList.add("is-playing");
    runCycle();
  }

  function stopReplay() {
    isPlaying = false;
    clearTimeout(cycleTimer);
    replayBtn.classList.remove("is-playing");
    replayBtn.querySelector(".replay-label").textContent = "启动回放";
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
