import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SchedulePage from "./components/SchedulePage";
import ScoresPage from "./components/ScoresPage";
import StandingsPage from "./components/StandingsPage";

export type Page = "scores" | "standings" | "schedule";

export default function App() {
  const [page, setPage] = useState<Page>("scores");

  return (
    <div className="min-h-screen flex flex-col">
      <Header page={page} setPage={setPage} />
      <div className="flex-1">
        {page === "scores" && <ScoresPage />}
        {page === "standings" && <StandingsPage />}
        {page === "schedule" && <SchedulePage />}
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
