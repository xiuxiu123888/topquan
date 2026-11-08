const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "export", "products.html");
const html = fs.readFileSync(file, "utf8");
const start = html.indexOf("const PRODUCTS = ");
const jsonStart = html.indexOf("[", start);
let depth = 0;
let jsonEnd = -1;
for (let i = jsonStart; i < html.length; i++) {
  if (html[i] === "[") depth++;
  else if (html[i] === "]") {
    depth--;
    if (depth === 0) { jsonEnd = i + 1; break; }
  }
}
const PRODUCTS = JSON.parse(html.slice(jsonStart, jsonEnd));
const CATS = [
  ["hft", "高频服务器", "纳秒级超低延迟、特挑超频，分 Intel 与 AMD 双架构，专为量化做市与撮合穿透定制"],
  ["gpu", "GPU服务器", "多卡高密度算力，分 Intel 与 AMD 双架构，赋能 AI 量化多因子与实时推理"],
  ["general", "普通服务器", "企业级稳健通用计算，分 Intel 与 AMD 双架构，行情清洗分发与集群存储节点"],
  ["accessory", "配件 (内含网卡等)", "Solarflare 25G网卡、FPGA硬件加速卡、超低损耗跳线与超频内存"]
];
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function groups(catId) {
  const items = PRODUCTS.filter(p => p.category === catId);
  if (catId === "accessory") return [{ id: "accessory-all", platform: "通用", items }];
  return ["Intel", "AMD"].map(platform => ({
    id: catId + "-" + platform.toLowerCase(),
    platform,
    items: items.filter(p => p.platform === platform)
  })).filter(g => g.items.length);
}
function article(p, list, index) {
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  const platClass = p.platform === "AMD" ? "b-rose" : (p.platform === "Universal" ? "b-ok" : "b-blue");
  const platText = p.platform === "Universal" ? "通用平台兼容" : p.platform + " 架构平台";
  const rows = (p.specsTable || []).map(s => "<tr><td>" + esc(s.label) + "</td><td>" + esc(s.value) + "</td></tr>").join("");
  const feats = (p.keyFeatures || []).map((feat, i) => {
    const parts = String(feat).split("：");
    const title = parts.length > 1 ? parts[0] : "核心特点 0" + (i + 1);
    const desc = parts.length > 1 ? parts.slice(1).join("：") : feat;
    return '<article class="feat"><div class="num">0' + (i + 1) + "</div><h4>" + esc(title) + "</h4><p>" + esc(desc) + '</p><div class="okline">✓ 金融严苛可靠性通过</div></article>';
  }).join("");
  const scenes = (p.targetScenarios || []).map(s => "<span>" + esc(s) + "</span>").join("");
  const catLabel = (CATS.find(c => c[0] === p.category) || [])[1] || "";
  const plat = p.category === "accessory" ? "通用" : (p.platform === "AMD" ? "amd" : "intel");
  return `
      <article class="stage" id="sku-${esc(p.id)}">
        <div class="stage-pad">
          <nav class="crumbs"><a href="#products">产品中心</a><span>›</span><a href="#cat-${esc(p.category)}">${esc(catLabel)}</a><span>›</span><a href="#${esc(p.category)}-${plat === "通用" ? "all" : plat}">${esc(plat)}</a><span>›</span><span class="cur">${esc(p.id)}</span></nav>
          <div class="title-row">
            <div>
              <div class="badges">
                <span class="badge b-id">型号: ${esc(p.id)}</span>
                <span class="badge b-blue">${esc(p.categoryName)}</span>
                <span class="badge ${platClass}">${esc(platText)}</span>
                ${p.badge ? '<span class="badge b-sky">' + esc(p.badge) + "</span>" : ""}
                <span class="badge b-ok">✓ CCC 认证</span>
              </div>
              <h2>${esc(p.name)}</h2>
              <p class="tagline">${esc(p.tagline)}</p>
            </div>
            <div class="ops"><a class="op-fill" href="contact.html">联系我们 →</a></div>
          </div>
          <div class="split">
            <div class="photo">
              <div class="photo-top"><span class="live">● 实机工程实物展示</span><span>${esc(p.formFactor)}</span></div>
              <figure>
                <img src="images/server.jpg" alt="${esc(p.id)} ${esc(p.name)}">
                <span class="float-id">${esc(p.id)} 工业级样机</span>
                <div class="cap"><span class="ok">✓ 72H 满载烤机出厂</span><span>${esc(String(p.cooling || "").split("(")[0])}</span></div>
              </figure>
              <div class="quick">
                <div><small>处理器架构</small><b>${esc(String(p.processor || "").split("(")[0])}</b><i>${esc(p.maxFreq)}</i></div>
                <div><small>整机供电</small><b>${esc(p.powerSupply)}</b><i style="color:#34d399">1年保修 · 7×24 支持</i></div>
              </div>
            </div>
            <div class="specbox">
              <div class="spec-head"><div><span>硬件技术规格明细</span><h3>${esc(p.id)} 真实工程参数矩阵</h3></div></div>
              <div class="table-wrap"><table><thead><tr><th>工程参数项</th><th>配置详情与测试指标</th></tr></thead><tbody>${rows}</tbody></table></div>
              <div class="note"><span>* 具体技术配置支持按需增配及软硬件协同定制</span><b>CCC 认证 · 严苛实盘验证</b></div>
            </div>
          </div>
        </div>
        <div class="feats"><span class="kicker">核心特点与架构优势</span><h3 style="margin:6px 0 0;font-size:18px">${esc(p.id)} 专属软硬件协同调优</h3><div class="feat-grid">${feats}</div></div>
        <div class="scenes"><div class="scene"><div><h3>● 推荐交易与量化应用场景</h3><p>经过头部证券期货机构实盘测试，${esc(p.id)} 推荐部署于以下核心业务线：</p></div><div class="tags">${scenes}</div></div></div>
        ${list.length > 1 ? '<div class="bottom-nav"><a class="navbtn" href="#sku-' + esc(prev.id) + '"><i>←</i><span><small>上一款机型</small><b>' + esc(prev.id) + '</b></span></a><div class="dots">' + esc(p.platform) + " 大类</div><a class=\"navbtn right\" href=\"#sku-" + esc(next.id) + '"><span><small>下一款机型</small><b>' + esc(next.id) + "</b></span><i>→</i></a></div>" : ""}
      </article>`;
}
const cats = CATS.map(([id, label, desc]) => {
  const n = PRODUCTS.filter(p => p.category === id).length;
  return '<a class="cat" href="#cat-' + id + '"><span class="cat-top"><b>' + esc(label) + '</b><span class="count">' + n + ' 款</span></span><p>' + esc(desc) + "</p></a>";
}).join("");
const blocks = CATS.map(([id, label]) => {
  const gs = groups(id);
  const body = gs.map(g => {
    const chips = g.items.map(p => '<a class="chip' + (p.platform === "AMD" ? " amd" : "") + '" href="#sku-' + esc(p.id) + '"><span>' + esc(p.id) + "</span>" + (p.badge ? "<em>" + esc(p.badge) + "</em>" : "") + "</a>").join("");
    const cards = g.items.map((p, i) => article(p, g.items, i)).join("");
    const platLabel = g.platform === "Intel" ? "Intel 平台" : (g.platform === "AMD" ? "AMD 平台" : "全部配件");
    return '<div class="plat" id="' + g.id + '"><span class="model-label">' + platLabel + "</span><div class=\"chips\">" + chips + "</div></div>" + cards;
  }).join("");
  const switches = id === "accessory" ? "" : '<div class="switch" style="margin-bottom:16px"><a class="on-intel" href="#' + id + '-intel">Intel 平台</a><a class="on-amd" href="#' + id + '-amd">AMD 平台</a></div>';
  return '<section class="cat-block" id="cat-' + id + '"><h2 style="margin:0 0 16px;font-size:28px">' + esc(label) + "</h2>" + switches + body + "</section>";
}).join("");
const inner = `
    <div class="head-row">
      <div>
        <div class="kicker">▣ 产品中心 · 金融级算力矩阵</div>
        <h1>产品中心 · 全系硬件配置体系</h1>
        <p class="sub">包含高频服务器、GPU服务器、普通服务器与专用配件。点击分类或型号，会跳到对应产品。</p>
      </div>
    </div>
    <div id="category-selector" class="cats">${cats}</div>
    ${blocks}
`;
const open = '<div class="wrap" id="app">';
const a = html.indexOf(open);
const b = html.indexOf("</div></main>", a);
if (a < 0 || b < 0) {
  console.error("markers missing", a, b);
  process.exit(1);
}
let next = html.slice(0, a + open.length) + inner + html.slice(b);
next = next.replace('<div class="wrap" id="app">', '<div class="wrap" id="app" data-static="1">');
next = next.replace("\nrender();\n</script>", '\nif (!document.getElementById("app").dataset.static) render();\n</script>');
fs.writeFileSync(file, next);
console.log("products", PRODUCTS.length, "html", inner.length);
