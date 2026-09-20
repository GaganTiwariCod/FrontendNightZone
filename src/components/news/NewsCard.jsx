import React from 'react';
import { 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  Clock, 
  Share2, 
  Globe
} from 'lucide-react';

const CATEGORY_FALLBACK_IMAGES = {
  dharmik: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&auto=format&fit=crop&q=80',
  astrology: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800&auto=format&fit=crop&q=80',
  rashifal: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
  panchang: 'https://images.unsplash.com/photo-1609137144822-4467005c2199?w=800&auto=format&fit=crop&q=80',
  temple: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
  festival: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=800&auto=format&fit=crop&q=80',
  pooja: 'https://images.unsplash.com/photo-1609137144822-4467005c2199?w=800&auto=format&fit=crop&q=80',
  aarti: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&auto=format&fit=crop&q=80',
  gods: 'https://images.unsplash.com/photo-1567591974584-f1832d949213?w=800&auto=format&fit=crop&q=80',
  mantra: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  vastu: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  spiritual: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80',
  'local-events': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
};

const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function NewsCard({ article, onSelectArticle }) {
  if (!article) return null;

  const categorySlug = article.category?.slug || 'dharmik';
  const displayImage = article.image_url || CATEGORY_FALLBACK_IMAGES[categorySlug] || CATEGORY_FALLBACK_IMAGES.dharmik;

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.origin + `/local-updates/${article.slug}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/local-updates/${article.slug}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      onClick={() => onSelectArticle && onSelectArticle(article)}
      className="group bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col cursor-pointer backdrop-blur-md"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950">
        <img 
          src={displayImage} 
          alt={article.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = CATEGORY_FALLBACK_IMAGES.dharmik;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {article.is_breaking && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1 shadow-md animate-pulse">
                <Flame className="w-3 h-3" /> BREAKING
              </span>
            )}
            {article.is_featured && !article.is_breaking && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" /> FEATURED
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-900/90 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              {article.category?.name || 'Dharmik'}
            </span>
          </div>

          <button 
            onClick={handleShare}
            className="p-1.5 rounded-full bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-700/50 backdrop-blur-md"
            title="Share article"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Location & Time Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-stone-300 font-medium">
          <div className="flex items-center gap-2">
            {article.location && (
              <span className="flex items-center gap-1 text-amber-400">
                <MapPin className="w-3 h-3" /> {article.location}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-stone-400">
            <Clock className="w-3 h-3" /> {getRelativeTime(article.published_at)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug mb-2">
            {article.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 line-clamp-3 leading-relaxed mb-4">
            {article.summary || article.content_excerpt}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-400 truncate max-w-[55%]">
            <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{article.source?.name || article.author || 'Dharmik News'}</span>
          </div>

          <a 
            href={article.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors py-1 px-2 rounded-lg hover:bg-amber-500/10"
          >
            Original <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
