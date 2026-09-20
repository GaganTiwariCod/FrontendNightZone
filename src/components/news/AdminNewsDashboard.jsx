import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { newsApi } from '../../api/newsApi';
import { 
  Layers, 
  Rss, 
  Key, 
  FolderTree, 
  History, 
  CheckCircle2, 
  XCircle, 
  Archive, 
  Plus, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Flame, 
  Sparkles, 
  Search, 
  Filter, 
  ShieldCheck, 
  ArrowLeft,
  AlertTriangle,
  Play,
  Clock,
  Eye,
  Check
} from 'lucide-react';

export default function AdminNewsDashboard({ onBack }) {
  const { user, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'news' | 'sources' | 'keywords' | 'categories' | 'logs'
  const [overview, setOverview] = useState(null);
  
  // News state
  const [newsList, setNewsList] = useState([]);
  const [newsStatusFilter, setNewsStatusFilter] = useState('all');
  const [newsSearch, setNewsSearch] = useState('');
  const [newsPage, setNewsPage] = useState(1);
  const [newsPagination, setNewsPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [editingArticle, setEditingArticle] = useState(null);

  // Sources state
  const [sources, setSources] = useState([]);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [sourceForm, setSourceForm] = useState({
    name: '',
    source_type: 'rss',
    base_url: '',
    feed_url: '',
    language: 'en',
    country: 'India',
    location: '',
    fetch_interval_minutes: 60,
    is_active: true
  });
  const [fetchingSourceId, setFetchingSourceId] = useState(null);

  // Keywords state
  const [keywords, setKeywords] = useState([]);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [keywordForm, setKeywordForm] = useState({
    keyword: '',
    language: 'en',
    category_id: '',
    weight: 10,
    match_title: true,
    match_description: true,
    match_content: true,
    is_active: true
  });

  // Categories state
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Sparkles',
    sort_order: 0,
    is_active: true
  });

  // Logs state
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(false);

  // Load active tab data
  useEffect(() => {
    loadData();
  }, [activeTab, newsStatusFilter, newsPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await newsApi.getAdminOverview();
        if (res.success) setOverview(res.data);
      } else if (activeTab === 'news') {
        const params = {
          page: newsPage,
          limit: 20,
          status: newsStatusFilter !== 'all' ? newsStatusFilter : undefined,
          search: newsSearch.trim() || undefined
        };
        const res = await newsApi.getAdminNews(params);
        if (res.success) {
          setNewsList(res.data);
          setNewsPagination(res.pagination);
        }
      } else if (activeTab === 'sources') {
        const res = await newsApi.getAdminSources();
        if (res.success) setSources(res.data);
      } else if (activeTab === 'keywords') {
        const [kwRes, catRes] = await Promise.all([
          newsApi.getAdminKeywords(),
          newsApi.getAdminCategories()
        ]);
        if (kwRes.success) setKeywords(kwRes.data);
        if (catRes.success) setCategories(catRes.data);
      } else if (activeTab === 'categories') {
        const res = await newsApi.getAdminCategories();
        if (res.success) setCategories(res.data);
      } else if (activeTab === 'logs') {
        const res = await newsApi.getFetchLogs();
        if (res.success) setLogs(res.data);
      }
    } catch (err) {
      console.error('Error loading admin news data:', err);
      showToast('Failed to load data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Status update
  const handleStatusChange = async (articleId, newStatus) => {
    try {
      const res = await newsApi.updateNewsStatus(articleId, newStatus);
      if (res.success) {
        showToast(`Article status updated to ${newStatus}.`, 'success');
        setNewsList(prev => prev.map(n => n.id === articleId ? { ...n, status: newStatus } : n));
      } else {
        showToast(res.message || 'Failed to update status.', 'error');
      }
    } catch (err) {
      showToast('Error updating status.', 'error');
    }
  };

  // Toggle breaking / featured
  const handleToggleFlag = async (article, field) => {
    try {
      const newVal = !article[field];
      const res = await newsApi.updateNewsDetails(article.id, { [field]: newVal });
      if (res.success) {
        showToast(`${field === 'is_breaking' ? 'Breaking news' : 'Featured flag'} updated.`, 'success');
        setNewsList(prev => prev.map(n => n.id === article.id ? { ...n, [field]: newVal } : n));
      }
    } catch (err) {
      showToast('Error updating flags.', 'error');
    }
  };

  // Manual Source Fetch Trigger ("Fetch Now")
  const handleTriggerFetch = async (sourceId) => {
    setFetchingSourceId(sourceId);
    try {
      const res = await newsApi.triggerSourceFetch(sourceId);
      if (res.success && res.stats) {
        showToast(`Fetch completed! Found: ${res.stats.articlesFound}, Added: ${res.stats.articlesAdded}, Duplicates: ${res.stats.duplicatesFound}`, 'success');
        loadData();
      } else {
        showToast(res.message || 'Fetch failed.', 'error');
      }
    } catch (err) {
      showToast('Network error triggering crawl.', 'error');
    } finally {
      setFetchingSourceId(null);
    }
  };

  // Save Source
  const handleSaveSource = async (e) => {
    e.preventDefault();
    try {
      const res = await newsApi.createSource(sourceForm);
      if (res.success) {
        showToast('Source added successfully!', 'success');
        setShowSourceModal(false);
        setSourceForm({
          name: '',
          source_type: 'rss',
          base_url: '',
          feed_url: '',
          language: 'en',
          country: 'India',
          location: '',
          fetch_interval_minutes: 60,
          is_active: true
        });
        loadData();
      } else {
        showToast(res.message || 'Failed to add source.', 'error');
      }
    } catch (err) {
      showToast('Error creating source.', 'error');
    }
  };

  // Save Keyword
  const handleSaveKeyword = async (e) => {
    e.preventDefault();
    try {
      const res = await newsApi.createKeyword(keywordForm);
      if (res.success) {
        showToast('Keyword registered successfully!', 'success');
        setShowKeywordModal(false);
        setKeywordForm({
          keyword: '',
          language: 'en',
          category_id: '',
          weight: 10,
          match_title: true,
          match_description: true,
          match_content: true,
          is_active: true
        });
        loadData();
      } else {
        showToast(res.message || 'Failed to add keyword.', 'error');
      }
    } catch (err) {
      showToast('Error creating keyword.', 'error');
    }
  };

  // Delete Keyword
  const handleDeleteKeyword = async (id) => {
    if (!window.confirm('Are you sure you want to delete this keyword?')) return;
    try {
      const res = await newsApi.deleteKeyword(id);
      if (res.success) {
        showToast('Keyword removed.', 'info');
        setKeywords(prev => prev.filter(k => k.id !== id));
      }
    } catch (err) {
      showToast('Error deleting keyword.', 'error');
    }
  };

  // Save Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await newsApi.createCategory(categoryForm);
      if (res.success) {
        showToast('Category created successfully!', 'success');
        setShowCategoryModal(false);
        setCategoryForm({
          name: '',
          slug: '',
          description: '',
          icon: 'Sparkles',
          sort_order: 0,
          is_active: true
        });
        loadData();
      } else {
        showToast(res.message || 'Failed to create category.', 'error');
      }
    } catch (err) {
      showToast('Error creating category.', 'error');
    }
  };

  // Save Article Details Edit
  const handleSaveArticleEdit = async (e) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      const res = await newsApi.updateNewsDetails(editingArticle.id, editingArticle);
      if (res.success) {
        showToast('Article updated successfully!', 'success');
        setEditingArticle(null);
        loadData();
      } else {
        showToast(res.message || 'Failed to save article.', 'error');
      }
    } catch (err) {
      showToast('Error updating article.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* Top Header */}
      <div className="bg-stone-900/90 border-b border-stone-800 px-4 sm:px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">Local Updates & News Admin</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Moderation
                </span>
              </div>
              <p className="text-xs text-stone-400">RSS Ingestion, Keyword Classification & Review Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto mt-4 pt-2 border-t border-stone-800/80 scrollbar-none">
          {[
            { key: 'overview', label: 'Overview', icon: Layers },
            { key: 'news', label: 'News Moderation', icon: CheckCircle2 },
            { key: 'sources', label: 'News Sources', icon: Rss },
            { key: 'keywords', label: 'Keywords & Rules', icon: Key },
            { key: 'categories', label: 'Categories', icon: FolderTree },
            { key: 'logs', label: 'Fetch Logs', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* ========================================== */}
        {/* 1. OVERVIEW TAB */}
        {/* ========================================== */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total News', value: overview.totalNews, color: 'text-white' },
                { label: "Today's News", value: overview.todayNews, color: 'text-amber-400' },
                { label: 'Pending Review', value: overview.pendingNews, color: 'text-yellow-400' },
                { label: 'Published', value: overview.publishedNews, color: 'text-emerald-400' },
                { label: 'Rejected', value: overview.rejectedNews, color: 'text-rose-400' },
                { label: 'Active Sources', value: `${overview.activeSources} / ${overview.totalSources}`, color: 'text-cyan-400' }
              ].map((card, idx) => (
                <div key={idx} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4">
                  <div className="text-xs text-stone-400 mb-1">{card.label}</div>
                  <div className={`text-2xl font-black ${card.color}`}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions Panel */}
              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setActiveTab('news'); setNewsStatusFilter('pending'); }}
                    className="p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-left transition-all"
                  >
                    <div className="text-amber-400 font-bold text-sm mb-1">Review Pending News</div>
                    <div className="text-xs text-stone-400">{overview.pendingNews} awaiting moderation</div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('sources'); setShowSourceModal(true); }}
                    className="p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 text-left transition-all"
                  >
                    <div className="text-amber-400 font-bold text-sm mb-1">Add RSS Source</div>
                    <div className="text-xs text-stone-400">Configure new RSS / Scraper feed</div>
                  </button>
                </div>
              </div>

              {/* Recent Crawl Logs */}
              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-white">Recent Crawl Activity</h3>
                  <button onClick={() => setActiveTab('logs')} className="text-xs text-amber-400 hover:underline">
                    View All Logs
                  </button>
                </div>

                <div className="space-y-3">
                  {overview.recentLogs?.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-stone-200">{log.source?.name || 'Automated Worker'}</div>
                        <div className="text-[11px] text-stone-500">
                          {new Date(log.created_at).toLocaleTimeString()} · Found: {log.articles_found} · Added: {log.articles_added}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 2. NEWS MODERATION TAB */}
        {/* ========================================== */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['all', 'pending', 'published', 'rejected', 'archived'].map(st => (
                  <button
                    key={st}
                    onClick={() => { setNewsStatusFilter(st); setNewsPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      newsStatusFilter === st
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadData()}
                  className="bg-stone-950 text-xs text-white px-3 py-2 rounded-xl border border-stone-800 focus:outline-none focus:border-amber-500 w-48 sm:w-64"
                />
                <button
                  onClick={loadData}
                  className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-4">Article</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Flags</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {newsList.map(art => (
                      <tr key={art.id} className="hover:bg-stone-800/30 transition-colors">
                        <td className="p-4 max-w-xs">
                          <div className="font-bold text-white line-clamp-2">{art.title}</div>
                          <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{art.summary}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-950 text-amber-400 border border-stone-800">
                            {art.category?.name || 'General'}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 font-bold text-amber-400">
                            <Sparkles className="w-3.5 h-3.5" /> {art.relevance_score}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {art.keywordMatches?.length || 0} keywords matched
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap text-stone-400">
                          {art.source?.name || 'Direct'}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            art.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                            art.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                            art.status === 'archived' ? 'bg-stone-500/20 text-stone-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {art.status}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleFlag(art, 'is_breaking')}
                              className={`p-1 rounded-lg border text-[10px] flex items-center gap-0.5 ${
                                art.is_breaking ? 'bg-rose-600 text-white border-rose-500' : 'bg-stone-950 text-stone-500 border-stone-800'
                              }`}
                              title="Toggle Breaking"
                            >
                              <Flame className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleToggleFlag(art, 'is_featured')}
                              className={`p-1 rounded-lg border text-[10px] flex items-center gap-0.5 ${
                                art.is_featured ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold' : 'bg-stone-950 text-stone-500 border-stone-800'
                              }`}
                              title="Toggle Featured"
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {art.status !== 'published' && (
                              <button
                                onClick={() => handleStatusChange(art.id, 'published')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                              >
                                Publish
                              </button>
                            )}
                            {art.status !== 'rejected' && (
                              <button
                                onClick={() => handleStatusChange(art.id, 'rejected')}
                                className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-bold"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => setEditingArticle(art)}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                              title="Edit Article"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={art.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400"
                              title="Open Original"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 3. SOURCES MANAGEMENT TAB */}
        {/* ========================================== */}
        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Configured News Sources</h2>
                <p className="text-xs text-stone-400">Manage RSS feeds, frequency, and trigger on-demand crawls.</p>
              </div>
              <button
                onClick={() => setShowSourceModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> Add Source
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sources.map(src => (
                <div key={src.id} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-base">{src.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        src.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-500'
                      }`}>
                        {src.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="text-xs text-stone-400 mb-3 break-all">
                      <span className="text-stone-500">Feed URL: </span> {src.feed_url || src.base_url}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-400 mb-4 bg-stone-950/60 p-3 rounded-xl">
                      <div>Type: <span className="font-bold text-stone-200 uppercase">{src.source_type}</span></div>
                      <div>Language: <span className="font-bold text-stone-200 uppercase">{src.language}</span></div>
                      <div>Interval: <span className="font-bold text-stone-200">{src.fetch_interval_minutes}m</span></div>
                      <div>Articles Fetched: <span className="font-bold text-amber-400">{src.total_articles_fetched}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs">
                    <div className="text-stone-500 text-[11px]">
                      Last fetched: {src.last_fetched_at ? new Date(src.last_fetched_at).toLocaleTimeString() : 'Never'}
                    </div>

                    <button
                      onClick={() => handleTriggerFetch(src.id)}
                      disabled={fetchingSourceId === src.id}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 font-bold transition-all flex items-center gap-1.5"
                    >
                      <Play className={`w-3 h-3 ${fetchingSourceId === src.id ? 'animate-spin' : ''}`} />
                      {fetchingSourceId === src.id ? 'Fetching...' : 'Fetch Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 4. KEYWORDS MANAGEMENT TAB */}
        {/* ========================================== */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Keyword Classification Engine</h2>
                <p className="text-xs text-stone-400">Define weighted multilingual keywords to automatically assign categories.</p>
              </div>
              <button
                onClick={() => setShowKeywordModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Keyword
              </button>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-4">Keyword</th>
                      <th className="p-4">Language</th>
                      <th className="p-4">Mapped Category</th>
                      <th className="p-4">Weight</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {keywords.map(kw => (
                      <tr key={kw.id} className="hover:bg-stone-800/30">
                        <td className="p-4 font-bold text-white">{kw.keyword}</td>
                        <td className="p-4 uppercase">{kw.language}</td>
                        <td className="p-4 text-amber-400 font-semibold">{kw.category?.name || 'General'}</td>
                        <td className="p-4 font-bold text-white">{kw.weight}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteKeyword(kw.id)}
                            className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 5. CATEGORIES MANAGEMENT TAB */}
        {/* ========================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Database-Driven Categories</h2>
                <p className="text-xs text-stone-400">Dynamic categories mapped to news classification.</p>
              </div>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4">
                  <div className="font-bold text-white text-base mb-1">{cat.name}</div>
                  <div className="text-xs text-amber-400 font-mono mb-2">/{cat.slug}</div>
                  <div className="text-xs text-stone-400 line-clamp-2">{cat.description || 'No description provided.'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 6. FETCH LOGS TAB */}
        {/* ========================================== */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Crawl & Ingestion Logs</h2>
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-4">Source</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Found</th>
                      <th className="p-4">Added</th>
                      <th className="p-4">Duplicates</th>
                      <th className="p-4">Errors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {logs.map(log => (
                      <tr key={log.id}>
                        <td className="p-4 font-bold text-white">{log.source?.name || 'General Worker'}</td>
                        <td className="p-4 text-stone-400">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4">{log.articles_found}</td>
                        <td className="p-4 text-emerald-400 font-bold">{log.articles_added}</td>
                        <td className="p-4 text-yellow-400">{log.duplicates_found}</td>
                        <td className="p-4 text-rose-400">{log.errors_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL: ADD SOURCE */}
      {/* ========================================== */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold text-white mb-4">Add News Source</h3>
            <form onSubmit={handleSaveSource} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Source Name *</label>
                <input
                  type="text"
                  required
                  value={sourceForm.name}
                  onChange={e => setSourceForm({ ...sourceForm, name: e.target.value })}
                  placeholder="e.g. Sanatan Dharma News RSS"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">RSS Feed URL *</label>
                <input
                  type="url"
                  required
                  value={sourceForm.feed_url}
                  onChange={e => setSourceForm({ ...sourceForm, feed_url: e.target.value, base_url: e.target.value })}
                  placeholder="https://example.com/rss.xml"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Language</label>
                  <select
                    value={sourceForm.language}
                    onChange={e => setSourceForm({ ...sourceForm, language: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Interval (Minutes)</label>
                  <input
                    type="number"
                    value={sourceForm.fetch_interval_minutes}
                    onChange={e => setSourceForm({ ...sourceForm, fetch_interval_minutes: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowSourceModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold uppercase tracking-wider"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD KEYWORD */}
      {/* ========================================== */}
      {showKeywordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold text-white mb-4">Add Classification Keyword</h3>
            <form onSubmit={handleSaveKeyword} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Keyword / Phrase (English, Hindi, Marathi) *</label>
                <input
                  type="text"
                  required
                  value={keywordForm.keyword}
                  onChange={e => setKeywordForm({ ...keywordForm, keyword: e.target.value })}
                  placeholder="e.g. हनुमान or Aarti or Ekadashi"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Language</label>
                  <select
                    value={keywordForm.language}
                    onChange={e => setKeywordForm({ ...keywordForm, language: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Mapped Category</label>
                  <select
                    value={keywordForm.category_id}
                    onChange={e => setKeywordForm({ ...keywordForm, category_id: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Weight Score (Default 10)</label>
                <input
                  type="number"
                  value={keywordForm.weight}
                  onChange={e => setKeywordForm({ ...keywordForm, weight: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowKeywordModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold uppercase tracking-wider"
                >
                  Save Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDIT ARTICLE */}
      {/* ========================================== */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-2xl w-full my-8">
            <h3 className="text-lg font-bold text-white mb-4">Edit Article Metadata</h3>
            <form onSubmit={handleSaveArticleEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Summary / Excerpt</label>
                <textarea
                  rows={3}
                  value={editingArticle.summary || ''}
                  onChange={e => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingArticle.image_url || ''}
                  onChange={e => setEditingArticle({ ...editingArticle, image_url: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Status</label>
                  <select
                    value={editingArticle.status}
                    onChange={e => setEditingArticle({ ...editingArticle, status: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingArticle.location || ''}
                    onChange={e => setEditingArticle({ ...editingArticle, location: e.target.value })}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
