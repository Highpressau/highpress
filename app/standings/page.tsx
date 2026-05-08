"use client";

import { useEffect, useState } from "react";

const DRIBL_BASE = "https://mc-api.dribl.com/api";

const LEAGUES = {
  vic: {
    label: "NPL VIC Men",
    source: "dribl",
    params:
      "date_range=default&season=nPmrj2rmow&competition=1pN6pRypd0&league=OEN2MExEmq&ladder_type=regular&tenant=w8zdBWPmBX&require_pools=true",
  },

  nsw: {
    label: "NPL NSW Men",
    source: "dribl",
    params:
      "date_range=default&season=wOmelzGd02&competition=A4KLxx87Kq&league=bgdMjoBxmE&ladder_type=regular&tenant=1RwNlWemjr&require_pools=true",
  },

  sa: {
    label: "NPL SA Men",
    source: "dribl",
    params:
      "date_range=default&season=7MNGzMbmAz&competition=08NOppXWKZ&league=LBdDV3bxNb&ladder_type=regular&tenant=3pmvvjLmvJ&require_pools=true",
  },

  tas: {
    label: "NPL TAS Men",
    source: "dribl",
    params:
      "date_range=default&season=RwNlRvMdjr&competition=R3NPox2jmr&league=8RmwOaxJmE&ladder_type=regular&tenant=7MNGJ1QmAz&require_pools=true",
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
      "https://capital.dribl.com/ladders?season=8zdBOokmBX&date_range=default&ladder_type=regular&competition=7ZKR51arNk&league=AZNQj7XgKx&timezone=Australia%2FSydney",
  },
} as const;

type LeagueKey = keyof typeof LEAGUES;

type TableTeam = {
  id: string;
  position: string;
  name: string;
  played: string;
  wins: string;
  draws: string;
  losses: string;
  goalsFor: string;
  goalsAgainst: string;
  goalDifference: string;
  points: string;
};

function mapSquadiTeam(team: any): TableTeam {
  return {
    id: team.teamUniqueKey || String(team.id),
    position: team.rk || "",
    name: team.name || "",
    played: team.P || "0",
    wins: team.W || "0",
    draws: team.D || "0",
    losses: team.L || "0",
    goalsFor: team.F || "0",
    goalsAgainst: team.A || "0",
    goalDifference: team.goalDifference || "0",
    points: team.PTS || "0",
  };
}

function mapDriblTeam(team: any, index: number): TableTeam {
  const a = team.attributes || team;

  return {
    id: team.hash_id || a.hash_id || String(index),
    position: String(a.position || a.rank || a.ranking || index + 1),
    name:
      a.team_name ||
      a.name ||
      a.club_name ||
      a.team?.name ||
      a.teamName ||
      "Team",
    played: String(a.played || a.P || a.matches_played || a.games || "0"),
    wins: String(a.wins || a.W || a.won || "0"),
    draws: String(a.draws || a.D || a.drawn || "0"),
    losses: String(a.losses || a.L || a.lost || "0"),
    goalsFor: String(a.goals_for || a.F || a.gf || a.goalsFor || "0"),
    goalsAgainst: String(
      a.goals_against || a.A || a.ga || a.goalsAgainst || "0"
    ),
    goalDifference: String(
      a.goal_difference || a.GD || a.gd || a.goalDifference || "0"
    ),
    points: String(a.points || a.PTS || a.pts || "0"),
  };
}

function findDriblLadderArray(json: any): any[] {
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.[0]?.standings)) return json.data[0].standings;
  if (Array.isArray(json?.data?.[0]?.ladder)) return json.data[0].ladder;
  if (Array.isArray(json?.standings)) return json.standings;
  if (Array.isArray(json?.ladder)) return json.ladder;
  if (Array.isArray(json?.ladders)) return json.ladders;

  return [];
}

export default function StandingsPage() {
  const [leagueKey, setLeagueKey] = useState<LeagueKey>("vic");
  const [teams, setTeams] = useState<TableTeam[]>([]);
  const [loading, setLoading] = useState(true);

  const league = LEAGUES[leagueKey];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setTeams([]);

      if (league.source === "external") {
        setLoading(false);
        return;
      }

      if (league.source === "squadi") {
        const res = await fetch(`/api/squadi-standings?league=${leagueKey}`, {
          cache: "no-store",
        });

        const json = await res.json();
        const ladder = json?.ladders || [];

        setTeams(ladder.map(mapSquadiTeam));
        setLoading(false);
        return;
      }

      if (league.source === "dribl") {
        const res = await fetch(`${DRIBL_BASE}/ladders?${league.params}`, {
          headers: {
            "x-requested-with": "XMLHttpRequest",
            accept: "application/json",
          },
        });

        const json = await res.json();
        const ladder = findDriblLadderArray(json);

        setTeams(ladder.map(mapDriblTeam));
        setLoading(false);
      }
    }

    fetchData();
  }, [leagueKey, league]);

  return (
    <main className="min-h-screen bg-[#f2f2ee] text-black">
      <section className="px-8 md:px-16 py-10 border-b border-black/10">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
          Match Centre
        </p>

        <h1 className="text-4xl md:text-5xl font-black uppercase leading-[0.95] tracking-[-0.05em]">
          Standings
        </h1>

        <div className="mt-8 flex flex-wrap gap-3">
          {Object.entries(LEAGUES).map(([key, l]) => {
            const active = leagueKey === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setLeagueKey(key as LeagueKey)}
                className={`border border-black px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
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
      </section>

      <section className="px-8 md:px-16 py-14">
        {league.source === "external" ? (
          <div className="border border-black p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{league.label}</h2>

            <p className="text-gray-600 mb-6">
              Standings are available via Dribl.
            </p>

            <a
              href={league.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-black px-6 py-3 font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-black hover:text-white"
            >
              View Standings →
            </a>
          </div>
        ) : loading ? (
          <p>Loading {league.label} standings...</p>
        ) : teams.length === 0 ? (
          <p>No standings found.</p>
        ) : (
          <div className="overflow-x-auto border border-black/10">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-black bg-white text-left text-xs uppercase tracking-[0.2em] text-gray-500">
                  <th className="p-4">#</th>
                  <th className="p-4">Team</th>
                  <th className="p-4 text-center">P</th>
                  <th className="p-4 text-center">W</th>
                  <th className="p-4 text-center">D</th>
                  <th className="p-4 text-center">L</th>
                  <th className="p-4 text-center">GF</th>
                  <th className="p-4 text-center">GA</th>
                  <th className="p-4 text-center">GD</th>
                  <th className="p-4 text-center">PTS</th>
                </tr>
              </thead>

              <tbody>
                {teams.map((team) => (
                  <tr
                    key={team.id}
                    className="group border-t border-black/10 transition-all duration-300 hover:bg-black hover:text-white"
                  >
                    <td className="p-4 font-bold">{team.position}</td>
                    <td className="p-4 font-bold">{team.name}</td>
                    <td className="p-4 text-center">{team.played}</td>
                    <td className="p-4 text-center">{team.wins}</td>
                    <td className="p-4 text-center">{team.draws}</td>
                    <td className="p-4 text-center">{team.losses}</td>
                    <td className="p-4 text-center">{team.goalsFor}</td>
                    <td className="p-4 text-center">{team.goalsAgainst}</td>
                    <td className="p-4 text-center">{team.goalDifference}</td>
                    <td className="p-4 text-center font-bold">
                      {team.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}