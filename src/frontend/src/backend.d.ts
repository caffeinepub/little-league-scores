import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface GameRecord {
    homeTeam: string;
    date: string;
    division: Division;
    mvpInfo?: MvpInfo;
    homeScore: bigint;
    awayTeam: string;
    awayScore: bigint;
}
export interface ScheduledGame {
    date: string;
    homeTeam: string;
    awayTeam: string;
    division: Division;
}
export interface UserProfile {
    name: string;
}
export interface MvpInfo {
    name: string;
    team: string;
    photo: ExternalBlob;
}
export enum Division {
    softballMinors = "softballMinors",
    baseballMinors = "baseballMinors",
    softballMajors = "softballMajors",
    softballCoachPitch = "softballCoachPitch",
    baseballCoachPitch = "baseballCoachPitch",
    baseballMajors = "baseballMajors",
    coEdTeeBall = "coEdTeeBall"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGame(game: GameRecord): Promise<bigint>;
    addScheduledGame(game: ScheduledGame): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createExternalMvpPhoto(blob: ExternalBlob): Promise<ExternalBlob>;
    deleteGame(gameId: bigint): Promise<void>;
    deleteScheduledGame(gameId: bigint): Promise<void>;
    getAllGames(): Promise<Array<GameRecord>>;
    getAllScheduledGames(): Promise<Array<ScheduledGame>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGame(gameId: bigint): Promise<GameRecord>;
    getGamesByDivision(division: Division): Promise<Array<GameRecord>>;
    getMvpPhotoByGameId(gameId: bigint): Promise<ExternalBlob>;
    getScheduledGamesByDivision(division: Division): Promise<Array<ScheduledGame>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateGame(gameId: bigint, game: GameRecord): Promise<void>;
    updateScheduledGame(gameId: bigint, game: ScheduledGame): Promise<void>;
}
