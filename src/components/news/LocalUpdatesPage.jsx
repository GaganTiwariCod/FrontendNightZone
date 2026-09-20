import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { newsApi } from '../../api/newsApi';
import NewsCard from './NewsCard';
import { 
  Sparkles, 
  Search, 
  Filter, 
  MapPin, 
  Globe2, 
  Flame, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Layers,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function LocalUpdatesPage({ onSelectArticle, onBack }) {
  const { setCurrentScreen } = useAuth();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('freshness');
  
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Categories & Featured
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [catRes, featRes, latRes] = await Promise.all([
          newsApi.getCategories(),
          newsApi.getFeaturedNews(),
          newsApi.getLatestNews()
        ]);

        if (catRes.success) setCategories(catRes.data || []);
        if (featRes.success) setFeaturedArticles(featRes.data || []);
        if (latRes.success) setLatestArticles(latRes.data || []);
      } catch (err) {
        console.error('Error initializing news page:', err);
      } finally {
        setFeaturedLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load Paginated News Feed
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: debouncedSearch.trim() || undefined,
          language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
          location: selectedLocation !== 'all' ? selectedLocation : undefined,
          sort: sortBy
        };

        const res = await newsApi.getPublicNews(params);
        if (res.success && res.data) {
          setArticles(res.data);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        console.error('Error loading news feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [selectedCategory, debouncedSearch, selectedLanguage, selectedLocation, sortBy, page]);

  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug);
    setPage(1);
  };

  const breakingNews = latestArticles.filter(a => a.is_breaking);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-gradient-to-r from-rose-900/90 via-red-800/90 to-rose-900/90 border-b border-rose-700/50 py-2.5 px-4 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-hidden text-xs sm:text-sm">
            <span className="bg-rose-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md shrink-0">
              <Flame className="w-3.5 h-3.5 animate-pulse" /> Breaking
            </span>
            <div className="truncate text-rose-100 font-medium flex-1 cursor-pointer hover:underline" onClick={() => onSelectArticle(breakingNews[0])}>
              {breakingNews[0].title}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 pt-6 pb-8 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Back Navigation Bar */}
          {onBack && (
            <div className="flex items-center justify-start mb-4">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-white bg-stone-900/80 border border-stone-700/60 px-3.5 py-1.5 rounded-full hover:border-amber-500/60 transition-all cursor-pointer shadow-xs"
              >
                <span>←</span>
                <span>Back to Home</span>
              </button>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Sanatan Dharma & Cosmic Updates
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Local Updates
          </h1>
          <p className="text-stone-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Dharmik, Astrology & Spiritual Updates, Mandir Darshan Timings, Tithi Panchang, and Sacred Festival Insights.
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-stone-900/90 border border-stone-700/80 focus-within:border-amber-500/80 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden transition-all">
              <Search className="w-5 h-5 text-stone-400 ml-4 shrink-0" />
              <input 
                type="text"
                placeholder="Search Mandir, Hanuman Aarti, Horoscope, Ekadashi, Vastu (English, हिन्दी, मराठी)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-3.5 text-sm sm:text-base text-white placeholder-stone-500 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mr-3 px-2 py-1 text-xs text-stone-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Dynamic Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-stone-800/80 mb-6">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md shadow-orange-500/20'
                : 'bg-stone-900/80 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" /> All Updates
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md shadow-orange-500/20'
                    : 'bg-stone-900/80 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-stone-900/50 p-3 rounded-xl border border-stone-800/60 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2">
            {/* Language filter */}
            <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1.5 rounded-lg border border-stone-800">
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => { setSelectedLanguage(e.target.value); setPage(1); }}
                className="bg-transparent text-stone-300 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-stone-900 text-white">All Languages</option>
                <option value="en" className="bg-stone-900 text-white">English</option>
                <option value="hi" className="bg-stone-900 text-white">हिन्दी (Hindi)</option>
                <option value="mr" className="bg-stone-900 text-white">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Location filter */}
            <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1.5 rounded-lg border border-stone-800">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedLocation}
                onChange={(e) => { setSelectedLocation(e.target.value); setPage(1); }}
                className="bg-transparent text-stone-300 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-stone-900 text-white">All Locations</option>
                <option value="Mumbai" className="bg-stone-900 text-white">Mumbai</option>
                <option value="Pune" className="bg-stone-900 text-white">Pune</option>
                <option value="Varanasi" className="bg-stone-900 text-white">Varanasi</option>
                <option value="Ayodhya" className="bg-stone-900 text-white">Ayodhya</option>
                <option value="India" className="bg-stone-900 text-white">All India</option>
              </select>
            </div>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="bg-stone-950 text-stone-300 px-2.5 py-1.5 rounded-lg border border-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="freshness" className="bg-stone-900 text-white">Fresh & Relevant</option>
              <option value="latest" className="bg-stone-900 text-white">Most Recent</option>
              <option value="popular" className="bg-stone-900 text-white">Most Viewed</option>
              <option value="relevance" className="bg-stone-900 text-white">Relevance Score</option>
            </select>
          </div>
        </div>

        {/* Featured Hero Grid (Only on page 1 when no search is active) */}
        {page === 1 && !debouncedSearch && selectedCategory === 'all' && featuredArticles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Featured Highlights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.slice(0, 2).map((feat) => (
                <NewsCard key={feat.id} article={feat} onSelectArticle={onSelectArticle} />
              ))}
            </div>
          </div>
        )}

        {/* Main Feed Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {selectedCategory === 'all' ? 'Latest Local & Dharmik Updates' : `${categories.find(c => c.slug === selectedCategory)?.name || 'Updates'}`}
            <span className="text-xs font-medium text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              {pagination.total} articles
            </span>
          </h2>
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 animate-pulse">
                <div className="aspect-[16/9] bg-stone-800 rounded-xl mb-4" />
                <div className="h-4 bg-stone-800 rounded w-1/3 mb-2" />
                <div className="h-5 bg-stone-800 rounded w-4/5 mb-3" />
                <div className="h-3 bg-stone-800 rounded w-full mb-1" />
                <div className="h-3 bg-stone-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-stone-900/40 border border-stone-800 rounded-2xl p-8">
            <AlertCircle className="w-12 h-12 text-stone-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No updates found</h3>
            <p className="text-sm text-stone-400 max-w-md mx-auto mb-4">
              We couldn't find any articles matching your search or filters. Try adjusting your query or category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedLanguage('all');
                setSelectedLocation('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* News Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard 
                key={article.id} 
                article={article} 
                onSelectArticle={onSelectArticle} 
              />
            ))}
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs font-semibold text-stone-300">
              <span>Page {pagination.page} of {pagination.totalPages}</span>
            </div>

            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
