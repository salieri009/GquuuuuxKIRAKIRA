import type { EffectModule } from "@kirakira/effect-sdk";

/** Class instance → ponytail default export ({ init, update, dispose }). */
export function bindEffectModule(effect: EffectModule): EffectModule {
  return {
    init: effect.init.bind(effect),
    update: effect.update.bind(effect),
    dispose: effect.dispose.bind(effect),
  };
}
