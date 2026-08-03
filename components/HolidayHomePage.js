"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  ShowerHead,
  Users,
  Wifi,
  X,
} from "lucide-react";
import CmsEditButton from "@/components/cms/CmsEditButton";

const GENERAL_WHATSAPP_NUMBER = "9779861814909";
const BOOKING_WHATSAPP_NUMBER = "9779851356074";
const CONTACT_EMAIL = "holidayhomebhaktapur@gmail.com";
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
    standard: "Room with private bathroom",
    standardCopy: "A restful, air-conditioned room with a private bathroom, work surface, and Wi-Fi.",
    standardAmenities: ["Comfortable beds", "Private bathroom", "Free Wi-Fi"],
    kitchen: "Room with Queen-size bed, Mini kitchen and Bathroom",
    kitchenCopy: "All the comforts of our private rooms, plus a dedicated kitchen for cooking and longer stays.",
    kitchenAmenities: ["Private kitchen", "Private bathroom", "Air conditioned", "Free Wi-Fi"],
    twinKitchen: "Room with twin bed, Mini kitchen and Bathroom",
    twinKitchenCopy: "A practical twin-bed room with a private bathroom and dedicated kitchen for flexible or longer stays.",
    twinKitchenAmenities: ["Twin beds", "Private kitchen", "Private bathroom", "Free Wi-Fi"],
    threeRooms: "3 rooms available",
    oneRoom: "1 room available",
    fromSheet: "Live nightly rate",
    enquireRate: "Check availability",
    readMore: "Read more",
    showLess: "Show less",
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
    bookingContact: "Booking requests",
    generalContact: "General enquiries",
    whatsappIntro: "Hello, I would like to request a stay.",
    whatsappAvailabilityIntro: "Hello, I would like to enquire about room availability.",
    notConfigured: "Send your dates on WhatsApp and we’ll confirm availability.",
    availabilityPrompt: "Send your dates on WhatsApp and we’ll confirm availability.",
    available: "Available for these dates",
    limited: "Limited availability",
    unavailable: "No rooms are currently listed as available for these dates. Message us to check alternatives.",
    perNight: "per night",
    night: "night",
    nights: "nights",
    total: "Total",
    usdGuide: "approximate USD guide",
    ratePolicyTitle: "Room rate & payment",
    ratePolicyCopy: "The rate is per room, per night. Please confirm payment details directly with us.",
    essentials: "Stay essentials",
    essentialItems: [
      ["Check-in & check-out", "Please plan your arrival and departure around the standard times below."],
      ["Rates & payment", "The current nightly rate applies to every room. Payment details are confirmed directly."],
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
    enquireRate: "Verfügbarkeit prüfen",
    readMore: "Mehr lesen",
    showLess: "Weniger anzeigen",
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
    bookingContact: "Buchungsanfragen",
    generalContact: "Allgemeine Anfragen",
    whatsappIntro: "Hallo, ich möchte einen Aufenthalt anfragen.",
    whatsappAvailabilityIntro: "Hallo, ich möchte mich nach der Zimmerverfügbarkeit erkundigen.",
    notConfigured: "Senden Sie uns Ihre Daten über WhatsApp, und wir bestätigen die Verfügbarkeit.",
    availabilityPrompt: "Senden Sie uns Ihre Reisedaten über WhatsApp, und wir bestätigen die Verfügbarkeit.",
    available: "Für diese Daten verfügbar",
    limited: "Begrenzte Verfügbarkeit",
    unavailable: "Für diese Daten sind derzeit keine Zimmer als verfügbar gelistet. Schreiben Sie uns, um Alternativen zu prüfen.",
    perNight: "pro Nacht",
    night: "Nacht",
    nights: "Nächte",
    total: "Gesamt",
    usdGuide: "ungefährer USD-Richtwert",
    ratePolicyTitle: "Zimmerpreis & Zahlung",
    ratePolicyCopy: "Der Preis gilt pro Zimmer und Nacht. Bitte bestätigen Sie die Zahlungsdetails direkt mit uns.",
    essentials: "Wichtige Informationen",
    essentialItems: [
      ["Check-in und Check-out", "Bitte planen Sie Ihre Ankunft und Abreise nach den unten angegebenen Standardzeiten."],
      ["Preise und Zahlung", "Der aktuelle Preis pro Nacht gilt für alle Zimmer. Die Zahlungsdetails werden direkt bestätigt."],
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
    enquireRate: "Vérifier la disponibilité",
    readMore: "Lire la suite",
    showLess: "Réduire",
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
    bookingContact: "Demandes de réservation",
    generalContact: "Renseignements généraux",
    whatsappIntro: "Bonjour, je souhaite demander un séjour.",
    whatsappAvailabilityIntro: "Bonjour, je souhaite connaître la disponibilité des chambres.",
    notConfigured: "Envoyez-nous vos dates sur WhatsApp et nous confirmerons la disponibilité.",
    availabilityPrompt: "Envoyez-nous vos dates sur WhatsApp et nous confirmerons la disponibilité.",
    available: "Disponible pour ces dates",
    limited: "Disponibilité limitée",
    unavailable: "Aucune chambre n’est actuellement indiquée comme disponible pour ces dates. Écrivez-nous pour vérifier les alternatives.",
    perNight: "par nuit",
    night: "nuit",
    nights: "nuits",
    total: "Total",
    usdGuide: "estimation en USD",
    ratePolicyTitle: "Tarif & paiement",
    ratePolicyCopy: "Le tarif s’applique par chambre et par nuit. Veuillez confirmer les modalités de paiement directement avec nous.",
    essentials: "Informations essentielles",
    essentialItems: [
      ["Arrivée et départ", "Veuillez organiser votre arrivée et votre départ selon les horaires standards ci-dessous."],
      ["Tarifs et paiement", "Le tarif actuel par nuit s’applique à toutes les chambres. Les modalités de paiement sont confirmées directement."],
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
    enquireRate: "Consultar disponibilidad",
    readMore: "Leer más",
    showLess: "Mostrar menos",
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
    bookingContact: "Solicitudes de reserva",
    generalContact: "Consultas generales",
    whatsappIntro: "Hola, me gustaría solicitar una estancia.",
    whatsappAvailabilityIntro: "Hola, quisiera consultar la disponibilidad de habitaciones.",
    notConfigured: "Envíanos tus fechas por WhatsApp y confirmaremos la disponibilidad.",
    availabilityPrompt: "Envíanos tus fechas por WhatsApp y confirmaremos la disponibilidad.",
    available: "Disponible para estas fechas",
    limited: "Disponibilidad limitada",
    unavailable: "Actualmente no aparecen habitaciones disponibles para estas fechas. Escríbenos para consultar alternativas.",
    perNight: "por noche",
    night: "noche",
    nights: "noches",
    total: "Total",
    usdGuide: "estimación aproximada en USD",
    ratePolicyTitle: "Tarifa y pago",
    ratePolicyCopy: "La tarifa es por habitación y por noche. Confirma los detalles del pago directamente con nosotros.",
    essentials: "Información esencial",
    essentialItems: [
      ["Llegada y salida", "Organiza tu llegada y salida según los horarios estándar indicados abajo."],
      ["Tarifas y pago", "La tarifa nocturna actual se aplica a todas las habitaciones. Los detalles del pago se confirman directamente."],
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

export const DEFAULT_SITE_CONTENT = {
  schemaVersion: 1,
  translations: content,
  gallery,
  roomGalleries,
  locationImage: {
    src: "/images/bhaktapur view.jpg",
    alt: "Bhaktapur city view",
  },
  settings: {
    bookingWhatsapp: BOOKING_WHATSAPP_NUMBER,
    generalWhatsapp: GENERAL_WHATSAPP_NUMBER,
    contactEmail: CONTACT_EMAIL,
    roomRatesUsd: { standard: 30, kitchen: 30, twinKitchen: 30 },
    checkInTime: "3:00 PM",
    checkOutTime: "12:00 PM",
    mapUrl: MAP_URL,
    bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "",
    airbnbUrl: process.env.NEXT_PUBLIC_AIRBNB_URL || "",
  },
  updatedAt: null,
  publishedAt: null,
};

function mergeContent(defaultValue, overrideValue) {
  if (overrideValue === undefined || overrideValue === null) return structuredClone(defaultValue);
  if (Array.isArray(defaultValue)) return Array.isArray(overrideValue) ? structuredClone(overrideValue) : structuredClone(defaultValue);
  if (defaultValue && typeof defaultValue === "object") {
    const output = {};
    for (const key of new Set([...Object.keys(defaultValue), ...Object.keys(overrideValue || {})])) {
      output[key] = key in (overrideValue || {})
        ? mergeContent(defaultValue[key], overrideValue[key])
        : structuredClone(defaultValue[key]);
    }
    return output;
  }
  return structuredClone(overrideValue);
}

export function resolveSiteContent(input) {
  return mergeContent(DEFAULT_SITE_CONTENT, input || {});
}

function useSwipeNavigation(onPrevious, onNext) {
  const startPoint = useRef(null);

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startPoint.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event) {
    if (!startPoint.current) return;
    const distanceX = event.clientX - startPoint.current.x;
    const distanceY = event.clientY - startPoint.current.y;
    startPoint.current = null;

    if (Math.abs(distanceX) < 44 || Math.abs(distanceX) <= Math.abs(distanceY) * 1.15) return;
    if (distanceX < 0) onNext();
    else onPrevious();
  }

  function cancelSwipe() {
    startPoint.current = null;
  }

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: cancelSwipe,
  };
}

function RoomSlideshow({ images, label, editorMode = false, onEdit = null, editDescriptor = null }) {
  const [index, setIndex] = useState(0);
  const showPrevious = () => setIndex((current) => (current - 1 + images.length) % images.length);
  const showNext = () => setIndex((current) => (current + 1) % images.length);
  const swipeHandlers = useSwipeNavigation(showPrevious, showNext);

  return (
    <div className={`room-media swipe-surface ${editorMode ? "cms-edit-host" : ""}`} role="region" aria-roledescription="carousel" aria-label={`${label} photos`} {...swipeHandlers}>
      <CmsEditButton enabled={editorMode} label={`Edit ${label} photos`} descriptor={editDescriptor} onEdit={onEdit} />
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

function RoomDescription({ children, readMore, showLess }) {
  const copyRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy || expanded) return undefined;
    const measure = () => setCanExpand(copy.scrollHeight > copy.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(copy);
    return () => observer.disconnect();
  }, [children, expanded]);

  return (
    <div className="room-description-wrap">
      <p ref={copyRef} className={`room-description ${expanded ? "" : "is-clamped"}`}>{children}</p>
      {canExpand && <button className="room-read-more" type="button" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>{expanded ? showLess : readMore}</button>}
    </div>
  );
}

function RoomRate({ amount, perNight }) {
  return <p className="room-rate"><strong>USD {amount}</strong><span>{perNight}</span></p>;
}

function roomTitleClass(title) {
  return title.length > 32 ? "room-title-long" : "";
}

function RoomFeatures({ features, icons }) {
  if (features.length === 0) return null;
  return <ul>{features.map((feature, index) => { const Icon = icons[index] || Check; return <li key={`${feature}-${index}`}><Icon /> {feature}</li>; })}</ul>;
}

function todayString(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function calculateStayNights(checkIn, checkOut) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return 0;
  const [startYear, startMonth, startDay] = checkIn.split("-").map(Number);
  const [endYear, endMonth, endDay] = checkOut.split("-").map(Number);
  const start = Date.UTC(startYear, startMonth - 1, startDay);
  const end = Date.UTC(endYear, endMonth - 1, endDay);
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

function displayWhatsappNumber(number) {
  const digits = String(number).replace(/\D/g, "");
  const match = digits.match(/^(977)(\d{3})(\d{7})$/);
  return match ? `+${match[1]} ${match[2]}-${match[3]}` : `+${digits}`;
}

export default function HolidayHomePage({ cmsContent = null, editorMode = false, onEdit = null }) {
  const siteContent = useMemo(() => resolveSiteContent(cmsContent), [cmsContent]);
  const siteGallery = siteContent.gallery;
  const siteRoomGalleries = siteContent.roomGalleries;
  const bookingWhatsappNumber = siteContent.settings.bookingWhatsapp;
  const generalWhatsappNumber = siteContent.settings.generalWhatsapp;
  const contactEmail = siteContent.settings.contactEmail;
  const roomRatesUsd = siteContent.settings.roomRatesUsd;
  const checkInTime = siteContent.settings.checkInTime;
  const checkOutTime = siteContent.settings.checkOutTime;
  const mapUrl = siteContent.settings.mapUrl;
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
  const t = siteContent.translations[language];
  const selectedRateKey = form.roomType === "twin-kitchen" ? "twinKitchen" : form.roomType;
  const selectedRoomRate = roomRatesUsd[selectedRateKey];
  const stayNights = calculateStayNights(form.checkIn, form.checkOut);
  const stayTotal = selectedRoomRate * stayNights;
  const stayNightLabel = stayNights === 1 ? t.night : t.nights;
  const safeHeroIndex = Math.min(heroIndex, siteGallery.length - 1);
  const safeGalleryIndex = Math.min(galleryIndex, siteGallery.length - 1);
  const heroSwipeHandlers = useSwipeNavigation(
    () => setHeroIndex((current) => (current - 1 + siteGallery.length) % siteGallery.length),
    () => setHeroIndex((current) => (current + 1) % siteGallery.length),
  );
  const gallerySwipeHandlers = useSwipeNavigation(
    () => setGalleryIndex((current) => (current - 1 + siteGallery.length) % siteGallery.length),
    () => setGalleryIndex((current) => (current + 1) % siteGallery.length),
  );

  const platformLinks = useMemo(
    () => [
      { label: t.bookingPlatform, href: siteContent.settings.bookingUrl },
      { label: t.airbnb, href: siteContent.settings.airbnbUrl },
    ].filter((item) => item.href),
    [siteContent.settings.airbnbUrl, siteContent.settings.bookingUrl, t],
  );
  const languageLabel = languages.find((item) => item.code === language)?.label || language.toUpperCase();

  function translationFields(id, title, fields) {
    return {
      id: `${id}-${language}`,
      type: "fields",
      title,
      language: languageLabel,
      fields: fields.map(([suffix, label, multiline = false, rows = 4]) => ({
        path: `translations.${language}.${suffix}`,
        label,
        multiline,
        rows,
      })),
    };
  }

  function imageEditor(id, title, path, single = false) {
    return { id, type: "images", title, path, single };
  }

  function withFields(descriptor, fields) {
    return { ...descriptor, fields: [...descriptor.fields, ...fields] };
  }

  function roomEditor(id, title, fields, amenitiesKey, rateKey) {
    return withFields(translationFields(id, title, fields), [
      { path: `translations.${language}.${amenitiesKey}`, label: "Features", list: true, itemLabel: "Feature" },
      { path: `settings.roomRatesUsd.${rateKey}`, label: "Nightly rate (USD)", inputType: "number" },
    ]);
  }

  function renderHeroTitle() {
    if (language !== "en") return t.heroTitle;
    const match = t.heroTitle.match(/Holiday Home Bhaktapur\.?/i);
    if (!match || match.index === undefined) return t.heroTitle;
    return (
      <>
        {t.heroTitle.slice(0, match.index)}
        <span className="hero-brand-name">{match[0]}</span>
        {t.heroTitle.slice(match.index + match[0].length)}
      </>
    );
  }

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
      setHeroIndex((current) => (current + 1) % siteGallery.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [siteGallery.length]);

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

  function whatsappUrl(number = bookingWhatsappNumber) {
    const roomName = form.roomType === "twin-kitchen"
      ? t.twinKitchen
      : form.roomType === "kitchen" ? t.kitchen : t.standard;
    const message = `${t.whatsappAvailabilityIntro}\n\n${t.checkIn}: ${form.checkIn} (${checkInTime})\n${t.checkOut}: ${form.checkOut} (${checkOutTime})\n${t.adults}: ${form.adults}\n${t.children}: ${form.children}\n${t.roomType}: ${roomName}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  return (
    <main>
      <header className={`site-header ${editorMode ? "cms-edit-host" : ""}`}>
        <CmsEditButton
          enabled={editorMode}
          label="Edit header labels"
          onEdit={onEdit}
          descriptor={translationFields("header", "Edit header labels", [
            ["nav.0", "Rooms navigation"], ["nav.1", "Stay navigation"], ["nav.2", "Location navigation"], ["nav.3", "Contact navigation"], ["book", "Booking button"],
          ])}
        />
        <a className="brand" href="#top" aria-label="Holiday Home Bhaktapur home">
          <Image src="/images/logo.png" alt="Holiday Home Bhaktapur" width={68} height={69} priority />
          <span><strong>Holiday Home</strong><small>Bhaktapur</small></span>
        </a>
        <nav id="main-navigation" className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
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
          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className={`hero-image swipe-surface ${editorMode ? "cms-edit-host" : ""}`} aria-hidden={!editorMode} {...heroSwipeHandlers}>
          <CmsEditButton enabled={editorMode} label="Edit hero photos" descriptor={imageEditor("hero-gallery", "Edit hero and property photos", "gallery")} onEdit={onEdit} />
          {siteGallery.map((image, index) => (
            <Image
              key={image.src}
              className={`hero-slide-image ${index === safeHeroIndex ? "active" : ""}`}
              src={image.src}
              alt=""
              fill
              priority={index === 0}
              loading="eager"
              quality={90}
              sizes="(max-width: 760px) 100vw, (max-width: 1050px) 54vw, 58vw"
              style={{ "--hero-position": image.heroPosition, "--hero-mobile-position": image.heroMobilePosition }}
            />
          ))}
          <div className="hero-slide-progress">
            {siteGallery.map((image, index) => <span key={image.src} className={index === safeHeroIndex ? "active" : ""} />)}
          </div>
          <div className="hero-location"><MapPin size={18} /> {t.hostNote}</div>
        </div>
        <div className={`hero-copy ${editorMode ? "cms-edit-host" : ""}`}>
          <CmsEditButton
            enabled={editorMode}
            label="Edit hero text"
            onEdit={onEdit}
            descriptor={translationFields("hero", "Edit hero section", [
              ["heroTitle", "Heading", true, 3], ["heroCopy", "Description", true, 5], ["hostNote", "Photo note", true, 2], ["explore", "Explore rooms link"], ["mapCta", "Directions link"], ["book", "Booking button"],
            ])}
          />
          <h1>
            {renderHeroTitle()}
          </h1>
          <p>{t.heroCopy}</p>
          <div className="hero-actions">
            <a className="button" href="#contact">{t.book}</a>
            <a className="text-link" href="#rooms">{t.explore} <ArrowDown size={18} /></a>
            <a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">{t.mapCta} <MapPin size={17} /></a>
          </div>
        </div>
        <div className="heritage-arch" aria-hidden="true" />
      </section>

      <section id="rooms" className="rooms-section">
        <div className="section-shell">
          <div className={`section-heading ${editorMode ? "cms-edit-host" : ""}`}>
            <CmsEditButton
              enabled={editorMode}
              label="Edit rooms introduction"
              onEdit={onEdit}
              descriptor={translationFields("rooms-heading", "Edit rooms introduction", [["roomsTitle", "Heading", true, 3], ["roomsCopy", "Description", true, 4], ["enquireRate", "Room enquiry link"], ["readMore", "Read more label"], ["showLess", "Show less label"]])}
            />
            <div><h2>{t.roomsTitle}</h2></div>
            <p>{t.roomsCopy}</p>
          </div>
          <div className="room-list">
            <article className="room-row">
              <RoomSlideshow images={siteRoomGalleries.standard} label={t.standard} editorMode={editorMode} onEdit={onEdit} editDescriptor={imageEditor("standard-gallery", "Edit private room photos", "roomGalleries.standard")} />
              <div className={`room-details ${editorMode ? "cms-edit-host" : ""}`}>
                <CmsEditButton enabled={editorMode} label="Edit private room details" onEdit={onEdit} descriptor={roomEditor("standard-room", "Edit private room", [["threeRooms", "Availability label"], ["standard", "Room name", true, 2], ["standardCopy", "Description", true, 5]], "standardAmenities", "standard")} />
                <span>{t.threeRooms}</span><h3 className={roomTitleClass(t.standard)}>{t.standard}</h3>
                <RoomRate amount={roomRatesUsd.standard} perNight={t.perNight} />
                <RoomDescription readMore={t.readMore} showLess={t.showLess}>{t.standardCopy}</RoomDescription>
                <RoomFeatures features={t.standardAmenities} icons={[BedDouble, Bath, Wifi]} />
                <a className="text-link" href="#contact" onClick={() => setForm((current) => ({ ...current, roomType: "standard" }))}>{t.enquireRate} <ChevronRight /></a>
              </div>
            </article>
            <article className="room-row room-row-reverse">
              <RoomSlideshow images={siteRoomGalleries.kitchen} label={t.kitchen} editorMode={editorMode} onEdit={onEdit} editDescriptor={imageEditor("kitchen-gallery", "Edit kitchen room photos", "roomGalleries.kitchen")} />
              <div className={`room-details ${editorMode ? "cms-edit-host" : ""}`}>
                <CmsEditButton enabled={editorMode} label="Edit kitchen room details" onEdit={onEdit} descriptor={roomEditor("kitchen-room", "Edit kitchen room", [["oneRoom", "Availability label"], ["kitchen", "Room name", true, 3], ["kitchenCopy", "Description", true, 5]], "kitchenAmenities", "kitchen")} />
                <span>{t.oneRoom}</span><h3 className={roomTitleClass(t.kitchen)}>{t.kitchen}</h3>
                <RoomRate amount={roomRatesUsd.kitchen} perNight={t.perNight} />
                <RoomDescription readMore={t.readMore} showLess={t.showLess}>{t.kitchenCopy}</RoomDescription>
                <RoomFeatures features={t.kitchenAmenities} icons={[CookingPot, Bath, AirVent, Wifi]} />
                <a className="text-link" href="#contact" onClick={() => setForm((current) => ({ ...current, roomType: "kitchen" }))}>{t.enquireRate} <ChevronRight /></a>
              </div>
            </article>
            <article className="room-row">
              <RoomSlideshow images={siteRoomGalleries.twinKitchen} label={t.twinKitchen} editorMode={editorMode} onEdit={onEdit} editDescriptor={imageEditor("twin-gallery", "Edit twin kitchen room photos", "roomGalleries.twinKitchen")} />
              <div className={`room-details ${editorMode ? "cms-edit-host" : ""}`}>
                <CmsEditButton enabled={editorMode} label="Edit twin kitchen room details" onEdit={onEdit} descriptor={roomEditor("twin-room", "Edit twin kitchen room", [["oneRoom", "Availability label"], ["twinKitchen", "Room name", true, 3], ["twinKitchenCopy", "Description", true, 5]], "twinKitchenAmenities", "twinKitchen")} />
                <span>{t.oneRoom}</span><h3 className={roomTitleClass(t.twinKitchen)}>{t.twinKitchen}</h3>
                <RoomRate amount={roomRatesUsd.twinKitchen} perNight={t.perNight} />
                <RoomDescription readMore={t.readMore} showLess={t.showLess}>{t.twinKitchenCopy}</RoomDescription>
                <RoomFeatures features={t.twinKitchenAmenities} icons={[BedDouble, CookingPot, Bath, Wifi]} />
                <a className="text-link" href="#contact" onClick={() => setForm((current) => ({ ...current, roomType: "twin-kitchen" }))}>{t.enquireRate} <ChevronRight /></a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="stay" className="intro section-shell">
        <div className={`intro-copy ${editorMode ? "cms-edit-host" : ""}`}>
          <CmsEditButton enabled={editorMode} label="Edit stay introduction" onEdit={onEdit} descriptor={translationFields("stay-copy", "Edit stay introduction", [["stayTitle", "Heading", true, 3], ["stayCopy", "Description", true, 6]])} />
          <h2>{t.stayTitle}</h2>
          <p>{t.stayCopy}</p>
        </div>
        <div className={`amenities ${editorMode ? "cms-edit-host" : ""}`}>
          <CmsEditButton enabled={editorMode} label="Edit property amenities" onEdit={onEdit} descriptor={translationFields("amenities", "Edit property amenities", [["amenityLabels.0", "First amenity"], ["amenityLabels.1", "Second amenity"], ["amenityLabels.2", "Third amenity"], ["amenityLabels.3", "Fourth amenity"]])} />
          {[AirVent, Bath, Wifi, ShowerHead].map((Icon, index) => (
            <div className="amenity" key={t.amenityLabels[index]}><Icon /><span>{t.amenityLabels[index]}</span></div>
          ))}
        </div>
      </section>

      <section className="gallery-section section-shell" aria-label="Property gallery">
        <div className={`gallery-main swipe-surface ${editorMode ? "cms-edit-host" : ""}`} {...gallerySwipeHandlers}>
          <CmsEditButton enabled={editorMode} label="Edit property gallery" descriptor={imageEditor("property-gallery", "Edit hero and property photos", "gallery")} onEdit={onEdit} />
          <Image src={siteGallery[safeGalleryIndex].src} alt={siteGallery[safeGalleryIndex].alt} fill quality={90} sizes="(max-width: 800px) 100vw, 70vw" />
          <div className="gallery-controls">
            <button onClick={() => setGalleryIndex((safeGalleryIndex - 1 + siteGallery.length) % siteGallery.length)} aria-label="Previous photo"><ChevronLeft /></button>
            <span>{String(safeGalleryIndex + 1).padStart(2, "0")} / {String(siteGallery.length).padStart(2, "0")}</span>
            <button onClick={() => setGalleryIndex((safeGalleryIndex + 1) % siteGallery.length)} aria-label="Next photo"><ChevronRight /></button>
          </div>
        </div>
        <div className="gallery-thumbs">
          {siteGallery.map((image, index) => (
            <button key={image.src} className={index === safeGalleryIndex ? "active" : ""} onClick={() => setGalleryIndex(index)} aria-label={`View photo ${index + 1}`}>
              <Image src={image.src} alt="" fill sizes="96px" />
            </button>
          ))}
        </div>
      </section>

      <section id="location" className="location-section">
        <div className={`location-panel ${editorMode ? "cms-edit-host" : ""}`}>
          <CmsEditButton enabled={editorMode} label="Edit location details" onEdit={onEdit} descriptor={translationFields("location", "Edit location section", [["locationTitle", "Heading", true, 3], ["locationCopy", "Description", true, 5], ["nearby.0", "First nearby place"], ["nearby.1", "Second nearby place"], ["nearby.2", "Third nearby place"], ["mapCta", "Directions link"]])} />
          <h2>{t.locationTitle}</h2><p>{t.locationCopy}</p>
          <ol>{t.nearby.map((place, index) => <li key={place}><span>0{index + 1}</span>{place}</li>)}</ol>
        </div>
        <div className={`location-visual ${editorMode ? "cms-edit-host" : ""}`} aria-hidden={!editorMode}>
          <CmsEditButton enabled={editorMode} label="Edit location photo" descriptor={imageEditor("location-image", "Edit location photo", "locationImage", true)} onEdit={onEdit} />
          <Image
            src={siteContent.locationImage.src}
            alt={siteContent.locationImage.alt}
            fill
            loading="eager"
            quality={90}
            sizes="(max-width: 960px) 100vw, 50vw"
          />
        </div>
      </section>

      <section id="contact" className="booking-section">
        <div className={`booking-copy ${editorMode ? "cms-edit-host" : ""}`}>
          <CmsEditButton enabled={editorMode} label="Edit booking introduction" onEdit={onEdit} descriptor={translationFields("booking-copy", "Edit booking introduction", [["formTitle", "Heading", true, 3], ["formCopy", "Description", true, 5]])} />
          <h2>{t.formTitle}</h2><p>{t.formCopy}</p>
        </div>
        <div className={`booking-form ${editorMode ? "cms-edit-host" : ""}`}>
          <CmsEditButton enabled={editorMode} label="Edit booking form labels" onEdit={onEdit} descriptor={withFields(translationFields("booking-form", "Edit booking form labels", [["checkIn", "Arrival label"], ["checkOut", "Departure label"], ["adults", "Adults label"], ["children", "Children label"], ["roomType", "Room type label"], ["night", "Single night label"], ["nights", "Multiple nights label"], ["total", "Total label"], ["checkRate", "Check availability button"], ["checking", "Checking message"], ["sendWhatsApp", "WhatsApp button"], ["whatsappAvailabilityIntro", "WhatsApp availability message", true, 3], ["available", "Available message"], ["limited", "Limited message"], ["unavailable", "Unavailable message", true, 3], ["availabilityPrompt", "Availability fallback message", true, 3]]), [{ path: "settings.checkInTime", label: "Check-in time" }, { path: "settings.checkOutTime", label: "Check-out time" }])} />
          <div className="field-grid">
            <label>{t.checkIn}<span><CalendarDays /><input name="checkIn" type="date" min={todayString()} value={form.checkIn} onChange={updateField} /></span></label>
            <label>{t.checkOut}<span><CalendarDays /><input name="checkOut" type="date" min={form.checkIn} value={form.checkOut} onChange={updateField} /></span></label>
            <label>{t.adults}<span><Users /><select name="adults" value={form.adults} onChange={updateField}>{[1,2,3,4,5,6].map((n) => <option key={n}>{n}</option>)}</select></span></label>
            <label>{t.children}<span><Users /><select name="children" value={form.children} onChange={updateField}>{[0,1,2,3,4].map((n) => <option key={n}>{n}</option>)}</select></span></label>
          </div>
          <fieldset><legend>{t.roomType}</legend><label className={form.roomType === "standard" ? "selected" : ""}><input type="radio" name="roomType" value="standard" checked={form.roomType === "standard"} onChange={updateField} /><BedDouble /><span>{t.standard}</span><Check /></label><label className={form.roomType === "kitchen" ? "selected" : ""}><input type="radio" name="roomType" value="kitchen" checked={form.roomType === "kitchen"} onChange={updateField} /><CookingPot /><span>{t.kitchen}</span><Check /></label><label className={form.roomType === "twin-kitchen" ? "selected" : ""}><input type="radio" name="roomType" value="twin-kitchen" checked={form.roomType === "twin-kitchen"} onChange={updateField} /><BedDouble /><span>{t.twinKitchen}</span><Check /></label></fieldset>
          <div className="booking-stay-summary"><strong><small>{t.total}</small> USD {stayTotal}</strong><span>{stayNights} {stayNightLabel} × USD {selectedRoomRate} {t.perNight}</span></div>
          <button className="button rate-button" type="button" disabled={!form.checkIn || !form.checkOut || form.checkOut <= form.checkIn || rateStatus === "loading"} onClick={checkRate}>{rateStatus === "loading" ? t.checking : t.checkRate}</button>
          {rateStatus === "done" && <div className={`rate-result ${rate?.available === false ? "rate-unavailable" : ""}`} aria-live="polite">
            <strong>USD {stayTotal} <small>{t.total}</small></strong><p>{stayNights} {stayNightLabel} × USD {selectedRoomRate} {t.perNight}</p><p>{rate?.available === false ? t.unavailable : rate?.available === true ? (rate.availableRooms <= 1 ? t.limited : t.available) : t.availabilityPrompt}</p>
          </div>}
          <a className="button whatsapp-button" href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle /> {t.sendWhatsApp}</a>
        </div>
      </section>

      <section className={`essentials section-shell ${editorMode ? "cms-edit-host" : ""}`}>
        <CmsEditButton enabled={editorMode} label="Edit stay essentials" onEdit={onEdit} descriptor={withFields(translationFields("essentials", "Edit stay essentials", [["essentials", "Section heading"], ["essentialItems.0.0", "First item title"], ["essentialItems.0.1", "First item description", true, 4], ["ratePolicyTitle", "Rate and payment title"], ["ratePolicyCopy", "Rate and payment description", true, 4], ["essentialItems.2.0", "Third item title"], ["essentialItems.2.1", "Third item description", true, 4]]), [{ path: "settings.checkInTime", label: "Check-in time" }, { path: "settings.checkOutTime", label: "Check-out time" }])} />
        <div><h2>{t.essentials}</h2></div>
        <div className="essential-list">{t.essentialItems.map(([title, copy], index) => <article key={title}><h3>{index === 1 ? t.ratePolicyTitle : title}</h3><p>{index === 1 ? t.ratePolicyCopy : copy}</p>{index === 0 && <strong className="essential-highlight">{t.checkIn}: {checkInTime}<br />{t.checkOut}: {checkOutTime}</strong>}</article>)}</div>
      </section>

      <footer className={editorMode ? "cms-edit-host" : ""}>
        <CmsEditButton
          enabled={editorMode}
          label="Edit footer and contact details"
          onEdit={onEdit}
          descriptor={{
            ...translationFields("footer", "Edit footer and contacts", [["footerCopy", "Footer description", true, 4], ["bookingContact", "Booking contact label"], ["generalContact", "General contact label"], ["platformTitle", "Booking platforms heading"]]),
            fields: [
              ...translationFields("footer", "Edit footer and contacts", [["footerCopy", "Footer description", true, 4], ["bookingContact", "Booking contact label"], ["generalContact", "General contact label"], ["platformTitle", "Booking platforms heading"]]).fields,
              { path: "settings.bookingWhatsapp", label: "Booking WhatsApp number" },
              { path: "settings.generalWhatsapp", label: "General WhatsApp number" },
              { path: "settings.contactEmail", label: "Contact email", inputType: "email" },
              { path: "settings.mapUrl", label: "Google Maps URL", inputType: "url" },
              { path: "settings.bookingUrl", label: "Booking.com URL", inputType: "url" },
              { path: "settings.airbnbUrl", label: "Airbnb URL", inputType: "url" },
            ],
          }}
        />
        <div className="footer-brand"><Image src="/images/logo.png" alt="" width={92} height={94} /><div><h2>Holiday Home Bhaktapur</h2><p>{t.footerCopy}</p></div></div>
        <div className="footer-contact"><a href={`https://wa.me/${bookingWhatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle /> {t.bookingContact}: {displayWhatsappNumber(bookingWhatsappNumber)}</a><a href={`https://wa.me/${generalWhatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle /> {t.generalContact}: {displayWhatsappNumber(generalWhatsappNumber)}</a><a href={`mailto:${contactEmail}`}><Mail /> {contactEmail}</a><a href={mapUrl} target="_blank" rel="noreferrer"><MapPin /> {t.mapCta}</a>{platformLinks.length > 0 && <><span>{t.platformTitle}</span>{platformLinks.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label} <ExternalLink /></a>)}</>}</div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {t.rights}</span><label className="language-select"><Languages aria-hidden="true" /><select value={language} onChange={(event) => changeLanguage(event.target.value)} aria-label="Footer language">{languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select><ChevronDown className="language-chevron" aria-hidden="true" /></label></div>
      </footer>

      <a className="floating-whatsapp" href={whatsappUrl(generalWhatsappNumber)} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle /></a>
    </main>
  );
}
