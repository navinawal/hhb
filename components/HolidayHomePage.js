"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  AirVent,
  ArrowDown,
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  ExternalLink,
  Languages,
  MapPin,
  Menu,
  MessageCircle,
  Plane,
  Refrigerator,
  Users,
  Wifi,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "9779861814909";

const content = {
  en: {
    nav: ["Stay", "Rooms", "Location", "Contact"],
    book: "Check your stay",
    heroTitle: "Sleep peacefully. Wake up in Bhaktapur.",
    heroCopy:
      "Five comfortable private rooms, two with their own kitchen, a short walk from Durbar Square and Nyatapola Temple.",
    explore: "Explore the rooms",
    hostNote: "Hosted with care in the heart of the old city",
    stayTitle: "A simple, comfortable base for discovering Bhaktapur",
    stayCopy:
      "We welcome travelers from around the world with clean rooms, practical comforts, and local help whenever you need it. Come for the temples and courtyards; stay for the unhurried rhythm of the city.",
    amenityLabels: ["Air conditioned", "Private bathroom", "High-speed Wi-Fi", "Local assistance"],
    roomsTitle: "Choose the stay that suits you",
    roomsCopy: "Three private rooms for shorter visits. Two kitchen rooms for guests who like more independence.",
    standard: "Standard private room",
    standardCopy: "A restful, air-conditioned room with a private bathroom, work surface, refrigerator, and Wi-Fi.",
    standardAmenities: ["Comfortable beds", "Private refrigerator", "Free Wi-Fi"],
    kitchen: "Private room with kitchen",
    kitchenCopy: "All the comforts of our private rooms, plus a dedicated kitchen for cooking and longer stays.",
    kitchenAmenities: ["Private kitchen", "Private bathroom", "Air conditioned"],
    threeRooms: "3 rooms available",
    twoRooms: "2 rooms available",
    fromSheet: "Live nightly rate",
    enquireRate: "Choose dates for the current rate",
    locationTitle: "The old city, right outside your door",
    locationCopy:
      "Walk to Bhaktapur Durbar Square, Nyatapola Temple, traditional streets, local markets, cafés, restaurants, and shops.",
    mapCta: "Get directions",
    nearby: ["Bhaktapur Durbar Square", "Nyatapola Temple", "Local markets & cafés"],
    formTitle: "Tell us when you’re coming",
    formCopy: "Check the nightly rate, then send your stay request directly on WhatsApp. We’ll confirm the details with you.",
    checkIn: "Arrival",
    checkOut: "Departure",
    adults: "Adults",
    children: "Children",
    roomType: "Room type",
    pickup: "I would like help arranging airport or local transport",
    checkRate: "Check rate & availability",
    checking: "Checking…",
    sendWhatsApp: "Send request on WhatsApp",
    notConfigured: "Live rates are being connected. Send your dates and we’ll quote the current price on WhatsApp.",
    available: "Available for these dates",
    limited: "Limited availability",
    unavailable: "No rooms are currently listed as available for these dates. Message us to check alternatives.",
    perNight: "per night",
    usdGuide: "approximate USD guide",
    pickupTitle: "Need a ride?",
    pickupCopy: "Ask us about airport pickup or local transport when you send your room request.",
    pickupCta: "Request transport",
    essentials: "Stay essentials",
    essentialItems: [
      ["Check-in & check-out", "Please confirm your arrival and departure times with us before travel."],
      ["Rates & payment", "Rates vary by date. Your final price and payment details are confirmed directly."],
      ["Kitchen rooms", "Kitchen rooms are best for longer stays and guests who prefer to prepare their own meals."],
    ],
    platformTitle: "Prefer a booking platform?",
    footerCopy: "A peaceful place to stay while you explore the beauty and culture of Bhaktapur.",
    bookingPlatform: "Booking.com",
    airbnb: "Airbnb",
    rights: "Holiday Home Bhaktapur",
  },
  ne: {
    nav: ["बसाइ", "कोठाहरू", "स्थान", "सम्पर्क"],
    book: "बसाइ जाँच्नुहोस्",
    heroTitle: "आरामले सुत्नुहोस्। भक्तपुरमा बिहानको स्वागत गर्नुहोस्।",
    heroCopy: "दरबार स्क्वायर र न्यातपोल मन्दिरबाट पैदल दूरीमा पाँच आरामदायी निजी कोठा—दुईवटामा आफ्नै भान्सा।",
    explore: "कोठाहरू हेर्नुहोस्",
    hostNote: "पुरानो सहरको मुटुमा आत्मीय आतिथ्य",
    stayTitle: "भक्तपुर घुम्नका लागि सरल र आरामदायी बसाइ",
    stayCopy: "हामी सफा कोठा, उपयोगी सुविधा र आवश्यक पर्दा स्थानीय सहयोगसहित संसारभरका पाहुनालाई स्वागत गर्छौँ।",
    amenityLabels: ["वातानुकूलित", "निजी स्नानघर", "उच्च-गति वाइफाइ", "स्थानीय सहयोग"],
    roomsTitle: "आफूलाई मिल्ने बसाइ रोज्नुहोस्",
    roomsCopy: "छोटो बसाइका लागि तीन निजी कोठा। थप स्वतन्त्रता चाहने पाहुनाका लागि भान्सासहित दुई कोठा।",
    standard: "साधारण निजी कोठा",
    standardCopy: "निजी स्नानघर, काम गर्ने ठाउँ, फ्रिज र वाइफाइसहितको शान्त वातानुकूलित कोठा।",
    standardAmenities: ["आरामदायी ओछ्यान", "निजी फ्रिज", "निःशुल्क वाइफाइ"],
    kitchen: "भान्सासहित निजी कोठा",
    kitchenCopy: "निजी कोठाका सबै सुविधा र लामो बसाइका लागि आफ्नै भान्सा।",
    kitchenAmenities: ["निजी भान्सा", "निजी स्नानघर", "वातानुकूलित"],
    threeRooms: "३ कोठा उपलब्ध",
    twoRooms: "२ कोठा उपलब्ध",
    fromSheet: "हालको प्रति रात दर",
    enquireRate: "हालको दरका लागि मिति रोज्नुहोस्",
    locationTitle: "ढोकाबाहिर नै पुरानो सहर",
    locationCopy: "भक्तपुर दरबार स्क्वायर, न्यातपोल मन्दिर, परम्परागत गल्ली, बजार, क्याफे, रेस्टुरेन्ट र पसलसम्म पैदल जानुहोस्।",
    mapCta: "बाटो हेर्नुहोस्",
    nearby: ["भक्तपुर दरबार स्क्वायर", "न्यातपोल मन्दिर", "स्थानीय बजार र क्याफे"],
    formTitle: "तपाईं कहिले आउँदै हुनुहुन्छ?",
    formCopy: "प्रति रात दर जाँचेर आफ्नो बसाइको अनुरोध सिधै व्हाट्सएपमा पठाउनुहोस्। हामी विवरण पुष्टि गर्नेछौँ।",
    checkIn: "आगमन",
    checkOut: "प्रस्थान",
    adults: "वयस्क",
    children: "बालबालिका",
    roomType: "कोठाको प्रकार",
    pickup: "मलाई विमानस्थल वा स्थानीय यातायात मिलाउन सहयोग चाहिन्छ",
    checkRate: "दर र उपलब्धता जाँच्नुहोस्",
    checking: "जाँच हुँदैछ…",
    sendWhatsApp: "व्हाट्सएपमा अनुरोध पठाउनुहोस्",
    notConfigured: "हालको दर जोडिँदैछ। मिति पठाउनुहोस्, हामी व्हाट्सएपमा मूल्य बताउनेछौँ।",
    available: "यी मितिका लागि उपलब्ध",
    limited: "सीमित उपलब्धता",
    unavailable: "यी मितिका लागि अहिले कोठा उपलब्ध देखिएको छैन। विकल्प जाँच्न हामीलाई सन्देश पठाउनुहोस्।",
    perNight: "प्रति रात",
    usdGuide: "अनुमानित अमेरिकी डलर",
    pickupTitle: "यातायात चाहिन्छ?",
    pickupCopy: "कोठाको अनुरोध पठाउँदा विमानस्थल पिकअप वा स्थानीय यातायातबारे सोध्नुहोस्।",
    pickupCta: "यातायात अनुरोध",
    essentials: "बसाइका मुख्य जानकारी",
    essentialItems: [
      ["चेक-इन र चेक-आउट", "यात्राअघि आफ्नो आगमन र प्रस्थान समय हामीसँग पुष्टि गर्नुहोस्।"],
      ["दर र भुक्तानी", "मितिअनुसार दर फरक हुन्छ। अन्तिम मूल्य र भुक्तानी विवरण सिधै पुष्टि गरिन्छ।"],
      ["भान्सासहित कोठा", "लामो बसाइ र आफ्नै खाना बनाउन चाहने पाहुनाका लागि उपयुक्त।"],
    ],
    platformTitle: "बुकिङ प्लेटफर्म मनपर्छ?",
    footerCopy: "भक्तपुरको सुन्दरता र संस्कृति घुम्दा शान्त र आरामदायी बसाइ।",
    bookingPlatform: "Booking.com",
    airbnb: "Airbnb",
    rights: "Holiday Home Bhaktapur",
  },
};

const gallery = [
  { src: "/images/standard-room.jpg", alt: "Double bed in a standard private room" },
  { src: "/images/standard-room-sitting.jpg", alt: "Sitting and work area in a standard room" },
  { src: "/images/standard-room-twin.jpg", alt: "Twin beds and storage in a private room" },
  { src: "/images/private-kitchen.jpg", alt: "Private fitted kitchen" },
  { src: "/images/private-bathroom.jpg", alt: "Clean private bathroom" },
];

function todayString(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export default function HolidayHomePage() {
  const [language, setLanguage] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [form, setForm] = useState({
    checkIn: todayString(1),
    checkOut: todayString(2),
    adults: "2",
    children: "0",
    roomType: "standard",
    pickup: false,
  });
  const [rate, setRate] = useState(null);
  const [rateStatus, setRateStatus] = useState("idle");
  const t = content[language];
  const isNepali = language === "ne";

  const usdRate = Number(process.env.NEXT_PUBLIC_NPR_PER_USD || 140);
  const platformLinks = useMemo(
    () => [
      { label: t.bookingPlatform, href: process.env.NEXT_PUBLIC_BOOKING_URL },
      { label: t.airbnb, href: process.env.NEXT_PUBLIC_AIRBNB_URL },
    ].filter((item) => item.href),
    [t],
  );

  useEffect(() => {
    document.documentElement.lang = isNepali ? "ne" : "en";
  }, [isNepali]);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setRate(null);
    setRateStatus("idle");
  }

  async function checkRate() {
    setRateStatus("loading");
    try {
      const query = new URLSearchParams({
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        roomType: form.roomType,
      });
      const response = await fetch(`/api/rates?${query}`);
      const data = await response.json();
      setRate(data);
      setRateStatus("done");
    } catch {
      setRate({ configured: true, error: true, available: null });
      setRateStatus("done");
    }
  }

  function whatsappUrl(transportOnly = false) {
    const roomName = form.roomType === "kitchen" ? t.kitchen : t.standard;
    const message = transportOnly
      ? `${isNepali ? "नमस्ते" : "Hello"}, ${isNepali ? "मलाई यातायात मिलाउन सहयोग चाहिन्छ।" : "I would like help arranging transport."}`
      : `${isNepali ? "नमस्ते, म बसाइको अनुरोध गर्न चाहन्छु।" : "Hello, I would like to request a stay."}\n\n${t.checkIn}: ${form.checkIn}\n${t.checkOut}: ${form.checkOut}\n${t.adults}: ${form.adults}\n${t.children}: ${form.children}\n${t.roomType}: ${roomName}\n${t.pickup}: ${form.pickup ? (isNepali ? "हो" : "Yes") : (isNepali ? "होइन" : "No")}${rate?.rateNpr ? `\n${t.fromSheet}: NPR ${rate.rateNpr.toLocaleString()}` : ""}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  return (
    <main className={isNepali ? "nepali" : ""}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Holiday Home Bhaktapur home">
          <Image src="/images/logo.jpg" alt="Holiday Home Bhaktapur" width={68} height={68} priority />
          <span><strong>Holiday Home</strong><small>Bhaktapur</small></span>
        </a>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          {["stay", "rooms", "location", "contact"].map((id, index) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{t.nav[index]}</a>
          ))}
        </nav>
        <div className="header-actions">
          <button className="language-button" onClick={() => setLanguage(isNepali ? "en" : "ne")} aria-label="Change language">
            <Languages size={17} /> {isNepali ? "EN" : "ने"}
          </button>
          <a className="button button-small" href="#contact">{t.book}</a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-image" aria-hidden="true">
          <Image src="/images/standard-room.jpg" alt="" fill priority loading="eager" sizes="100vw" />
        </div>
        <div className="hero-copy">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroCopy}</p>
          <div className="hero-actions">
            <a className="button" href="#contact">{t.book}</a>
            <a className="text-link" href="#rooms">{t.explore} <ArrowDown size={18} /></a>
          </div>
        </div>
        <div className="hero-location"><MapPin size={18} /> {t.hostNote}</div>
        <div className="heritage-arch" aria-hidden="true" />
      </section>

      <section id="stay" className="intro section-shell">
        <div className="section-number">HHB / 01</div>
        <div className="intro-copy">
          <h2>{t.stayTitle}</h2>
          <p>{t.stayCopy}</p>
        </div>
        <div className="amenities">
          {[AirVent, Bath, Wifi, MessageCircle].map((Icon, index) => (
            <div className="amenity" key={t.amenityLabels[index]}><Icon /><span>{t.amenityLabels[index]}</span></div>
          ))}
        </div>
      </section>

      <section id="rooms" className="rooms-section">
        <div className="section-shell">
          <div className="section-heading">
            <div><span className="section-number">HHB / 02</span><h2>{t.roomsTitle}</h2></div>
            <p>{t.roomsCopy}</p>
          </div>
          <div className="room-list">
            <article className="room-row">
              <div className="room-media"><Image src="/images/standard-room-twin.jpg" alt="Standard private room" fill loading="eager" sizes="(max-width: 800px) 100vw, 48vw" /></div>
              <div className="room-details">
                <span>{t.threeRooms}</span><h3>{t.standard}</h3><p>{t.standardCopy}</p>
                <ul><li><BedDouble /> {t.standardAmenities[0]}</li><li><Refrigerator /> {t.standardAmenities[1]}</li><li><Wifi /> {t.standardAmenities[2]}</li></ul>
                <a className="text-link" href="#contact" onClick={() => setForm((current) => ({ ...current, roomType: "standard" }))}>{t.enquireRate} <ChevronRight /></a>
              </div>
            </article>
            <article className="room-row room-row-reverse">
              <div className="room-media"><Image src="/images/private-kitchen.jpg" alt="Private kitchen room" fill loading="eager" sizes="(max-width: 800px) 100vw, 48vw" /></div>
              <div className="room-details">
                <span>{t.twoRooms}</span><h3>{t.kitchen}</h3><p>{t.kitchenCopy}</p>
                <ul><li><CookingPot /> {t.kitchenAmenities[0]}</li><li><Bath /> {t.kitchenAmenities[1]}</li><li><AirVent /> {t.kitchenAmenities[2]}</li></ul>
                <a className="text-link" href="#contact" onClick={() => setForm((current) => ({ ...current, roomType: "kitchen" }))}>{t.enquireRate} <ChevronRight /></a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="gallery-section section-shell" aria-label="Property gallery">
        <div className="gallery-main">
          <Image src={gallery[galleryIndex].src} alt={gallery[galleryIndex].alt} fill sizes="(max-width: 800px) 100vw, 70vw" />
          <div className="gallery-controls">
            <button onClick={() => setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)} aria-label="Previous photo"><ChevronLeft /></button>
            <span>{String(galleryIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span>
            <button onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)} aria-label="Next photo"><ChevronRight /></button>
          </div>
        </div>
        <div className="gallery-thumbs">
          {gallery.map((image, index) => (
            <button key={image.src} className={index === galleryIndex ? "active" : ""} onClick={() => setGalleryIndex(index)} aria-label={`View photo ${index + 1}`}>
              <Image src={image.src} alt="" fill sizes="96px" />
            </button>
          ))}
        </div>
      </section>

      <section id="location" className="location-section">
        <div className="location-panel">
          <span className="section-number">HHB / 03</span>
          <h2>{t.locationTitle}</h2><p>{t.locationCopy}</p>
          <ol>{t.nearby.map((place, index) => <li key={place}><span>0{index + 1}</span>{place}</li>)}</ol>
          {process.env.NEXT_PUBLIC_MAP_URL && <a className="button button-outline" href={process.env.NEXT_PUBLIC_MAP_URL} target="_blank" rel="noreferrer">{t.mapCta} <ExternalLink size={17} /></a>}
        </div>
        <div className="location-visual" aria-hidden="true">
          <div className="brick-grid" /><div className="temple-line"><span /><span /><span /><span /></div>
          <MapPin />
        </div>
      </section>

      <section id="contact" className="booking-section">
        <div className="booking-copy">
          <span className="section-number">HHB / 04</span><h2>{t.formTitle}</h2><p>{t.formCopy}</p>
          <div className="transport-card"><Plane /><div><h3>{t.pickupTitle}</h3><p>{t.pickupCopy}</p><a href={whatsappUrl(true)} target="_blank" rel="noreferrer">{t.pickupCta} <ChevronRight /></a></div></div>
        </div>
        <div className="booking-form">
          <div className="field-grid">
            <label>{t.checkIn}<span><CalendarDays /><input name="checkIn" type="date" min={todayString()} value={form.checkIn} onChange={updateField} /></span></label>
            <label>{t.checkOut}<span><CalendarDays /><input name="checkOut" type="date" min={form.checkIn} value={form.checkOut} onChange={updateField} /></span></label>
            <label>{t.adults}<span><Users /><select name="adults" value={form.adults} onChange={updateField}>{[1,2,3,4,5,6].map((n) => <option key={n}>{n}</option>)}</select></span></label>
            <label>{t.children}<span><Users /><select name="children" value={form.children} onChange={updateField}>{[0,1,2,3,4].map((n) => <option key={n}>{n}</option>)}</select></span></label>
          </div>
          <fieldset><legend>{t.roomType}</legend><label className={form.roomType === "standard" ? "selected" : ""}><input type="radio" name="roomType" value="standard" checked={form.roomType === "standard"} onChange={updateField} /><BedDouble /><span>{t.standard}</span><Check /></label><label className={form.roomType === "kitchen" ? "selected" : ""}><input type="radio" name="roomType" value="kitchen" checked={form.roomType === "kitchen"} onChange={updateField} /><CookingPot /><span>{t.kitchen}</span><Check /></label></fieldset>
          <label className="pickup-check"><input type="checkbox" name="pickup" checked={form.pickup} onChange={updateField} /><span><Check /></span>{t.pickup}</label>
          <button className="button rate-button" type="button" disabled={!form.checkIn || !form.checkOut || form.checkOut <= form.checkIn || rateStatus === "loading"} onClick={checkRate}>{rateStatus === "loading" ? t.checking : t.checkRate}</button>
          {rateStatus === "done" && <div className={`rate-result ${rate?.available === false ? "rate-unavailable" : ""}`} aria-live="polite">
            {rate?.rateNpr ? <><strong>NPR {rate.rateNpr.toLocaleString()} <small>{t.perNight}</small></strong><span>≈ USD {(rate.rateNpr / usdRate).toFixed(0)} · {t.usdGuide}</span><p>{rate.availableRooms <= 1 ? t.limited : t.available}</p></> : <p>{rate?.available === false ? t.unavailable : t.notConfigured}</p>}
          </div>}
          <a className="button whatsapp-button" href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle /> {t.sendWhatsApp}</a>
        </div>
      </section>

      <section className="essentials section-shell">
        <div><span className="section-number">HHB / 05</span><h2>{t.essentials}</h2></div>
        <div className="essential-list">{t.essentialItems.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <footer>
        <div className="footer-brand"><Image src="/images/logo.jpg" alt="" width={92} height={92} /><div><h2>Holiday Home Bhaktapur</h2><p>{t.footerCopy}</p></div></div>
        <div className="footer-contact"><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"><MessageCircle /> +977 986-1814909</a>{platformLinks.length > 0 && <><span>{t.platformTitle}</span>{platformLinks.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label} <ExternalLink /></a>)}</>}</div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {t.rights}</span><button onClick={() => setLanguage(isNepali ? "en" : "ne")}><Languages /> {isNepali ? "English" : "नेपाली"}</button></div>
      </footer>

      <a className="floating-whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle /></a>
    </main>
  );
}
