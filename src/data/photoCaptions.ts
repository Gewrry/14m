export type PhotoCaption = {
  title: string;
  description?: string;
};

export const photoCaptions: Record<string, PhotoCaption> = {
  "sample-photo.jpg": {
    title: "A favorite moment",
    description: "Replace this entry with the filename, title, and description for your uploaded photo.",
  },
};
