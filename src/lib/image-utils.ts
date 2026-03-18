export const normalizeProductImages = (product: any) => {
  if (!product || !product.image) return product;

  const variants = ['thumbnail', 'low', 'mid', 'high', 'veryHigh'] as const;
  
  // Find the first available image
  let firstAvailable = '';
  for (const v of variants) {
    if (product.image[v]) {
      firstAvailable = product.image[v];
      break;
    }
  }

  if (!firstAvailable) return product;

  // Fill in blanks
  let lastAvailable = firstAvailable;
  for (const v of variants) {
    if (!product.image[v]) {
      product.image[v] = lastAvailable;
    } else {
      lastAvailable = product.image[v];
    }
  }

  return product;
};

export const getProductImage = (image: any, preferred: 'thumbnail' | 'low' | 'mid' | 'high' | 'veryHigh') => {
  if (!image) return '/placeholder-jewelry.png';
  
  const variants = ['thumbnail', 'low', 'mid', 'high', 'veryHigh'] as const;
  
  // 1. Try preferred
  if (image[preferred]) return image[preferred];
  
  // 2. Try higher quality first
  const preferredIdx = variants.indexOf(preferred);
  for (let i = preferredIdx + 1; i < variants.length; i++) {
    if (image[variants[i]]) return image[variants[i]];
  }
  
  // 3. Try lower quality
  for (let i = preferredIdx - 1; i >= 0; i--) {
    if (image[variants[i]]) return image[variants[i]];
  }
  
  return '/placeholder-jewelry.png';
};
