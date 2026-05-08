import { NextResponse } from "next/server";

const SQUADI = {
  qld: {
    competitionKey: "96ffe6ee-0ed4-40b8-a2af-a192740a830e",
    divisionId: "8908",
  },
  wa: {
    competitionKey: "41d0e2de-c7db-4839-a9a3-6a00c61352d6",
    divisionId: "9511",
  },
  nnsw: {
    competitionKey: "72f93fa2-ff07-46d8-a550-1b505e1c1df6",
    divisionId: "9313",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league") as keyof typeof SQUADI;

  if (!league || !SQUADI[league]) {
    return NextResponse.json({ error: "Missing or invalid league" }, { status: 400 });
  }

  const token = process.env.SQUADI_AUTH_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Missing SQUADI_AUTH_TOKEN" }, { status: 500 });
  }

  const { competitionKey, divisionId } = SQUADI[league];

  const url = `https://api.squadi.com/livescores/teams/ladder/v2?divisionIds=${divisionId}&competitionKey=${competitionKey}&filteredOutCompStatuses=1&showForm=1&sportRefId=3`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      authorization: token,
      origin: "https://registration.squadi.com",
      referer: "https://registration.squadi.com/",
    },
    cache: "no-store",
  });

  const data = await res.json();

  return NextResponse.json(data);
}