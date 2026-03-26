import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Star, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { SampleGame } from "../data/sampleGames";

interface GameCardProps {
  game: SampleGame;
  isAdmin?: boolean;
  index?: number;
  onEdit?: (game: SampleGame) => void;
  onDelete?: (id: string) => void;
}

export default function GameCard({
  game,
  isAdmin,
  index = 0,
  onEdit,
  onDelete,
}: GameCardProps) {
  const homeWon = game.homeScore > game.awayScore;
  const awayWon = game.awayScore > game.homeScore;
  const tied = game.homeScore === game.awayScore;

  const formattedDate = new Date(`${game.date}T00:00:00`).toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric" },
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      data-ocid={`game.item.${index + 1}`}
    >
      <Card className="bg-card border border-border shadow-card overflow-hidden">
        {/* Date bar */}
        <div className="bg-navy px-4 py-2 flex items-center justify-between">
          <span className="text-white/80 text-xs font-medium">
            {formattedDate}
          </span>
          {tied && (
            <Badge className="bg-orange/20 text-orange text-xs border-0">
              TIE
            </Badge>
          )}
          {isAdmin && (
            <div className="flex items-center gap-1 ml-auto">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => onEdit?.(game)}
                data-ocid={`game.edit_button.${index + 1}`}
              >
                <Pencil className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white/60 hover:text-red-400 hover:bg-white/10"
                onClick={() => onDelete?.(game.id)}
                data-ocid={`game.delete_button.${index + 1}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Scoreboard */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Home team */}
            <div className="flex-1">
              <div
                className={`text-sm font-semibold ${
                  homeWon ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {game.homeTeam}
              </div>
              <div className="text-xs text-muted-foreground">HOME</div>
            </div>

            {/* Scores */}
            <div className="flex items-center gap-3">
              <span
                className={`text-3xl font-display font-bold ${
                  homeWon ? "text-navy" : "text-muted-foreground"
                }`}
              >
                {game.homeScore}
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                &ndash;
              </span>
              <span
                className={`text-3xl font-display font-bold ${
                  awayWon ? "text-navy" : "text-muted-foreground"
                }`}
              >
                {game.awayScore}
              </span>
            </div>

            {/* Away team */}
            <div className="flex-1 text-right">
              <div
                className={`text-sm font-semibold ${
                  awayWon ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {game.awayTeam}
              </div>
              <div className="text-xs text-muted-foreground">AWAY</div>
            </div>
          </div>

          {/* Winner badge */}
          {!tied && (
            <div className="mt-2 text-center">
              <span className="text-xs text-muted-foreground">
                {homeWon ? `${game.homeTeam} wins` : `${game.awayTeam} wins`}
              </span>
            </div>
          )}
        </div>

        {/* MVP section */}
        {game.mvp && (
          <div className="border-t-2 border-orange mx-4 mb-4 pt-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-orange">
                <AvatarImage src={game.mvp.photo} alt={game.mvp.name} />
                <AvatarFallback className="bg-navy text-white font-bold text-sm">
                  {game.mvp.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-orange fill-orange" />
                  <span className="text-xs font-bold text-orange uppercase tracking-wider">
                    Game MVP
                  </span>
                </div>
                <div className="font-semibold text-foreground text-sm">
                  {game.mvp.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {game.mvp.team}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
