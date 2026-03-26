import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Division } from "../backend";
import { DIVISIONS_ORDERED, DIVISION_LABELS } from "../data/sampleGames";
import {
  useAddScheduledGame,
  useUpdateScheduledGame,
} from "../hooks/useQueries";

interface ScheduledGameLocal {
  id?: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  division: Division;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editGame?: ScheduledGameLocal | null;
  defaultDivision?: Division;
}

export default function ScheduleFormDialog({
  open,
  onOpenChange,
  editGame,
  defaultDivision,
}: Props) {
  const [division, setDivision] = useState<Division>(
    defaultDivision ?? Division.coEdTeeBall,
  );
  const [date, setDate] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");

  const addGame = useAddScheduledGame();
  const updateGame = useUpdateScheduledGame();

  const isPending = addGame.isPending || updateGame.isPending;

  useEffect(() => {
    if (editGame) {
      setDivision(editGame.division);
      setDate(editGame.date);
      setHomeTeam(editGame.homeTeam);
      setAwayTeam(editGame.awayTeam);
    } else {
      setDivision(defaultDivision ?? Division.coEdTeeBall);
      setDate("");
      setHomeTeam("");
      setAwayTeam("");
    }
  }, [editGame, defaultDivision]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !homeTeam || !awayTeam) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      if (editGame?.id?.startsWith("b_")) {
        const id = BigInt(editGame.id.slice(2));
        await updateGame.mutateAsync({
          id,
          game: { division, date, homeTeam, awayTeam },
        });
        toast.success("Game updated.");
      } else {
        await addGame.mutateAsync({ division, date, homeTeam, awayTeam });
        toast.success("Game scheduled.");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="schedule.dialog">
        <DialogHeader>
          <DialogTitle>
            {editGame ? "Edit Scheduled Game" : "Add Scheduled Game"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="div-select">Division</Label>
            <Select
              value={division}
              onValueChange={(v) => setDivision(v as Division)}
            >
              <SelectTrigger id="div-select" data-ocid="schedule.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIVISIONS_ORDERED.map((d) => (
                  <SelectItem key={d} value={d}>
                    {DIVISION_LABELS[d]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="game-date">Date</Label>
            <Input
              id="game-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-ocid="schedule.input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="home-team">Home Team</Label>
              <Input
                id="home-team"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="Home team"
                data-ocid="schedule.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="away-team">Away Team</Label>
              <Input
                id="away-team"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Away team"
                data-ocid="schedule.input"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="schedule.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-orange hover:bg-orange/90 text-white"
              data-ocid="schedule.submit_button"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editGame ? "Update" : "Add Game"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
