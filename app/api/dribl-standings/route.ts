import { NextResponse } from "next/server";

const DRIBL = {
  vic: {
    params:
      "date_range=default&season=nPmrj2rmow&competition=1pN6pRypd0&league=OEN2MExEmq&ladder_type=regular&tenant=w8zdBWPmBX&require_pools=true",
    origin: "https://fv.dribl.com",
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league") as keyof typeof DRIBL;

    if (!league || !DRIBL[league]) {
      return NextResponse.json(
        { error: "Missing or invalid league" },
        { status: 400 }
      );
    }

    const { params, origin } = DRIBL[league];

    const url = `https://mc-api.dribl.com/api/ladders?${params}`;

    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        origin,
        referer: `${origin}/`,
        "x-requested-with": "XMLHttpRequest",
      },
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Dribl request failed",
          status: res.status,
          body: text,
        },
        { status: res.status }
      );
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        {
          error: "Dribl did not return JSON",
          body: text,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal route error",
        details: String(error),
      },
      { status: 500 }
    );
  }
}