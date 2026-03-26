import { Division } from "../backend";

export interface SampleGame {
  id: string;
  division: Division;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  mvp?: {
    name: string;
    team: string;
    photo: string;
  };
}

export const SAMPLE_GAMES: SampleGame[] = [
  {
    id: "s1",
    division: Division.coEdTeeBall,
    homeTeam: "Blue Jays",
    awayTeam: "Cardinals",
    homeScore: 8,
    awayScore: 5,
    date: "2026-03-22",
    mvp: {
      name: "Lily Hernandez",
      team: "Blue Jays",
      photo: "/assets/generated/mvp-teeball-1.dim_200x200.jpg",
    },
  },
  {
    id: "s2",
    division: Division.coEdTeeBall,
    homeTeam: "Tigers",
    awayTeam: "Marlins",
    homeScore: 6,
    awayScore: 7,
    date: "2026-03-20",
  },
  {
    id: "s3",
    division: Division.baseballCoachPitch,
    homeTeam: "Royals",
    awayTeam: "Braves",
    homeScore: 11,
    awayScore: 9,
    date: "2026-03-23",
    mvp: {
      name: "Marcus Webb",
      team: "Royals",
      photo: "/assets/generated/mvp-baseball-2.dim_200x200.jpg",
    },
  },
  {
    id: "s4",
    division: Division.baseballCoachPitch,
    homeTeam: "Cubs",
    awayTeam: "Padres",
    homeScore: 7,
    awayScore: 10,
    date: "2026-03-21",
  },
  {
    id: "s5",
    division: Division.softballCoachPitch,
    homeTeam: "Sparks",
    awayTeam: "Comets",
    homeScore: 9,
    awayScore: 6,
    date: "2026-03-22",
    mvp: {
      name: "Ava Mitchell",
      team: "Sparks",
      photo: "/assets/generated/mvp-softball-2.dim_200x200.jpg",
    },
  },
  {
    id: "s6",
    division: Division.softballCoachPitch,
    homeTeam: "Rockets",
    awayTeam: "Stars",
    homeScore: 4,
    awayScore: 5,
    date: "2026-03-19",
  },
  {
    id: "s7",
    division: Division.baseballMinors,
    homeTeam: "Red Sox",
    awayTeam: "Yankees",
    homeScore: 6,
    awayScore: 4,
    date: "2026-03-24",
    mvp: {
      name: "Jordan Price",
      team: "Red Sox",
      photo: "/assets/generated/mvp-baseball-1.dim_200x200.jpg",
    },
  },
  {
    id: "s8",
    division: Division.baseballMinors,
    homeTeam: "Dodgers",
    awayTeam: "Astros",
    homeScore: 3,
    awayScore: 5,
    date: "2026-03-22",
  },
  {
    id: "s9",
    division: Division.softballMinors,
    homeTeam: "Eagles",
    awayTeam: "Falcons",
    homeScore: 7,
    awayScore: 3,
    date: "2026-03-23",
    mvp: {
      name: "Sofia Garcia",
      team: "Eagles",
      photo: "/assets/generated/mvp-softball-1.dim_200x200.jpg",
    },
  },
  {
    id: "s10",
    division: Division.softballMinors,
    homeTeam: "Lightning",
    awayTeam: "Thunder",
    homeScore: 5,
    awayScore: 8,
    date: "2026-03-21",
  },
  {
    id: "s11",
    division: Division.baseballMajors,
    homeTeam: "Rangers",
    awayTeam: "Giants",
    homeScore: 4,
    awayScore: 4,
    date: "2026-03-25",
    mvp: {
      name: "Tyler Nguyen",
      team: "Rangers",
      photo: "/assets/generated/mvp-baseball-2.dim_200x200.jpg",
    },
  },
  {
    id: "s12",
    division: Division.baseballMajors,
    homeTeam: "Mets",
    awayTeam: "Phillies",
    homeScore: 2,
    awayScore: 7,
    date: "2026-03-22",
  },
  {
    id: "s13",
    division: Division.softballMajors,
    homeTeam: "Vipers",
    awayTeam: "Panthers",
    homeScore: 6,
    awayScore: 5,
    date: "2026-03-24",
    mvp: {
      name: "Kayla Thompson",
      team: "Vipers",
      photo: "/assets/generated/mvp-softball-2.dim_200x200.jpg",
    },
  },
  {
    id: "s14",
    division: Division.softballMajors,
    homeTeam: "Wildcats",
    awayTeam: "Cheetahs",
    homeScore: 9,
    awayScore: 2,
    date: "2026-03-20",
  },
];

export const DIVISION_LABELS: Record<Division, string> = {
  [Division.coEdTeeBall]: "Co-Ed TeeBall",
  [Division.baseballCoachPitch]: "Baseball Coach Pitch",
  [Division.softballCoachPitch]: "Softball Coach Pitch",
  [Division.baseballMinors]: "Baseball Minors",
  [Division.softballMinors]: "Softball Minors",
  [Division.baseballMajors]: "Baseball Majors",
  [Division.softballMajors]: "Softball Majors",
};

export const DIVISIONS_ORDERED: Division[] = [
  Division.coEdTeeBall,
  Division.baseballCoachPitch,
  Division.softballCoachPitch,
  Division.baseballMinors,
  Division.softballMinors,
  Division.baseballMajors,
  Division.softballMajors,
];
