import { SIZE_PRICES, FINISH_PRICES } from '@/types';

/**
 * Centralized pricing engine for NovaFrame artifacts.
 * Formula: (Base + Size_Offset + Finish_Offset + Variant_Offset) * Count
 * 
 * @param {Object} product - The base product object
 * @param {Object} config - Configuration details { size, finish, variant, variantIndex, count }
 * @returns {number} - The calculated total price
 */
export function calculateArtifactPrice(product, config = {}) {
  if (!product) return 0;
  
  const basePrice = product.price || 185;
  
  // 1. Size Offset
  const sizeOffset = SIZE_PRICES[config.size] || 0;
  
  // 2. Finish/Material Offset
  // SPECIAL RULE: Canvas Premium is 145% of the Lona HD price
  let finishOffset = FINISH_PRICES[config.finish] || 0;
  let currentBasePlusSize = basePrice + sizeOffset;
  
  if (config.finish === 'Canvas Premium') {
    const lonaPrice = currentBasePlusSize + (FINISH_PRICES['Lona HD'] || 35);
    const targetCanvasPrice = Math.round(lonaPrice * 1.45);
    // Adjust finishOffset so the total (base + size + finish) matches target
    finishOffset = targetCanvasPrice - currentBasePlusSize;
  }

  // 3. Variant Offset
  // Standard PBN reduction is -$20
  let variantOffset = 0;
  const isPBN = config.variant?.toLowerCase().includes('pbn') || 
                config.variantIndex === 1 || 
                (config.variant === 'ALPHA' && config.variantIndex === 1); // For Holodeck Alpha/Beta
                
  if (isPBN) {
    variantOffset = -20;
  }

  // 4. Frame Offset
  // Any frame selection other than 'ninguno' or null adds $150
  const frameOffset = (config.frame && config.frame !== 'ninguno') ? 150 : 0;
  
  // 5. LED Offset
  const ledOffset = (config.led && config.led !== 'none') ? 200 : 0;
  
  // 6. Layout Count (Single, Duo, Trio)
  const count = config.count || 1;
  
  return (currentBasePlusSize + finishOffset + variantOffset + frameOffset + ledOffset) * count;
}
