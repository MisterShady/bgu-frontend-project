export const toPlural = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'iphone':
      return 'iphones';
    case 'ipad':
      return "ipads";
    case "mac":
      return "macs";
    case "watch":
      return "watches";
    default:
      return type;
  }
};

export const getDataOrFallback = <T, K extends keyof T>(obj: T | null | undefined, key: K, fallback: T[K]): T[K] => {
  return obj && obj[key] !== undefined ? obj[key] : fallback;
};
