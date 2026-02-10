export type MatterState = 'SOLID' | 'LIQUID' | 'GAS' | 'INTRO';

export interface MatterItem {
  id: string;
  name: string;
  type: 'NATURAL' | 'MAN_MADE';
  image: string; // Emoji or URL
  isSolid?: boolean;
}