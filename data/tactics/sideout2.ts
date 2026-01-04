
export const sideout2 = {
  "id": "sideout-2",
  "category": "Sideouts",
  "name": "Sideout 2 (Rot 2)",
  "description": "Setter in Zone 6. Stack Left.",
  "players": ["S", "P1", "P2", "MID", "DIA", "L", "OS", "BALL"],
  "steps": [
    {
      "id": "1",
      "label": "Start: Serve Receive",
      "description": "Setter (S) pushing up from middle-back.",
      "defaultNextStepId": "2",
      "positions": {
        "BALL": { "x": 50, "y": 2 },
        "S":   { "x": 50, "y": 65 },
        "MID": { "x": 80, "y": 55 },
        "P2":  { "x": 20, "y": 60 },
        "DIA": { "x": 85, "y": 85 },
        "L":   { "x": 40, "y": 85 },
        "P1":  { "x": 60, "y": 85 },
        "OS":  { "x": 50, "y": 1 }
      }
    },
    {
      "id": "2",
      "label": "Setter Release",
      "description": "S runs to net. Ball passed to center.",
      "positions": {
        "BALL": { "x": 50, "y": 75 },
        "S":   { "x": 60, "y": 52 },
        "MID": { "x": 85, "y": 55 },
        "P2":  { "x": 20, "y": 65 },
        "DIA": { "x": 85, "y": 80 },
        "L":   { "x": 45, "y": 80 },
        "P1":  { "x": 55, "y": 80 },
        "OS":  { "x": 50, "y": 10 }
      }
    }
  ]
};
