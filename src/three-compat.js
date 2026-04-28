import * as THREE from '../node_modules/three/build/three.module.js';

// Re-export everything from the real three
export * from '../node_modules/three/build/three.module.js';

// Add missing constants that were removed in three@0.152.0
export const sRGBEncoding = 3001;
export const LinearEncoding = 3000;
export const NoEncoding = 3000;

// Export default for compatibility
export default THREE;
