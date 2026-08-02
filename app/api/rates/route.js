import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300;

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function findRate(rows, roomType, checkIn, checkOut) {
  const arrival = new Date(`${checkIn}T00:00:00Z`);
  const departure = new Date(`${checkOut}T00:00:00Z`);
  const nights = Math.round((departure - arrival) / 86400000);
  if (!Number.isFinite(nights) || nights < 1) return null;

  const matched = rows.filter((row) => {
    if (row.room_type?.toLowerCase() !== roomType.toLowerCase()) return false;
    const start = new Date(`${row.start_date}T00:00:00Z`);
    const end = new Date(`${row.end_date}T23:59:59Z`);
    return arrival >= start && departure <= end;
  });

  if (!matched.length) return null;
  const rate = Number(matched[0].rate_npr);
  const availableRooms = Number(matched[0].available_rooms);
  if (!Number.isFinite(rate) || !Number.isFinite(availableRooms)) return null;
  return { rateNpr: rate, availableRooms, nights };
}

export async function GET(request) {
  const url = new URL(request.url);
  const checkIn = url.searchParams.get("checkIn");
  const checkOut = url.searchParams.get("checkOut");
  const roomType = url.searchParams.get("roomType");
  const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;

  if (!sheetUrl) {
    return NextResponse.json({ configured: false, available: null });
  }
  if (!checkIn || !checkOut || !roomType) {
    return NextResponse.json({ configured: true, error: "Missing booking details." }, { status: 400 });
  }

  try {
    const response = await fetch(sheetUrl, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error("Sheet request failed");
    const match = findRate(parseCsv(await response.text()), roomType, checkIn, checkOut);
    return NextResponse.json({
      configured: true,
      available: match ? match.availableRooms > 0 : null,
      ...match,
    });
  } catch {
    return NextResponse.json(
      { configured: true, available: null, error: "Rates are temporarily unavailable." },
      { status: 502 },
    );
  }
}
