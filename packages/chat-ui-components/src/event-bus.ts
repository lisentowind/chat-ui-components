import mitt, { Emitter } from 'mitt';
import type { ChatEvents } from './types';

export const createEventBus = (): Emitter<ChatEvents> => {
  return mitt<ChatEvents>();
};
