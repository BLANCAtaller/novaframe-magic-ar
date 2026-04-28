import * as THREE from 'three';

// Re-export everything from three
export * from 'three';

// Add missing constants that were removed in three@0.152.0
export const sRGBEncoding = 3001;
export const LinearEncoding = 3000;
export const NoEncoding = 3000;

// Export default for compatibility
export default THREE;
