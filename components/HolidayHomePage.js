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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  ExternalLink,
  Languages,
  MapPin,
  Menu,
  MessageCircle,
  ShowerHead,
  Users,
  Wifi,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "9779861814909";
const MAP_URL = process.env.NEXT_PUBLIC_MAP_URL || "https://maps.app.goo.gl/Q3ZcFKfFDzMhCruN7?g_st=ic";
const languages = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

const content = {
  en: {
    nav: ["Rooms", "Stay", "Location", "Contact"],
    book: "Check your stay",
    heroTitle: "Welcome to Holiday Home Bhaktapur.",
    heroCopy:
      "Stay in a cozy private room, enjoy a peaceful night's sleep, and wake up just a short walk from Durbar Square and the beautiful Nyatapola Temple.",
    explore: "Explore the rooms",
    hostNote: "Hosted with care in the heart of the old city",
    stayTitle: "A simple, comfortable base for discovering Bhaktapur",
    stayCopy:
      "We welcome travelers from around the world with clean rooms, practical comforts, and local help whenever you need it. Come for the temples and courtyards; stay for the unhurried rhythm of the city.",
    amenityLabels: ["Air conditioned", "Private bathroom", "High-speed Wi-Fi", "24-hour hot water"],
    roomsTitle: "Choose the stay that suits you",
    roomsCopy: "Three private rooms, one private room with a kitchen, and one twin-bed room with a kitchen.",
    standard: "Private room",
    standardCopy: "A restful, air-conditioned room with a private bathroom, work surface, and Wi-Fi.",
    standardAmenities: ["Comfortable beds", "Private bathroom", "Free Wi-Fi"],
    kitchen: "Private room with kitchen",
    kitchenCopy: "All the comforts of our private rooms, plus a dedicated kitchen for cooking and longer stays.",
    kitchenAmenities: ["Private kitchen", "Private bathroom", "Air conditioned", "Free Wi-Fi"],
    twinKitchen: "Private room with twin bed and kitchen",
    twinKitchenCopy: "A practical twin-bed room with a private bathroom and dedicated kitchen for flexible or longer stays.",
    twinKitchenAmenities: ["Twin beds", "Private kitchen", "Private bathroom", "Free Wi-Fi"],
    threeRooms: "3 rooms available",
    oneRoom: "1 room available",
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
    checkRate: "Check rate & availability",
    checking: "Checking…",
    sendWhatsApp: "Send request on WhatsApp",
    whatsappIntro: "Hello, I would like to request a stay.",
    notConfigured: "Live rates are being connected. Send your dates and we’ll quote the current price on WhatsApp.",
    available: "Available for these dates",
    limited: "Limited availability",
    unavailable: "No rooms are currently listed as available for these dates. Message us to check alternatives.",
    perNight: "per night",
    usdGuide: "approximate USD guide",
    essentials: "Stay essentials",
    essentialItems: [
      ["Check-in & check-out", "Please confirm your arrival and departure times with us before travel."],
      ["Rates & payment", "Rates vary by date. Your final price and payment details are confirmed directly."],
      ["Rooms with kitchens", "Rooms with kitchens are best for longer stays and guests who prefer to prepare their own meals."],
    ],
    platformTitle: "Prefer a booking platform?",
    footerCopy: "A peaceful place to stay while you explore the beauty and culture of Bhaktapur.",
    bookingPlatform: "Booking.com",
    airbnb: "Airbnb",
    rights: "Holiday Home Bhaktapur",
  },
  de: {
    nav: ["Zimmer", "Aufenthalt", "Lage", "Kontakt"],
    book: "Aufenthalt prüfen",
    heroTitle: "Willkommen in unserem gemütlichen Zuhause in Bhaktapur.",
    heroCopy: "Übernachten Sie in einem gemütlichen Privatzimmer, genießen Sie eine ruhige Nacht und wachen Sie nur wenige Gehminuten vom Durbar Square und dem wunderschönen Nyatapola-Tempel entfernt auf.",
    explore: "Zimmer entdecken",
    hostNote: "Mit Sorgfalt geführt, im Herzen der Altstadt",
    stayTitle: "Ein ruhiger, komfortabler Ausgangspunkt für Bhaktapur",
    stayCopy: "Wir begrüßen Reisende aus aller Welt mit sauberen Zimmern, praktischer Ausstattung und Hilfe vor Ort. Kommen Sie wegen der Tempel und Höfe und bleiben Sie für den entspannten Rhythmus der Stadt.",
    amenityLabels: ["Klimatisiert", "Privates Badezimmer", "Kostenloses WLAN", "Warmwasser rund um die Uhr"],
    roomsTitle: "Wählen Sie das passende Zimmer",
    roomsCopy: "Drei Privatzimmer, ein Privatzimmer mit Küche und ein Privatzimmer mit zwei Einzelbetten und Küche.",
    standard: "Privatzimmer",
    standardCopy: "Ein ruhiges, klimatisiertes Zimmer mit privatem Badezimmer, Arbeitsfläche und WLAN.",
    standardAmenities: ["Bequeme Betten", "Privates Badezimmer", "Kostenloses WLAN"],
    kitchen: "Privatzimmer mit Küche",
    kitchenCopy: "Der Komfort unserer Privatzimmer plus eine eigene Küche zum Kochen und für längere Aufenthalte.",
    kitchenAmenities: ["Private Küche", "Privates Badezimmer", "Klimatisiert", "Kostenloses WLAN"],
    twinKitchen: "Privatzimmer mit zwei Einzelbetten und Küche",
    twinKitchenCopy: "Ein praktisches Zimmer mit zwei Einzelbetten, privatem Badezimmer und eigener Küche für flexible oder längere Aufenthalte.",
    twinKitchenAmenities: ["Zwei Einzelbetten", "Private Küche", "Privates Badezimmer", "Kostenloses WLAN"],
    threeRooms: "3 Zimmer verfügbar",
    oneRoom: "1 Zimmer verfügbar",
    fromSheet: "Aktueller Preis pro Nacht",
    enquireRate: "Daten für den aktuellen Preis wählen",
    locationTitle: "Die Altstadt direkt vor der Tür",
    locationCopy: "Spazieren Sie zum Bhaktapur Durbar Square, Nyatapola-Tempel, durch traditionelle Gassen sowie zu Märkten, Cafés, Restaurants und Geschäften.",
    mapCta: "Route anzeigen",
    nearby: ["Bhaktapur Durbar Square", "Nyatapola-Tempel", "Lokale Märkte und Cafés"],
    formTitle: "Wann möchten Sie anreisen?",
    formCopy: "Prüfen Sie den Preis pro Nacht und senden Sie Ihre Anfrage direkt über WhatsApp. Wir bestätigen die Einzelheiten mit Ihnen.",
    checkIn: "Anreise",
    checkOut: "Abreise",
    adults: "Erwachsene",
    children: "Kinder",
    roomType: "Zimmerkategorie",
    checkRate: "Preis und Verfügbarkeit prüfen",
    checking: "Wird geprüft…",
    sendWhatsApp: "Anfrage über WhatsApp senden",
    whatsappIntro: "Hallo, ich möchte einen Aufenthalt anfragen.",
    notConfigured: "Die Live-Preise werden eingerichtet. Senden Sie uns Ihre Daten, und wir teilen Ihnen den aktuellen Preis über WhatsApp mit.",
    available: "Für diese Daten verfügbar",
    limited: "Begrenzte Verfügbarkeit",
    unavailable: "Für diese Daten sind derzeit keine Zimmer als verfügbar gelistet. Schreiben Sie uns, um Alternativen zu prüfen.",
    perNight: "pro Nacht",
    usdGuide: "ungefährer USD-Richtwert",
    essentials: "Wichtige Informationen",
    essentialItems: [
      ["Check-in und Check-out", "Bitte bestätigen Sie Ihre Ankunfts- und Abreisezeit vor der Reise mit uns."],
      ["Preise und Zahlung", "Die Preise variieren je nach Datum. Endpreis und Zahlungsdetails werden direkt bestätigt."],
      ["Zimmer mit Küche", "Zimmer mit Küche eignen sich besonders für längere Aufenthalte und Gäste, die selbst kochen möchten."],
    ],
    platformTitle: "Lieber über eine Buchungsplattform?",
    footerCopy: "Ein ruhiger Ort zum Übernachten, während Sie die Schönheit und Kultur Bhaktapurs entdecken.",
    bookingPlatform: "Booking.com",
    airbnb: "Airbnb",
    rights: "Holiday Home Bhaktapur",
  },
  fr: {
    nav: ["Chambres", "Séjour", "Emplacement", "Contact"],
    book: "Vérifier le séjour",
    heroTitle: "Bienvenue dans notre maison chaleureuse à Bhaktapur.",
    heroCopy: "Séjournez dans une chambre privée confortable, profitez d’une nuit paisible et réveillez-vous à quelques pas de Durbar Square et du magnifique temple de Nyatapola.",
    explore: "Découvrir les chambres",
    hostNote: "Un accueil attentionné au cœur de la vieille ville",
    stayTitle: "Un pied-à-terre simple et confortable pour découvrir Bhaktapur",
    stayCopy: "Nous accueillons les voyageurs du monde entier avec des chambres propres, des équipements pratiques et une aide locale. Venez pour les temples et les cours; restez pour le rythme paisible de la ville.",
    amenityLabels: ["Climatisé", "Salle de bains privée", "Wi-Fi gratuit", "Eau chaude 24 h/24"],
    roomsTitle: "Choisissez la chambre qui vous convient",
    roomsCopy: "Trois chambres privées, une chambre privée avec cuisine et une chambre privée avec lits jumeaux et cuisine.",
    standard: "Chambre privée",
    standardCopy: "Une chambre calme et climatisée avec salle de bains privée, espace de travail et Wi-Fi.",
    standardAmenities: ["Lits confortables", "Salle de bains privée", "Wi-Fi gratuit"],
    kitchen: "Chambre privée avec cuisine",
    kitchenCopy: "Tout le confort de nos chambres privées, avec une cuisine dédiée pour cuisiner et prolonger votre séjour.",
    kitchenAmenities: ["Cuisine privée", "Salle de bains privée", "Climatisé", "Wi-Fi gratuit"],
    twinKitchen: "Chambre privée avec lits jumeaux et cuisine",
    twinKitchenCopy: "Une chambre pratique avec lits jumeaux, salle de bains privée et cuisine dédiée, idéale pour les séjours flexibles ou prolongés.",
    twinKitchenAmenities: ["Lits jumeaux", "Cuisine privée", "Salle de bains privée", "Wi-Fi gratuit"],
    threeRooms: "3 chambres disponibles",
    oneRoom: "1 chambre disponible",
    fromSheet: "Tarif actuel par nuit",
    enquireRate: "Choisir les dates pour voir le tarif",
    locationTitle: "La vieille ville juste devant votre porte",
    locationCopy: "Rejoignez à pied Bhaktapur Durbar Square, le temple de Nyatapola, les rues traditionnelles, les marchés, cafés, restaurants et boutiques.",
    mapCta: "Afficher l’itinéraire",
    nearby: ["Bhaktapur Durbar Square", "Temple de Nyatapola", "Marchés et cafés locaux"],
    formTitle: "Quand souhaitez-vous venir?",
    formCopy: "Vérifiez le tarif par nuit, puis envoyez votre demande directement sur WhatsApp. Nous confirmerons les détails avec vous.",
    checkIn: "Arrivée",
    checkOut: "Départ",
    adults: "Adultes",
    children: "Enfants",
    roomType: "Type de chambre",
    checkRate: "Vérifier le tarif et la disponibilité",
    checking: "Vérification…",
    sendWhatsApp: "Envoyer la demande sur WhatsApp",
    whatsappIntro: "Bonjour, je souhaite demander un séjour.",
    notConfigured: "Les tarifs en direct sont en cours de configuration. Envoyez-nous vos dates et nous vous indiquerons le prix actuel sur WhatsApp.",
    available: "Disponible pour ces dates",
    limited: "Disponibilité limitée",
    unavailable: "Aucune chambre n’est actuellement indiquée comme disponible pour ces dates. Écrivez-nous pour vérifier les alternatives.",
    perNight: "par nuit",
    usdGuide: "estimation en USD",
    essentials: "Informations essentielles",
    essentialItems: [
      ["Arrivée et départ", "Veuillez confirmer vos heures d’arrivée et de départ avec nous avant votre voyage."],
      ["Tarifs et paiement", "Les tarifs varient selon les dates. Le prix final et les modalités de paiement sont confirmés directement."],
      ["Chambres avec cuisine", "Les chambres avec cuisine conviennent aux séjours prolongés et aux voyageurs qui souhaitent préparer leurs repas."],
    ],
    platformTitle: "Vous préférez une plateforme de réservation?",
    footerCopy: "Un lieu paisible où séjourner tout en découvrant la beauté et la culture de Bhaktapur.",
    bookingPlatform: "Booking.com",
    airbnb: "Airbnb",
    rights: "Holiday Home Bhaktapur",
  },
  es: {
    nav: ["Habitaciones", "Estancia", "Ubicación", "Contacto"],
    book: "Consultar estancia",
    heroTitle: "Te damos la bienvenida a nuestro acogedor hogar en Bhaktapur.",
    heroCopy: "Alójate en una acogedora habitación privada, disfruta de una noche tranquila y despierta a pocos pasos de Durbar Square y del hermoso templo Nyatapola.",
    explore: "Descubrir las habitaciones",
    hostNote: "Atención cercana en el corazón del casco antiguo",
    stayTitle: "Una base sencilla y cómoda para descubrir Bhaktapur",
    stayCopy: "Recibimos a viajeros de todo el mundo con habitaciones limpias, comodidades prácticas y ayuda local. Ven por los templos y patios; quédate por el ritmo tranquilo de la ciudad.",
    amenityLabels: ["Aire acondicionado", "Baño privado", "Wi-Fi gratis", "Agua caliente las 24 horas"],
    roomsTitle: "Elige la habitación que más te conviene",
    roomsCopy: "Tres habitaciones privadas, una habitación privada con cocina y una habitación privada con dos camas y cocina.",
    standard: "Habitación privada",
    standardCopy: "Una habitación tranquila con aire acondicionado, baño privado, espacio de trabajo y Wi-Fi.",
    standardAmenities: ["Camas cómodas", "Baño privado", "Wi-Fi gratis"],
    kitchen: "Habitación privada con cocina",
    kitchenCopy: "Todas las comodidades de nuestras habitaciones privadas, más una cocina propia para cocinar y disfrutar de estancias largas.",
    kitchenAmenities: ["Cocina privada", "Baño privado", "Aire acondicionado", "Wi-Fi gratis"],
    twinKitchen: "Habitación privada con dos camas y cocina",
    twinKitchenCopy: "Una práctica habitación con dos camas, baño privado y cocina propia para estancias flexibles o prolongadas.",
    twinKitchenAmenities: ["Dos camas", "Cocina privada", "Baño privado", "Wi-Fi gratis"],
    threeRooms: "3 habitaciones disponibles",
    oneRoom: "1 habitación disponible",
    fromSheet: "Tarifa actual por noche",
    enquireRate: "Elegir fechas para consultar la tarifa",
    locationTitle: "El casco antiguo, justo al salir",
    locationCopy: "Camina hasta Bhaktapur Durbar Square, el templo Nyatapola, las calles tradicionales, los mercados, cafés, restaurantes y tiendas.",
    mapCta: "Cómo llegar",
    nearby: ["Bhaktapur Durbar Square", "Templo Nyatapola", "Mercados y cafés locales"],
    formTitle: "¿Cuándo vienes?",
    formCopy: "Consulta la tarifa por noche y envía tu solicitud directamente por WhatsApp. Confirmaremos contigo todos los detalles.",
    checkIn: "Llegada",
    checkOut: "Salida",
    adults: "Adultos",
    children: "Niños",
    roomType: "Tipo de habitación",
    checkRate: "Consultar tarifa y disponibilidad",
    checking: "Consultando…",
    sendWhatsApp: "Enviar solicitud por WhatsApp",
    whatsappIntro: "Hola, me gustaría solicitar una estancia.",
    notConfigured: "Estamos conectando las tarifas en directo. Envíanos tus fechas y te indicaremos el precio actual por WhatsApp.",
    available: "Disponible para estas fechas",
    limited: "Disponibilidad limitada",
    unavailable: "Actualmente no aparecen habitaciones disponibles para estas fechas. Escríbenos para consultar alternativas.",
    perNight: "por noche",
    usdGuide: "estimación aproximada en USD",
    essentials: "Información esencial",
    essentialItems: [
      ["Llegada y salida", "Confirma con nosotros tus horas de llegada y salida antes de viajar."],
      ["Tarifas y pago", "Las tarifas varían según la fecha. El precio final y los datos de pago se confirman directamente."],
      ["Habitaciones con cocina", "Las habitaciones con cocina son ideales para estancias largas y huéspedes que prefieren preparar sus propias comidas."],
    ],
    platformTitle: "¿Prefieres una plataforma de reservas?",
    footerCopy: "Un lugar tranquilo donde alojarte mientras descubres la belleza y la cultura de Bhaktapur.",
    bookingPlatform: "Booking.com",
    airbnb: "Airbnb",
    rights: "Holiday Home Bhaktapur",
  },
};

const gallery = [
  { src: "/images/standard-room.jpg", alt: "Double bed in a private room", heroPosition: "60% center", heroMobilePosition: "62% center" },
  { src: "/images/standard-room-sitting.jpg", alt: "Sitting and work area in a private room", heroPosition: "56% center", heroMobilePosition: "68% center" },
  { src: "/images/standard-room-twin.PNG", alt: "Twin beds and storage in a private room", heroPosition: "58% center", heroMobilePosition: "calc(50% + 20px) center" },
  { src: "/images/private-kitchen.jpg", alt: "Private fitted kitchen", heroPosition: "64% center", heroMobilePosition: "68% center" },
  { src: "/images/private-bathroom.jpg", alt: "Clean private bathroom", heroPosition: "60% center", heroMobilePosition: "63% center" },
];

const roomGalleries = {
  standard: [
    { src: "/images/standard-room-sitting.jpg", alt: "Sitting and work area in a private room" },
    { src: "/images/standard-room.jpg", alt: "Double bed in a private room" },
    { src: "/images/private-bathroom.jpg", alt: "Bathroom for the private room" },
  ],
  kitchen: [
    { src: "/images/private-bathroom.jpg", alt: "Private bathroom for the kitchen room" },
    { src: "/images/private-kitchen.jpg", alt: "Dedicated kitchen in a private room" },
    { src: "/images/standard-room.jpg", alt: "Double bed in the private kitchen room" },
  ],
  twinKitchen: [
    { src: "/images/standard-room-twin.PNG", alt: "Twin beds in a private room with kitchen" },
    { src: "/images/private-bathroom.jpg", alt: "Private bathroom for the twin room" },
    { src: "/images/private-kitchen.jpg", alt: "Dedicated kitchen for the twin room" },
  ],
};

function RoomSlideshow({ images, label }) {
  const [index, setIndex] = useState(0);
  const showPrevious = () => setIndex((current) => (current - 1 + images.length) % images.length);
  const showNext = () => setIndex((current) => (current + 1) % images.length);

  return (
    <div className="room-media" role="region" aria-roledescription="carousel" aria-label={`${label} photos`}>
      <Image
        key={images[index].src}
        className="room-slide-image"
        src={images[index].src}
        alt={images[index].alt}
        fill
        loading="eager"
        quality={90}
        sizes="(max-width: 800px) 100vw, (max-width: 1050px) 50vw, 33vw"
      />
      <div className="room-slide-controls">
        <button type="button" onClick={showPrevious} aria-label={`Previous ${label} photo`}><ChevronLeft /></button>
        <span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <button type="button" onClick={showNext} aria-label={`Next ${label} photo`}><ChevronRight /></button>
      </div>
    </div>
  );
}

function todayString(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export default function HolidayHomePage() {
  const [language, setLanguage] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [languageHintVisible, setLanguageHintVisible] = useState(false);
  const [form, setForm] = useState({
    checkIn: todayString(1),
    checkOut: todayString(2),
    adults: "2",
    children: "0",
    roomType: "standard",
  });
  const [rate, setRate] = useState(null);
  const [rateStatus, setRateStatus] = useState("idle");
  const t = content[language];

  const usdRate = Number(process.env.NEXT_PUBLIC_NPR_PER_USD || 140);
  const platformLinks = useMemo(
    () => [
      { label: t.bookingPlatform, href: process.env.NEXT_PUBLIC_BOOKING_URL },
      { label: t.airbnb, href: process.env.NEXT_PUBLIC_AIRBNB_URL },
    ].filter((item) => item.href),
    [t],
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    let hintAlreadyShown = false;
    try {
      hintAlreadyShown = window.sessionStorage.getItem("hhb-language-hint") === "shown";
    } catch {
      // The hint can still appear when browser storage is unavailable.
    }
    if (hintAlreadyShown) return undefined;

    const showTimer = window.setTimeout(() => setLanguageHintVisible(true), 700);
    const hideTimer = window.setTimeout(() => {
      setLanguageHintVisible(false);
      try {
        window.sessionStorage.setItem("hhb-language-hint", "shown");
      } catch {
        // The timed dismissal still works when browser storage is unavailable.
      }
    }, 7000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % gallery.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setRate(null);
    setRateStatus("idle");
  }

  function dismissLanguageHint() {
    setLanguageHintVisible(false);
    try {
      window.sessionStorage.setItem("hhb-language-hint", "shown");
    } catch {
      // The in-page dismissal still works when browser storage is unavailable.
    }
  }

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    dismissLanguageHint();
  }

  async function checkRate() {
    setRateStatus("loading");
    try {
      const query = new URLSearchParams({
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        roomType: form.roomType === "twin-kitchen" ? "kitchen" : form.roomType,
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

  function whatsappUrl() {
    const roomName = form.roomType === "twin-kitchen"
      ? t.twinKitchen
      : form.roomType === "kitchen" ? t.kitchen : t.standard;
    const message = `${t.whatsappIntro}\n\n${t.checkIn}: ${form.checkIn}\n${t.checkOut}: ${form.checkOut}\n${t.adults}: ${form.adults}\n${t.children}: ${form.children}\n${t.roomType}: ${roomName}${rate?.rateNpr ? `\n${t.fromSheet}: NPR ${rate.rateNpr.toLocaleString()}` : ""}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Holiday Home Bhaktapur home">
          <Image src="/images/logo.png" alt="Holiday Home Bhaktapur" width={68} height={69} priority />
          <span><strong>Holiday Home</strong><small>Bhaktapur</small></span>
        </a>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          {["rooms", "stay", "location", "contact"].map((id, index) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{t.nav[index]}</a>
          ))}
        </nav>
        <div className="header-actions">
          <label className="language-select">
            <Languages size={17} aria-hidden="true" />
            <select value={language} onChange={(event) => changeLanguage(event.target.value)} aria-label="Language">
              {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
            </select>
            <ChevronDown className="language-chevron" aria-hidden="true" />
          </label>
          {languageHintVisible && (
            <div className="language-hint" role="status">
              <strong>Choose your language</strong>
              <span>Deutsch · Français · Español</span>
              <button type="button" onClick={dismissLanguageHint} aria-label="Dismiss language notice">
                <X aria-hidden="true" />
              </button>
            </div>
          )}
          <a className="button button-small" href="#contact">{t.book}</a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-image" aria-hidden="true">
          {gallery.map((image, index) => (
            <Image
              key={image.src}
              className={`hero-slide-image ${index === heroIndex ? "active" : ""}`}
              src={image.src}
              alt=""
              fill
              priority={index === 0}
              loading="eager"
              quality={90}
              sizes="100vw"
              style={{ "--hero-position": image.heroPosition, "--hero-mobile-position": image.heroMobilePosition }}
            />
          ))}
          <div className="hero-slide-progress">
            {gallery.map((image, index) => <span key={image.src} className={index === heroIndex ? "active" : ""} />)}
          </div>
          <div className="hero-location"><MapPin size={18} /> {t.hostNote}</div>
        </div>
        <div className="hero-copy">
          <h1>
            {language === "en" ? (
              <>Welcome to <span className="hero-brand-name">Holiday Home Bhaktapur.</span></>
            ) : t.heroTitle}
          </h1>
          <p>{t.heroCopy}</p>
          <div className="hero-actions">
            <a className="button" href="#contact">{t.book}</a>
            <a className="text-link" href="#rooms">{t.explore} <ArrowDown size={18} /></a>
            <a className="text-link" href={MAP_URL} target="_blank" rel="noreferrer">{t.mapCta} <MapPin size={17} /></a>
          </div>
        </div>
        <div className="heritage-arch" aria-hidden="true" />
      </section>

      <section id="rooms" className="rooms-section">
        <div className="section-shell">
          <div className="section-heading">
            <div><h2>{t.roomsTitle}</h2></div>
            <p>{t.roomsCopy}</p>
          </div>
          <div className="room-list">
            <article className="room-row">
              <RoomSlideshow images={roomGalleries.standard} label={t.standard} />
              <div className="room-details">
                <span>{t.threeRooms}</span><h3>{t.standard}</h3><p>{t.standardCopy}</p>
                <ul><li><BedDouble /> {t.standardAmenities[0]}</li><li><Bath /> {t.standardAmenities[1]}</li><li><Wifi /> {t.standardAmenities[2]}</li></ul>
                <a className="text-link" href="#contact" onClick={() => setForm((current) => ({ ...current, roomType: "standard" }))}>{t.enquireRate} <ChevronRight /></a>
              </div>
            </article>
            <article className="room-row room-row-reverse">
              <RoomSlideshow images={roomGalleries.kitchen} label={t.kitchen} />
              <div className="room-details">
                <span>{t.oneRoom}</span><h3>{t.kitchen}</h3><p>{t.kitchenCopy}</p>
                <ul><li><CookingPot /> {t.kitchenAmenities[0]}</li><li><Bath /> {t.kitchenAmenities[1]}</li><li><AirVent /> {t.kitchenAmenities[2]}</li><li><Wifi /> {t.kitchenAmenities[3]}</li></ul>
                <a className="text-link" href="#contact" onClick={() => setForm((current) => ({ ...current, roomType: "kitchen" }))}>{t.enquireRate} <ChevronRight /></a>
              </div>
            </article>
            <article className="room-row">
              <RoomSlideshow images={roomGalleries.twinKitchen} label={t.twinKitchen} />
              <div className="room-details">
                <span>{t.oneRoom}</span><h3>{t.twinKitchen}</h3><p>{t.twinKitchenCopy}</p>
                <ul><li><BedDouble /> {t.twinKitchenAmenities[0]}</li><li><CookingPot /> {t.twinKitchenAmenities[1]}</li><li><Bath /> {t.twinKitchenAmenities[2]}</li><li><Wifi /> {t.twinKitchenAmenities[3]}</li></ul>
                <a className="text-link" href="#contact" onClick={() => setForm((current) => ({ ...current, roomType: "twin-kitchen" }))}>{t.enquireRate} <ChevronRight /></a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="stay" className="intro section-shell">
        <div className="intro-copy">
          <h2>{t.stayTitle}</h2>
          <p>{t.stayCopy}</p>
        </div>
        <div className="amenities">
          {[AirVent, Bath, Wifi, ShowerHead].map((Icon, index) => (
            <div className="amenity" key={t.amenityLabels[index]}><Icon /><span>{t.amenityLabels[index]}</span></div>
          ))}
        </div>
      </section>

      <section className="gallery-section section-shell" aria-label="Property gallery">
        <div className="gallery-main">
          <Image src={gallery[galleryIndex].src} alt={gallery[galleryIndex].alt} fill quality={90} sizes="(max-width: 800px) 100vw, 70vw" />
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
          <h2>{t.locationTitle}</h2><p>{t.locationCopy}</p>
          <ol>{t.nearby.map((place, index) => <li key={place}><span>0{index + 1}</span>{place}</li>)}</ol>
        </div>
        <div className="location-visual" aria-hidden="true">
          <Image
            src="/images/bhaktapur view.jpg"
            alt=""
            fill
            loading="eager"
            quality={90}
            sizes="(max-width: 960px) 100vw, 50vw"
          />
        </div>
      </section>

      <section id="contact" className="booking-section">
        <div className="booking-copy">
          <h2>{t.formTitle}</h2><p>{t.formCopy}</p>
        </div>
        <div className="booking-form">
          <div className="field-grid">
            <label>{t.checkIn}<span><CalendarDays /><input name="checkIn" type="date" min={todayString()} value={form.checkIn} onChange={updateField} /></span></label>
            <label>{t.checkOut}<span><CalendarDays /><input name="checkOut" type="date" min={form.checkIn} value={form.checkOut} onChange={updateField} /></span></label>
            <label>{t.adults}<span><Users /><select name="adults" value={form.adults} onChange={updateField}>{[1,2,3,4,5,6].map((n) => <option key={n}>{n}</option>)}</select></span></label>
            <label>{t.children}<span><Users /><select name="children" value={form.children} onChange={updateField}>{[0,1,2,3,4].map((n) => <option key={n}>{n}</option>)}</select></span></label>
          </div>
          <fieldset><legend>{t.roomType}</legend><label className={form.roomType === "standard" ? "selected" : ""}><input type="radio" name="roomType" value="standard" checked={form.roomType === "standard"} onChange={updateField} /><BedDouble /><span>{t.standard}</span><Check /></label><label className={form.roomType === "kitchen" ? "selected" : ""}><input type="radio" name="roomType" value="kitchen" checked={form.roomType === "kitchen"} onChange={updateField} /><CookingPot /><span>{t.kitchen}</span><Check /></label><label className={form.roomType === "twin-kitchen" ? "selected" : ""}><input type="radio" name="roomType" value="twin-kitchen" checked={form.roomType === "twin-kitchen"} onChange={updateField} /><BedDouble /><span>{t.twinKitchen}</span><Check /></label></fieldset>
          <button className="button rate-button" type="button" disabled={!form.checkIn || !form.checkOut || form.checkOut <= form.checkIn || rateStatus === "loading"} onClick={checkRate}>{rateStatus === "loading" ? t.checking : t.checkRate}</button>
          {rateStatus === "done" && <div className={`rate-result ${rate?.available === false ? "rate-unavailable" : ""}`} aria-live="polite">
            {rate?.rateNpr ? <><strong>NPR {rate.rateNpr.toLocaleString()} <small>{t.perNight}</small></strong><span>≈ USD {(rate.rateNpr / usdRate).toFixed(0)} · {t.usdGuide}</span><p>{rate.availableRooms <= 1 ? t.limited : t.available}</p></> : <p>{rate?.available === false ? t.unavailable : t.notConfigured}</p>}
          </div>}
          <a className="button whatsapp-button" href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle /> {t.sendWhatsApp}</a>
        </div>
      </section>

      <section className="essentials section-shell">
        <div><h2>{t.essentials}</h2></div>
        <div className="essential-list">{t.essentialItems.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <footer>
        <div className="footer-brand"><Image src="/images/logo.png" alt="" width={92} height={94} /><div><h2>Holiday Home Bhaktapur</h2><p>{t.footerCopy}</p></div></div>
        <div className="footer-contact"><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"><MessageCircle /> +977 986-1814909</a><a href={MAP_URL} target="_blank" rel="noreferrer"><MapPin /> {t.mapCta}</a>{platformLinks.length > 0 && <><span>{t.platformTitle}</span>{platformLinks.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label} <ExternalLink /></a>)}</>}</div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {t.rights}</span><label className="language-select"><Languages aria-hidden="true" /><select value={language} onChange={(event) => changeLanguage(event.target.value)} aria-label="Footer language">{languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select><ChevronDown className="language-chevron" aria-hidden="true" /></label></div>
      </footer>

      <a className="floating-whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle /></a>
    </main>
  );
}
