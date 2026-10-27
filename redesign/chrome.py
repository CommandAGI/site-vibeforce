"""The signage strip (header) and the footer of every page, in its locale. Run after editing a page's chrome:
python3 redesign/chrome.py. It rewrites only <header class="strip|site-head">…</header> and <footer …>…</footer>,
so each page's own content stays as written."""
import re, pathlib
SITE = pathlib.Path(__file__).resolve().parent.parent
L = {
  "en": dict(nav="Site", lang="Language", items=["Home", "Mission control", "Pricing", "About", "Team"], home="VibeForce, home",
             tag="Global field ops for teams that ship.", product="Product", contact="Contact", language="Language",
             fine='VibeForce is a company of <a href="https://commandagi.com/">CommandAGI</a> and runs on its site hosting and records. The operators, missions, prices and ratings on the demo pages are fictional. The footage is generated. © 2026 VibeForce.'),
  "es": dict(nav="Sitio", lang="Idioma", items=["Inicio", "Control de misiones", "Precios", "Acerca de", "Equipo"], home="VibeForce, inicio",
             tag="Operaciones de campo globales para equipos que entregan.", product="Producto", contact="Contacto", language="Idioma",
             fine='VibeForce es una compañía de <a href="https://commandagi.com/">CommandAGI</a> y corre sobre su alojamiento de sitios y sus registros. Los operadores, misiones, precios y calificaciones de las páginas de demostración son ficticios. Las imágenes en movimiento son generadas. © 2026 VibeForce.'),
  "zh": dict(nav="站点", lang="语言", items=["首页", "任务控制台", "价格", "关于", "团队"], home="VibeForce 首页",
             tag="为交付型团队而生的全球现场运维。", product="产品", contact="联系", language="语言",
             fine='VibeForce 是 <a href="https://commandagi.com/">CommandAGI</a> 旗下公司，运行在其站点托管和记录之上。演示页面上的执行者、任务、价格和评分均为虚构。视频画面为生成内容。© 2026 VibeForce。'),
}
# page → (locale, kind); kind picks the current bay and the other locales' twin page
PAGES = {
  "index.html": ("en", "index"), "about.html": ("en", "about"), "team.html": ("en", "team"), "app/index.html": ("en", "app"),
  "team-mirela-popescu.html": ("en", "team"), "team-callum-reid.html": ("en", "team"), "team-tariq-hussain.html": ("en", "team"),
  "es/index.html": ("es", "index"), "es/about.html": ("es", "about"), "es/app/index.html": ("es", "app"),
  "zh/index.html": ("zh", "index"), "zh/about.html": ("zh", "about"), "zh/app/index.html": ("zh", "app"),
}
TWIN = {"index": "{l}", "about": "{l}about.html", "app": "{l}app/", "team": "{l}about.html"}
LROOT = {"en": "", "es": "es/", "zh": "zh/"}

def chrome(page, loc, kind):
    up = "../" * page.count("/")
    S = L[loc]; lr = up + LROOT[loc]
    hrefs = [lr + "index.html", lr + "app/", ("#pricing" if kind == "index" else lr + "index.html#pricing"), lr + "about.html", up + "team.html"]
    cur = {"index": 0, "app": 1, "about": 3, "team": 4}[kind]
    bays = "\n".join(f'    <a href="{h}"{" aria-current=\"page\"" if i == cur else ""}><b>0{i+1}</b>{t}</a>' for i, (h, t) in enumerate(zip(hrefs, S["items"])))
    twin = lambda l: up + TWIN[kind].format(l=LROOT[l]) if TWIN[kind] != "{l}" else up + (LROOT[l] or "index.html")
    plate = "\n".join(f'    <a href="{twin(l)}"{" aria-current=\"true\"" if l == loc else ""} hreflang="{h}" lang="{h}">{n}</a>'
                      for l, h, n in [("en", "en", "EN"), ("es", "es", "ES"), ("zh", "zh-Hans", "中文")])
    header = f'''<header class="strip">
  <a class="brand" href="{lr}index.html"><span class="wm" role="img" aria-label="{S["home"]}"></span></a>
  <nav class="bays" aria-label="{S["nav"]}">
{bays}
  </nav>
  <nav class="plate" aria-label="{S["lang"]}">
{plate}
  </nav>
</header>'''
    langs = "".join(f'<li><a href="{twin(l)}" hreflang="{h}" lang="{h}"{" aria-current=\"true\"" if l == loc else ""}>{n}</a></li>'
                    for l, h, n in [("en", "en", "English"), ("es", "es", "Español"), ("zh", "zh-Hans", "简体中文")])
    prod = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in list(zip(hrefs, S["items"]))[1:])
    footer = f'''<footer class="foot">
  <div class="haz"></div>
  <div class="big" aria-hidden="true"><span class="wm"></span></div>
  <div class="cols">
    <div><h2>VibeForce</h2><p>{S["tag"]}</p></div>
    <div><h2>{S["product"]}</h2><ul>{prod}</ul></div>
    <div><h2>{S["contact"]}</h2><ul><li><a href="mailto:hello@vibeforce.pro">hello@vibeforce.pro</a></li><li><a href="https://vibeforce.pro/">vibeforce.pro</a></li></ul></div>
    <div><h2>{S["language"]}</h2><ul>{langs}</ul></div>
  </div>
  <p class="fine">{S["fine"]}</p>
</footer>'''
    return header, footer, up

for page, (loc, kind) in PAGES.items():
    p = SITE / page; h = p.read_text()
    header, footer, up = chrome(page, loc, kind)
    h = re.sub(r'<header class="(?:strip|site-head)">.*?</header>', lambda m: header, h, count=1, flags=re.S)
    h = re.sub(r'<footer class="(?:foot|site-foot)">.*?</footer>', lambda m: footer, h, count=1, flags=re.S)
    if "<footer" not in h:  # the team pages had no footer
        h = h.replace("</body>", footer + "\n</body>")
    h = h.replace("connect-src 'none'", "media-src 'self'; connect-src 'none'") if "media-src" not in h else h
    h = h.replace('<meta name="viewport" content="width=device-width, initial-scale=1">', '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">')
    if 'name="theme-color"' not in h:
        h = h.replace("<link rel=\"stylesheet\"", '<meta name="theme-color" content="#14372e">\n<link rel="stylesheet"', 1)
    if 'rel="preload" href="' + up + 'fonts/barlow-condensed-800.woff2"' not in h:
        pre = "".join(f'<link rel="preload" href="{up}fonts/{f}.woff2" as="font" type="font/woff2" crossorigin>\n' for f in ("barlow-condensed-800", "barlow-400"))
        h = re.sub(r'<link rel="preload" href="[^"]*fonts/[^"]*"[^>]*>\n', "", h)
        h = h.replace('<link rel="stylesheet"', pre + '<link rel="stylesheet"', 1)
    if "apple-touch-icon" not in h:
        h = h.replace('type="image/svg+xml">', f'type="image/svg+xml">\n<link rel="apple-touch-icon" href="{up}touch-icon.png">', 1)
    if 'property="og:image"' not in h:
        h = h.replace("</head>", f'<meta property="og:image" content="https://vibeforce.commandagi.app/og.png">\n<meta name="twitter:card" content="summary_large_image">\n</head>', 1)
    # inner pages: the manual layout (no centred .wrap inside main)
    if kind == "about":
        h = re.sub(r'<main id="main">\s*<div class="wrap">(.*)</div>\s*</main>', r'<main id="main" class="page">\1</main>', h, flags=re.S)
    if page == "team.html":
        h = h.replace('<link rel="canonical" href="https://vibeforce.commandagi.app/about.html">', '<link rel="canonical" href="https://vibeforce.commandagi.app/team.html">')
    p.write_text(h)
    print(page)
