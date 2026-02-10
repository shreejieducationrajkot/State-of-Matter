import { MatterItem } from './types';

export const INTRO_ITEMS: MatterItem[] = [
  { id: 'plant', name: 'Plant', type: 'NATURAL', image: '🌿' },
  { id: 'cat', name: 'Cat', type: 'NATURAL', image: '🐱' },
  { id: 'chair', name: 'Chair', type: 'MAN_MADE', image: '🪑' },
  { id: 'book', name: 'Book', type: 'MAN_MADE', image: '📘' },
];

export const SOLID_ITEMS = [
  { id: 'car', name: 'Toy Car', image: '🚗', width: 'w-24', height: 'h-16' },
  { id: 'block', name: 'Wood Block', image: '🪵', width: 'w-16', height: 'h-16' },
];