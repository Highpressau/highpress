"use client";

import { useEffect, useState } from "react";

const BASE = "https://mc-api.dribl.com/api";
const DRIBL_BATCH_SIZE = 4;

type LeagueSource = "dribl" | "squadi" | "external";

type League = {
  label: string;
  source: LeagueSource;
  leagueName?: string;
  params?: string;
  rounds?: number;
  externalUrl?: string;
};

const LEAGUES = {
  vic: {
    label: "NPL VIC Men",
    source: "dribl",
    leagueName: "NPL VIC Men",
    params:
      "date_range=default&season=nPmrj2rmow&competition=1pN6pRypd0&tenant=w8zdBWPmBX&timezone=Australia%2FSydney",
    rounds: 26,
  },
  nsw: {
    label: "NPL NSW Men",
    source: "dribl",
    leagueName: "",
    params:
      "date_range=default&season=wOmelzGd02&competition=A4KLxx87Kq&league=bgdMjoBxmE&timezone=Australia%2FSydney",
    rounds: 30,
  },
  sa: {
    label: "NPL SA Men",
    source: "dribl",
    leagueName: "",
    params:
      "date_range=default&season=7MNGzMbmAz&competition=08NOppXWKZ&league=LBdDV3bxNb&timezone=Australia%2FSydney",
    rounds: 22,
  },
  tas: {
    label: "NPL TAS Men",
    source: "dribl",
    leagueName: "",
    params:
      "date_range=default&season=RwNlRvMdjr&competition=R3NPox2jmr&timezone=Australia%2FSydney",
    rounds: 21,
  },
  qld: {
    label: "NPL QLD Men",
    source: "squadi",
  },
  wa: {
    label: "NPL WA Men",
    source: "squadi",
  },
  nnsw: {
    label: "NPL NNSW Men",
    source: "squadi",
  },
  capital: {
    label: "NPL Capital Football Men",
    source: "external",
    externalUrl:
      "https://capital.dribl.com/fixtures?date_range=default&season=8zdBOokmBX&competition=7ZKR51arNk&league=AZNQj7XgKx&timezone=Australia%2FSydney",
  },
} satisfies Record<string, League>;

type LeagueKey = keyof typeof LEAGUES;

type Match = {
  hash_id: string;
  attributes: {
    date: string;
    full_round: string;
    ground_name: string;
    field_name: string;
    home_team_name: string;
    away_team_name: string;
    home_score: number | null;
    away_score: number | null;
    league_name: string;
    status: string;
  };
};

type SquadiMatch = {
  id: number;
  team1Score: number | null;
  team2Score: number | null;
  startTime: string;
  matchStatus: string | null;
  resultStatus: string | null;
  matchEnded: boolean;
  isResultsLocked: boolean;
  endTime: string | null;
  team1ResultId: number | null;
  team2ResultId: number | null;
  team1?: { name?: string };
  team2?: { name?: string };
  venueCourt?: {
    name?: string;
    venue?: {
      name?: string;
    };
  };
  round?: {
    name?: string;
  };
};

type SquadiRound = {
  name: string;
  matches: SquadiMatch[];
};

function cleanTeamName(name: string) {
  return name
    .replace(" Seniors", "")
    .replace(" - NPL", "")
    .replace(" - NPL Men", "")
    .replace(" NPLM", "");
}

function isTasFirstGrade(match: Match) {
  const a = match.attributes;

  const text = [
    a.league_name,
    a.home_team_name,
    a.away_team_name,
    a.full_round,
  ]
    .join(" ")
    .toLowerCase();

  return (
    !text.includes("u21") &&
    !text.includes("under 21") &&
    !text.includes("under-21") &&
    !text.includes("21s")
  );
}

function isSquadiResult(match: SquadiMatch) {
  return (
    match.matchEnded === true ||
    match.isResultsLocked === true ||
    match.matchStatus === "ENDED" ||
    match.endTime !== null ||
    match.team1ResultId !== null ||
    match.team2ResultId !== null
  );
}

function mapSquadiMatch(match: SquadiMatch, roundName: string): Match {
  return {
    hash_id: `squadi-${match.id}`,
    attributes: {
      date: match.startTime,
      full_round: match.round?.name || roundName || "Round",
      ground_name: match.venueCourt?.venue?.name || "",
      field_name: match.venueCourt?.name || "",
      home_team_name: match.team1?.name || "TBC",
      away_team_name: match.team2?.name || "TBC",
      home_score: match.team1Score,
      away_score: match.team2Score,
      league_name: "",
      status: match.matchStatus || "",
    },
  };
}

function getLatestRoundResults(results: Match[]) {
  if (results.length === 0) {
    return {
      latestRound: "",
      latestResults: [],
      olderResults: [],
    };
  }

  const latestRound = results[0].attributes.full_round;

  return {
    latestRound,
    latestResults: results.filter(
      (match) => match.attributes.full_round === latestRound
    ),
    olderResults: results.filter(
      (match) => match.attributes.full_round !== latestRound
    ),
  };
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

export default function FixturesPage() {
  const [selectedLeague, setSelectedLeague] = useState<LeagueKey>("vic");
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [results, setResults] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadError, setLoadError] = useState("");

  const league = LEAGUES[selectedLeague];

  useEffect(() => {
    let cancelled = false;

    async function loadDribl() {
      if (
        league.source !== "dribl" ||
        !("params" in league) ||
        !("rounds" in league) ||
        !league.params ||
        !league.rounds
      ) {
        return { fixtures: [], results: [] };
      }

      async function fetchRound(
        roundNumber: number,
        resultsMode: 0 | 1
      ): Promise<Match[]> {
        const res = await fetch(
          `${BASE}/results?${league.params}&type_round=roundrobin_${roundNumber}&results=${resultsMode}`,
          {
            headers: {
              "x-requested-with": "XMLHttpRequest",
            },
          }
        );

        if (!res.ok) {
          return [];
        }

        const json = await res.json();
        return json.data || [];
      }

      const roundNumbers = Array.from(
        { length: league.rounds },
        (_, i) => i + 1
      );

      const fixtureData: Match[] = [];
      const resultData: Match[] = [];

      for (const batch of chunkArray(roundNumbers, DRIBL_BATCH_SIZE)) {
        if (cancelled) {
          return { fixtures: [], results: [] };
        }

        const batchFixtures = await Promise.all(
          batch.map((roundNumber) => fetchRound(roundNumber, 0))
        );

        const batchResults = await Promise.all(
          batch.map((roundNumber) => fetchRound(roundNumber, 1))
        );

        fixtureData.push(...batchFixtures.flat());
        resultData.push(...batchResults.flat());
      }

      const leagueFilter = (match: Match) => {
        if (selectedLeague === "tas") {
          return isTasFirstGrade(match);
        }

        if (!league.leagueName) return true;

        return match.attributes.league_name === league.leagueName;
      };

      const allFixtures = fixtureData
        .filter(leagueFilter)
        .sort(
          (a, b) =>
            new Date(a.attributes.date).getTime() -
            new Date(b.attributes.date).getTime()
        );

      const allResults = resultData
        .filter(leagueFilter)
        .sort(
          (a, b) =>
            new Date(b.attributes.date).getTime() -
            new Date(a.attributes.date).getTime()
        );

      return { fixtures: allFixtures, results: allResults };
    }

    async function loadSquadi() {
      const res = await fetch(`/api/squadi?league=${selectedLeague}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        return { fixtures: [], results: [] };
      }

      const json = await res.json();
      const rounds: SquadiRound[] = json.rounds || [];

      const fixtureMatches: Match[] = [];
      const resultMatches: Match[] = [];

      rounds.forEach((round) => {
        (round.matches || []).forEach((match) => {
          const mapped = mapSquadiMatch(match, round.name);

          if (isSquadiResult(match)) {
            resultMatches.push(mapped);
          } else {
            fixtureMatches.push(mapped);
          }
        });
      });

      const allFixtures = fixtureMatches.sort(
        (a, b) =>
          new Date(a.attributes.date).getTime() -
          new Date(b.attributes.date).getTime()
      );

      const allResults = resultMatches.sort(
        (a, b) =>
          new Date(b.attributes.date).getTime() -
          new Date(a.attributes.date).getTime()
      );

      return { fixtures: allFixtures, results: allResults };
    }

    async function loadSeason() {
      setLoading(true);
      setLoadError("");
      setFixtures([]);
      setResults([]);

      try {
        if (league.source === "external") {
          setLoading(false);
          return;
        }

        const data =
          league.source === "dribl" ? await loadDribl() : await loadSquadi();

        if (cancelled) return;

        setFixtures(data.fixtures);
        setResults(data.results);
      } catch (error) {
        if (cancelled) return;

        console.error(error);
        setLoadError(`Unable to load ${league.label}. Please try again.`);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSeason();

    return () => {
      cancelled = true;
    };
  }, [selectedLeague, league]);

  function MatchCard({
    match,
    type,
  }: {
    match: Match;
    type: "fixture" | "result";
  }) {
    const a = match.attributes;
    const isResult = type === "result";

    return (
      <div className="group grid items-center gap-4 border border-black/10 p-5 transition-all duration-300 hover:border-black hover:bg-black hover:text-white hover:shadow-[6px_6px_0px_#000] md:grid-cols-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 transition-colors duration-300 group-hover:text-white/70">
            {a.full_round}
          </p>

          <p className="mt-1 text-xs text-gray-500 transition-colors duration-300 group-hover:text-white/70">
            {new Date(a.date).toLocaleDateString("en-AU", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-xl font-bold">
            {cleanTeamName(a.home_team_name)} {isResult ? a.home_score : ""}{" "}
            {isResult ? "–" : "v"} {isResult ? a.away_score : ""}{" "}
            {cleanTeamName(a.away_team_name)}
          </p>

          <p className="mt-1 text-sm text-gray-500 transition-colors duration-300 group-hover:text-white/70">
            {a.ground_name}
            {a.field_name ? ` — ${a.field_name}` : ""}
          </p>
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 transition-colors duration-300 group-hover:text-white/70">
          {isResult ? "Full Time" : "Upcoming"}
        </p>
      </div>
    );
  }

  const { latestRound, latestResults, olderResults } =
    getLatestRoundResults(results);

  return (
    <main className="min-h-screen bg-[#f2f2ee] text-black">
      <section className="border-b border-black/10 px-8 py-10 md:px-16">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500">
          Match Centre
        </p>

        <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] md:text-5xl">
          Fixtures / Results
        </h1>

        <div className="relative mt-8 inline-block">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="group flex items-center gap-3 border border-black px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-black hover:text-white"
          >
            <span>{league.label}</span>
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">
              {menuOpen ? "▴" : "▾"}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute left-0 z-20 mt-3 w-72 overflow-hidden border border-black bg-white shadow-[8px_8px_0px_#000]">
              {Object.entries(LEAGUES).map(([key, l]) => {
                const active = selectedLeague === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedLeague(key as LeagueKey);
                      setMenuOpen(false);
                    }}
                    className={`block w-full px-5 py-4 text-left text-sm uppercase tracking-[0.15em] transition-all duration-300 ${
                      active
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {league.source === "external" ? (
        <section className="px-8 py-14 md:px-16">
          <div className="border border-black p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">{league.label}</h2>

            <p className="mb-6 text-gray-600">
              Fixtures and results are available via Dribl.
            </p>

            <a
              href={league.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-black px-6 py-3 font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-black hover:text-white"
            >
              View Match Centre →
            </a>
          </div>
        </section>
      ) : loading ? (
        <section className="px-8 py-14 md:px-16">
          <p>Loading {league.label} season...</p>
        </section>
      ) : loadError ? (
        <section className="px-8 py-14 md:px-16">
          <p>{loadError}</p>
        </section>
      ) : (
        <>
          <section className="border-b border-black/10 px-8 py-14 md:px-16">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between border border-black/10 p-5 transition-all duration-300 hover:border-black hover:bg-black hover:text-white">
                <h2 className="text-3xl font-bold">{league.label} Fixtures</h2>

                <span className="text-sm uppercase tracking-[0.25em] text-gray-500 transition-colors duration-300 group-open:hidden group-hover:text-white/70">
                  Show all
                </span>

                <span className="hidden text-sm uppercase tracking-[0.25em] text-gray-500 transition-colors duration-300 group-open:inline group-hover:text-white/70">
                  Hide
                </span>
              </summary>

              <div className="mt-6 space-y-4">
                {fixtures.length === 0 ? (
                  <p>No fixtures found.</p>
                ) : (
                  fixtures.map((match) => (
                    <MatchCard
                      key={match.hash_id}
                      match={match}
                      type="fixture"
                    />
                  ))
                )}
              </div>
            </details>
          </section>

          <section className="px-8 py-14 md:px-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">
                  {league.label} Latest Results
                </h2>

                {latestRound && (
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-500">
                    {latestRound}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {latestResults.length === 0 ? (
                <p>No results found.</p>
              ) : (
                latestResults.map((match) => (
                  <MatchCard key={match.hash_id} match={match} type="result" />
                ))
              )}
            </div>

            {olderResults.length > 0 && (
              <details className="group mt-8">
                <summary className="flex cursor-pointer items-center justify-between border border-black/10 p-5 transition-all duration-300 hover:border-black hover:bg-black hover:text-white">
                  <h3 className="text-2xl font-bold">All Previous Results</h3>

                  <span className="text-sm uppercase tracking-[0.25em] text-gray-500 transition-colors duration-300 group-open:hidden group-hover:text-white/70">
                    Show all
                  </span>

                  <span className="hidden text-sm uppercase tracking-[0.25em] text-gray-500 transition-colors duration-300 group-open:inline group-hover:text-white/70">
                    Hide
                  </span>
                </summary>

                <div className="mt-6 space-y-4">
                  {olderResults.map((match) => (
                    <MatchCard
                      key={match.hash_id}
                      match={match}
                      type="result"
                    />
                  ))}
                </div>
              </details>
            )}
          </section>
        </>
      )}
    </main>
  );
}