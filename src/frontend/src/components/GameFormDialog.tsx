import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Division, ExternalBlob } from "../backend";
import {
  DIVISIONS_ORDERED,
  DIVISION_LABELS,
  type SampleGame,
} from "../data/sampleGames";
import {
  useAddGame,
  useCreateMvpPhoto,
  useUpdateGame,
} from "../hooks/useQueries";

interface GameFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editGame?: SampleGame | null;
  defaultDivision?: Division;
}

const emptyForm = (div: Division) => ({
  division: div,
  homeTeam: "",
  awayTeam: "",
  homeScore: "",
  awayScore: "",
  date: new Date().toISOString().slice(0, 10),
  mvpName: "",
  mvpTeam: "",
  mvpPhotoUrl: "",
  mvpPhotoFile: null as File | null,
});

export default function GameFormDialog({
  open,
  onOpenChange,
  editGame,
  defaultDivision = Division.coEdTeeBall,
}: GameFormDialogProps) {
  const [form, setForm] = useState(() => emptyForm(defaultDivision));
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addGame = useAddGame();
  const updateGame = useUpdateGame();
  const createPhoto = useCreateMvpPhoto();

  useEffect(() => {
    if (open) {
      if (editGame) {
        setForm({
          division: editGame.division,
          homeTeam: editGame.homeTeam,
          awayTeam: editGame.awayTeam,
          homeScore: String(editGame.homeScore),
          awayScore: String(editGame.awayScore),
          date: editGame.date,
          mvpName: editGame.mvp?.name ?? "",
          mvpTeam: editGame.mvp?.team ?? "",
          mvpPhotoUrl: editGame.mvp?.photo ?? "",
          mvpPhotoFile: null,
        });
      } else {
        setForm(emptyForm(defaultDivision));
      }
    }
  }, [open, editGame, defaultDivision]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, mvpPhotoFile: file, mvpPhotoUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.homeTeam || !form.awayTeam || !form.date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      let mvpPhoto: ExternalBlob | undefined;

      if (form.mvpPhotoFile) {
        setUploading(true);
        const bytes = new Uint8Array(await form.mvpPhotoFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        mvpPhoto = await createPhoto.mutateAsync(blob);
        setUploading(false);
      }

      const mvpInfo =
        form.mvpName && mvpPhoto
          ? { name: form.mvpName, team: form.mvpTeam, photo: mvpPhoto }
          : undefined;

      const gameRecord = {
        division: form.division,
        homeTeam: form.homeTeam,
        awayTeam: form.awayTeam,
        homeScore: BigInt(Number.parseInt(form.homeScore || "0")),
        awayScore: BigInt(Number.parseInt(form.awayScore || "0")),
        date: form.date,
        mvpInfo,
      };

      if (editGame?.id.startsWith("b_")) {
        const gameId = BigInt(editGame.id.slice(2));
        await updateGame.mutateAsync({ id: gameId, game: gameRecord });
        toast.success("Game updated!");
      } else {
        await addGame.mutateAsync(gameRecord);
        toast.success("Game added!");
      }

      onOpenChange(false);
    } catch (err: any) {
      setUploading(false);
      toast.error(err?.message ?? "Something went wrong.");
    }
  };

  const isPending = addGame.isPending || updateGame.isPending || uploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-ocid="game.dialog">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-navy">
            {editGame ? "Edit Game" : "Add New Game"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Division */}
          <div className="space-y-1">
            <Label htmlFor="division">Division</Label>
            <Select
              value={form.division}
              onValueChange={(v) => set("division", v)}
            >
              <SelectTrigger id="division" data-ocid="game.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIVISIONS_ORDERED.map((div) => (
                  <SelectItem key={div} value={div}>
                    {DIVISION_LABELS[div]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              required
              data-ocid="game.input"
            />
          </div>

          {/* Teams + Scores */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="homeTeam">Home Team</Label>
              <Input
                id="homeTeam"
                placeholder="Team name"
                value={form.homeTeam}
                onChange={(e) => set("homeTeam", e.target.value)}
                required
                data-ocid="game.home_team.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="awayTeam">Away Team</Label>
              <Input
                id="awayTeam"
                placeholder="Team name"
                value={form.awayTeam}
                onChange={(e) => set("awayTeam", e.target.value)}
                required
                data-ocid="game.away_team.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="homeScore">Home Score</Label>
              <Input
                id="homeScore"
                type="number"
                min="0"
                placeholder="0"
                value={form.homeScore}
                onChange={(e) => set("homeScore", e.target.value)}
                data-ocid="game.home_score.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="awayScore">Away Score</Label>
              <Input
                id="awayScore"
                type="number"
                min="0"
                placeholder="0"
                value={form.awayScore}
                onChange={(e) => set("awayScore", e.target.value)}
                data-ocid="game.away_score.input"
              />
            </div>
          </div>

          {/* MVP */}
          <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
            <div className="text-sm font-semibold text-foreground">
              Game MVP (optional)
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="w-14 h-14 border-2 border-orange">
                <AvatarImage src={form.mvpPhotoUrl} />
                <AvatarFallback className="bg-navy text-white text-xs">
                  {form.mvpName
                    ? form.mvpName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "MVP"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="MVP Name"
                  value={form.mvpName}
                  onChange={(e) => set("mvpName", e.target.value)}
                  data-ocid="game.mvp_name.input"
                />
                <Input
                  placeholder="MVP Team"
                  value={form.mvpTeam}
                  onChange={(e) => set("mvpTeam", e.target.value)}
                  data-ocid="game.mvp_team.input"
                />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-dashed"
              data-ocid="game.upload_button"
            >
              <Upload className="w-4 h-4 mr-2" />
              {form.mvpPhotoFile ? "Change Photo" : "Upload MVP Photo"}
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="game.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-navy hover:bg-navy/90 text-white"
              data-ocid="game.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : editGame ? (
                "Update Game"
              ) : (
                "Add Game"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
