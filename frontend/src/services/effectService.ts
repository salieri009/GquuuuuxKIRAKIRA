import effectsData from '../data/effects.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchEffects() {
  // Simulate API loading delay
  await delay(1000);
  
  // Simulate occasional network error (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Network error: Failed to fetch effects');
  }
  
  return effectsData;
}

export async function loadEffectModule(effectId: string) {
  // Simulate dynamic module loading
  await delay(500);
  
  // Return a mock effect module
  return {
    init: (scene: any, params: any) => {
      console.log(`Initializing effect: ${effectId}`, params);
      // Effect initialization logic would go here
    },
    update: (params: any) => {
      console.log(`Updating effect: ${effectId}`, params);
      // Effect update logic would go here
    },
    dispose: () => {
      console.log(`Disposing effect: ${effectId}`);
      // Cleanup logic would go here
    }
  };
}