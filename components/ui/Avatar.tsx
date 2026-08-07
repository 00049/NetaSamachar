'use client';

import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

interface AvatarProps {
  photoUrl?: string;
  name: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

// 4x4 generic gray/neutral placeholder to satisfy next/image blurDataURL
// This ensures we get the smooth opacity cross-fade when the real image loads,
// avoiding a harsh pop from a transparent/blank background.
const BLUR_B64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAQAAAADeEpSQAAAC0lEQVR42mOUYmBgwAAuMDIwgBgMAA74AL98z6fKAAAAAElFTkSuQmCC';

/**
 * Avatar — handles image optimization (WebP/AVIF via next/image),
 * exact sizing, and smooth blur-up loading. Falls back to a letter
 * circle if no photo is available or if it errors out.
 */
export function Avatar({ photoUrl, name, size = 40, className = '', priority = false }: AvatarProps) {
  const [error, setError] = useState(false);

  // Treat 'placeholder' strings in our raw data as missing images
  const isMissing = !photoUrl || photoUrl.includes('placeholder.jpg') || error;

  if (isMissing) {
    return (
      <div
        className={clsx(
          'rounded-full bg-[var(--bg-raised)] border border-[var(--border-default)] flex items-center justify-center shrink-0',
          className
        )}
        style={{ width: size, height: size }}
      >
        <span
          className="font-serif font-bold text-[var(--text-primary)]"
          style={{ fontSize: Math.round(size * 0.35) }}
        >
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'relative rounded-full overflow-hidden shrink-0 border border-[var(--border-default)] bg-[var(--bg-raised)]',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={photoUrl}
        alt={name}
        fill
        sizes={`${size}px`}
        className="object-cover"
        placeholder="blur"
        blurDataURL={BLUR_B64}
        priority={priority}
        onError={() => setError(true)}
      />
    </div>
  );
}
