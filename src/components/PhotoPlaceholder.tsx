import React from 'react';
import { Camera, ImageOff, CheckCircle2 } from 'lucide-react';
import { getCategoryMeta } from '../utils/nutrition';
import { FoodPhotoItem } from '../types';

interface PhotoPlaceholderProps {
  foodName: string;
  foodGroup: string;
  photoInfo?: FoodPhotoItem;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PhotoPlaceholder: React.FC<PhotoPlaceholderProps> = ({
  foodName,
  foodGroup,
  photoInfo,
  size = 'md',
  className = '',
}) => {
  const cat = getCategoryMeta(foodGroup);
  const [imageError, setImageError] = React.useState(false);

  // Visual sizes
  const heightClass = size === 'sm' ? 'h-24' : size === 'lg' ? 'h-64 sm:h-72' : 'h-40 sm:h-48';
  const iconSize = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-5xl' : 'text-3xl';
  const hasCustomHeight = className.includes('h-');

  // If in the future an actual image file exists and is populated, render standard img
  // Support the new EXTRACTED state
  const isExtracted = !imageError && photoInfo?.image_status === 'EXTRACTED' && photoInfo?.image_path_or_reference;
  if (isExtracted || (!imageError && photoInfo?.image_file && photoInfo.image_file.trim() !== '')) {
    const imgSrc = isExtracted ? photoInfo.image_path_or_reference : photoInfo.image_file;
    return (
      <div className={`relative overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center ${hasCustomHeight ? '' : heightClass} ${className}`}>
        <img
          src={imgSrc}
          alt={foodName}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-1"
          referrerPolicy="no-referrer"
        />
        {photoInfo?.figure_number && (
          <span className="absolute bottom-2 left-2 bg-neutral-900/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-xs">
            {photoInfo.figure_number}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-neutral-200/80 bg-linear-to-br from-neutral-50 via-neutral-100/60 to-neutral-200/40 flex flex-col justify-between p-3.5 select-none ${className}`}
    >
      {/* Top row: Category Badge & Figure Tag */}
      <div className="flex items-center justify-between gap-2 z-10">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${cat.bgClass} ${cat.textClass} ${cat.borderClass} shadow-2xs`}>
          <span>{cat.emoji}</span>
          <span>{cat.nameEn}</span>
        </span>

        {photoInfo?.figure_number ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/90 border border-neutral-200 text-neutral-600 text-[10px] font-mono font-medium shadow-2xs">
            <Camera className="w-3 h-3 text-neutral-500" />
            {photoInfo.figure_number}
          </span>
        ) : null}
      </div>

      {/* Center Botanical / Category Graphic */}
      <div className="flex flex-col items-center justify-center my-auto text-center z-10">
        <div className="w-14 h-14 rounded-full bg-white/80 border border-neutral-200/70 shadow-xs flex items-center justify-center mb-1.5">
          <span className={iconSize}>{cat.emoji}</span>
        </div>
        <p className="text-xs font-semibold text-neutral-800 line-clamp-1 max-w-[85%] px-1">
          {foodName}
        </p>
      </div>

      {/* Bottom bar: NARC Reference & Pending Status */}
      <div className="flex items-center justify-between text-[10px] text-neutral-500 z-10 pt-1 border-t border-neutral-200/60">
        <span className="truncate max-w-[65%]">
          {photoInfo?.figure_caption ? (
            <span className="italic font-medium">{photoInfo.figure_caption}</span>
          ) : (
            'NARC 2024 Reference'
          )}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-amber-700 bg-amber-50/90 border border-amber-200/80 px-1.5 py-0.5 rounded text-[9px] shrink-0">
          <ImageOff className="w-2.5 h-2.5" /> Photo pending
        </span>
      </div>

      {/* Subtle background motif grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />
    </div>
  );
};
