
import { AppData } from '../types';

export const tacticalData: AppData = {
  theme: {
    primary: "#ff0000", // Team A
    away: "#dc2626", // Team B
    secondary: "#ffffff",
    accent: "#f59e0b",
    courtBg: "#e5e7eb", 
    courtLines: "#ffffff", 
  },
  system: {
    name: "Full Court: 4-2 Serve Receive",
    players: [
      { id: "S", name: "S", team: "home" },
      { id: "P1", name: "P1", team: "home" },
      { id: "P2", name: "P2", team: "home" },
      { id: "MID", name: "MID", team: "home" },
      { id: "DIA", name: "DIA", team: "home" },
      { id: "L", name: "L", team: "home" },
      { id: "OS", name: "S", team: "away" },
      { id: "OM", name: "M", team: "away" },
      { id: "OH1", name: "H1", team: "away" },
      { id: "OH2", name: "H2", team: "away" },
      { id: "OS2", name: "S2", team: "away" },
      { id: "OL", name: "L", team: "away" }
    ],
    steps: [
      {
        id: '1',
        label: "Start: Team A Receiving",
        description: "Team B (Red) in Base Formation. Team A (Dark) in receive. Ball with Server.",
        defaultNextStepId: '2',
        balls: [{ id: "BALL", position: { x: 88, y: 2 } }],
        positions: {
          "S":   { x: 75, y: 58 },
          "MID": { x: 50, y: 55 },
          "P2":  { x: 25, y: 72 },
          "DIA": { x: 80, y: 85 },
          "L":   { x: 50, y: 90 },
          "P1":  { x: 20, y: 85 },
          "OS":  { x: 85, y: 1 },
          "OH1": { x: 20, y: 38 },
          "OM":  { x: 50, y: 38 },
          "OS2": { x: 80, y: 38 },
          "OH2": { x: 30, y: 18 },
          "OL":  { x: 70, y: 18 },
        }
      },
      {
        id: '2',
        label: "Phase 1: Serve & Read",
        description: "OS serves. Ball travels to Receiver (P2).",
        defaultNextStepId: '3',
        balls: [{ id: "BALL", position: { x: 28, y: 70 } }],
        positions: {
          "S":   { x: 72, y: 60 },
          "MID": { x: 50, y: 55 },
          "P2":  { x: 28, y: 74 },
          "DIA": { x: 78, y: 84 },
          "L":   { x: 50, y: 88 },
          "P1":  { x: 22, y: 84 },
          "OS":  { x: 75, y: 12 },
          "OH1": { x: 20, y: 40 },
          "OM":  { x: 50, y: 40 },
          "OS2": { x: 80, y: 40 },
          "OH2": { x: 32, y: 20 },
          "OL":  { x: 68, y: 20 },
        }
      },
      {
        id: '3',
        label: "Phase 2: Setter Release / Block Setup",
        description: "Pass to Setter Target. Setter sprints.",
        balls: [{ id: "BALL", position: { x: 65, y: 52 } }],
        positions: {
          "S":   { x: 65, y: 52 },
          "MID": { x: 40, y: 53 },
          "P2":  { x: 10, y: 65 },
          "DIA": { x: 85, y: 80 },
          "L":   { x: 50, y: 75 },
          "P1":  { x: 20, y: 75 },
          "OS":  { x: 75, y: 15 },
          "OH1": { x: 20, y: 46 },
          "OM":  { x: 50, y: 46 },
          "OS2": { x: 80, y: 46 },
          "OH2": { x: 30, y: 22 },
          "OL":  { x: 70, y: 22 },
        }
      }
    ]
  }
};
