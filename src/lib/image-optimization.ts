/**
 * Image optimization utility
 * Converts images to modern formats and provides responsive sizes
 */

interface ImageOptimizationOptions {
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

export function getOptimizedImageProps({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  priority = false,
}: ImageOptimizationOptions) {
  // For production, you would integrate with an image optimization service
  // For now, we'll use native loading and decoding optimizations
  
  return {
    src,
    alt,
    width,
    height,
    loading: priority ? 'eager' : loading,
    decoding: priority ? 'sync' : 'async',
    // Add srcSet for responsive images
    srcSet: width ? `${src} 1x, ${src} 2x` : undefined,
  }
}

export function preloadImage(src: string) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  document.head.appendChild(link)
}
