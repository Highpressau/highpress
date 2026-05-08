import { NextResponse } from "next/server";

const SQUADI_LEAGUES = {
  qld: { competitionId: "1232", divisionId: "8908" },
  wa: { competitionId: "1342", divisionId: "9511" },
  nnsw: { competitionId: "1295", divisionId: "9313" },
};

type SquadiLeagueKey = keyof typeof SQUADI_LEAGUES;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league") as SquadiLeagueKey | null;

    if (!league || !(league in SQUADI_LEAGUES)) {
      return NextResponse.json(
        { error: "Invalid or missing league" },
        { status: 400 }
      );
    }

    const token = process.env.SQUADI_AUTH_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Missing SQUADI_AUTH_TOKEN" },
        { status: 500 }
      );
    }

    const { competitionId, divisionId } = SQUADI_LEAGUES[league];

    const url = `https://api.squadi.com/livescores/round/matches?competitionId=${competitionId}&divisionId=${divisionId}&teamIds=&ignoreStatuses=%5B1%5D`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: token,
        referer: "https://registration.squadi.com/",
      },
      cache: "no-store",
    });

    const text = await res.text();

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        rawResponse: text,
      };
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch Squadi data",
          status: res.status,
          details: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Squadi route crashed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}