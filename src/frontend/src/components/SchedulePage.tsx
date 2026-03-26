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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Edit2, PlusCircle, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Division } from "../backend";
import { DIVISION_LABELS } from "../data/sampleGames";
import {
  useDeleteScheduledGame,
  useGetAllScheduledGames,
  useIsAdmin,
} from "../hooks/useQueries";
import ScheduleFormDialog from "./ScheduleFormDialog";

interface ScheduledGameLocal {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  division: Division;
}

const SAMPLE_UPCOMING: ScheduledGameLocal[] = [
  {
    id: "u1",
    date: "2026-03-28",
    homeTeam: "Royals",
    awayTeam: "Cubs",
    division: Division.baseballCoachPitch,
  },
  {
    id: "u2",
    date: "2026-03-29",
    homeTeam: "Eagles",
    awayTeam: "Falcons",
    division: Division.softballMinors,
  },
  {
    id: "u3",
    date: "2026-03-29",
    homeTeam: "Rangers",
    awayTeam: "Giants",
    division: Division.baseballMajors,
  },
  {
    id: "u4",
    date: "2026-03-30",
    homeTeam: "Sparks",
    awayTeam: "Rockets",
    division: Division.softballCoachPitch,
  },
  {
    id: "u5",
    date: "2026-04-05",
    homeTeam: "Blue Jays",
    awayTeam: "Tigers",
    division: Division.coEdTeeBall,
  },
  {
    id: "u6",
    date: "2026-04-06",
    homeTeam: "Red Sox",
    awayTeam: "Yankees",
    division: Division.baseballMinors,
  },
  {
    id: "u7",
    date: "2026-04-07",
    homeTeam: "Vipers",
    awayTeam: "Panthers",
    division: Division.softballMajors,
  },
];

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function groupByDate(
  games: ScheduledGameLocal[],
): Map<string, ScheduledGameLocal[]> {
  const map = new Map<string, ScheduledGameLocal[]>();
  for (const g of games) {
    if (!map.has(g.date)) map.set(g.date, []);
    map.get(g.date)!.push(g);
  }
  return map;
}

export default function SchedulePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editGame, setEditGame] = useState<ScheduledGameLocal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: backendGames } = useGetAllScheduledGames();
  const { data: isAdmin } = useIsAdmin();
  const deleteGame = useDeleteScheduledGame();

  const allGames = useMemo<ScheduledGameLocal[]>(() => {
    const fromBackend: ScheduledGameLocal[] =
      backendGames?.map((g, i) => ({
        id: `b_${i}`,
        division: g.division,
        homeTeam: g.homeTeam,
        awayTeam: g.awayTeam,
        date: g.date,
      })) ?? [];
    const games = fromBackend.length > 0 ? fromBackend : SAMPLE_UPCOMING;
    return [...games].sort((a, b) => a.date.localeCompare(b.date));
  }, [backendGames]);

  const grouped = useMemo(() => groupByDate(allGames), [allGames]);
  const sortedDates = Array.from(grouped.keys()).sort();

  const handleDelete = async () => {
    if (!deleteId) return;
    if (deleteId.startsWith("b_")) {
      const id = BigInt(deleteId.slice(2));
      try {
        await deleteGame.mutateAsync(id);
        toast.success("Game removed from schedule.");
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
              Schedule
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Upcoming Games &middot; Spring Season 2026
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-orange w-5 h-5" />
            <h2 className="font-display font-bold uppercase tracking-widest text-sm text-foreground">
              Upcoming Games
            </h2>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                setEditGame(null);
                setFormOpen(true);
              }}
              className="bg-orange hover:bg-orange/90 text-white font-semibold"
              data-ocid="schedule.primary_button"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Game
            </Button>
          )}
        </div>

        {allGames.length === 0 ? (
          <div
            className="bg-card border border-border rounded-lg px-6 py-16 text-center"
            data-ocid="schedule.empty_state"
          >
            <div className="text-4xl mb-3">📅</div>
            <p className="text-muted-foreground font-medium">
              No upcoming games scheduled.
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
                data-ocid="schedule.secondary_button"
              >
                Add First Game
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => {
              const dayGames = grouped.get(date)!;
              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-navy rounded-md px-3 py-1.5 text-white text-xs font-bold uppercase tracking-widest">
                      {formatDate(date)}
                    </div>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Games for this date */}
                  <div className="space-y-2">
                    {dayGames.map((game, idx) => (
                      <div
                        key={game.id}
                        className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3"
                        data-ocid={`schedule.item.${idx + 1}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="text-xs uppercase tracking-wide font-semibold"
                            >
                              {DIVISION_LABELS[game.division]}
                            </Badge>
                          </div>
                          <div className="mt-1.5 text-sm font-semibold text-foreground">
                            {game.homeTeam}
                            <span className="mx-2 text-muted-foreground font-normal text-xs">
                              vs
                            </span>
                            {game.awayTeam}
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setEditGame(game);
                                setFormOpen(true);
                              }}
                              data-ocid={`schedule.edit_button.${idx + 1}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 rounded hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500"
                              onClick={() => setDeleteId(game.id)}
                              data-ocid={`schedule.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <ScheduleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editGame={editGame}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="schedule.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this game?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the scheduled game. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="schedule.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="schedule.confirm_button"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
