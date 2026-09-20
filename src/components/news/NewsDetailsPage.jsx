import React, { useState, useEffect } from 'react';
import { newsApi } from '../../api/newsApi';
import NewsCard from './NewsCard';
import { 
  ArrowLeft, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Clock, 
  Globe, 
  Share2, 
  Flame, 
  Sparkles, 
  Tag, 
  Bookmark,
  ShieldCheck,
  Eye
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

export default function NewsDetailsPage({ articleSlug, onBack, onSelectArticle }) {
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleSlug) return;
    const loadDetails = async () => {
      setLoading(true);
      try {
        const [detailRes, relatedRes] = await Promise.all([
          newsApi.getNewsBySlug(articleSlug),
          newsApi.getRelatedNews(articleSlug)
        ]);

        if (detailRes.success && detailRes.data) {
          setArticle(detailRes.data);
        }
        if (relatedRes.success && relatedRes.data) {
          setRelated(relatedRes.data);
        }
      } catch (err) {
        console.error('Error loading article detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [articleSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-400 text-sm">Loading article updates...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-stone-400 mb-6">The requested update could not be located or has been archived.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm"
        >
          Back to Local Updates
        </button>
      </div>
    );
  }

  const categorySlug = article.category?.slug || 'dharmik';
  const displayImage = article.image_url || CATEGORY_FALLBACK_IMAGES[categorySlug] || CATEGORY_FALLBACK_IMAGES.dharmik;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      {/* Top Bar Navigation */}
      <div className="bg-stone-900/90 border-b border-stone-800 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-stone-300 hover:text-amber-400 font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Local Updates
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Article Metadata Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {article.is_breaking && (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1 shadow-md animate-pulse">
                <Flame className="w-3.5 h-3.5" /> Breaking News
              </span>
            )}
            {article.is_featured && !article.is_breaking && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-stone-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Featured
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-900 text-amber-400 border border-amber-500/40">
              {article.category?.name || 'Dharmik'}
            </span>
            {article.location && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-900 text-stone-300 border border-stone-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> {article.location}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-400 pb-4 border-b border-stone-800">
            <span className="flex items-center gap-1 text-stone-300">
              <Globe className="w-4 h-4 text-amber-500" /> Source: {article.source?.name || article.author || 'Dharmik News'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-stone-500" /> {new Date(article.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            {article.view_count > 0 && (
              <span className="flex items-center gap-1 text-stone-500">
                <Eye className="w-4 h-4" /> {article.view_count} views
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden mb-8 border border-stone-800 shadow-2xl bg-stone-950 aspect-[16/9] w-full">
          <img 
            src={displayImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Excerpt / Summary Content Box */}
        <div className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-md">
          <div className="prose prose-invert max-w-none">
            {article.summary && (
              <p className="text-base sm:text-lg text-amber-100/90 font-medium leading-relaxed mb-4">
                {article.summary}
              </p>
            )}

            {article.content_excerpt && article.content_excerpt !== article.summary && (
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed whitespace-pre-line">
                {article.content_excerpt}
              </p>
            )}
          </div>

          {/* Legal / Publisher CTA Banner */}
          <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-950/60 p-5 rounded-2xl border border-stone-800/80">
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                Read Full Story on {article.source?.name || 'Publisher'}
              </h4>
              <p className="text-xs text-stone-400">
                Shubhkaal indexes spiritual updates. To read the complete original article, visit the publisher site.
              </p>
            </div>

            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20 whitespace-nowrap transition-all"
            >
              Read Original Article <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Matched Keywords Section */}
        {article.keywordMatches && article.keywordMatches.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-500" /> Related Keywords & Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.keywordMatches.map((m) => (
                <span 
                  key={m.id}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-stone-900 text-stone-300 border border-stone-800"
                >
                  #{m.matched_text || m.keyword?.keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related News Updates */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-800">
              <h3 className="text-xl font-bold text-white">Related Updates</h3>
              <button 
                onClick={onBack}
                className="text-xs font-semibold text-amber-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((relItem) => (
                <NewsCard
                  key={relItem.id}
                  article={relItem}
                  onSelectArticle={onSelectArticle}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
