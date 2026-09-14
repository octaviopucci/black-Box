import type { StoreEvent } from "./types";

type Listener = (event: StoreEvent) => void;

const listeners = new Map<string, Set<Listener>>();

export function subscribe(establishmentId: string, listener: Listener) {
  if (!listeners.has(establishmentId)) listeners.set(establishmentId, new Set());
  listeners.get(establishmentId)!.add(listener);
  return () => listeners.get(establishmentId)?.delete(listener);
}

export function emit(event: StoreEvent) {
  const set = listeners.get(event.establishmentId);
  if (!set) return;
  for (const fn of set) fn(event);
}

export function subscribeAll(listener: Listener) {
  const wrapper = (e: StoreEvent) => listener(e);
  const unsubscribers: (() => void)[] = [];
  return {
    add(establishmentId: string) {
      unsubscribers.push(subscribe(establishmentId, wrapper));
    },
    dispose() {
      unsubscribers.forEach((u) => u());
    },
  };
}
