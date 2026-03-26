import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Division } from "../backend";
import {
  DIVISIONS_ORDERED,
  DIVISION_LABELS,
  SAMPLE_GAMES,
  type SampleGame,
} from "../data/sampleGames";
import { useGetAllGames } from "../hooks/useQueries";

interface TeamRecord {
  team: string;
  w: number;
  l: number;
  t: number;
  rs: number;
  ra: number;
}

function computeStandings(games: SampleGame[]): Map<Division, TeamRecord[]> {
  const map = new Map<Division, Map<string, TeamRecord>>();

  for (const div of DIVISIONS_ORDERED) {
    map.set(div, new Map());
  }

  const getOrCreate = (div: Division, team: string): TeamRecord => {
    const divMap = map.get(div)!;
    if (!divMap.has(team)) {
      divMap.set(team, { team, w: 0, l: 0, t: 0, rs: 0, ra: 0 });
    }
    return divMap.get(team)!;
  };

  for (const g of games) {
    const home = getOrCreate(g.division, g.homeTeam);
    const away = getOrCreate(g.division, g.awayTeam);

    home.rs += g.homeScore;
    home.ra += g.awayScore;
    away.rs += g.awayScore;
    away.ra += g.homeScore;

    if (g.homeScore > g.awayScore) {
      home.w++;
      away.l++;
    } else if (g.awayScore > g.homeScore) {
      away.w++;
      home.l++;
    } else {
      home.t++;
      away.t++;
    }
  }

  const result = new Map<Division, TeamRecord[]>();
  for (const [div, divMap] of map.entries()) {
    const sorted = Array.from(divMap.values()).sort((a, b) => {
      if (b.w !== a.w) return b.w - a.w;
      return b.rs - a.rs;
    });
    result.set(div, sorted);
  }
  return result;
}

export default function StandingsPage() {
  const [activeDiv, setActiveDiv] = useState<Division>(Division.coEdTeeBall);
  const { data: backendGames } = useGetAllGames();

  const allGames = useMemo<SampleGame[]>(() => {
    const fromBackend: SampleGame[] =
      backendGames?.map((g, i) => ({
        id: `b_${i}`,
        division: g.division,
        homeTeam: g.homeTeam,
        awayTeam: g.awayTeam,
        homeScore: Number(g.homeScore),
        awayScore: Number(g.awayScore),
        date: g.date,
      })) ?? [];
    return fromBackend.length > 0 ? fromBackend : SAMPLE_GAMES;
  }, [backendGames]);

  const standings = useMemo(() => computeStandings(allGames), [allGames]);

  const divRecords = standings.get(activeDiv) ?? [];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-36 overflow-hidden">
        <img
          src="/assets/generated/league-hero.dim_1200x300.jpg"
          alt="Little League"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display font-bold text-white text-3xl md:text-4xl uppercase tracking-wider">
              Standings
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Spring Season 2026 Win/Loss Records
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-orange w-5 h-5" />
          <h2 className="font-display font-bold uppercase tracking-widest text-sm text-foreground">
            Division Standings
          </h2>
        </div>

        <Tabs
          value={activeDiv}
          onValueChange={(v) => setActiveDiv(v as Division)}
        >
          <div className="overflow-x-auto pb-1">
            <TabsList className="bg-transparent h-auto p-0 gap-0 flex w-max min-w-full">
              {DIVISIONS_ORDERED.map((div) => (
                <TabsTrigger
                  key={div}
                  value={div}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground px-4 py-2.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-all"
                  data-ocid="standings.tab"
                >
                  {DIVISION_LABELS[div]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {DIVISIONS_ORDERED.map((div) => (
            <TabsContent key={div} value={div} className="mt-0">
              <div className="bg-navy rounded-t-lg px-4 py-2.5 flex items-center justify-between">
                <span className="text-white font-display font-bold uppercase tracking-widest text-sm">
                  {DIVISION_LABELS[div]}
                </span>
                <span className="text-white/50 text-xs">
                  {(standings.get(div) ?? []).length} teams
                </span>
              </div>

              {divRecords.length === 0 ? (
                <div
                  className="bg-card border border-t-0 border-border rounded-b-lg px-6 py-12 text-center"
                  data-ocid="standings.empty_state"
                >
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-muted-foreground font-medium">
                    No games recorded yet for this division.
                  </p>
                </div>
              ) : (
                <div className="bg-card border border-t-0 border-border rounded-b-lg overflow-hidden">
                  <Table data-ocid="standings.table">
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-bold text-foreground w-8 text-center">
                          #
                        </TableHead>
                        <TableHead className="font-bold text-foreground">
                          Team
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-center">
                          W
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-center">
                          L
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-center">
                          T
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-center">
                          RS
                        </TableHead>
                        <TableHead className="font-bold text-foreground text-center">
                          RA
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {divRecords.map((rec, idx) => (
                        <TableRow
                          key={rec.team}
                          className="hover:bg-muted/30"
                          data-ocid={`standings.row.${idx + 1}`}
                        >
                          <TableCell className="text-center text-muted-foreground text-xs font-medium">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">
                            {idx === 0 && (
                              <span className="inline-block mr-1.5 text-yellow-500">
                                🏆
                              </span>
                            )}
                            {rec.team}
                          </TableCell>
                          <TableCell className="text-center font-bold text-green-600">
                            {rec.w}
                          </TableCell>
                          <TableCell className="text-center font-medium text-red-500">
                            {rec.l}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {rec.t}
                          </TableCell>
                          <TableCell className="text-center text-foreground">
                            {rec.rs}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {rec.ra}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
