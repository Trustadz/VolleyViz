
export const sideout1 = {
  "id": "sideout-1",
  "category": "Sideouts",
  "name": "Sideout 1 (Rot 1) - Interactive",
  "description": "Tap zones to direct the pass! 4-2 Serve Receive.",
  "players": ["S", "P1", "P2", "MID", "DIA", "L", "OS", "OM", "OH1", "OH2", "OS2", "OL", "BALL"],
  "steps": [
    {
      "id": "step-start",
      "label": "Start: Serve Receive",
      "description": "Tap a zone to simulate the pass location. Orange zones = visible. Others are hidden.",
      "defaultNextStepId": "step-perfect-pass",
      "zones": [
        {
          "id": "zone-ba",
          "color": "rgba(249, 115, 22, 0.2)",
          "responsiblePlayerId": "P1",
          "targetStepId": "step-high-ball",
          "points": [{"x": 4, "y": 55}, {"x": 35, "y": 55}, {"x": 35, "y": 96}, {"x": 4, "y": 96}]
        },
        {
          "id": "zone-ma",
          "color": "rgba(59, 130, 246, 0.1)",
          "responsiblePlayerId": "L",
          "targetStepId": "step-perfect-pass",
          "points": [{"x": 35, "y": 55}, {"x": 65, "y": 55}, {"x": 65, "y": 96}, {"x": 35, "y": 96}]
        },
        {
          "id": "zone-bv",
          "color": "rgba(249, 115, 22, 0.2)",
          "responsiblePlayerId": "P2",
          "targetStepId": "step-tight-pass",
          "points": [{"x": 65, "y": 55}, {"x": 96, "y": 55}, {"x": 96, "y": 96}, {"x": 65, "y": 96}]
        },
        {
           "id": "zone-dia",
           "color": "rgba(239, 68, 68, 0.2)",
           "responsiblePlayerId": "DIA",
           "targetStepId": "step-perfect-pass",
           "points": [{"x": 4, "y": 40}, {"x": 45, "y": 40}, {"x": 45, "y": 55}, {"x": 4, "y": 55}]
        }
      ],
      "positions": {
        "BALL": { "x": 88, "y": 2 },
        "S":   { "x": 75, "y": 58 },
        "MID": { "x": 50, "y": 55 },
        "P2":  { "x": 25, "y": 72 },
        "DIA": { "x": 80, "y": 85 },
        "L":   { "x": 50, "y": 90 },
        "P1":  { "x": 20, "y": 85 },
        "OS":  { "x": 85, "y": 1 },
        "OH1": { "x": 20, "y": 38 },
        "OM":  { "x": 50, "y": 38 },
        "OS2": { "x": 80, "y": 38 },
        "OH2": { "x": 30, "y": 18 },
        "OL":  { "x": 70, "y": 18 }
      }
    },
    {
      "id": "step-perfect-pass",
      "label": "Perfect Pass",
      "description": "Ball to target. Setter moves to net.",
      "defaultNextStepId": "step-attack",
      "positions": {
        "BALL": { "x": 65, "y": 67 },
        "S":   { "x": 65, "y": 52 },
        "MID": { "x": 40, "y": 53 },
        "P2":  { "x": 10, "y": 65 },
        "DIA": { "x": 85, "y": 80 },
        "L":   { "x": 50, "y": 75 },
        "P1":  { "x": 20, "y": 75 },
        "OS":  { "x": 75, "y": 15 },
        "OH1": { "x": 20, "y": 46 },
        "OM":  { "x": 50, "y": 46 },
        "OS2": { "x": 80, "y": 46 },
        "OH2": { "x": 30, "y": 22 },
        "OL":  { "x": 70, "y": 22 }
      }
    },
    {
      "id": "step-high-ball",
      "label": "High Ball / Off Net",
      "description": "Pass is off the net. Setter must scramble.",
      "defaultNextStepId": "step-attack-high",
      "positions": {
        "BALL": { "x": 55, "y": 65 },
        "S":   { "x": 58, "y": 62 },
        "MID": { "x": 40, "y": 53 },
        "P2":  { "x": 25, "y": 72 },
        "DIA": { "x": 85, "y": 80 },
        "L":   { "x": 50, "y": 85 },
        "P1":  { "x": 30, "y": 80 },
        "OS":  { "x": 75, "y": 15 },
        "OH1": { "x": 20, "y": 42 },
        "OM":  { "x": 50, "y": 42 },
        "OS2": { "x": 80, "y": 42 },
        "OH2": { "x": 30, "y": 20 },
        "OL":  { "x": 70, "y": 20 }
      }
    },
    {
      "id": "step-tight-pass",
      "label": "Tight Pass",
      "description": "Pass too close to net. Setter jump set.",
      "defaultNextStepId": "step-attack",
      "positions": {
        "BALL": { "x": 65, "y": 49 },
        "S":   { "x": 65, "y": 50 },
        "MID": { "x": 45, "y": 55 },
        "P2":  { "x": 25, "y": 68 },
        "DIA": { "x": 85, "y": 80 },
        "L":   { "x": 50, "y": 90 },
        "P1":  { "x": 20, "y": 85 },
        "OS":  { "x": 75, "y": 15 },
        "OH1": { "x": 20, "y": 40 },
        "OM":  { "x": 50, "y": 40 },
        "OS2": { "x": 80, "y": 40 },
        "OH2": { "x": 30, "y": 18 },
        "OL":  { "x": 70, "y": 18 }
      }
    },
    {
      "id": "step-attack",
      "label": "Attack",
      "description": "Set to Outside.",
      "positions": {
        "BALL": { "x": 10, "y": 45 },
        "S":   { "x": 60, "y": 52 },
        "MID": { "x": 40, "y": 50 },
        "P2":  { "x": 15, "y": 55 },
        "DIA": { "x": 85, "y": 80 },
        "L":   { "x": 50, "y": 75 },
        "P1":  { "x": 30, "y": 75 },
        "OS":  { "x": 75, "y": 15 },
        "OH1": { "x": 15, "y": 40 },
        "OM":  { "x": 45, "y": 46 },
        "OS2": { "x": 80, "y": 46 },
        "OH2": { "x": 30, "y": 22 },
        "OL":  { "x": 70, "y": 22 }
      }
    },
    {
      "id": "step-attack-high",
      "label": "OOS Attack",
      "description": "High set to outside, double block forming.",
      "positions": {
        "BALL": { "x": 10, "y": 45 },
        "S":   { "x": 55, "y": 60 },
        "MID": { "x": 45, "y": 55 },
        "P2":  { "x": 15, "y": 55 },
        "DIA": { "x": 85, "y": 80 },
        "L":   { "x": 50, "y": 80 },
        "P1":  { "x": 35, "y": 80 },
        "OS":  { "x": 75, "y": 15 },
        "OH1": { "x": 12, "y": 40 },
        "OM":  { "x": 20, "y": 42 },
        "OS2": { "x": 80, "y": 42 },
        "OH2": { "x": 30, "y": 20 },
        "OL":  { "x": 70, "y": 20 }
      }
    }
  ]
};
