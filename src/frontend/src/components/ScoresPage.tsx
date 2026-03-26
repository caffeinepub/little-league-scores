import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Division } from "../backend";
import {
  DIVISIONS_ORDERED,
  DIVISION_LABELS,
  SAMPLE_GAMES,
  type SampleGame,
} from "../data/sampleGames";
import {
  useDeleteGame,
  useGetAllGames,
  useGetAllScheduledGames,
  useIsAdmin,
} from "../hooks/useQueries";
import GameCard from "./GameCard";
import GameFormDialog from "./GameFormDialog";

const SAMPLE_UPCOMING = [
  {
    date: "2026-03-28",
    homeTeam: "Royals",
    awayTeam: "Cubs",
    division: "Baseball Coach Pitch",
  },
  {
    date: "2026-03-29",
    homeTeam: "Eagles",
    awayTeam: "Falcons",
    division: "Softball Minors",
  },
  {
    date: "2026-03-29",
    homeTeam: "Rangers",
    awayTeam: "Giants",
    division: "Baseball Majors",
  },
  {
    date: "2026-03-30",
    homeTeam: "Sparks",
    awayTeam: "Rockets",
    division: "Softball Coach Pitch",
  },
  {
    date: "2026-04-05",
    homeTeam: "Blue Jays",
    awayTeam: "Tigers",
    division: "Co-Ed TeeBall",
  },
];

const NOTICES = [
  {
    title: "Opening Day Ceremony",
    body: "Join us March 28 at 9am for the Spring 2026 Opening Day ceremony at Field 1.",
  },
  {
    title: "Picture Day",
    body: "Team photos will be taken April 12 from 8am\u201312pm. Wear your full uniform.",
  },
  {
    title: "Volunteer Sign-ups",
    body: "We need concession stand helpers for April games. Contact the board to sign up.",
  },
];

function formatDateShort(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ScoresPage() {
  const [activeDiv, setActiveDiv] = useState<Division>(Division.coEdTeeBall);
  const [formOpen, setFormOpen] = useState(false);
  const [editGame, setEditGame] = useState<SampleGame | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: backendGames, isLoading } = useGetAllGames();
  const { data: isAdmin } = useIsAdmin();
  const { data: scheduledGames } = useGetAllScheduledGames();
  const deleteGame = useDeleteGame();

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
        mvp: g.mvpInfo
          ? {
              name: g.mvpInfo.name,
              team: g.mvpInfo.team,
              photo: g.mvpInfo.photo.getDirectURL(),
            }
          : undefined,
      })) ?? [];

    return fromBackend.length > 0 ? fromBackend : SAMPLE_GAMES;
  }, [backendGames]);

  const divisionGames = useMemo(
    () => allGames.filter((g) => g.division === activeDiv),
    [allGames, activeDiv],
  );

  const upcomingGames = useMemo(() => {
    if (scheduledGames && scheduledGames.length > 0) {
      return [...scheduledGames]
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5)
        .map((g) => ({
          date: formatDateShort(g.date),
          homeTeam: g.homeTeam,
          awayTeam: g.awayTeam,
          division: DIVISION_LABELS[g.division],
        }));
    }
    return SAMPLE_UPCOMING.map((g) => ({
      ...g,
      date: formatDateShort(g.date),
    }));
  }, [scheduledGames]);

  const handleDelete = async () => {
    if (!deleteId) return;
    if (deleteId.startsWith("b_")) {
      const gameId = BigInt(deleteId.slice(2));
      try {
        await deleteGame.mutateAsync(gameId);
        toast.success("Game deleted.");
      } catch (err: any) {
        toast.error(err?.message ?? "Failed to delete.");
      }
    } else {
      toast.info("Sample games cannot be deleted.");
    }
    setDeleteId(null);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero banner */}
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
              Game Scores
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Spring Season 2026 &middot;{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {isAdmin && (
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => {
                    setEditGame(null);
                    setFormOpen(true);
                  }}
                  className="bg-orange hover:bg-orange/90 text-white font-semibold"
                  data-ocid="game.primary_button"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Game
                </Button>
              </div>
            )}

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
                      data-ocid="division.tab"
                    >
                      {DIVISION_LABELS[div]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {DIVISIONS_ORDERED.map((div) => (
                <TabsContent key={div} value={div} className="mt-6">
                  <div className="bg-navy rounded-t-lg px-4 py-2.5 flex items-center justify-between">
                    <span className="text-white font-display font-bold uppercase tracking-widest text-sm">
                      {DIVISION_LABELS[div]}
                    </span>
                    <span className="text-white/50 text-xs">
                      {divisionGames.length} game
                      {divisionGames.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {isLoading ? (
                    <div
                      className="space-y-4 mt-4"
                      data-ocid="game.loading_state"
                    >
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : divisionGames.length === 0 ? (
                    <div
                      className="bg-card border border-t-0 border-border rounded-b-lg px-6 py-12 text-center"
                      data-ocid="game.empty_state"
                    >
                      <div className="text-4xl mb-3">⚾</div>
                      <p className="text-muted-foreground font-medium">
                        No games recorded yet for this division.
                      </p>
                      {isAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => {
                            setEditGame(null);
                            setFormOpen(true);
                          }}
                          data-ocid="game.secondary_button"
                        >
                          Add First Game
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-card border border-t-0 border-border rounded-b-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {divisionGames.map((game, idx) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          isAdmin={!!isAdmin}
                          index={idx}
                          onEdit={(g) => {
                            setEditGame(g);
                            setFormOpen(true);
                          }}
                          onDelete={(id) => setDeleteId(id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
              <div className="bg-navy px-4 py-2.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange" />
                <span className="text-white font-display font-bold uppercase tracking-widest text-xs">
                  Upcoming Games
                </span>
              </div>
              <div className="divide-y divide-border">
                {upcomingGames.map((ug, i) => (
                  <div
                    key={`${ug.date}-${ug.homeTeam}`}
                    className="px-4 py-3"
                    data-ocid={`upcoming.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-orange">
                        {ug.date}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {ug.division}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {ug.homeTeam}{" "}
                      <span className="text-muted-foreground font-normal">
                        vs
                      </span>{" "}
                      {ug.awayTeam}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
              <div className="bg-navy px-4 py-2.5 flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange" />
                <span className="text-white font-display font-bold uppercase tracking-widest text-xs">
                  League Notices
                </span>
              </div>
              <div className="divide-y divide-border">
                {NOTICES.map((n) => (
                  <div key={n.title} className="px-4 py-3">
                    <div className="text-sm font-semibold text-foreground mb-0.5">
                      {n.title}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <GameFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editGame={editGame}
        defaultDivision={activeDiv}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="game.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this game?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the game record. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="game.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="game.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
