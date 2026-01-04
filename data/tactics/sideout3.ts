
export const sideout3 = {
    "id": "sideout-3",
    "category": "Sideouts",
    "name": "Sideout 3 (Rot 3)",
    "description": "Setter in Zone 5. Stack Left.",
    "players": ["S", "P1", "P2", "MID", "DIA", "L", "OS", "BALL"],
    "steps": [
      {
        "id": "1",
        "label": "Start",
        "description": "Setter (S) in back-left corner.",
        "defaultNextStepId": "2",
        "positions": {
          "BALL": { "x": 50, "y": 2 },
          "S": { "x": 20, "y": 75 },
          "MID": { "x": 50, "y": 55 },
          "P2": { "x": 35, "y": 65 },
          "DIA": { "x": 80, "y": 80 },
          "L": { "x": 50, "y": 85 },
          "P1": { "x": 65, "y": 80 },
          "OS": { "x": 50, "y": 1 }
        }
      },
      {
        "id": "2",
        "label": "Release",
        "description": "Setter runs along sideline.",
        "positions": {
          "BALL": { "x": 50, "y": 75 },
          "S": { "x": 30, "y": 55 },
          "MID": { "x": 55, "y": 55 },
          "P2": { "x": 35, "y": 65 },
          "DIA": { "x": 80, "y": 80 },
          "L": { "x": 50, "y": 85 },
          "P1": { "x": 65, "y": 80 },
          "OS": { "x": 50, "y": 10 }
        }
      }
    ]
};
