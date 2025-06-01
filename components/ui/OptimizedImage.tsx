// Optimized image components with WebP/AVIF support and lazy loading
'use client';

import Image from 'next/image';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ImageProps } from '@/types';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  lazy?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty' | 'skeleton';
  blurDataURL?: string;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
  showSkeleton?: boolean;
  aspectRatio?: number;
}

// Base optimized image component
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fallbackSrc,
  lazy = true,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoadComplete,
  onLoadError,
  showSkeleton = true,
  aspectRatio,
  className = '',
  priority = false,
  fill = false,
  sizes,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate placeholder blur data URL if not provided
  const generateBlurDataURL = useCallback((w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  }, []);

  const defaultBlurDataURL = blurDataURL || 
    (width && height ? generateBlurDataURL(width, height) : 
     'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyFGSckZHHvXFry9t7ndEMoJE2lnzPKDhW/lX1ZIuW9Q32XgPHl+ffntuYY3jANHOcaWV5hqOTh7Z/+QCC1zfkUgfKEUQhTqGFOBKgBE8hJTKVLPpOuRCKKqSBP83b8q8FaPqVJ');

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoadComplete?.();
  }, [onLoadComplete]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    } else {
      const error = new Error(`Failed to load image: ${src}`);
      onLoadError?.(error);
    }
  }, [src, fallbackSrc, currentSrc, onLoadError]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoading(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [lazy, priority]);

  const imageProps = {
    src: currentSrc,
    alt,
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    fill,
    sizes: sizes || (width ? `${width}px` : '100vw'),
    quality,
    priority,
    placeholder: placeholder === 'skeleton' ? 'empty' : placeholder,
    blurDataURL: placeholder === 'blur' ? defaultBlurDataURL : undefined,
    onLoad: handleLoad,
    onError: handleError,
    className: `transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    } ${className}`,
    ...props,
  };

  const containerStyle = aspectRatio ? {
    aspectRatio: aspectRatio.toString(),
    position: 'relative' as const,
  } : {};

  if (hasError && !fallbackSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200  ${className}`}
        style={{ width, height, ...containerStyle }}
        aria-label={`Image failed to load: ${alt}`}
      >
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div ref={imgRef} style={containerStyle} className="relative">
      {showSkeleton && isLoading && placeholder === 'skeleton' && (
        <div 
          className="absolute inset-0 bg-gray-200  animate-pulse rounded"
          style={{ width, height }}
          aria-hidden="true"
        />
      )}
      <Image {...imageProps} />
    </div>
  );
}

// Magazine cover image with specific optimizations
export function MagazineCoverImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={300}
      height={400}
      aspectRatio={3 / 4}
      placeholder="blur"
      quality={90}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px"
      className={`rounded-lg shadow-md ${className}`}
      fallbackSrc="/images/magazine-placeholder.webp"
      {...props}
    />
  );
}

// Hero image with progressive loading
export function HeroImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height' | 'fill'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      quality={95}
      placeholder="blur"
      sizes="100vw"
      className={`object-cover ${className}`}
      fallbackSrc="/images/hero-fallback.webp"
      {...props}
    />
  );
}

// Avatar image with fallback
export function AvatarImage({
  src,
  alt,
  size = 48,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & { size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      quality={80}
      placeholder="blur"
      className={`rounded-full ${className}`}
      fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&size=${size}&background=random`}
      {...props}
    />
  );
}

// Gallery image with lazy loading and zoom
export function GalleryImage({
  src,
  alt,
  className = '',
  onZoom,
  ...props
}: OptimizedImageProps & { onZoom?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative overflow-hidden rounded-lg cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onZoom}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onZoom?.();
        }
      }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        className={`transition-transform duration-300 ${
          isHovered ? 'scale-105' : 'scale-100'
        } ${className}`}
        {...props}
      />
      {onZoom && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// Responsive image grid
interface ImageGridProps {
  images: Array<{
    src: string;
    alt: string;
    id: string;
  }>;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: number;
  onImageClick?: (id: string) => void;
  className?: string;
}

export function ResponsiveImageGrid({
  images,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  onImageClick,
  className = '',
}: ImageGridProps) {
  const gridClass = `grid gap-${gap} grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;

  return (
    <div className={`${gridClass} ${className}`}>
      {images.map((image, index) => (
        <GalleryImage
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={400}
          height={300}
          lazy={index > 6} // Only lazy load images beyond the first 6
          onZoom={() => onImageClick?.(image.id)}
        />
      ))}
    </div>
  );
}

// Image with caption
interface CaptionedImageProps extends OptimizedImageProps {
  caption?: string;
  credit?: string;
}

export function CaptionedImage({
  caption,
  credit,
  className = '',
  ...props
}: CaptionedImageProps) {
  return (
    <figure className={`space-y-2 ${className}`}>
      <OptimizedImage {...props} />
      {(caption || credit) && (
        <figcaption className="text-sm text-gray-600 ">
          {caption && <p>{caption}</p>}
          {credit && <p className="text-xs opacity-75">{credit}</p>}
        </figcaption>
      )}
    </figure>
  );
}

// Progressive image loading hook
export function useProgressiveImage(src: string, fallbackSrc?: string) {
  const [currentSrc, setCurrentSrc] = useState(fallbackSrc || src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
      setHasError(false);
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setHasError(false);
      }
    };
    
    img.src = src;
  }, [src, fallbackSrc, currentSrc]);

  return { src: currentSrc, isLoading, hasError };
}

export default {
  OptimizedImage,
  MagazineCoverImage,
  HeroImage,
  AvatarImage,
  GalleryImage,
  ResponsiveImageGrid,
  CaptionedImage,
  useProgressiveImage,
};
