# -*- coding: utf-8 -*-
"""Rebuild the overclock server catalog from the confirmed Excel sheets."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NIC = "选配Solarflare X2522-25G -Plus/ X4522-Plus或Cisco 低延迟网卡或信创低延迟网卡（满配光模块）"
CASE = "2U机架式，含导轨"
COOL = "高效2U闭环液冷系统"

def clean(s):
    return re.sub(r"\s+", " ", s).strip()

def item(pid, chip, series, platform, cpus, freq, mem, disk, pcie, lan, mgmt, psu, chipset):
    cpus = [clean(c) for c in cpus]
    cpu_text = "；".join(cpus)
    title = f"TopQuant {chip} 2U超频服务器" if len(cpus) > 1 else f"TopQuant {clean(cpus[0].split('、')[0])} 2U超频服务器"
    specs = [
        ("机箱", CASE),
        ("主板芯片组", chipset),
        ("CPU", cpu_text),
        ("全核超频", freq),
        ("内存", mem),
        ("硬盘", disk),
        ("冷却系统", COOL),
        ("网卡", NIC),
        ("PCIe扩展", pcie),
        ("Lan口", lan),
        ("管理", mgmt),
        ("电源", psu),
    ]
    return {
        "id": pid,
        "chip": chip,
        "name": title,
        "category": "hft",
        "categoryName": "超频服务器",
        "platform": platform,
        "series": series,
        "tagline": f"{CASE} · 全核超频 {freq} · {COOL}",
        "formFactor": CASE,
        "cooling": COOL,
        "processor": cpu_text,
        "chipset": chipset,
        "maxFreq": freq,
        "memory": mem,
        "storage": disk,
        "pcieSlots": pcie,
        "networking": NIC,
        "latencyBench": freq,
        "powerSupply": psu,
        "targetScenarios": ["高频、量化交易"],
        "keyFeatures": [
            f"全核超频：{freq}",
            f"冷却系统：{COOL}",
            f"网卡：{NIC}",
        ],
        "specsTable": [{"label": a, "value": b} for a, b in specs],
        "badge": series,
        "mgmt": mgmt,
        "lan": lan,
        "pdfUrl": "",
        "pdfFileSize": "",
        "pdfPages": 0,
    }

INTEL = [
    item("14900KS", "14900KS", "酷睿", "Intel",
         ["Intel Core i9-14900KS、24C/32T、L3=36MB"],
         "大核5.9GHz或8大核5.8GHz+16小核4.3GHz",
         "64GB(2*32GB，DDR5-6400MHz）", "标配2*480GB（硬件RAID1）",
         "2*PCIe5.0 x16", "1*10Gb RJ45、1*2.5Gb RJ45",
         "IPMI管理卡（含VGA口）", "2个CRPS 800W（冗余）电源", "Intel Z790"),
    item("285K", "285K", "酷睿", "Intel",
         ["Intel Core Ultra 9 285K、24C/24T、L3=36MB"],
         "大核5.4GHz",
         "64GB(2*32GB，DDR5-6400MHz）", "标配2*480GB（硬件RAID1）",
         "2*PCIe5.0 x16", "1*10Gb RJ45、1*2.5Gb RJ45",
         "IPMI管理卡（含VGA口）", "2个CRPS 800W（冗余）电源", "Intel Z890"),
    item("W7-2495X", "2495X", "至强 W", "Intel",
         ["Intel Xeon W7-2495X、24C/48T、L3=45MB"], "4.9GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "4*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W790芯片组"),
    item("W7-2595X", "2595X", "至强 W", "Intel",
         ["Intel Xeon w7-2595X、26C/52T、L3=48MB"], "4.9GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "4*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W790芯片组"),
    item("W7-3465X", "3465X", "至强 W", "Intel",
         ["Intel Xeon W7-3465X、28C/56T、L3=75MB"], "4.8GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W790芯片组"),
    item("W9-3575X", "3575X", "至强 W", "Intel",
         ["Intel Xeon w9-3575X、44C/88T、L3=97.5MB"], "4.6GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W790芯片组"),
    item("W9-3495X", "3495X", "至强 W", "Intel",
         ["Intel Xeon W9-3495X、56C/112T、L3=105MB"], "4.3GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W790芯片组"),
    item("W9-3595X", "3595X", "至强 W", "Intel",
         ["Intel Xeon w9-3595X、60C/120T、L3=112.5MB"], "4.3GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W790芯片组"),
    item("XEON-658X", "658X", "至强 6", "Intel",
         ["Intel Xeon 658X Processor、24C/48T、L3=144MB"], "5.0GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W890 Chipset"),
    item("XEON-676X", "676X", "至强 6", "Intel",
         ["Intel Xeon 676X Processor、32C/64T、L3=144MB"], "4.9GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W890 Chipset"),
    item("XEON-678X", "678X", "至强 6", "Intel",
         ["Intel Xeon 678X Processor、48C/96T、L3=192MB"], "4.7GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W890 Chipset"),
    item("XEON-696X", "696X", "至强 6", "Intel",
         ["Intel Xeon 696X Processor、64C/128T、L3=336MB"], "4.4GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W890 Chipset"),
    item("XEON-698X", "698X", "至强 6", "Intel",
         ["Intel Xeon 698X Processor、86C/172T、L3=336MB"], "4.3GHz",
         "128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "Intel W890 Chipset"),
]

AMD = [
    item("R9-9950", "9950", "锐龙", "AMD", [
        "AMD Ryzen 9 9950X、16C/32T、L3=64MB",
        "AMD Ryzen 9 9950X3D、16C/32T、L3=96MB",
        "AMD Ryzen 9 9950X3D2、16C/32T、L3=128MB",
    ], "5.5GHz", "标配64GB(2*32GB，DDR5-6000MHz）", "标配2*480GB（硬件RAID1）",
       "2*PCIe5.0 x16", "1*10Gb RJ45、1*2.5Gb RJ45", "IPMI管理卡（含VGA口）",
       "2个CRPS 800W（冗余）电源", "AMD X870"),
    item("TRP-7965-9965", "7965 / 9965", "线程撕裂者 Pro", "AMD", [
        "AMD Ryzen Threadripper PRO 7965WX、24C/48T、L3=128MB",
        "AMD Ryzen Threadripper PRO 9965WX、24C/48T、L3=128MB",
    ], "5.3GHz", "标配128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（硬件RAID1）",
       "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
       "2个CRPS 1200W（冗余）电源", "AMD WRX90"),
    item("TRP-7975-9975", "7975 / 9975", "线程撕裂者 Pro", "AMD", [
        "AMD Ryzen Threadripper PRO 7975WX、32C/64T、L3=128MB",
        "AMD Ryzen Threadripper PRO 9975WX、32C/64T、L3=128MB",
    ], "5.0GHz", "标配128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（硬件RAID1）",
       "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
       "2个CRPS 1200W（冗余）电源", "AMD WRX90"),
    item("TRP-7985-9985", "7985 / 9985", "线程撕裂者 Pro", "AMD", [
        "AMD Ryzen Threadripper PRO 7985WX、64C/128T、L3=256MB",
        "AMD Ryzen Threadripper PRO 9985WX、64C/128T、L3=256MB",
    ], "4.8GHz", "标配128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（硬件RAID1）",
       "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
       "2个CRPS 1200W（冗余）电源", "AMD WRX90"),
    item("TRP-7995-9995", "7995 / 9995", "线程撕裂者 Pro", "AMD", [
        "AMD Ryzen Threadripper PRO 7995WX、96C/192T、L3=384MB",
        "AMD Ryzen Threadripper PRO 9995WX、96C/192T、L3=384MB",
    ], "4.6GHz", "标配128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（硬件RAID1）",
       "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
       "2个CRPS 1600W（冗余）电源", "AMD WRX90芯片组"),
    item("TR-7960-9960", "7960 / 9960", "线程撕裂者", "AMD", [
        "AMD Ryzen Threadripper 7960X、24C/48T、L3=128MB",
        "AMD Ryzen Threadripper 9960X、24C/48T、L3=128MB",
    ], "5.3GHz", "标配128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（硬件RAID1）",
       "4*PCIe5.0 x16", "1*10Gb RJ45、1*2.5Gb RJ45", "IPMI管理卡（含VGA口）",
       "2个CRPS 1200W（冗余）电源", "AMD TRX50芯片组"),
    item("TR-7970-9970", "7970 / 9970", "线程撕裂者", "AMD", [
        "AMD Ryzen Threadripper 7970X、32C/64T、L3=128MB",
        "AMD Ryzen Threadripper 9970X、32C/64T、L3=128MB",
    ], "5.0GHz", "标配128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（硬件RAID1）",
       "4*PCIe5.0 x16", "1*10Gb RJ45、1*2.5Gb RJ45", "IPMI管理卡（含VGA口）",
       "2个CRPS 1200W（冗余）电源", "AMD TRX50芯片组"),
    item("TR-7980-9980", "7980 / 9980", "线程撕裂者", "AMD", [
        "AMD Ryzen Threadripper 7980X、64C/128T、L3=256MB",
        "AMD Ryzen Threadripper 9980X、64C/128T、L3=256MB",
    ], "4.8GHz", "标配128GB(4*32GB，DDR5-6400MHz）", "标配2*960GB（硬件RAID1）",
       "4*PCIe5.0 x16", "1*10Gb RJ45、1*2.5Gb RJ45", "IPMI管理卡（含VGA口）",
       "2个CRPS 1200W（冗余）电源", "AMD TRX50芯片组"),
    item("TRP-5995", "5995", "线程撕裂者 Pro", "AMD",
         ["AMD Ryzen Threadripper PRO 5995WX、64C/128T、L3=256MB"],
         "4.3GHz", "标配128GB(4*32GB，DDR4-3200MHz）", "标配2*960GB（硬件RAID1）",
         "7*PCIe5.0 x16", "2*10Gb RJ45", "独立管理口（板载IPMI）",
         "2个CRPS 1200W（冗余）电源", "AMD WRX80"),
]

PRODUCTS = INTEL + AMD

def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"))

def article(p, group):
    idx = group.index(p)
    prev = group[(idx - 1) % len(group)]
    nxt = group[(idx + 1) % len(group)]
    plat = "intel" if p["platform"] == "Intel" else "amd"
    badge_cls = "b-blue" if p["platform"] == "Intel" else "b-rose"
    rows = "".join(f"<tr><td>{esc(r['label'])}</td><td>{esc(r['value'])}</td></tr>" for r in p["specsTable"])
    feats = "".join(
        f'<article class="feat"><div class="num">{i:02d}</div><h4>{esc(t.split("：",1)[0])}</h4><p>{esc(t.split("：",1)[1])}</p></article>'
        for i, t in enumerate(p["keyFeatures"], 1)
    )
    nav = ""
    if len(group) > 1:
        nav = (
            f'<div class="bottom-nav"><a class="navbtn" href="#sku-{prev["id"]}"><i>←</i><span><small>上一款</small><b>{esc(prev["chip"])}</b></span></a>'
            f'<div class="dots">{esc(p["platform"])} 超频</div>'
            f'<a class="navbtn right" href="#sku-{nxt["id"]}"><span><small>下一款</small><b>{esc(nxt["chip"])}</b></span><i>→</i></a></div>'
        )
    return f'''<article class="stage" id="sku-{p["id"]}">
        <div class="stage-pad">
          <nav class="crumbs"><a href="#products">产品中心</a><span>›</span><a href="#cat-hft">超频服务器</a><span>›</span><a href="#hft-{plat}">{plat}</a><span>›</span><span class="cur">{esc(p["chip"])}</span></nav>
          <div class="title-row">
            <div>
              <div class="badges">
                <span class="badge b-id">型号: {esc(p["chip"])}</span>
                <span class="badge b-blue">超频服务器</span>
                <span class="badge {badge_cls}">{esc(p["platform"])} 平台</span>
                <span class="badge b-sky">{esc(p["series"])}</span>
              </div>
              <h2>{esc(p["name"])}</h2>
              <p class="tagline">{esc(p["tagline"])}</p>
            </div>
            <div class="ops"><a class="op-fill" href="contact?view=1">联系我们 →</a></div>
          </div>
          <div class="split">
            <div class="photo">
              <div class="photo-top"><span class="live">● 实机工程实物展示</span><span>{esc(CASE)}</span></div>
              <figure>
                <img src="images/server.jpg" alt="{esc(p["name"])}">
                <span class="float-id">{esc(p["chip"])}</span>
                <div class="cap"><span class="ok">✓ {esc(COOL)}</span><span>全核超频 {esc(p["maxFreq"])}</span></div>
              </figure>
              <div class="quick">
                <div><small>处理器</small><b>{esc(p["processor"])}</b><i>全核超频 {esc(p["maxFreq"])}</i></div>
                <div><small>电源</small><b>{esc(p["powerSupply"])}</b><i>{esc(p["lan"])}</i></div>
              </div>
            </div>
            <div class="specbox">
              <div class="spec-head"><div><span>硬件技术规格明细</span><h3>{esc(p["chip"])} 定稿配置</h3></div></div>
              <div class="table-wrap"><table><thead><tr><th>配置项</th><th>定稿参数</th></tr></thead><tbody>{rows}</tbody></table></div>
              <div class="note"><span>* 网卡为选配，其余项目按公司定稿表</span><b>{esc(p["series"])}</b></div>
            </div>
          </div>
        </div>
        <div class="feats"><span class="kicker">定稿配置要点</span><h3 style="margin:6px 0 0;font-size:18px">{esc(p["chip"])}</h3><div class="feat-grid">{feats}</div></div>
        {nav}
      </article>'''

def chips(group):
    parts = []
    for p in group:
        amd = " amd" if p["platform"] == "AMD" else ""
        parts.append(f'<a class="chip{amd}" href="#sku-{p["id"]}"><span>{esc(p["chip"])}</span><em>{esc(p["series"])}</em></a>')
    return "".join(parts)

def app_html():
    intel_ids = ",".join(f"#sku-{p['id']}:target" for p in INTEL)
    body = f'''
    <div class="head-row">
      <div>
        <div class="kicker">▣ 产品中心 · 超频服务器</div>
        <h1>超频服务器 · 定稿配置</h1>
        <p class="sub">按公司定稿表列出 Intel 与 AMD 超频服务器。选中平台或型号后，只显示这一款。</p>
      </div>
    </div>
    <div id="category-selector" class="cats"><a class="cat on" href="#cat-hft"><span class="cat-top"><b>超频服务器</b><span class="count">{len(PRODUCTS)} 款</span></span><p>Intel {len(INTEL)} 款，AMD {len(AMD)} 款。机箱均为 2U，含导轨，高效 2U 闭环液冷。</p></a></div>
    <section class="cat-block" id="cat-hft"><h2 style="margin:0 0 16px;font-size:28px">超频服务器</h2>
      <div class="switch" style="margin-bottom:16px"><a class="on-intel" href="#hft-intel">Intel 平台</a><a class="on-amd" href="#hft-amd">AMD 平台</a></div>
      <div class="plat" id="hft-intel"><span class="model-label">Intel 平台</span><div class="chips">{chips(INTEL)}</div></div>
      {''.join(article(p, INTEL) for p in INTEL)}
      <div class="plat" id="hft-amd"><span class="model-label">AMD 平台</span><div class="chips">{chips(AMD)}</div></div>
      {''.join(article(p, AMD) for p in AMD)}
    </section>'''
    return body, intel_ids

def css_block():
    intel_sel = ", ".join(f"#sku-{p['id']}:target" for p in INTEL)
    amd_sel = ", ".join(f"#sku-{p['id']}:target" for p in AMD)
    intel_has = ", ".join(f"#sku-{p['id']}:target" for p in INTEL)
    amd_has = ", ".join(f"#sku-{p['id']}:target" for p in AMD)
    intel_chips = ",\n".join(
        f'#hft-intel:has(~ #sku-{p["id"]}:target) a.chip[href="#sku-{p["id"]}"]' for p in INTEL
    )
    amd_chips = ",\n".join(
        f'#hft-amd:has(~ #sku-{p["id"]}:target) a.chip[href="#sku-{p["id"]}"]' for p in AMD
    )
    first_i = INTEL[0]["id"]
    first_a = AMD[0]["id"]
    return f'''
    .cats {{ grid-template-columns: minmax(0, 460px); }}
    .cat-block, .stage {{ display:none; }}
    .plat {{ display:none; }}
    .switch a.on-intel, .switch a.on-amd {{ background:transparent; color:#475569; }}
    #app:not(:has(:target)) #cat-hft,
    #cat-hft:target,
    #cat-hft:has(:target) {{ display:block; }}
    #app:not(:has(:target)) #hft-intel,
    #cat-hft:target #hft-intel,
    #hft-intel:target,
    #cat-hft:has({intel_has}) #hft-intel {{ display:flex; }}
    #app:not(:has(:target)) #sku-{first_i},
    #cat-hft:target #sku-{first_i},
    #hft-intel:target ~ #sku-{first_i},
    {intel_sel} {{ display:block; }}
    #hft-amd:target,
    #cat-hft:has({amd_has}) #hft-amd {{ display:flex; }}
    #hft-amd:target ~ #sku-{first_a},
    {amd_sel} {{ display:block; }}
    #app:not(:has(:target)) #cat-hft .switch a[href="#hft-intel"],
    #cat-hft:target .switch a[href="#hft-intel"],
    #hft-intel:target .switch a[href="#hft-intel"],
    #cat-hft:has({intel_has}) .switch a[href="#hft-intel"] {{ background:#0263E0; color:#fff; }}
    #hft-amd:target .switch a[href="#hft-amd"],
    #cat-hft:has({amd_has}) .switch a[href="#hft-amd"] {{ background:#C43A1A; color:#fff; }}
    #app:not(:has(:target)) a.chip[href="#sku-{first_i}"],
    #cat-hft:target a.chip[href="#sku-{first_i}"],
    #hft-intel:target a.chip[href="#sku-{first_i}"],
    {intel_chips} {{ background:#0263E0; color:#fff; border-color:#0263E0; }}
    #hft-amd:target a.chip[href="#sku-{first_a}"],
    {amd_chips} {{ background:#C43A1A; color:#fff; border-color:#C43A1A; }}
'''

def ts_catalog():
    lines = [
        "export const PRODUCT_CATEGORIES = [",
        "  { id: 'hft', label: '超频服务器', desc: '按公司定稿表配置，分 Intel 与 AMD。机箱均为 2U 含导轨，高效 2U 闭环液冷，网卡选配。' }",
        "];",
        "",
        "export const PRODUCTS_CATALOG: ProductItem[] = [",
    ]
    for p in PRODUCTS:
        lines.append("  {")
        for key in ["id", "name", "category", "categoryName", "platform", "series", "tagline", "formFactor", "cooling", "processor", "chipset", "maxFreq", "memory", "storage", "pcieSlots", "networking", "latencyBench", "powerSupply", "badge", "pdfUrl", "pdfFileSize"]:
            lines.append(f"    {key}: {json.dumps(p[key], ensure_ascii=False)},")
        lines.append(f"    pdfPages: {p['pdfPages']},")
        lines.append(f"    targetScenarios: {json.dumps(p['targetScenarios'], ensure_ascii=False)},")
        lines.append(f"    keyFeatures: {json.dumps(p['keyFeatures'], ensure_ascii=False)},")
        lines.append(f"    specsTable: {json.dumps(p['specsTable'], ensure_ascii=False)},")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    return "\n".join(lines)

def json_products():
    slim = []
    for p in PRODUCTS:
        slim.append({k: p[k] for k in p if k not in ("chip", "mgmt", "lan")})
    return json.dumps(slim, ensure_ascii=False, separators=(",", ":"))

DROP_REMOTE = (
    '<a class="item" href="products?view=1#hft-intel"><span class="item-top"><b>Intel 超频服务器</b><em>13 款</em></span><small>酷睿、至强 W、至强 6。2U 机架含导轨，高效 2U 闭环液冷，网卡选配。</small></a>'
    '<a class="item" href="products?view=1#hft-amd"><span class="item-top"><b>AMD 超频服务器</b><em>9 款</em></span><small>锐龙、线程撕裂者、线程撕裂者 Pro。2U 机架含导轨，高效 2U 闭环液冷，网卡选配。</small></a>'
)
DROP_LOCAL = DROP_REMOTE.replace("products?view=1", "")
OLD_DROP_REMOTE = None

def replace_drop(text, remote):
    pat = r'<a class="item" href="(?:products\?view=1)?#cat-hft">[\s\S]*?<a class="item" href="(?:products\?view=1)?#cat-accessory">[\s\S]*?</a>'
    new = DROP_REMOTE if remote else DROP_LOCAL
    text2, n = re.subn(pat, new, text, count=1)
    if n != 1:
        raise SystemExit(f"dropdown replace failed remote={remote} n={n}")
    return text2

def replace_footer_products(text, remote):
    prefix = "products?view=1" if remote else ""
    new = (
        f'<li><a href="{prefix}#hft-intel">Intel 超频服务器</a></li>\n'
        f'        <li><a href="{prefix}#hft-amd">AMD 超频服务器</a></li>'
    )
    pat = r'<li><a href="(?:products\?view=1)?#cat-hft">高频服务器</a></li>\s*<li><a href="(?:products\?view=1)?#cat-gpu">GPU服务器</a></li>\s*<li><a href="(?:products\?view=1)?#cat-general">普通服务器</a></li>\s*<li><a href="(?:products\?view=1)?#cat-accessory">配件(?:</a>|（含网卡等）</a>| \(内含网卡等\)</a>).*?</li>'
    # simpler exact blocks
    return text

def main():
    data_path = ROOT / "src" / "data" / "companyData.ts"
    src = data_path.read_text(encoding="utf-8")
    start = src.index("export const PRODUCT_CATEGORIES")
    end = src.index("export const DRIVER_DOWNLOADS")
    data_path.write_text(src[:start] + ts_catalog() + "\n" + src[end:], encoding="utf-8")
    print("companyData products", len(PRODUCTS))

    prod = ROOT / "export" / "products.html"
    html = prod.read_text(encoding="utf-8")
    css = css_block()
    html2, n = re.subn(r"\n    \.cat-block, \.stage \{ display:none; \}[\s\S]*?</style>", "\n" + css + "</style>", html, count=1)
    if n != 1:
        raise SystemExit("css replace failed")
    html = html2
    app, _ = app_html()
    html2, n = re.subn(
        r'(<div class="wrap" id="app" data-static="1">)[\s\S]*?(</div></main>)',
        r"\1" + app + r"\n\2",
        html,
        count=1,
    )
    if n != 1:
        raise SystemExit("app replace failed")
    html = html2
    html = replace_drop(html, remote=False)
    html = html.replace(
        """        <li><a href="#cat-hft">高频服务器</a></li>
        <li><a href="#cat-gpu">GPU服务器</a></li>
        <li><a href="#cat-general">普通服务器</a></li>
        <li><a href="#cat-accessory">配件</a></li>""",
        """        <li><a href="#hft-intel">Intel 超频服务器</a></li>
        <li><a href="#hft-amd">AMD 超频服务器</a></li>""",
    )
    html = re.sub(
        r"const CATS = \[[\s\S]*?\];",
        "const CATS = [\n  {id:'hft', label:'超频服务器', desc:'按公司定稿表配置，分 Intel 与 AMD。机箱均为 2U 含导轨，高效 2U 闭环液冷，网卡选配。'}\n];",
        html,
        count=1,
    )
    html2, n = re.subn(r"const PRODUCTS = \[.*?\];", "const PRODUCTS = " + json_products() + ";", html, count=1)
    if n != 1:
        raise SystemExit("products json failed")
    prod.write_text(html2, encoding="utf-8")
    print("products.html bytes", prod.stat().st_size)

    foot_pat = re.compile(
        r'<li><a href="products\?view=1#cat-hft">高频服务器</a></li>\s*'
        r'<li><a href="products\?view=1#cat-gpu">GPU服务器</a></li>\s*'
        r'<li><a href="products\?view=1#cat-general">普通服务器</a></li>\s*'
        r'<li><a href="products\?view=1#cat-accessory">配件</a></li>'
    )
    foot_new = (
        '<li><a href="products?view=1#hft-intel">Intel 超频服务器</a></li>\n'
        '          <li><a href="products?view=1#hft-amd">AMD 超频服务器</a></li>'
    )
    for name in ["homepage.html", "contact.html", "partners.html", "service.html"]:
        path = ROOT / "export" / name
        text = path.read_text(encoding="utf-8")
        text = replace_drop(text, remote=True)
        text2, n = foot_pat.subn(foot_new, text, count=1)
        if n != 1:
            raise SystemExit("footer missing in " + name)
        path.write_text(text2, encoding="utf-8")
        print("updated", name)

if __name__ == "__main__":
    main()
