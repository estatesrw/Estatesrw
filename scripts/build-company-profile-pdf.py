import subprocess, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader

def font(spec, name):
    p = subprocess.check_output(["fc-match", "-f", "%{file}", spec], text=True).strip()
    pdfmetrics.registerFont(TTFont(name, p))

font("DejaVu Sans", "Body")
font("DejaVu Sans:bold", "BodyB")
font("DejaVu Serif:bold", "Head")

GREEN = colors.HexColor("#004428")
GOLD = colors.HexColor("#C8A96A")
CREAM = colors.HexColor("#F7F4EC")
INK = colors.HexColor("#1B1B1B")
MUTED = colors.HexColor("#5A6360")

W, H = A4
M = 20 * mm
OUT = "/tmp/deck/EstatesRW-Company-Profile.pdf"
LOGO = "/tmp/deck/logo-white.png"

c = canvas.Canvas(OUT, pagesize=A4)
page_no = [0]


def wrap(text, fname, size, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if pdfmetrics.stringWidth(t, fname, size) <= maxw:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def para(text, y, size=10, leading=15, fname="Body", color=MUTED, x=M, maxw=W - 2 * M):
    c.setFont(fname, size)
    c.setFillColor(color)
    for ln in wrap(text, fname, size, maxw):
        c.drawString(x, y, ln)
        y -= leading
    return y


def footer():
    page_no[0] += 1
    c.setFont("Body", 7.5)
    c.setFillColor(MUTED)
    c.drawString(M, 12 * mm, "EstatesRW  ·  Company Profile  ·  info@estatesrw.com  ·  +250 791 915 459")
    c.drawRightString(W - M, 12 * mm, str(page_no[0]))


def new_page(title=None, kicker=None):
    c.showPage()
    y = H - M
    if title:
        if kicker:
            c.setFont("BodyB", 8.5)
            c.setFillColor(GOLD)
            c.drawString(M, y - 6, kicker.upper())
            y -= 20
        c.setFont("Head", 21)
        c.setFillColor(GREEN)
        c.drawString(M, y - 14, title)
        y -= 26
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.6)
        c.line(M, y - 6, M + 46 * mm, y - 6)
        y -= 22
    return y


# ---------------- Cover ----------------
c.setFillColor(GREEN)
c.rect(0, 0, W, H, stroke=0, fill=1)
c.setFillColor(colors.HexColor("#0A5A36"))
c.circle(W + 20 * mm, H * 0.78, 70 * mm, stroke=0, fill=1)
c.circle(-15 * mm, H * 0.18, 55 * mm, stroke=0, fill=1)

if os.path.exists(LOGO):
    img = ImageReader(LOGO)
    iw, ih = img.getSize()
    h = 22 * mm
    c.drawImage(LOGO, M, H - M - h, width=h * iw / ih, height=h, mask="auto")

c.setFillColor(GOLD)
c.setFont("BodyB", 9.5)
c.drawString(M, H * 0.56 + 40, "COMPANY PROFILE  ·  2026")

c.setFillColor(colors.white)
c.setFont("Head", 34)
c.drawString(M, H * 0.56, "Your trusted path")
c.drawString(M, H * 0.56 - 40, "to property in Rwanda")

c.setFont("Body", 11.5)
c.setFillColor(colors.HexColor("#DCE8E0"))
for i, ln in enumerate(wrap(
    "Investment advisory, property access and a purpose-built property "
    "management system — one partner for owners, investors and guests.",
    "Body", 11.5, W - 2 * M - 40 * mm)):
    c.drawString(M, H * 0.56 - 75 - i * 17, ln)

c.setStrokeColor(GOLD)
c.setLineWidth(1)
c.line(M, 46 * mm, W - M, 46 * mm)
c.setFont("Body", 9.5)
c.setFillColor(colors.white)
c.drawString(M, 38 * mm, "Kigali, Rwanda")
c.drawString(M, 32 * mm, "info@estatesrw.com  ·  +250 791 915 459")
c.drawRightString(W - M, 32 * mm, "estatesrw.com")

# ---------------- Who we are ----------------
y = new_page("Who We Are", "Introduction")
y = para(
    "EstatesRW is a full-service property management and real estate company built for Rwanda's "
    "growing hospitality and rental market. We combine hands-on hospitality experience with "
    "purpose-built technology to help property owners, hoteliers, landlords and investors turn real "
    "estate into reliable, well-run income — while giving guests and tenants a seamless, "
    "professional experience from first inquiry to checkout.", y, size=10.5, leading=16)
y -= 14

y = para("Our Story", y, size=13, leading=18, fname="Head", color=GREEN)
y -= 2
y = para(
    "EstatesRW was created from a deep love for Rwanda and a vision to connect it with the world. "
    "With honesty, transparency and trust at our core, we help people find the right home, land or "
    "business that truly fits their goals. We go beyond property — we connect people to "
    "possibilities.", y, leading=15)
y -= 14

y = para("Our Mission", y, size=13, leading=18, fname="Head", color=GREEN)
y -= 2
y = para(
    "To make property ownership and hospitality in Rwanda effortless, profitable and trusted. We "
    "combine professional management, transparent operations and modern technology to deliver "
    "consistent guest experiences, protect asset value and give owners complete peace of mind — "
    "whether they operate a single apartment, a boutique hotel or a portfolio of rentals.",
    y, leading=15)
y -= 20

# value cards
values = [("Honesty &\nTransparency",), ("Local &\nGlobal Reach",), ("Community\nFirst",), ("Technology\nDriven",)]
cw = (W - 2 * M - 3 * 6 * mm) / 4
for i, (label,) in enumerate(values):
    x = M + i * (cw + 6 * mm)
    c.setFillColor(CREAM)
    c.roundRect(x, y - 24 * mm, cw, 24 * mm, 4 * mm, stroke=0, fill=1)
    c.setFillColor(GREEN)
    c.setFont("BodyB", 9)
    for j, ln in enumerate(label.split("\n")):
        c.drawCentredString(x + cw / 2, y - 12 * mm - j * 12, ln)
y -= 24 * mm + 32

y = para("At a glance", y, size=13, leading=18, fname="Head", color=GREEN)
stats = [("500+", "Properties managed"), ("98%", "Client satisfaction"),
         ("50+", "Expert consultants"), ("10+", "Years of experience")]
y -= 4
for i, (v, l) in enumerate(stats):
    x = M + i * (cw + 6 * mm)
    c.setFillColor(GREEN)
    c.setFont("Head", 18)
    c.drawString(x, y - 16, v)
    c.setFillColor(MUTED)
    c.setFont("Body", 8.5)
    c.drawString(x, y - 30, l)
footer()

# ---------------- Three pillars ----------------
y = new_page("What We Do", "Our model")
y = para(
    "EstatesRW sits at the intersection of investment advisory, property sourcing and property "
    "management technology — simplifying how investors enter the market and how owners operate and "
    "monetise their assets.", y, size=10.5, leading=16)
y -= 12

pillars = [
    ("01", "Investment Advisory",
     "We guide local and international investors through every step — from identifying "
     "high-potential opportunities to negotiation, due diligence and deal structuring.",
     ["Market analysis & insights", "Site visits & due diligence",
      "Negotiation & deal structuring", "Legal & administrative support"]),
    ("02", "Property Access Network",
     "A curated portfolio of land, apartments and hotels with direct access to verified and "
     "off-market opportunities across Rwanda.",
     ["Verified land parcels", "Prime apartments", "Hotels & lodges", "Off-market deals"]),
    ("03", "Property Management System",
     "A digital platform enabling owners to manage bookings, track occupancy, handle operations "
     "and reach domestic and international clients — all from one dashboard.",
     ["Bookings & occupancy", "End-to-end operations",
      "Service provider network", "Global client access"]),
]
for n, title, desc, items in pillars:
    box_h = 46 * mm
    c.setFillColor(CREAM)
    c.roundRect(M, y - box_h, W - 2 * M, box_h, 4 * mm, stroke=0, fill=1)
    c.setFillColor(GREEN)
    c.roundRect(M, y - box_h, 2.5 * mm, box_h, 1.2 * mm, stroke=0, fill=1)
    c.setFont("BodyB", 9)
    c.setFillColor(GOLD)
    c.drawRightString(W - M - 8 * mm, y - 11 * mm, n)
    c.setFont("Head", 13)
    c.setFillColor(GREEN)
    c.drawString(M + 8 * mm, y - 11 * mm, title)
    yy = para(desc, y - 17 * mm, size=9.5, leading=13.5, color=MUTED,
              x=M + 8 * mm, maxw=W - 2 * M - 16 * mm)
    c.setFont("Body", 9)
    c.setFillColor(INK)
    colw = (W - 2 * M - 16 * mm) / 2
    for k, it in enumerate(items):
        cx = M + 8 * mm + (k % 2) * colw
        cy = yy - 4 - (k // 2) * 13
        c.setFillColor(GOLD)
        c.circle(cx + 2, cy + 3, 1.6, stroke=0, fill=1)
        c.setFillColor(INK)
        c.drawString(cx + 8, cy, it)
    y -= box_h + 7 * mm
footer()

# ---------------- Services ----------------
y = new_page("Services We Offer", "Capabilities")
services = [
    ("Property Management",
     "Tenant screening and placement, rent collection and accounting, lease administration and regular property inspections."),
    ("Hospitality Operations",
     "Front-desk workflows, guest communication, check-ins, housekeeping coordination and daily operations for hotels, lodges and serviced apartments."),
    ("Real Estate Consultancy",
     "Investment advisory, market analysis and reports, property valuation and portfolio strategy tailored to Rwanda's market."),
    ("Revenue & Booking Optimisation",
     "Dynamic pricing, channel management and direct-booking strategies to maximise occupancy and owner income."),
    ("Construction Supervision",
     "On-site supervision covering quality assurance, timeline management, budget monitoring and compliance oversight."),
    ("Project Management",
     "Full lifecycle delivery from concept to completion — planning, contractor coordination, risk management and progress reporting."),
    ("Legal & Compliance",
     "Title transfers, contract drafting, dispute resolution and regulatory guidance under Rwandan property law."),
    ("Property Valuation",
     "Data-driven valuations for buying, selling, insurance and investment across all property types."),
    ("Maintenance & Service Network",
     "A vetted network of cleaners, technicians and hospitality suppliers keeping every property guest-ready."),
    ("Secure Payments & Reporting",
     "Transparent rent and guest-payment tracking with detailed financial statements and owner dashboards."),
]
for i, (t, d) in enumerate(services):
    if y < 44 * mm:
        footer()
        y = new_page("Services We Offer", "Capabilities (continued)")
    c.setFillColor(GREEN)
    c.setFont("BodyB", 10.5)
    c.drawString(M + 7 * mm, y, t)
    c.setFillColor(GOLD)
    c.rect(M, y - 1, 3.4 * mm, 3.4 * mm, stroke=0, fill=1)
    y = para(d, y - 14, size=9.5, leading=13, x=M + 7 * mm, maxw=W - 2 * M - 7 * mm)
    y -= 9
    c.setStrokeColor(colors.HexColor("#E4E0D6"))
    c.setLineWidth(0.6)
    c.line(M, y + 4, W - M, y + 4)
    y -= 8
footer()

# ---------------- Who we work with ----------------
y = new_page("Who We Work With", "Clients & partners")
y = para(
    "Our platform and services are built around five groups of people, each with their own "
    "dedicated tools and workflows inside the EstatesRW system.", y, size=10.5, leading=16)
y -= 12

audiences = [
    ("Property Owners & Landlords",
     "Single-unit owners and portfolio holders who want reliable income, protected asset value and full visibility without daily involvement."),
    ("Hoteliers & Hospitality Operators",
     "Hotels, lodges, guesthouses and serviced apartments needing professional operations, channel management and consistent guest standards."),
    ("Investors — Local & Diaspora",
     "Rwandans abroad and international investors acquiring, developing or repositioning hospitality and residential assets, supported end to end."),
    ("Tenants & Guests",
     "Long-stay tenants and short-stay guests with verified listings, clear contracts, digital payments and responsive support."),
    ("Agents, Service Providers & Partners",
     "Referral agents earning commission, plus cleaners, technicians, designers and suppliers in our vetted service network."),
]
for t, d in audiences:
    bh = 24 * mm
    c.setStrokeColor(colors.HexColor("#DFE5E1"))
    c.setLineWidth(0.8)
    c.setFillColor(colors.white)
    c.roundRect(M, y - bh, W - 2 * M, bh, 3.5 * mm, stroke=1, fill=1)
    c.setFillColor(GREEN)
    c.setFont("BodyB", 10.5)
    c.drawString(M + 7 * mm, y - 9 * mm, t)
    para(d, y - 14.5 * mm, size=9.5, leading=13, x=M + 7 * mm, maxw=W - 2 * M - 14 * mm)
    y -= bh + 5 * mm

y -= 14
y = para("Why partners choose us", y, size=13, leading=18, fname="Head", color=GREEN)
reasons = ["On-the-ground deal sourcing", "Structured investment approach",
           "Technology-driven management system", "Local & international network",
           "End-to-end investor support", "Transparent reporting & verified records"]
c.setFont("Body", 9.5)
colw = (W - 2 * M) / 2
for i, r in enumerate(reasons):
    x = M + (i % 2) * colw
    yy = y - 6 - (i // 2) * 14
    c.setFillColor(GOLD)
    c.circle(x + 2, yy + 3, 1.6, stroke=0, fill=1)
    c.setFillColor(INK)
    c.drawString(x + 8, yy, r)
footer()

# ---------------- Platform + leadership + contact ----------------
y = new_page("The EstatesRW Platform", "Technology")
y = para(
    "Everything we manage runs on our own property management operating system — one place for "
    "properties, units, leases, rent, contracts and people.", y, size=10.5, leading=16)
y -= 12

modules = [
    ("Occupancy Map", "Live, colour-coded view of every unit across a portfolio."),
    ("Units Register", "Full unit inventory with filters, statuses and CSV export."),
    ("Leases", "Tenant-to-unit leases with rent, deposit and term tracking."),
    ("Rent Collection", "Monthly invoicing, payment status and collection KPIs."),
    ("AI Contracts", "Professional management contracts generated and signed digitally."),
    ("Bookings & Calendar", "Short-stay bookings, availability and channel sync."),
    ("Team & Access", "Role-based access for owners, managers, agents and tenants."),
    ("Activity Log", "Full audit trail of every change, for accountability."),
]
cw2 = (W - 2 * M - 6 * mm) / 2
for i, (t, d) in enumerate(modules):
    x = M + (i % 2) * (cw2 + 6 * mm)
    yy = y - (i // 2) * (22 * mm + 4 * mm)
    c.setFillColor(CREAM)
    c.roundRect(x, yy - 22 * mm, cw2, 22 * mm, 3.5 * mm, stroke=0, fill=1)
    c.setFillColor(GREEN)
    c.setFont("BodyB", 10)
    c.drawString(x + 6 * mm, yy - 8 * mm, t)
    para(d, yy - 13.5 * mm, size=9, leading=12, x=x + 6 * mm, maxw=cw2 - 12 * mm)
y -= 4 * (22 * mm + 4 * mm) + 24

y = para("Leadership", y, size=13, leading=18, fname="Head", color=GREEN)
y -= 4
for name, role in [("Fiston NTIRENGANYA", "Founder"), ("Joshua van Spankeren", "Co-Founder")]:
    c.setFillColor(INK)
    c.setFont("BodyB", 10.5)
    c.drawString(M, y, name)
    c.setFillColor(MUTED)
    c.setFont("Body", 9.5)
    c.drawString(M + 58 * mm, y, role)
    y -= 15
footer()

# ---------------- Closing ----------------
c.showPage()
page_no[0] += 1
c.setFillColor(GREEN)
c.rect(0, 0, W, H, stroke=0, fill=1)
c.setFillColor(colors.HexColor("#0A5A36"))
c.circle(W * 1.02, -12 * mm, 58 * mm, stroke=0, fill=1)
if os.path.exists(LOGO):
    img = ImageReader(LOGO)
    iw, ih = img.getSize()
    h = 20 * mm
    c.drawImage(LOGO, M, H - M - h, width=h * iw / ih, height=h, mask="auto")
c.setFillColor(GOLD)
c.setFont("BodyB", 9.5)
c.drawString(M, H * 0.6 + 34, "LET'S WORK TOGETHER")
c.setFillColor(colors.white)
c.setFont("Head", 28)
c.drawString(M, H * 0.6, "Partner with EstatesRW")
c.setFont("Body", 11)
c.setFillColor(colors.HexColor("#DCE8E0"))
for i, ln in enumerate(wrap(
    "Whether you own a single apartment, operate a hotel, or are looking to invest in Rwandan "
    "real estate from abroad — we would love to talk.", "Body", 11, W - 2 * M - 40 * mm)):
    c.drawString(M, H * 0.6 - 30 - i * 17, ln)

yy = H * 0.42
for label, value in [("Email", "info@estatesrw.com"), ("Phone", "+250 791 915 459"),
                     ("Website", "estatesrw.com"), ("Office", "Kigali, Rwanda")]:
    c.setFillColor(GOLD)
    c.setFont("BodyB", 8.5)
    c.drawString(M, yy, label.upper())
    c.setFillColor(colors.white)
    c.setFont("Body", 12)
    c.drawString(M + 30 * mm, yy - 1, value)
    yy -= 20
c.setStrokeColor(GOLD)
c.setLineWidth(1)
c.line(M, 40 * mm, W - M, 40 * mm)
c.setFont("Body", 8.5)
c.setFillColor(colors.HexColor("#BFD3C6"))
c.drawString(M, 33 * mm, "EstatesRW  ·  Company Profile 2026  ·  Your trusted path to property.")

c.setTitle("EstatesRW — Company Profile & Services")
c.setAuthor("EstatesRW")
c.setSubject("Company profile, services, and partnership overview")
c.save()
print("built", OUT)
