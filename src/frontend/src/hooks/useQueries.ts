import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Division, GameRecord } from "../backend";
import { useActor } from "./useActor";

// ScheduledGame type (available in backend.d.ts but not yet in auto-generated backend.ts)
export interface ScheduledGame {
  date: string;
  homeTeam: string;
  awayTeam: string;
  division: Division;
}

export function useGetAllGames() {
  const { actor, isFetching } = useActor();
  return useQuery<GameRecord[]>({
    queryKey: ["games"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGamesByDivision(division: Division) {
  const { actor, isFetching } = useActor();
  return useQuery<GameRecord[]>({
    queryKey: ["games", division],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGamesByDivision(division);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGame() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (game: GameRecord) => {
      if (!actor) throw new Error("Not connected");
      return actor.addGame(game);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useUpdateGame() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, game }: { id: bigint; game: GameRecord }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateGame(id, game);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useDeleteGame() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteGame(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useCreateMvpPhoto() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (blob: import("../backend").ExternalBlob) => {
      if (!actor) throw new Error("Not connected");
      return actor.createExternalMvpPhoto(blob);
    },
  });
}

export function useGetAllScheduledGames() {
  const { actor, isFetching } = useActor();
  return useQuery<ScheduledGame[]>({
    queryKey: ["scheduledGames"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllScheduledGames() as Promise<ScheduledGame[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddScheduledGame() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (game: ScheduledGame) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).addScheduledGame(game) as Promise<bigint>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scheduledGames"] });
    },
  });
}

export function useUpdateScheduledGame() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, game }: { id: bigint; game: ScheduledGame }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateScheduledGame(id, game) as Promise<void>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scheduledGames"] });
    },
  });
}

export function useDeleteScheduledGame() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).deleteScheduledGame(id) as Promise<void>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scheduledGames"] });
    },
  });
}
