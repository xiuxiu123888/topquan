# -*- coding: utf-8 -*-
"""Build a self-contained products.html that mirrors ProductCenter, and add the header dropdown to every export page."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
src = (root / "src" / "data" / "companyData.ts").read_text(encoding="utf-8")
export = root / "export"


def skip(s, i):
    while i < len(s):
        if s[i].isspace():
            i += 1
        elif s.startswith("//", i):
            n = s.find("\n", i)
            i = len(s) if n < 0 else n + 1
        elif s.startswith("/*", i):
            n = s.find("*/", i)
            i = len(s) if n < 0 else n + 2
        else:
            break
    return i


def parse_string(s, i):
    q = s[i]
    i += 1
    out = []
    while i < len(s) and s[i] != q:
        if s[i] == "\\":
            out.append(s[i + 1])
            i += 2
        else:
            out.append(s[i])
            i += 1
    return "".join(out), i + 1


def parse_value(s, i):
    i = skip(s, i)
    if s[i] in "'\"":
        return parse_string(s, i)
    if s[i] == "{":
        return parse_obj(s, i)
    if s[i] == "[":
        return parse_arr(s, i)
    if s[i].isdigit() or (s[i] == "-" and s[i + 1].isdigit()):
        j = i + 1
        while j < len(s) and (s[j].isdigit() or s[j] == "."):
            j += 1
        raw = s[i:j]
        return (float(raw) if "." in raw else int(raw)), j
    j = i
    while j < len(s) and (s[j].isalnum() or s[j] == "_"):
        j += 1
    word = s[i:j]
    if word == "true":
        return True, j
    if word == "false":
        return False, j
    if word in ("null", "undefined"):
        return None, j
    raise ValueError(f"bad token {word!r} at {i}")


def parse_obj(s, i):
    i = skip(s, i)
    assert s[i] == "{"
    i += 1
    obj = {}
    while True:
        i = skip(s, i)
        if s[i] == "}":
            return obj, i + 1
        if s[i] in "'\"":
            key, i = parse_string(s, i)
        else:
            j = i
            while s[j].isalnum() or s[j] == "_":
                j += 1
            key = s[i:j]
            i = j
        i = skip(s, i)
        assert s[i] == ":", s[i : i + 30]
        val, i = parse_value(s, i + 1)
        obj[key] = val
        i = skip(s, i)
        if s[i] == ",":
            i += 1


def parse_arr(s, i):
    i = skip(s, i)
    assert s[i] == "["
    i += 1
    arr = []
    while True:
        i = skip(s, i)
        if s[i] == "]":
            return arr, i + 1
        val, i = parse_value(s, i)
        arr.append(val)
        i = skip(s, i)
        if s[i] == ",":
            i += 1


start = src.index("export const PRODUCTS_CATALOG")
start = src.index("= [", start) + 2
products, _ = parse_arr(src, start)
keep = [
    "id", "name", "category", "categoryName", "platform", "series", "tagline",
    "formFactor", "cooling", "processor", "chipset", "maxFreq", "memory",
    "storage", "pcieSlots", "networking", "latencyBench", "powerSupply",
    "targetScenarios", "keyFeatures", "specsTable", "badge", "pdfUrl",
    "pdfFileSize", "pdfPages",
]
clean = []
for p in products:
    item = {k: p.get(k) for k in keep if k in p}
    clean.append(item)
data = json.dumps(clean, ensure_ascii=False).replace("<", "\\u003c")

CATS = [
    ("hft", "高频服务器", "纳秒级超低延迟、特挑超频，分 Intel 与 AMD 双架构，专为量化做市与撮合穿透定制"),
    ("gpu", "GPU服务器", "多卡高密度算力，分 Intel 与 AMD 双架构，赋能 AI 量化多因子与实时推理"),
    ("general", "普通服务器", "企业级稳健通用计算，分 Intel 与 AMD 双架构，行情清洗分发与集群存储节点"),
    ("accessory", "配件 (内含网卡等)", "Solarflare 25G网卡、FPGA硬件加速卡、超低损耗跳线与超频内存"),
]

DROP_CSS = r'''
    .drop { position: relative; }
    .drop > a { display: inline-flex; align-items: center; gap: 2px; }
    .chev { color: #94a3b8; transition: transform .2s; }
    .drop:hover .chev, .drop:focus-within .chev { transform: rotate(180deg); color: #0263E0; }
    .drop-panel {
      display: none; position: absolute; left: 50%; top: 100%; transform: translateX(-50%);
      width: 560px; max-width: calc(100vw - 32px); padding-top: 8px; z-index: 80;
    }
    .drop-box {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
      box-shadow: 0 18px 40px rgba(15,23,42,.16); padding: 16px;
      display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px;
      width: 100%; min-width: 0; overflow: hidden;
    }
    .drop:hover .drop-panel, .drop:focus-within .drop-panel { display: block; }
    .menu .drop-panel a.item {
      display: block; min-width: 0; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;
      background: #fff; color: #0f172a; font-weight: 700; font-size: 14px;
      white-space: normal; line-height: 1.35;
    }
    .menu .drop-panel a.item:hover { border-color: #7dd3fc; background: rgba(240,249,255,.65); color: #0263E0; }
    .item-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; min-width: 0; }
    .item-top b { min-width: 0; }
    .item-top em { flex: none; font-style: normal; font-size: 10px; font-family: ui-monospace, Consolas, monospace; font-weight: 500; background: #f1f5f9; color: #475569; border-radius: 4px; padding: 1px 6px; }
    .menu .drop-panel a.item small { display: block; font-weight: 400; color: #64748b; font-size: 12px; line-height: 1.45; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .drop-foot { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 12px; min-width: 0; max-width: 100%; padding: 8px 4px 0; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; }
    .drop-foot span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .menu .drop-foot a { flex: none; display: inline; width: auto; padding: 0; margin: 0; border: 0; border-radius: 0; background: none; color: #0263E0; font-size: 12px; font-weight: 600; line-height: 1.4; white-space: nowrap; }
    .menu .drop-foot a:hover { background: none; text-decoration: underline; }
    .menu .btn { display: none; }
    @media (max-width: 980px) {
      .drop-panel { position: static; transform: none; width: auto; padding: 0 0 8px 8px; display: block; }
      .drop-box { box-shadow: none; border: 0; padding: 0; width: auto; }
      .drop-foot { display: block; }
      .nav-check:checked ~ .menu .btn { display: inline-flex; width: 100%; margin-top: 8px; }
    }
'''


def nav(active):
    def mark(name):
        return ' class="on"' if active == name else ""

    items = []
    for cid, label, desc in CATS:
        items.append(
            f'<a class="item" href="products.html?cat={cid}">'
            f'<span class="item-top"><b>{label}</b><em>Intel / AMD</em></span>'
            f"<small>{desc}</small></a>"
        )
    return f'''<nav class="menu">
        <a{mark("home")} href="homepage.html">首页</a>
        <div class="drop">
          <a{mark("products")} href="products.html">产品中心 <svg class="chev" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></a>
          <div class="drop-panel"><div class="drop-box">
            {''.join(items)}
            <div class="drop-foot"><span>均提供详细配置与 PDF 规格书在线预览/下载</span><a href="products.html">浏览完整产品中心页面 →</a></div>
          </div></div>
        </div>
        <a{mark("partners")} href="partners.html">合作伙伴</a>
        <a{mark("service")} href="service.html">服务支持</a>
        <a{mark("contact")} href="contact.html">联系我们</a>
        <a class="btn btn-primary" href="contact.html">联系我们</a>
      </nav>'''


def patch(path, active):
    html = path.read_text(encoding="utf-8")
    if ".drop-panel" not in html:
        html = html.replace("</style>", DROP_CSS + "\n  </style>", 1)
    html = re.sub(r"<nav class=\"menu\">.*?</nav>", nav(active), html, count=1, flags=re.S)
    path.write_text(html, encoding="utf-8")


CHROME = r'''
    :root { --blue:#0263E0; --blue-dark:#0052cc; --navy:#0B2545; --ink:#0B1E36; --text:#1e293b; --max:1280px; }
    * { box-sizing:border-box; }
    body { margin:0; color:var(--text); font-family:"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif; background:#f8fafc; }
    a { color:inherit; text-decoration:none; }
    img { max-width:100%; display:block; }
    button { font-family:inherit; }
    .wrap { width:min(var(--max), calc(100% - 32px)); margin:0 auto; }
    .topbar { background:var(--navy); color:#cbd5e1; font-size:12px; padding:8px 0; border-bottom:1px solid #1e293b; }
    .topbar .wrap, .foot-bottom { display:flex; align-items:center; justify-content:space-between; gap:16px; }
    .dot { width:6px; height:6px; border-radius:50%; background:#34d399; display:inline-block; margin-right:8px; }
    .topbar a { color:#fff; }
    header { position:sticky; top:0; z-index:50; background:rgba(255,255,255,.96); border-bottom:1px solid #e2e8f0; box-shadow:0 2px 12px rgba(0,0,0,.03); }
    .nav { position:relative; min-height:80px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; column-gap:16px; }
    .brand { grid-column:1; justify-self:start; }
    .logo { height:64px; width:auto; }
    .menu { grid-column:2; justify-self:center; display:flex; align-items:center; gap:2px; margin:0; }
    .menu > a, .drop > a { padding:8px 12px; border-radius:6px; font-size:14px; font-weight:500; color:#334155; white-space:nowrap; line-height:1.2; }
    .menu > a:hover, .drop > a:hover, .menu > a.on, .drop > a.on { color:var(--blue); background:#f0f9ff; font-weight:600; }
    .actions { grid-column:3; justify-self:end; display:flex; align-items:center; gap:8px; }
    .nav-check { position:absolute; width:1px; height:1px; opacity:0; pointer-events:none; }
    .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:36px; padding:0 14px; border-radius:6px; font-size:12px; font-weight:600; border:1px solid transparent; white-space:nowrap; cursor:pointer; background:#fff; }
    .btn-primary { background:var(--blue); color:#fff; }
    .btn-primary:hover { background:var(--blue-dark); }
    .btn-ghost { color:#334155; border-color:#e2e8f0; }
    .btn-ghost:hover { color:var(--blue); border-color:#7dd3fc; background:#f0f9ff; }
    .menu-toggle { display:none; }
    footer { background:var(--ink); color:#94a3b8; font-size:12px; padding:56px 0 28px; }
    .foot { display:grid; grid-template-columns:1.6fr 1fr 1fr 1fr; gap:32px; }
    footer h4 { color:#fff; margin:0 0 14px; font-size:14px; }
    footer ul { margin:0; padding:0; }
    footer li { list-style:none; margin:0 0 10px; }
    footer a:hover { color:#fff; }
    footer p { line-height:1.7; }
    .logo-light { background:#fff; border-radius:8px; padding:4px 8px; height:56px; width:auto; }
    .foot-bottom { margin-top:36px; padding-top:20px; border-top:1px solid #1e293b; font-size:11px; }
    @media (max-width:980px) {
      .menu, .actions { display:none; }
      .menu-toggle { display:inline-flex; grid-column:3; justify-self:end; }
      .nav-check:checked ~ .menu { display:flex; flex-direction:column; align-items:stretch; position:absolute; left:0; right:0; top:100%; margin:0; padding:8px 16px 16px; background:#fff; border-bottom:1px solid #e2e8f0; box-shadow:0 12px 24px rgba(15,23,42,.08); z-index:30; }
      .nav-check:checked ~ .menu > a, .nav-check:checked ~ .menu .drop > a { padding:12px 10px; }
      .foot, .topbar .wrap, .foot-bottom { display:block; }
      .hide-sm { display:none; }
    }
'''

PROD_CSS = r'''
    .prod { padding:40px 0 64px; }
    .head-row { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; padding-bottom:24px; margin-bottom:24px; border-bottom:1px solid #e2e8f0; }
    .kicker { display:inline-flex; align-items:center; gap:6px; color:#0263E0; font-size:12px; font-weight:700; letter-spacing:.08em; }
    .prod h1 { margin:8px 0 8px; font-size:36px; letter-spacing:-.02em; line-height:1.25; }
    .sub { margin:0; max-width:640px; color:#475569; font-size:14px; line-height:1.7; }
    .cats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-bottom:24px; min-width:0; }
    .cat { min-width:0; overflow:hidden; text-align:left; border:1px solid #e2e8f0; background:#fff; border-radius:12px; padding:14px; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,.04); }
    .cat.on { background:#0F2847; color:#fff; border-color:#0F2847; box-shadow:0 0 0 2px rgba(2,99,224,.5); }
    .cat-top { display:flex; align-items:center; justify-content:space-between; gap:8px; }
    .cat b { font-size:14px; }
    .cat .count { font-size:11px; font-family:ui-monospace,Consolas,monospace; background:#f1f5f9; color:#475569; border-radius:4px; padding:1px 8px; }
    .cat.on .count { background:rgba(14,165,233,.3); color:#bae6fd; }
    .cat p { margin:8px 0 0; font-size:11px; color:#64748b; line-height:1.4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .cat.on p { color:#cbd5e1; }
    .plat { background:#fff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 1px 2px rgba(0,0,0,.04); padding:16px; margin-bottom:32px; display:flex; flex-wrap:wrap; align-items:center; gap:12px; }
    .switch { display:inline-flex; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:8px; padding:4px; }
    .switch button, .chip, .pager button, .mini, .navbtn { cursor:pointer; border:0; background:transparent; }
    .switch button { display:inline-flex; align-items:center; gap:8px; padding:8px 16px; border-radius:6px; font-size:12px; font-weight:700; color:#475569; }
    .switch button.on-intel { background:#0263E0; color:#fff; }
    .switch button.on-amd { background:#C43A1A; color:#fff; }
    .switch em { font-style:normal; font-size:10px; font-family:ui-monospace,Consolas,monospace; background:#e2e8f0; color:#475569; border-radius:4px; padding:1px 6px; }
    .switch button.on-intel em, .switch button.on-amd em, .chip.on em { background:rgba(255,255,255,.2); color:#fff; }
    .model-label { font-size:12px; font-weight:700; color:#94a3b8; letter-spacing:.04em; white-space:nowrap; }
    .chips { display:flex; align-items:center; gap:8px; overflow-x:auto; flex:1; justify-content:flex-end; }
    .chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:8px; border:1px solid #e2e8f0; background:#f8fafc; color:#334155; font-size:12px; font-weight:700; font-family:ui-monospace,Consolas,monospace; white-space:nowrap; }
    .chip em { font-style:normal; font-family:"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif; font-weight:500; font-size:10px; background:#e2e8f0; color:#475569; border-radius:4px; padding:1px 6px; }
    .chip.on { background:#0263E0; color:#fff; border-color:#0263E0; }
    .chip.on.amd { background:#C43A1A; border-color:#C43A1A; }
    .pager { display:inline-flex; align-items:center; gap:8px; }
    .pager span { font-size:12px; color:#64748b; font-family:ui-monospace,Consolas,monospace; }
    .pager .pair { display:inline-flex; border:1px solid #e2e8f0; background:#f8fafc; border-radius:8px; padding:2px; }
    .pager button { width:28px; height:28px; border-radius:6px; color:#475569; }
    .pager button:hover { background:#fff; }
    .stage { background:#fff; border:1px solid #e2e8f0; border-radius:16px; box-shadow:0 1px 2px rgba(0,0,0,.04); overflow:hidden; }
    .stage-pad { padding:32px 40px; }
    .crumbs { display:flex; align-items:center; gap:8px; font-size:12px; color:#64748b; padding-bottom:12px; margin-bottom:16px; border-bottom:1px solid #f1f5f9; overflow-x:auto; }
    .crumbs button { border:0; background:none; color:#475569; cursor:pointer; font-size:12px; padding:0; white-space:nowrap; }
    .crumbs button:hover { color:#0263E0; }
    .crumbs .cur { font-family:ui-monospace,Consolas,monospace; font-weight:700; color:#0263E0; background:#f0f9ff; border:1px solid #bae6fd; border-radius:4px; padding:1px 8px; }
    .title-row { display:flex; justify-content:space-between; gap:20px; align-items:flex-start; }
    .badges { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; }
    .badge { font-size:12px; font-weight:700; border-radius:4px; padding:4px 10px; }
    .b-id { background:#0F2847; color:#fff; font-family:ui-monospace,Consolas,monospace; }
    .b-blue { background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; }
    .b-rose { background:#fff1f2; color:#9f1239; border:1px solid #fecdd3; }
    .b-sky { background:#e0f2fe; color:#0263E0; }
    .b-ok { background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; font-weight:500; }
    .stage h2 { margin:0 0 8px; font-size:32px; letter-spacing:-.02em; line-height:1.25; }
    .tagline { margin:0; color:#475569; font-size:15px; line-height:1.7; max-width:720px; }
    .ops { display:flex; flex-wrap:wrap; gap:8px; flex-shrink:0; }
    .ops button, .ops a { display:inline-flex; align-items:center; gap:6px; height:40px; padding:0 14px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; border:1px solid transparent; }
    .op-line { background:#fff; border-color:#cbd5e1; color:#1e293b; }
    .op-soft { background:#f0f9ff; border-color:#bae6fd; color:#0263E0; }
    .op-fill { background:#0263E0; color:#fff; }
    .split { margin-top:32px; display:grid; grid-template-columns:5fr 7fr; gap:28px; align-items:start; }
    .photo { background:linear-gradient(#0f172a,#020617 40%,#0F2847); color:#fff; border-radius:16px; padding:22px; border:1px solid #1e293b; }
    .photo-top, .photo-chips { display:flex; justify-content:space-between; align-items:center; gap:8px; font-size:12px; }
    .photo-top { margin-bottom:12px; font-family:ui-monospace,Consolas,monospace; }
    .live { color:#38bdf8; font-weight:700; }
    .photo figure { position:relative; margin:0; border-radius:12px; overflow:hidden; border:1px solid rgba(51,65,85,.8); background:#020617; }
    .photo img { width:100%; height:280px; object-fit:cover; }
    .cap { position:absolute; left:12px; right:12px; bottom:12px; display:flex; justify-content:space-between; gap:8px; font-size:11px; }
    .cap span, .float-id { background:rgba(15,23,42,.9); border:1px solid #334155; border-radius:6px; padding:3px 8px; }
    .cap .ok { color:#6ee7b7; border-color:#065f46; background:rgba(6,78,59,.9); }
    .float-id { position:absolute; left:12px; top:12px; color:#7dd3fc; font-family:ui-monospace,Consolas,monospace; font-weight:700; border-color:rgba(14,165,233,.4); }
    .quick { margin-top:16px; padding-top:16px; border-top:1px solid #1e293b; display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .quick div { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:12px; padding:12px; }
    .quick small { display:block; color:#94a3b8; font-size:10px; letter-spacing:.06em; }
    .quick b { display:block; margin-top:4px; font-size:13px; }
    .quick i { display:block; margin-top:4px; font-style:normal; color:#38bdf8; font-size:11px; font-family:ui-monospace,Consolas,monospace; }
    .specbox { border:1px solid #e2e8f0; border-radius:16px; padding:22px; }
    .spec-head { display:flex; justify-content:space-between; gap:12px; align-items:flex-end; padding-bottom:16px; margin-bottom:16px; border-bottom:1px solid #e2e8f0; }
    .spec-head span { font-size:12px; font-weight:700; color:#64748b; letter-spacing:.04em; }
    .spec-head h3 { margin:4px 0 0; font-size:18px; }
    .mini { height:32px; padding:0 10px; border-radius:8px; font-size:12px; font-weight:700; margin-left:6px; }
    .mini.gray { background:#f1f5f9; color:#334155; }
    .mini.sky { background:#f0f9ff; color:#0263E0; }
    table { width:100%; border-collapse:collapse; font-size:12px; }
    .table-wrap { border:1px solid #e2e8f0; border-radius:12px; overflow:auto; }
    thead { background:#0F2847; color:#fff; }
    th, td { text-align:left; padding:10px 16px; vertical-align:top; }
    th { font-weight:600; letter-spacing:.04em; }
    td:first-child, th:first-child { width:34%; white-space:nowrap; }
    tbody tr:nth-child(even) { background:#f8fafc; }
    td:first-child { font-weight:700; color:#334155; background:rgba(248,250,252,.7); }
    .note { margin-top:12px; padding-top:12px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; gap:12px; font-size:11px; color:#94a3b8; }
    .note b { color:#0263E0; font-family:ui-monospace,Consolas,monospace; }
    .feats { padding:32px 40px; background:rgba(248,250,252,.7); border-top:1px solid #e2e8f0; }
    .feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:16px; }
    .feat { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:20px; }
    .num { width:32px; height:32px; border-radius:8px; background:#f0f9ff; color:#0263E0; border:1px solid #e0f2fe; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; margin-bottom:12px; }
    .feat h4 { margin:0 0 8px; font-size:14px; }
    .feat p { margin:0; color:#475569; font-size:12px; line-height:1.7; }
    .feat .okline { margin-top:16px; padding-top:12px; border-top:1px solid #f1f5f9; color:#94a3b8; font-size:11px; }
    .scenes { padding:24px 40px 32px; background:rgba(248,250,252,.7); }
    .scene { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:20px; display:flex; justify-content:space-between; gap:16px; align-items:center; }
    .scene h3 { margin:0 0 4px; font-size:12px; letter-spacing:.04em; }
    .scene p { margin:0; color:#64748b; font-size:12px; }
    .tags { display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end; }
    .tags span { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:6px 12px; font-size:12px; font-weight:700; }
    .bottom-nav { margin-top:20px; background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:20px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
    .navbtn { display:flex; align-items:center; gap:12px; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:10px 16px; text-align:left; }
    .navbtn.right { text-align:right; }
    .navbtn i { width:32px; height:32px; border-radius:8px; background:#f1f5f9; display:inline-flex; align-items:center; justify-content:center; font-style:normal; }
    .navbtn small { display:block; color:#94a3b8; font-size:11px; }
    .navbtn b { font-family:ui-monospace,Consolas,monospace; font-size:12px; }
    .dots { text-align:center; font-size:12px; color:#64748b; }
    .dots .row { margin-top:6px; display:flex; justify-content:center; gap:6px; }
    .dots button { width:8px; height:6px; border:0; border-radius:99px; background:#e2e8f0; cursor:pointer; padding:0; }
    .dots button.on { width:24px; background:#0263E0; }
    .dots button.on.amd { background:#C43A1A; }
    .cta { margin-top:20px; background:#0f172a; color:#fff; border-radius:16px; padding:24px 28px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
    .cta p { margin:4px 0 0; color:#cbd5e1; font-size:12px; }
    .cta a { background:#0263E0; color:#fff; border-radius:8px; padding:10px 16px; font-size:12px; font-weight:700; white-space:nowrap; }
    .crumbbar { display:none; position:fixed; top:112px; left:0; right:0; z-index:40; background:rgba(255,255,255,.96); border-bottom:1px solid #e2e8f0; box-shadow:0 6px 16px rgba(15,23,42,.06); }
    .crumbbar.show { display:block; }
    .crumbbar .wrap { min-height:48px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
    .crumbbar .ops button, .crumbbar .ops a { height:28px; padding:0 8px; font-size:11px; }
    .modal { position:fixed; inset:0; z-index:90; background:rgba(2,6,23,.72); display:flex; align-items:center; justify-content:center; padding:24px; }
    .modal[hidden] { display:none; }
    .dialog { background:#fff; border-radius:16px; width:min(1100px,100%); max-height:90vh; display:flex; flex-direction:column; overflow:hidden; }
    .dialog header { position:static; background:#0F2847; color:#fff; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; box-shadow:none; border:0; }
    .dialog header p { margin:0; color:#7dd3fc; font-size:12px; letter-spacing:.06em; }
    .dialog header h3 { margin:4px 0 0; font-size:18px; }
    .dialog header button { background:rgba(255,255,255,.1); color:#fff; border:0; border-radius:8px; width:32px; height:32px; cursor:pointer; }
    .dialog .body { padding:24px; overflow:auto; background:#f8fafc; }
    .dialog footer { padding:14px 20px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; font-size:12px; color:#64748b; }
    .toast { position:fixed; right:24px; bottom:24px; z-index:95; background:#0B2545; color:#fff; border:1px solid #0284c7; border-radius:10px; padding:14px 18px; box-shadow:0 12px 30px rgba(0,0,0,.25); font-size:12px; }
    .toast[hidden] { display:none; }
    .toast b { display:block; margin-bottom:4px; }
    @media (max-width:980px) {
      .prod h1, .stage h2 { font-size:26px; }
      .head-row, .title-row, .scene, .bottom-nav, .cta, .split, .feat-grid, .cats { display:grid; grid-template-columns:1fr; }
      .cats { grid-template-columns:1fr 1fr; }
      .stage-pad, .feats, .scenes { padding:20px; }
      .chips { justify-content:flex-start; }
      .photo img { height:200px; }
    }
'''

JS = r'''
const CATS = [
  {id:'hft', label:'高频服务器', desc:'纳秒级超低延迟、特挑超频，分 Intel 与 AMD 双架构，专为量化做市与撮合穿透定制'},
  {id:'gpu', label:'GPU服务器', desc:'多卡高密度算力，分 Intel 与 AMD 双架构，赋能 AI 量化多因子与实时推理'},
  {id:'general', label:'普通服务器', desc:'企业级稳健通用计算，分 Intel 与 AMD 双架构，行情清洗分发与集群存储节点'},
  {id:'accessory', label:'配件 (内含网卡等)', desc:'Solarflare 25G网卡、FPGA硬件加速卡、超低损耗跳线与超频内存'}
];
const PRODUCTS = __DATA__;
const params = new URLSearchParams(location.search);
let cat = CATS.some(c => c.id === params.get('cat')) ? params.get('cat') : 'hft';
let platform = params.get('platform') === 'AMD' ? 'AMD' : 'Intel';
let selectedId = params.get('id') || '';

function esc(s){return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function byCat(id){return PRODUCTS.filter(p => p.category === id);}
function currentList(){
  const items = byCat(cat);
  if (cat === 'accessory') return items;
  return items.filter(p => p.platform === platform);
}
function ensure(){
  if (selectedId){
    const hit = PRODUCTS.find(p => p.id === selectedId);
    if (hit){
      cat = hit.category;
      if (hit.platform === 'AMD' || hit.platform === 'Intel') platform = hit.platform;
    }
  }
  let list = currentList();
  if (cat !== 'accessory' && !list.length){
    platform = platform === 'Intel' ? 'AMD' : 'Intel';
    list = currentList();
  }
  if (!list.some(p => p.id === selectedId)) selectedId = list[0] ? list[0].id : PRODUCTS[0].id;
}
function sync(){
  const q = new URLSearchParams();
  q.set('cat', cat);
  if (cat !== 'accessory') q.set('platform', platform);
  q.set('id', selectedId);
  history.replaceState(null, '', 'products.html?' + q.toString());
}
function product(){return PRODUCTS.find(p => p.id === selectedId) || PRODUCTS[0];}
function pick(id){
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  cat = p.category;
  if (p.platform === 'AMD' || p.platform === 'Intel') platform = p.platform;
  selectedId = p.id;
  render();
  document.getElementById('stage').scrollIntoView({behavior:'smooth', block:'start'});
}
function step(dir){
  const list = currentList();
  if (list.length < 2) return;
  const i = list.findIndex(p => p.id === selectedId);
  pick(list[(i + dir + list.length) % list.length].id);
}
function crumb(p, inline){
  const catLabel = (CATS.find(c => c.id === cat) || {}).label || '';
  const plat = cat === 'accessory' ? '通用' : (p.platform === 'AMD' ? 'amd' : 'intel');
  return `<nav class="crumbs">
    <button data-action="top">产品中心</button><span>›</span>
    <button data-action="cats">${esc(catLabel)}</button><span>›</span>
    <button data-action="plat">${esc(plat)}</button><span>›</span>
    <span class="cur">${esc(p.id)}</span>
  </nav>`;
}
function render(){
  ensure();
  sync();
  const p = product();
  const list = currentList();
  const index = Math.max(0, list.findIndex(x => x.id === p.id));
  const catLabel = (CATS.find(c => c.id === cat) || {}).label || '';
  const platLabel = cat === 'accessory' ? '通用' : (p.platform === 'AMD' ? 'amd' : 'intel');
  const intelN = byCat(cat).filter(x => x.platform === 'Intel').length;
  const amdN = byCat(cat).filter(x => x.platform === 'AMD').length;
  const cats = CATS.map(c => {
    const n = byCat(c.id).length;
    return `<button class="cat${c.id===cat?' on':''}" data-action="cat" data-id="${c.id}"><span class="cat-top"><b>${esc(c.label)}</b><span class="count">${n} 款</span></span><p>${esc(c.desc)}</p></button>`;
  }).join('');
  const platformBar = cat === 'accessory'
    ? `<div class="model-label">配件与硬件加速卡 · 纳秒级网卡、FPGA加速卡与特挑超频内存</div>`
    : `<div class="switch">
        <button data-action="platform" data-id="Intel" class="${platform==='Intel'?'on-intel':''}">Intel 平台大类 <em>${intelN} 款机型</em></button>
        <button data-action="platform" data-id="AMD" class="${platform==='AMD'?'on-amd':''}">AMD 平台大类 <em>${amdN} 款机型</em></button>
      </div>`;
  const chips = list.map(item => `<button class="chip${item.id===p.id?' on':''}${item.platform==='AMD'?' amd':''}" data-action="model" data-id="${esc(item.id)}"><span>${esc(item.id)}</span>${item.badge?`<em>${esc(item.badge)}</em>`:''}</button>`).join('');
  const pager = list.length > 1 ? `<div class="pager"><span>${index+1} / ${list.length}</span><span class="pair"><button data-action="prev" title="上一款">‹</button><button data-action="next" title="下一款">›</button></span></div>` : '';
  const rows = (p.specsTable||[]).map(s => `<tr><td>${esc(s.label)}</td><td>${esc(s.value)}</td></tr>`).join('');
  const feats = (p.keyFeatures||[]).map((feat, i) => {
    const parts = String(feat).split('：');
    const title = parts.length > 1 ? parts[0] : `核心特点 0${i+1}`;
    const desc = parts.length > 1 ? parts.slice(1).join('：') : feat;
    return `<article class="feat"><div class="num">0${i+1}</div><h4>${esc(title)}</h4><p>${esc(desc)}</p><div class="okline">✓ 金融严苛可靠性通过</div></article>`;
  }).join('');
  const scenes = (p.targetScenarios||[]).map(s => `<span>${esc(s)}</span>`).join('');
  const platClass = p.platform === 'AMD' ? 'b-rose' : (p.platform === 'Universal' ? 'b-ok' : 'b-blue');
  const platText = p.platform === 'Universal' ? '通用平台兼容' : `${p.platform} 架构平台`;
  const prev = list.length > 1 ? list[(index - 1 + list.length) % list.length] : null;
  const next = list.length > 1 ? list[(index + 1) % list.length] : null;
  const amdDot = p.platform === 'AMD' ? ' amd' : '';
  document.getElementById('app').innerHTML = `
    <div class="head-row">
      <div>
        <div class="kicker">▣ 产品中心 · 金融级算力矩阵</div>
        <h1>产品中心 · 全系硬件配置体系</h1>
        <p class="sub">包含高频服务器、GPU服务器、普通服务器与专用配件，分 <strong>Intel</strong>、<strong>AMD</strong> 两大类平台，大类下展示详细配置与工程规格。</p>
      </div>
      <button class="btn btn-ghost" data-action="compare">查看全系参数对比表</button>
    </div>
    <div id="category-selector" class="cats">${cats}</div>
    <div id="platform-selector" class="plat">
      ${platformBar}
      <div class="chips"><span class="model-label">切换机型:</span>${chips}</div>
      ${pager}
    </div>
    <div id="stage">
      <article class="stage">
        <div class="stage-pad">
          ${crumb(p)}
          <div class="title-row">
            <div>
              <div class="badges">
                <span class="badge b-id">型号: ${esc(p.id)}</span>
                <span class="badge b-blue">${esc(p.categoryName)}</span>
                <span class="badge ${platClass}">${esc(platText)}</span>
                ${p.badge ? `<span class="badge b-sky">${esc(p.badge)}</span>` : ''}
                <span class="badge b-ok">✓ CCC 认证</span>
              </div>
              <h2>${esc(p.name)}</h2>
              <p class="tagline">${esc(p.tagline)}</p>
            </div>
            <div class="ops">
              <button class="op-line" data-action="pdf">PDF跳转预览 ↗</button>
              <button class="op-soft" data-action="download">下载 PDF (${esc(p.pdfFileSize||'')})</button>
              <a class="op-fill" href="contact.html">联系我们 →</a>
            </div>
          </div>
          <div class="split">
            <div class="photo">
              <div class="photo-top"><span class="live">● 实机工程实物展示</span><span>${esc(p.formFactor)} 标准机架式</span></div>
              <figure>
                <img src="images/server.jpg" alt="${esc(p.id)} ${esc(p.name)}">
                <span class="float-id">${esc(p.id)} 工业级样机</span>
                <div class="cap"><span class="ok">✓ 72H 满载烤机出厂</span><span>${esc(String(p.cooling||'').split('(')[0])}</span></div>
              </figure>
              <div class="quick">
                <div><small>处理器架构</small><b>${esc(String(p.processor||'').split('(')[0])}</b><i>${esc(p.maxFreq)}</i></div>
                <div><small>整机供电</small><b>${esc(p.powerSupply)}</b><i style="color:#34d399">1年保修 · 7×24 支持</i></div>
              </div>
            </div>
            <div class="specbox">
              <div class="spec-head">
                <div><span>硬件技术规格明细</span><h3>${esc(p.id)} 真实工程参数矩阵</h3></div>
                <div><button class="mini gray" data-action="pdf">PDF预览</button><button class="mini sky" data-action="download">下载规格表</button></div>
              </div>
              <div class="table-wrap"><table><thead><tr><th>工程参数项</th><th>配置详情与测试指标</th></tr></thead><tbody>${rows}</tbody></table></div>
              <div class="note"><span>* 具体技术配置支持按需增配及软硬件协同定制</span><b>CCC 认证 · 严苛实盘验证</b></div>
            </div>
          </div>
        </div>
        <div class="feats">
          <span class="kicker">核心特点与架构优势</span>
          <h3 style="margin:6px 0 0;font-size:18px">${esc(p.id)} 专属软硬件协同调优</h3>
          <div class="feat-grid">${feats}</div>
        </div>
        <div class="scenes">
          <div class="scene">
            <div><h3>● 推荐交易与量化应用场景</h3><p>经过头部证券期货机构实盘测试，${esc(p.id)} 推荐部署于以下核心业务线：</p></div>
            <div class="tags">${scenes}</div>
          </div>
        </div>
      </article>
      ${list.length > 1 ? `<div class="bottom-nav">
        <button class="navbtn" data-action="prev"><i>←</i><span><small>上一款机型</small><b>${esc(prev.id)}</b></span></button>
        <div class="dots">${esc(p.platform)} 大类 · 当前展示第 <strong>${index+1}</strong> 款（共 ${list.length} 款）<div class="row">${list.map((item,i)=>`<button class="${i===index?'on':''}${amdDot}" data-action="model" data-id="${esc(item.id)}" title="${esc(item.id)}"></button>`).join('')}</div></div>
        <button class="navbtn right" data-action="next"><span><small>下一款机型</small><b>${esc(next.id)}</b></span><i>→</i></button>
      </div>` : ''}
      <div class="cta">
        <div><b>需要针对量化策略或金融机房浅机柜进行深度非标定制？</b><p>冠量科技支持从特定进深机箱、主板 PCIe 拓扑、闭环液冷结构到 FPGA 网卡固件的全栈联调。</p></div>
        <a href="contact.html">提交非标定制需求</a>
      </div>
    </div>`;
  const bar = document.getElementById('crumbbar');
  bar.innerHTML = `<div class="wrap"><nav class="crumbs" style="border:0;margin:0;padding:0">
      <button data-action="top">产品中心</button><span>›</span>
      <button data-action="cats">${esc(catLabel)}</button><span>›</span>
      <button data-action="plat">${esc(platLabel)}</button><span>›</span>
      <span class="cur">${esc(p.id)}</span>
    </nav>
    <div class="ops">
      <span class="hide-sm" style="font-size:12px;color:#475569;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.name)}</span>
      <button class="op-line" data-action="pdf">PDF预览</button>
      <button class="op-soft" data-action="download">下载PDF</button>
      <a class="op-fill" href="contact.html">联系我们</a>
      ${list.length>1?`<span class="pair" style="display:inline-flex;border:1px solid #e2e8f0;border-radius:6px"><button data-action="prev">‹</button><button data-action="next">›</button></span>`:''}
    </div></div>`;
}
function openCompare(){
  const list = currentList();
  const platName = cat === 'accessory' ? '通用' : platform;
  const catLabel = (CATS.find(c => c.id === cat) || {}).label || '';
  const head = list.map(p => `<th><div style="color:#0263E0;font-family:ui-monospace,monospace">${esc(p.id)}</div><div style="font-weight:400;color:#64748b">${esc(p.name)}</div><button class="mini sky" data-action="model" data-id="${esc(p.id)}" data-close="1">切换到本款</button></th>`).join('');
  const row = (label, pick, cls='') => `<tr class="${cls}"><td>${label}</td>${list.map(p => `<td>${esc(pick(p))}</td>`).join('')}</tr>`;
  document.getElementById('compare').innerHTML = `<div class="dialog">
    <header><div><p>${esc(catLabel)} (${esc(platName)} 平台) · 横向对比</p><h3>标准参数对比矩阵</h3></div><button data-action="close">×</button></header>
    <div class="body"><div class="table-wrap"><table>
      <thead><tr><th>规格对比项</th>${head}</tr></thead>
      <tbody>
        ${row('机箱形态', p => p.formFactor)}
        ${row('主频/超频', p => p.maxFreq)}
        ${row('处理器 (CPU)', p => p.processor)}
        ${row('主板芯片组', p => p.chipset || '专属架构')}
        ${row('内存配置', p => p.memory)}
        ${row('硬盘存储', p => p.storage)}
        ${row('冷却系统', p => p.cooling)}
        ${row('专用交易网卡', p => p.networking)}
        ${row('供电系统', p => p.powerSupply)}
      </tbody>
    </table></div></div>
    <footer><span>点击“切换到本款”即可在主舞台详细查阅该机型全部软硬件参数与架构</span><button class="btn btn-ghost" data-action="close">关闭对比窗口</button></footer>
  </div>`;
  document.getElementById('compare').hidden = false;
}
function openPdf(){
  const p = product();
  const rows = (p.specsTable||[]).map(s => `<tr><td>${esc(s.label)}</td><td>${esc(s.value)}</td></tr>`).join('');
  document.getElementById('pdf').innerHTML = `<div class="dialog">
    <header><div><p>规格白皮书在线预览 · ${esc(p.pdfPages || '')} 页 · ${esc(p.pdfFileSize || '')}</p><h3>${esc(p.id)} ${esc(p.name)}</h3></div><button data-action="close-pdf">×</button></header>
    <div class="body"><div class="table-wrap"><table><thead><tr><th>工程参数项</th><th>配置详情与测试指标</th></tr></thead><tbody>${rows}</tbody></table></div></div>
    <footer><span>${esc(p.pdfUrl || '')}</span><button class="btn btn-primary" data-action="download">下载 PDF</button></footer>
  </div>`;
  document.getElementById('pdf').hidden = false;
}
let toastTimer;
function download(){
  const p = product();
  const toast = document.getElementById('toast');
  toast.hidden = false;
  toast.innerHTML = `<b>已触发规格书 PDF 下载</b><span>正在下载 ${esc(p.id)} 完整硬件白皮书文档</span>`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-action]');
  if (!t) {
    if (e.target.id === 'compare' || e.target.id === 'pdf') e.target.hidden = true;
    return;
  }
  const action = t.dataset.action;
  if (action === 'cat'){ cat = t.dataset.id; selectedId = ''; render(); }
  else if (action === 'platform'){ platform = t.dataset.id; selectedId = ''; render(); }
  else if (action === 'model'){ if (t.dataset.close) document.getElementById('compare').hidden = true; pick(t.dataset.id); }
  else if (action === 'prev') step(-1);
  else if (action === 'next') step(1);
  else if (action === 'compare') openCompare();
  else if (action === 'pdf') openPdf();
  else if (action === 'download') download();
  else if (action === 'close') document.getElementById('compare').hidden = true;
  else if (action === 'close-pdf') document.getElementById('pdf').hidden = true;
  else if (action === 'top') document.getElementById('products').scrollIntoView({behavior:'smooth'});
  else if (action === 'cats') document.getElementById('category-selector').scrollIntoView({behavior:'smooth'});
  else if (action === 'plat') document.getElementById('platform-selector').scrollIntoView({behavior:'smooth'});
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'Escape'){ document.getElementById('compare').hidden = true; document.getElementById('pdf').hidden = true; }
});
window.addEventListener('scroll', () => {
  const stage = document.getElementById('stage');
  if (!stage) return;
  document.getElementById('crumbbar').classList.toggle('show', stage.getBoundingClientRect().top <= 160);
}, {passive:true});
render();
'''.replace("__DATA__", data)

footer = '''
  <footer>
    <div class="wrap foot">
      <div>
        <img class="logo-light" src="images/logo.png" alt="冠量科技">
        <p>深圳冠量科技有限公司成立于2015年，是一家具有自主创新能力并为金融市场客户提供高频交易设备的金融科技企业。</p>
        <p>联系电话：<strong style="color:#fff">0755-23003729 / 18923779722</strong><br>官方邮箱：<strong style="color:#fff">zhouwd@topquant.com.cn</strong><br>地址：深圳市宝安区留仙一路2号高新奇园区2期1栋A601</p>
      </div>
      <div><h4>产品中心</h4><ul>
        <li><a href="products.html?cat=hft">高频服务器</a></li>
        <li><a href="products.html?cat=gpu">GPU服务器</a></li>
        <li><a href="products.html?cat=general">普通服务器</a></li>
        <li><a href="products.html?cat=accessory">配件</a></li>
      </ul></div>
      <div><h4>生态与服务支持</h4><ul>
        <li><a href="partners.html">合作伙伴</a></li>
        <li><a href="service.html">驱动下载中心</a></li>
        <li><a href="service.html">7×24小时应急技术电话</a></li>
        <li><a href="service.html">原厂底层参数定制与调优</a></li>
      </ul></div>
      <div><h4>联系我们</h4><ul>
        <li><a href="contact.html">研发总部地址</a></li>
        <li><a href="contact.html">联系电话与邮箱</a></li>
        <li><a href="homepage.html">返回网站首页</a></li>
      </ul></div>
    </div>
    <div class="wrap foot-bottom"><span>© 2026 深圳冠量科技有限公司 保留所有权利</span><span>金融级硬件可靠性合规 · 严格保密协议（NDA） · ISO9001</span></div>
  </footer>'''

page = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>产品中心 | 深圳冠量科技</title>
  <style>{CHROME}{DROP_CSS}{PROD_CSS}</style>
</head>
<body>
  <div class="topbar"><div class="wrap"><span><i class="dot"></i>金融级低时延服务器 · 自主创新与严格品控</span><span class="hide-sm">服务于证券、期货及量化交易机构 · 始于2015年</span><a href="tel:0755-23003729">服务专线: 0755-23003729</a></div></div>
  <header>
    <div class="nav wrap">
      <a class="brand" href="homepage.html"><img class="logo" src="images/logo.png" alt="冠量科技 TOP QUANT"></a>
      <input class="nav-check" id="nav-toggle" type="checkbox">
      <label class="menu-toggle btn btn-ghost" for="nav-toggle">菜单</label>
      {nav("products")}
      <div class="actions">
        <a class="btn btn-primary" href="contact.html">联系我们</a>
      </div>
    </div>
  </header>
  <div id="crumbbar" class="crumbbar"></div>
  <main id="products" class="prod"><div class="wrap" id="app"></div></main>
  <div id="compare" class="modal" hidden></div>
  <div id="pdf" class="modal" hidden></div>
  <div id="toast" class="toast" hidden></div>
  {footer}
  <script>{JS}</script>
</body>
</html>
'''

(export / "products.html").write_text(page, encoding="utf-8")
for name, active in [("homepage.html", "home"), ("partners.html", "partners"), ("service.html", "service"), ("contact.html", "contact")]:
    patch(export / name, active)
print("products", len(clean), [p["id"] for p in clean])
print("specs", len(clean[0].get("specsTable", [])))
