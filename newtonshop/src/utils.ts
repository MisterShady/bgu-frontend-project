export const toPlural = (type: string): string => {
  switch (type.toLowerCase()) {
  case "iphone":
    return "iphones";
  case "ipad":
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

export const base64ToBlob = (base64: string, contentType: string = "image/jpeg") => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

export const getImagesByColor = (images: string[], color: string): string[] => {
  const normalizedColor = color.replace(/\s+/g, "").toLowerCase();
  return images.filter((image) => image.toLowerCase().includes(normalizedColor));
};

export const getImagesByBandStyle = (bandStyle: { image: string }): string | null => {
  return bandStyle.image || null;
};
