import type { LFPShortcodeConfig } from '../types.d.ts';

let STORE: Partial<LFPShortcodeConfig> = {};

export function initConfig(config: LFPShortcodeConfig) {
  STORE = config;
}

export function getConfig() {
  return STORE;
}

export function updateConfig(update: Partial<LFPShortcodeConfig>) {
  STORE = Object.assign(STORE, update);
  return STORE;
}