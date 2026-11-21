"""Idempotent seed command with Slovak demo content for the aerial agency.

Usage:
    python manage.py seed_data
    python manage.py seed_data --flush   # delete catalogue data first (quotes are kept)
"""

from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from aerial.models import (
    AerialCategory,
    AerialProject,
    AerialService,
    DroneFleetItem,
    PilotMember,
)


def unsplash(photo_id: str, width: int = 1600) -> str:
    return f"https://images.unsplash.com/photo-{photo_id}?auto=format&fit=crop&w={width}&q=80"


YT = "https://www.youtube.com/embed/{}"
VIMEO = "https://player.vimeo.com/video/{}"

CATEGORIES = [
    {
        "slug": "reklamne-a-tv-zabery",
        "name": "Reklamné a TV letecké zábery",
        "short_summary": "Kinematografické zábery pre reklamné spoty, TV produkcie a brandové kampane.",
        "icon_name": "cinema",
    },
    {
        "slug": "fpv-prelety",
        "name": "Dynamické FPV prelety (Indoor & Outdoor)",
        "short_summary": "Plynulé jednozáberové prelety interiérmi, halami a exteriérmi s pocitom letu.",
        "icon_name": "fpv",
    },
    {
        "slug": "reality-a-architektura",
        "name": "Reality, development a architektúra",
        "short_summary": "Letecké prezentácie rezidenčných projektov, nehnuteľností a stavieb.",
        "icon_name": "building",
    },
    {
        "slug": "eventy-a-sport",
        "name": "Eventy, koncerty a športové podujatia",
        "short_summary": "Bezpečné zábery davov, pódií a športových výkonov z perspektívy vtáka.",
        "icon_name": "event",
    },
    {
        "slug": "inspekcie-a-termovizia",
        "name": "Technické inšpekcie a termovízia",
        "short_summary": "Termovízna a vizuálna kontrola striech, FVE, mostov a priemyslu.",
        "icon_name": "thermal",
    },
    {
        "slug": "fotogrametria-a-ortofotomapy",
        "name": "3D Fotogrametria a ortofotomapy",
        "short_summary": "Presné RTK mapovanie terénu, 3D modely stavieb a výpočty kubatúr.",
        "icon_name": "map",
    },
]

PROJECTS = [
    {
        "slug": "fpv-prelet-vyrobnou-halou-a-showroomom",
        "title": "FPV prelet výrobnou halou a showroomom bez jediného strihu",
        "client_name": "Konštrukt Industries a.s.",
        "client_sector": "Strojárska výroba",
        "category": "fpv-prelety",
        "location_name": "Žilina – priemyselný park",
        "drone_platform": "Cinewhoop 2.5\" Indoor 4K",
        "video_resolution": "4K 60fps / 2.7K 120fps",
        "airspace_clearance": "Interiérový let – mimo pôsobnosti UAS zón, bezpečnostný protokol pre pracovisko",
        "video_embed_url": YT.format("LXb3EKWsInQ"),
        "thumbnail_url": unsplash("1565043589221-1a6fd9ae45c7"),
        "shoot_summary": (
            "Klient potreboval predstaviť celý výrobný proces od skladu materiálu až po showroom "
            "hotových strojov v jednom plynulom zábere. Natáčanie prebehlo počas plnej prevádzky, "
            "preto sme s bezpečnostným technikom pripravili koridor letu, vyznačili zakázané zóny "
            "a koordinovali pohyb vysokozdvižných vozíkov. Chránený cinewhoop s vrtuľovými krytmi "
            "preletel 340 metrov trasy cez otvory s rezervou iba 40 cm. Výsledný 94-sekundový záber "
            "bez strihu sa stal ústredným prvkom náborovej kampane aj veľtržnej expozície."
        ),
        "deliverables_tags": ["4K ProRes Master", "9:16 Reels verzie", "Color Grading", "Sound design"],
        "is_featured": True,
        "display_order": 1,
    },
    {
        "slug": "letecka-prezentacia-rezidencneho-projektu-bratislava",
        "title": "Letecká prezentácia rezidenčného projektu v Bratislave",
        "client_name": "Danube Living Development s.r.o.",
        "client_sector": "Rezidenčný development",
        "category": "reality-a-architektura",
        "location_name": "Bratislava – Staré Mesto",
        "drone_platform": "DJI Inspire 3 • Zenmuse X9-8K Air",
        "video_resolution": "8K RAW / 4K 120fps",
        "airspace_clearance": "Povolenie Dopravného úradu SR & koordinácia CTR Bratislava",
        "video_embed_url": VIMEO.format("22439234"),
        "thumbnail_url": unsplash("1486406146926-c627a92ad1ab"),
        "shoot_summary": (
            "Projekt sa nachádza v riadenom okrsku letiska (CTR) a v husto zastavanej mestskej oblasti. "
            "Päť pracovných dní vopred sme podali žiadosť o letové povolenie, zabezpečili súhlas "
            "vlastníkov okolitých pozemkov a koordinovali okno letu s riadením letovej prevádzky. "
            "Zábery pri zlatej hodinke ukazujú vzťah projektu k Dunaju, hradu a historickému centru. "
            "Z 8K materiálu sme vytvorili aj sériu fotografií pre predajné brožúry a billboardy."
        ),
        "deliverables_tags": ["8K RAW Master", "4K ProRes 422 HQ", "Fotografie 45 MP", "Vizualizačné podklady"],
        "is_featured": True,
        "display_order": 2,
    },
    {
        "slug": "cinema-zabery-automobilova-kampan-vysoke-tatry",
        "title": "Cinema zábery pre automobilovú kampaň vo Vysokých Tatrách",
        "client_name": "Nordline Motors Slovakia",
        "client_sector": "Automotive",
        "category": "reklamne-a-tv-zabery",
        "location_name": "Vysoké Tatry",
        "drone_platform": "Custom CineLifter 7\" FPV + RED Komodo",
        "video_resolution": "6K RAW / 4K 120fps",
        "airspace_clearance": "Súhlas správy TANAP-u, uzávierka cesty a koordinácia s produkciou",
        "video_embed_url": YT.format("BHACKCNDMW8"),
        "thumbnail_url": unsplash("1503376780353-7e6692767b70"),
        "shoot_summary": (
            "Agentúra potrebovala dynamické chasing zábery nového SUV v horských serpentínach. "
            "Kombinovali sme Inspire 3 na široké etablovacie zábery a ťažký FPV CineLifter s RED "
            "Komodo na prenasledovanie vozidla rýchlosťou až 110 km/h. Natáčanie v chránenom "
            "území vyžadovalo súhlas správy národného parku a presne vymedzený letový priestor. "
            "Celkovo sme za dva dni zaznamenali 42 použiteľných záberov pre TV spot a online kampaň."
        ),
        "deliverables_tags": ["6K RED RAW", "4K ProRes Master", "Surové D-Log zábery", "TV spot 30 s"],
        "is_featured": True,
        "display_order": 3,
    },
    {
        "slug": "termovizna-inspekcia-fotovoltickej-elektrarne-4-mw",
        "title": "Termovízna inšpekcia fotovoltickej elektrárne 4 MW",
        "client_name": "SolarGrid Energy s.r.o.",
        "client_sector": "Energetika",
        "category": "inspekcie-a-termovizia",
        "location_name": "Nitriansky kraj",
        "drone_platform": "DJI Matrice 350 RTK + Zenmuse H20T",
        "video_resolution": "640×512 radiometrický IR / 20 MP zoom",
        "airspace_clearance": "Otvorená kategória A3, koordinácia s prevádzkovateľom areálu",
        "video_embed_url": VIMEO.format("108018156"),
        "thumbnail_url": unsplash("1509391366360-2e959784a276"),
        "shoot_summary": (
            "Prevádzkovateľ zaznamenal pokles výkonu, no nevedel lokalizovať príčinu. Automatizovaným "
            "letovým plánom sme za 3,5 hodiny nasnímali všetkých 9 800 panelov radiometrickou kamerou "
            "pri ožiarení nad 600 W/m². Analýza odhalila 37 hotspotov, 4 nefunkčné stringy a "
            "poškodené bypass diódy. Klient dostal georeferencovaný report s prioritami opráv, "
            "ktorý mu ušetril týždne manuálnej kontroly."
        ),
        "deliverables_tags": ["Radiometrické IR snímky", "PDF report s GPS", "Ortofotomapa", "Mapa hotspotov"],
        "is_featured": True,
        "display_order": 4,
    },
    {
        "slug": "aftermovie-letneho-hudobneho-festivalu",
        "title": "Aftermovie letného hudobného festivalu pre 25 000 návštevníkov",
        "client_name": "Riverside Festival",
        "client_sector": "Kultúra a eventy",
        "category": "eventy-a-sport",
        "location_name": "Trenčín – letisko",
        "drone_platform": "DJI Inspire 3 • Zenmuse X9-8K Air",
        "video_resolution": "8K RAW / 4K 120fps",
        "airspace_clearance": "Kategória Špecifická (STS-01), let mimo nad davom s vymedzeným bezpečnostným priestorom",
        "video_embed_url": YT.format("2OEL4P1Rz04"),
        "thumbnail_url": unsplash("1470229722913-7c0e2dbbafd3"),
        "shoot_summary": (
            "Trojdňový festival sme pokrývali dvoma posádkami. Lety boli naplánované tak, aby dron "
            "nikdy nepreletel priamo nad davom – využívali sme bočné koridory a teleobjektív. "
            "Večerné zábery s pyrotechnikou a svetelnou šou vznikali v koordinácii s pyrotechnikom "
            "a hlavným organizátorom. Aftermovie dosiahlo 410 000 zhliadnutí za prvý týždeň."
        ),
        "deliverables_tags": ["Aftermovie 3 min", "9:16 Reels verzie", "Highlights pre sponzorov", "Color Grading"],
        "is_featured": True,
        "display_order": 5,
    },
    {
        "slug": "fpv-prehliadka-luxusnej-vily-pri-senci",
        "title": "FPV prehliadka luxusnej vily pri Senci – interiér aj exteriér",
        "client_name": "Prime Estates Reality",
        "client_sector": "Prémiové reality",
        "category": "reality-a-architektura",
        "location_name": "Senec – Slnečné jazerá",
        "drone_platform": "Cinewhoop 2.5\" Indoor 4K + DJI Mavic 3 Pro Cine",
        "video_resolution": "4K 60fps / 5.1K Apple ProRes",
        "airspace_clearance": "Otvorená kategória A1, interiérový let so súhlasom majiteľa",
        "video_embed_url": VIMEO.format("22439234"),
        "thumbnail_url": unsplash("1600596542815-ffad4c1539a9"),
        "shoot_summary": (
            "Realitná kancelária chcela ponuku, ktorá vynikne medzi statickými fotografiami. "
            "Jednozáberový FPV prelet začína nad jazerom, vletí cez otvorené posuvné dvere do obývačky "
            "a pokračuje celým domom až na strešnú terasu. Pred letom sme zabezpečili interiér, "
            "odstránili krehké predmety a pripravili svetelný plán. Nehnuteľnosť sa predala do 3 týždňov."
        ),
        "deliverables_tags": ["4K Master", "Verzia pre portály 16:9", "9:16 Reels verzie", "Fotografie 20 MP"],
        "is_featured": False,
        "display_order": 6,
    },
    {
        "slug": "3d-fotogrametria-lomu-vypocet-kubatur",
        "title": "3D fotogrametria lomu a mesačný výpočet kubatúr",
        "client_name": "Kameňolomy Stredné Slovensko a.s.",
        "client_sector": "Ťažobný priemysel",
        "category": "fotogrametria-a-ortofotomapy",
        "location_name": "Banskobystrický kraj",
        "drone_platform": "DJI Matrice 350 RTK + Zenmuse P1",
        "video_resolution": "45 MP • GSD 1,5 cm/px",
        "airspace_clearance": "Otvorená kategória A3, RTK korekcie SKPOS",
        "video_embed_url": YT.format("LXb3EKWsInQ"),
        "thumbnail_url": unsplash("1504307651254-35680f356dfd"),
        "shoot_summary": (
            "Pre ťažobnú spoločnosť pravidelne mapujeme 48-hektárový lom. RTK presnosť s pripojením "
            "na SKPOS zaručuje odchýlku do 3 cm bez nutnosti rozmiestňovať desiatky vlícovacích bodov. "
            "Z 1 200 snímok vzniká mračno bodov, digitálny model terénu a ortofotomapa. Porovnaním "
            "s predchádzajúcim mesiacom klient presne vyčísli objem vyťaženého materiálu."
        ),
        "deliverables_tags": ["Ortofotomapa GeoTIFF", "Mračno bodov LAS", "DMR / DSM", "Výkaz kubatúr"],
        "is_featured": False,
        "display_order": 7,
    },
    {
        "slug": "letecke-zabery-majstrovstiev-v-zjazde-na-divokej-vode",
        "title": "Letecké zábery majstrovstiev v zjazde na divokej vode",
        "client_name": "Slovenský zväz kanoistiky (demo)",
        "client_sector": "Šport",
        "category": "eventy-a-sport",
        "location_name": "Liptovský Mikuláš – Areál Ondreja Cibáka",
        "drone_platform": "Custom CineLifter 7\" FPV + GoPro HERO12",
        "video_resolution": "5.3K 60fps / 2.7K 240fps",
        "airspace_clearance": "Kategória Špecifická (STS-01), koordinácia s TV produkciou a organizátorom",
        "video_embed_url": VIMEO.format("108018156"),
        "thumbnail_url": unsplash("1464822759023-fed622ff2c3b"),
        "shoot_summary": (
            "Pre živý prenos a následné zostrihy sme nasadili FPV dron, ktorý sledoval pretekárov "
            "nízko nad vodnou hladinou. Pilot spolupracoval s režisérom prenosu cez intercom a "
            "lety boli synchronizované so štartovými intervalmi. Spomalené 240fps zábery zachytili "
            "každý záber pádla v detaile, ktorý pozemné kamery neponúknu."
        ),
        "deliverables_tags": ["Živý signál pre TV", "Highlights 4K", "Slow-motion 240fps", "Sociálne siete 9:16"],
        "is_featured": False,
        "display_order": 8,
    },
]

SERVICES = [
    {
        "slug": "kinematograficke-letecke-natacanie",
        "title": "Kinematografické letecké natáčanie (Heavy-Lift & Cinema)",
        "category": "reklamne-a-tv-zabery",
        "short_description": "Full-frame 8K zábery pre reklamy, filmy a TV produkcie s dvojčlennou posádkou pilot + kameraman.",
        "detailed_description": (
            "Pracujeme s platformou DJI Inspire 3 a full-frame kamerou Zenmuse X9-8K Air, ktorá "
            "zdieľa farebnú vedu s kamerami DJI Ronin 4D. Dvojčlenná posádka – pilot a operátor "
            "kamery – umožňuje komplexné pohyby a presné rámovanie. Zábery dodávame v 8K CinemaDNG "
            "alebo Apple ProRes RAW, pripravené na profesionálny color grading."
        ),
        "included_deliverables": ["8K CinemaDNG / ProRes RAW", "Dvojčlenná posádka", "Obhliadka a letový plán", "Zálohovanie dát na mieste"],
        "drone_fleet_used": ["DJI Inspire 3", "DJI Mavic 3 Pro Cine"],
        "typical_turnaround": "3 – 5 pracovných dní",
        "starting_price_eur": Decimal("890.00"),
        "is_featured": True,
        "display_order": 1,
    },
    {
        "slug": "kreativne-fpv-prelety",
        "title": "Kreatívne FPV prelety interiérom aj exteriérom",
        "category": "fpv-prelety",
        "short_description": "Jednozáberové prelety halami, showroomami a hotelmi, ktoré divák zažije ako vlastný let.",
        "detailed_description": (
            "FPV drony lietajú tam, kam sa klasický dron nedostane – cez dvere, okná, pomedzi "
            "stroje či regály. Pre interiéry používame chránené cinewhoopy s krytmi vrtúľ, pre "
            "exteriér a chasing výkonné 7-palcové CineLiftery nesúce kinematografické kamery. "
            "Každý let pripravujeme s bezpečnostným protokolom a nácvikom trasy."
        ),
        "included_deliverables": ["Nácvik a plán trasy", "Jednozáberový 4K Master", "Stabilizácia a color grading", "Verzie 16:9 a 9:16"],
        "drone_fleet_used": ["Indoor Cinewhoop 2.5\" Pro", "Custom CineLifter FPV 7\""],
        "typical_turnaround": "4 – 7 pracovných dní",
        "starting_price_eur": Decimal("690.00"),
        "is_featured": True,
        "display_order": 2,
    },
    {
        "slug": "letecke-foto-a-video-pre-realitnych-developerov",
        "title": "Letecké foto a video pre realitných developerov",
        "category": "reality-a-architektura",
        "short_description": "Prezentácie projektov, dokumentácia výstavby a zábery pre predajné materiály.",
        "detailed_description": (
            "Pripravíme leteckú prezentáciu nehnuteľnosti alebo celého developerského projektu "
            "vrátane kontextu okolia – dostupnosti, zelene a výhľadov. Ponúkame aj pravidelnú "
            "mesačnú dokumentáciu postupu výstavby z identických bodov, ideálnu pre investorov "
            "a banky. Povolenia v mestských a CTR zónach vybavíme za vás."
        ),
        "included_deliverables": ["15 – 30 upravených fotografií", "Video 60 – 90 s", "Verzia pre realitné portály", "Vybavenie povolení"],
        "drone_fleet_used": ["DJI Mavic 3 Pro Cine", "DJI Inspire 3"],
        "typical_turnaround": "2 – 4 pracovné dni",
        "starting_price_eur": Decimal("390.00"),
        "is_featured": True,
        "display_order": 3,
    },
    {
        "slug": "termovizne-inspekcie",
        "title": "Termovízne inšpekcie striech, FVE a priemyselných objektov",
        "category": "inspekcie-a-termovizia",
        "short_description": "Radiometrická termovízia a 20 MP zoom na bezkontaktnú kontrolu bez lešenia a odstávok.",
        "detailed_description": (
            "Odhalíme hotspoty na fotovoltických paneloch, tepelné úniky na strechách a fasádach "
            "či poruchy na technologických zariadeniach. Matrice 350 RTK s kamerou Zenmuse H20T "
            "kombinuje radiometrickú termokameru, 23× optický zoom a laserový diaľkomer. "
            "Výsledkom je prehľadný report s GPS polohou každej anomálie."
        ),
        "included_deliverables": ["Radiometrické IR snímky", "Vizuálne snímky v zoome", "PDF report s GPS", "Odporúčania opráv"],
        "drone_fleet_used": ["DJI Matrice 350 RTK"],
        "typical_turnaround": "3 – 5 pracovných dní",
        "starting_price_eur": Decimal("490.00"),
        "is_featured": True,
        "display_order": 4,
    },
    {
        "slug": "3d-mapovanie-terenu-a-ortofotomapy",
        "title": "3D mapovanie terénu a ortofotomapy",
        "category": "fotogrametria-a-ortofotomapy",
        "short_description": "RTK fotogrametria s centimetrovou presnosťou pre stavby, geodéziu a ťažbu.",
        "detailed_description": (
            "Vytvárame ortofotomapy, digitálne modely terénu, mračná bodov a 3D modely objektov. "
            "Vďaka RTK modulu a sieti SKPOS dosahujeme presnosť do 3 cm. Výstupy dodávame "
            "v štandardných formátoch pre CAD a GIS – GeoTIFF, LAS, OBJ, DXF – a pripravíme aj "
            "výpočty kubatúr či porovnania v čase."
        ),
        "included_deliverables": ["Ortofotomapa GeoTIFF", "Mračno bodov LAS", "3D model OBJ", "Výkaz kubatúr"],
        "drone_fleet_used": ["DJI Matrice 350 RTK"],
        "typical_turnaround": "5 – 7 pracovných dní",
        "starting_price_eur": Decimal("590.00"),
        "is_featured": False,
        "display_order": 5,
    },
]

FLEET = [
    {
        "model_name": "DJI Inspire 3",
        "category_label": "Heavy-Lift Cinema",
        "camera_sensor": "Full-Frame 8K Zenmuse X9-8K Air",
        "max_resolution_fps": "8K 75fps / 4K 120fps ProRes RAW",
        "flight_time_min": 28,
        "key_use_cases": ["Reklamné spoty", "Filmová a TV produkcia", "Prémiové reality"],
        "image_url": unsplash("1473968512647-3e447244af8f", 1200),
        "display_order": 1,
    },
    {
        "model_name": "Custom CineLifter FPV 7\"",
        "category_label": "FPV Akrobatický / Chasing",
        "camera_sensor": "RED Komodo 6K S35 Global Shutter",
        "max_resolution_fps": "6K 40fps / 4K 60fps RED RAW",
        "flight_time_min": 8,
        "key_use_cases": ["Chasing áut a motoriek", "Športové podujatia", "Akrobatické prelety"],
        "image_url": unsplash("1521405924368-64c5b84bec60", 1200),
        "display_order": 2,
    },
    {
        "model_name": "Indoor Cinewhoop 2.5\" Pro",
        "category_label": "Indoor Bezpečný FPV",
        "camera_sensor": "1/1.9\" CMOS 4K, chránené vrtule",
        "max_resolution_fps": "4K 60fps / 2.7K 120fps",
        "flight_time_min": 6,
        "key_use_cases": ["Prelety výrobnými halami", "Hotely a showroomy", "Realitné prehliadky"],
        "image_url": unsplash("1579829366248-204fe8413f31", 1200),
        "display_order": 3,
    },
    {
        "model_name": "DJI Mavic 3 Pro Cine",
        "category_label": "Kompaktný Cinema",
        "camera_sensor": "4/3 CMOS Hasselblad + 2 teleobjektívy",
        "max_resolution_fps": "5.1K 50fps / 4K 120fps Apple ProRes",
        "flight_time_min": 43,
        "key_use_cases": ["Reality a development", "Eventy", "Rýchle výjazdy v meste"],
        "image_url": unsplash("1508614589041-895b88991e3e", 1200),
        "display_order": 4,
    },
    {
        "model_name": "DJI Matrice 350 RTK",
        "category_label": "Priemyselná inšpekcia & RTK",
        "camera_sensor": "Zenmuse H20T (IR 640×512) / Zenmuse P1 45 MP",
        "max_resolution_fps": "4K 30fps / 45 MP fotogrametria",
        "flight_time_min": 55,
        "key_use_cases": ["Termovízia FVE a striech", "3D mapovanie", "Inšpekcie mostov a stožiarov"],
        "image_url": unsplash("1527977966376-1c8408f9f108", 1200),
        "display_order": 5,
    },
]

PILOTS = [
    {
        "full_name": "Ing. Martin Kráľ",
        "role_title": "Šéfpilot & Letecký kameraman",
        "certifications": "EASA A1/A3, A2, STS-01, Povolenie Dopravného úradu SR, Poistenie do 1 000 000 €",
        "bio": (
            "Viac ako 9 rokov a 2 400 letových hodín. Zodpovedá za plánovanie letov, komunikáciu "
            "s Dopravným úradom SR a riadenie bezpečnosti na place. Pracoval na reklamách pre "
            "automobilové značky a na celovečerných dokumentoch."
        ),
        "photo_url": unsplash("1507003211169-0a1dd7228f2d", 800),
        "display_order": 1,
    },
    {
        "full_name": "Tomáš Benko",
        "role_title": "FPV pilot & Špecialista na indoor prelety",
        "certifications": "EASA A1/A3, A2, STS-01, Medzinárodné FPV preteky",
        "bio": (
            "Bývalý pretekár v FPV pretekoch, dnes autor najzložitejších jednozáberových preletov "
            "v štúdiu. Ladí vlastné CineLiftery a cinewhoopy a pripravuje bezpečnostné protokoly "
            "pre lety v prevádzkach a interiéroch."
        ),
        "photo_url": unsplash("1500648767791-00dcc994a43e", 800),
        "display_order": 2,
    },
    {
        "full_name": "Mgr. Lucia Vargová",
        "role_title": "Operátorka kamery & Coloristka",
        "certifications": "EASA A1/A3, A2, DaVinci Resolve Certified Colorist",
        "bio": (
            "Ovláda gimbal kamery pri dvojčlenných cinema letoch a stará sa o postprodukciu – "
            "od zálohovania dát na mieste až po finálny color grading. Vďaka nej majú zábery "
            "konzistentný filmový vzhľad naprieč celou kampaňou."
        ),
        "photo_url": unsplash("1494790108377-be9c29b29330", 800),
        "display_order": 3,
    },
]


class Command(BaseCommand):
    help = "Naplní databázu ukážkovým obsahom leteckej agentúry (idempotentne)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Pred naplnením vymaže katalógové dáta (dopyty zostanú zachované).",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["flush"]:
            AerialProject.objects.all().delete()
            AerialService.objects.all().delete()
            AerialCategory.objects.all().delete()
            DroneFleetItem.objects.all().delete()
            PilotMember.objects.all().delete()
            self.stdout.write(self.style.WARNING("Katalógové dáta boli vymazané."))

        categories: dict[str, AerialCategory] = {}
        for order, data in enumerate(CATEGORIES, start=1):
            data = dict(data)
            slug = data.pop("slug")
            obj, _ = AerialCategory.objects.update_or_create(
                slug=slug, defaults={**data, "display_order": order}
            )
            categories[slug] = obj

        for data in PROJECTS:
            data = dict(data)
            slug = data.pop("slug")
            data["category"] = categories[data["category"]]
            AerialProject.objects.update_or_create(slug=slug, defaults=data)

        for data in SERVICES:
            data = dict(data)
            slug = data.pop("slug")
            data["category"] = categories[data["category"]]
            AerialService.objects.update_or_create(slug=slug, defaults=data)

        for data in FLEET:
            data = dict(data)
            DroneFleetItem.objects.update_or_create(model_name=data.pop("model_name"), defaults=data)

        for data in PILOTS:
            data = dict(data)
            PilotMember.objects.update_or_create(full_name=data.pop("full_name"), defaults=data)

        self.stdout.write(
            self.style.SUCCESS(
                "Hotovo: "
                f"{AerialCategory.objects.count()} kategórií, "
                f"{AerialProject.objects.count()} projektov, "
                f"{AerialService.objects.count()} služieb, "
                f"{DroneFleetItem.objects.count()} dronov, "
                f"{PilotMember.objects.count()} pilotov."
            )
        )
