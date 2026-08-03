const LANGUAGES = ["en", "de", "fr", "es"];
const STRING_ARRAY_FIELDS = new Set([
  "nav",
  "amenityLabels",
  "standardAmenities",
  "kitchenAmenities",
  "twinKitchenAmenities",
  "nearby",
]);
const PAIR_ARRAY_FIELDS = new Set(["essentialItems"]);
const TRANSLATION_FIELDS = new Set([
  "nav", "book", "heroTitle", "heroCopy", "explore", "hostNote", "stayTitle", "stayCopy", "amenityLabels",
  "roomsTitle", "roomsCopy", "standard", "standardCopy", "standardAmenities", "kitchen", "kitchenCopy",
  "kitchenAmenities", "twinKitchen", "twinKitchenCopy", "twinKitchenAmenities", "threeRooms", "oneRoom",
  "fromSheet", "enquireRate", "readMore", "showLess", "locationTitle", "locationCopy", "mapCta", "nearby", "formTitle", "formCopy",
  "checkIn", "checkOut", "adults", "children", "roomType", "checkRate", "checking", "sendWhatsApp",
  "bookingContact", "generalContact", "whatsappIntro", "whatsappAvailabilityIntro", "notConfigured", "availabilityPrompt", "available", "limited", "unavailable",
  "perNight", "night", "nights", "total", "usdGuide", "ratePolicyTitle", "ratePolicyCopy", "essentials", "essentialItems", "platformTitle", "footerCopy", "bookingPlatform",
  "airbnb", "rights",
]);
const SETTINGS_FIELDS = new Set([
  "bookingWhatsapp",
  "generalWhatsapp",
  "contactEmail",
  "roomRatesUsd",
  "checkInTime",
  "checkOutTime",
  "mapUrl",
  "bookingUrl",
  "airbnbUrl",
]);
const IMAGE_FIELDS = new Set(["src", "alt", "heroPosition", "heroMobilePosition"]);
const ALLOWED_IMAGE_PREFIXES = ["/images/", "/uploads/"];

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function text(value, label, maxLength = 3000) {
  if (typeof value !== "string") throw new Error(`${label} must be text.`);
  const normalized = value.replace(/\r\n/g, "\n").trim();
  if (normalized.length > maxLength) throw new Error(`${label} is too long.`);
  return normalized;
}

function url(value, label, allowEmpty = true) {
  const normalized = text(value, label, 2048);
  if (!normalized && allowEmpty) return "";
  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(`${label} must be a valid web address.`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(`${label} must use http or https.`);
  return parsed.toString();
}

function imageSource(value, label) {
  const normalized = text(value, label, 2048);
  if (ALLOWED_IMAGE_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return normalized;
  const parsed = url(normalized, label, false);
  const hostname = new URL(parsed).hostname;
  if (!hostname.endsWith(".public.blob.vercel-storage.com")) {
    throw new Error(`${label} must be a website image or an uploaded Vercel Blob image.`);
  }
  return parsed;
}

function imagePosition(value, label) {
  const normalized = text(value ?? "center center", label, 80);
  if (!/^[a-zA-Z0-9%().+\-\s]+$/.test(normalized)) throw new Error(`${label} has an invalid image position.`);
  return normalized;
}

function validateImage(value, label, hero = false) {
  if (!plainObject(value)) throw new Error(`${label} must be an image.`);
  for (const key of Object.keys(value)) {
    if (!IMAGE_FIELDS.has(key)) throw new Error(`${label} contains an unsupported field.`);
  }
  const image = {
    src: imageSource(value.src, `${label} source`),
    alt: text(value.alt ?? "", `${label} alternative text`, 240),
  };
  if (hero) {
    image.heroPosition = imagePosition(value.heroPosition, `${label} desktop position`);
    image.heroMobilePosition = imagePosition(value.heroMobilePosition, `${label} mobile position`);
  }
  return image;
}

function validateImages(value, label, hero = false) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 12) {
    throw new Error(`${label} must contain between 1 and 12 images.`);
  }
  return value.map((item, index) => validateImage(item, `${label} image ${index + 1}`, hero));
}

function validateTranslations(value) {
  if (!plainObject(value)) throw new Error("Translations are missing.");
  const translations = {};
  for (const language of LANGUAGES) {
    const source = value[language];
    if (!plainObject(source)) throw new Error(`${language.toUpperCase()} translation is missing.`);
    const output = {};
    for (const key of Object.keys(source)) {
      if (!TRANSLATION_FIELDS.has(key)) throw new Error(`${language.toUpperCase()} contains an unsupported content field.`);
    }
    for (const key of TRANSLATION_FIELDS) {
      if (!(key in source)) throw new Error(`${language.toUpperCase()} is missing ${key}.`);
    }
    for (const [key, fieldValue] of Object.entries(source)) {
      if (STRING_ARRAY_FIELDS.has(key)) {
        if (!Array.isArray(fieldValue) || fieldValue.length > 12) throw new Error(`${language}.${key} must be a short list.`);
        output[key] = fieldValue.map((item, index) => text(item, `${language}.${key}.${index}`, 500));
      } else if (PAIR_ARRAY_FIELDS.has(key)) {
        if (!Array.isArray(fieldValue) || fieldValue.length > 8) throw new Error(`${language}.${key} must be a short list.`);
        output[key] = fieldValue.map((pair, index) => {
          if (!Array.isArray(pair) || pair.length !== 2) throw new Error(`${language}.${key}.${index} must contain a title and description.`);
          return [text(pair[0], `${language}.${key}.${index}.title`, 300), text(pair[1], `${language}.${key}.${index}.copy`, 1200)];
        });
      } else {
        output[key] = text(fieldValue, `${language}.${key}`);
      }
    }
    translations[language] = output;
  }
  return translations;
}

function validateSettings(value) {
  if (!plainObject(value)) throw new Error("Contact settings are missing.");
  for (const key of Object.keys(value)) {
    if (!SETTINGS_FIELDS.has(key)) throw new Error("Contact settings contain an unsupported field.");
  }
  const bookingWhatsapp = text(value.bookingWhatsapp, "Booking WhatsApp", 18).replace(/[^0-9]/g, "");
  const generalWhatsapp = text(value.generalWhatsapp, "General WhatsApp", 18).replace(/[^0-9]/g, "");
  const contactEmail = text(value.contactEmail, "Contact email", 254).toLowerCase();
  if (bookingWhatsapp.length < 10 || generalWhatsapp.length < 10) throw new Error("WhatsApp numbers must include the country code.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) throw new Error("Contact email must be a valid email address.");
  if (!plainObject(value.roomRatesUsd)) throw new Error("Room rates are missing.");
  const roomRatesUsd = {};
  for (const room of ["standard", "kitchen", "twinKitchen"]) {
    const rate = Number(value.roomRatesUsd[room]);
    if (!Number.isFinite(rate) || rate <= 0 || rate > 10_000) throw new Error(`${room} nightly rate must be a positive USD amount.`);
    roomRatesUsd[room] = rate;
  }
  return {
    bookingWhatsapp,
    generalWhatsapp,
    contactEmail,
    roomRatesUsd,
    checkInTime: text(value.checkInTime, "Check-in time", 30),
    checkOutTime: text(value.checkOutTime, "Check-out time", 30),
    mapUrl: url(value.mapUrl, "Map URL", false),
    bookingUrl: url(value.bookingUrl ?? "", "Booking.com URL"),
    airbnbUrl: url(value.airbnbUrl ?? "", "Airbnb URL"),
  };
}

export function validateCmsDocument(input) {
  if (!plainObject(input)) throw new Error("The CMS content document is invalid.");
  if (JSON.stringify(input).length > 350_000) throw new Error("The CMS content document is too large.");

  const roomGalleries = input.roomGalleries;
  if (!plainObject(roomGalleries)) throw new Error("Room galleries are missing.");
  const allowedRoomKeys = ["standard", "kitchen", "twinKitchen"];
  for (const key of Object.keys(roomGalleries)) {
    if (!allowedRoomKeys.includes(key)) throw new Error("Room galleries contain an unsupported room.");
  }

  return {
    schemaVersion: 1,
    translations: validateTranslations(input.translations),
    gallery: validateImages(input.gallery, "Hero gallery", true),
    roomGalleries: {
      standard: validateImages(roomGalleries.standard, "Private room gallery"),
      kitchen: validateImages(roomGalleries.kitchen, "Kitchen room gallery"),
      twinKitchen: validateImages(roomGalleries.twinKitchen, "Twin kitchen room gallery"),
    },
    locationImage: validateImage(input.locationImage, "Location image"),
    settings: validateSettings(input.settings),
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : null,
    publishedAt: typeof input.publishedAt === "string" ? input.publishedAt : null,
  };
}
