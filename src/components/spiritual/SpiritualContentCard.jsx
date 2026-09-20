import React from 'react';
import { getTranslation } from '../../utils/i18n';

export default function SpiritualContentCard({ item, activeLang = 'hi', onSelect }) {
  const trans = item.active_translation || {};
  const API_BASE = 'http://localhost:5001';

  const coverUrl = item.image_url
    ? (item.image_url.startsWith('http') ? item.image_url : `${API_BASE}${item.image_url}`)
    : 'https://images.unsplash.com/photo-1567591414240-e2ff01e85567?w=600&auto=format&fit=crop&q=80';

  const typeName = item.type?.name || 'Spiritual';
  const typeIcon = item.type?.icon || '🪔';
  const deityName = item.deity?.name || null;

  return (
    <div
      onClick={() => onSelect && onSelect(trans.slug || item.id)}
      className="group bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] hover:border-[#E8862B] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
    >
      <div>
        {/* Cover Image */}
        <div className="relative h-44 w-full bg-[#241631] overflow-hidden">
          <img
            src={coverUrl}
            alt={trans.title || 'Spiritual Text'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1567591414240-e2ff01e85567?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Type Badge */}
          <span className="absolute top-3 left-3 bg-[#241631]/90 backdrop-blur-xs text-[#F7EEDC] text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1 shadow-sm">
            <span>{typeIcon}</span>
            <span>{typeName}</span>
          </span>

          {/* Deity Badge */}
          {deityName && (
            <span className="absolute top-3 right-3 bg-[#E8862B] text-[#2A1503] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {deityName}
            </span>
          )}

          {/* Fallback indicator */}
          {trans.is_fallback && (
            <span className="absolute bottom-2 left-3 bg-[#9E2B2B]/90 text-white text-[9.5px] font-medium px-2 py-0.5 rounded-md">
              🌐 {activeLang.toUpperCase()} Translation pending
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] text-[#8A5A12] font-semibold">
            {item.category?.name && <span>{item.category.name}</span>}
            {item.category?.name && item.tags?.length > 0 && <span>•</span>}
            {item.tags?.[0]?.name && <span>#{item.tags[0].name}</span>}
          </div>

          <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-lg font-bold text-[#241631] group-hover:text-[#9E2B2B] transition-colors leading-snug line-clamp-2 m-0">
            {trans.title}
          </h3>

          <p className="text-xs text-[#6E6074] leading-relaxed line-clamp-2 m-0">
            {trans.short_description || 'Read the complete sacred verses, mantras, vidhi and spiritual explanation.'}
          </p>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="px-4 pb-4 pt-2 border-t border-[#F0E5CF] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#A28FA6]">
          {item.available_languages?.map(l => (
            <span key={l} className="px-1.5 py-0.5 rounded-sm bg-[#F6E7CE] text-[#8A5A12] font-bold text-[9px] uppercase">
              {l}
            </span>
          ))}
        </div>

        <span className="font-semibold text-[#E8862B] group-hover:text-[#D8791F] flex items-center gap-1">
          <span>{getTranslation('readNow', activeLang)}</span>
          <span className="text-sm transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </div>
  );
}
