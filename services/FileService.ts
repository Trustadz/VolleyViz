import { Tactic } from '../types';
import { sanitizeTactic } from '../utils/dataMigration';

export const FileService = {
  exportTacticToJson: (tactic: Tactic) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tactic, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `${tactic.name.replace(/\s+/g, '_')}.json`);
    dl.click();
    dl.remove();
  },

  importTacticFromJson: (file: File): Promise<Tactic> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const raw = JSON.parse(ev.target?.result as string);
          const sanitized = sanitizeTactic(raw);
          resolve(sanitized);
        } catch (err) {
          reject(new Error("Invalid Play File Format"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }
};
