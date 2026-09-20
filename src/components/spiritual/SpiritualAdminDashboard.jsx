import React, { useState, useEffect } from 'react';
import { spiritualApi } from '../../api/spiritualApi';
import { useAuth } from '../../context/AuthContext';

export default function SpiritualAdminDashboard({ onBack }) {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState({ totalContent: 0, published: 0, drafts: 0, archived: 0, requests: 0 });
  const [contents, setContents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  
  // Active Tab: 'contents' | 'requests'
  const [activeTab, setActiveTab] = useState('contents');
  
  // Masters
  const [types, setTypes] = useState([]);
  const [deities, setDeities] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Content Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Content Form Modal State
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState(null);
  const [formActiveLang, setFormActiveLang] = useState('hi');
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [formCommon, setFormCommon] = useState({
    type_id: '',
    deity_id: '',
    category_id: '',
    image_url: '',
    is_featured: false,
    sort_order: 0,
    status: 'PUBLISHED',
    tags: '',
    // Type specific
    samagri: '',
    sacred_verse_sanskrit: '',
    ideal_time: '',
    benefits: ''
  });

  const [formTranslations, setFormTranslations] = useState({
    hi: { title: '', slug: '', short_description: '', content: '', meta_title: '', meta_description: '' },
    mr: { title: '', slug: '', short_description: '', content: '', meta_title: '', meta_description: '' },
    en: { title: '', slug: '', short_description: '', content: '', meta_title: '', meta_description: '' }
  });

  const [coverUploading, setCoverUploading] = useState(false);

  // 1. Fetch Stats & Masters
  const loadInitialData = async () => {
    try {
      const [statsRes, mastersRes] = await Promise.all([
        spiritualApi.adminGetDashboardStats(),
        spiritualApi.getMasters()
      ]);
      if (statsRes?.data) setStats(statsRes.data);
      if (mastersRes?.data) {
        setTypes(mastersRes.data.types || []);
        setDeities(mastersRes.data.deities || []);
        setCategories(mastersRes.data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching admin stats', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // 2. Load Contents
  const loadContents = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type_id: typeFilter || undefined,
        search: searchTerm || undefined
      };
      const res = await spiritualApi.adminGetContents(params);
      if (res?.data) {
        setContents(res.data.contents || []);
        setPagination(res.data.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 });
      }
    } catch (err) {
      showToast('Could not fetch contents table.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Load Requests
  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await spiritualApi.adminGetRequests({ status: 'all' });
      if (res?.data) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      showToast('Could not fetch content requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'contents') {
      loadContents(1);
    } else {
      loadRequests();
    }
  }, [activeTab, statusFilter, typeFilter, searchTerm]);

  // Open Add Content Modal
  const handleOpenAddModal = (prefillData = null) => {
    setEditingContentId(null);
    setFormActiveLang('hi');
    setFormCommon({
      type_id: prefillData?.type_id || (types[0]?.id || ''),
      deity_id: prefillData?.deity_id || '',
      category_id: prefillData?.category_id || '',
      image_url: prefillData?.image_url || '',
      is_featured: false,
      sort_order: 0,
      status: 'PUBLISHED',
      tags: prefillData?.tags || '',
      samagri: '',
      sacred_verse_sanskrit: '',
      ideal_time: '',
      benefits: ''
    });

    setFormTranslations({
      hi: {
        title: prefillData?.title || '',
        slug: '',
        short_description: prefillData?.description || '',
        content: '',
        meta_title: '',
        meta_description: ''
      },
      mr: { title: '', slug: '', short_description: '', content: '', meta_title: '', meta_description: '' },
      en: { title: '', slug: '', short_description: '', content: '', meta_title: '', meta_description: '' }
    });

    setContentModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = async (id) => {
    setActionLoading(true);
    try {
      const res = await spiritualApi.adminGetContentDetail(id);
      if (res?.data?.content) {
        const item = res.data.content;
        setEditingContentId(item.id);
        const typeData = item.type_specific_data || {};

        setFormCommon({
          type_id: item.type_id || '',
          deity_id: item.deity_id || '',
          category_id: item.category_id || '',
          image_url: item.image_url || '',
          is_featured: item.is_featured || false,
          sort_order: item.sort_order || 0,
          status: item.status || 'PUBLISHED',
          tags: (item.tags || []).map(t => t.name).join(', '),
          samagri: typeData.samagri || '',
          sacred_verse_sanskrit: typeData.sacred_verse_sanskrit || '',
          ideal_time: typeData.ideal_time || '',
          benefits: typeData.benefits || ''
        });

        const newTrans = {
          hi: { title: '', slug: '', short_description: '', content: '', meta_title: '', meta_description: '' },
          mr: { title: '', slug: '', short_description: '', content: '', meta_title: '', meta_description: '' },
          en: { title: '', slug: '', short_description: '', content: '', meta_title: '', meta_description: '' }
        };

        (item.translations || []).forEach(tr => {
          if (newTrans[tr.language_code]) {
            newTrans[tr.language_code] = {
              title: tr.title || '',
              slug: tr.slug || '',
              short_description: tr.short_description || '',
              content: tr.content || '',
              meta_title: tr.meta_title || '',
              meta_description: tr.meta_description || ''
            };
          }
        });

        setFormTranslations(newTrans);
        setContentModalOpen(true);
      }
    } catch (err) {
      showToast('Could not load content details for editing.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Content (Create or Update)
  const handleSaveContent = async (e) => {
    e.preventDefault();
    if (!formCommon.type_id) {
      showToast('Please select a Content Type.', 'error');
      return;
    }

    const validTranslations = Object.keys(formTranslations)
      .map(langCode => ({
        language_code: langCode,
        ...formTranslations[langCode]
      }))
      .filter(t => t.title.trim() && t.content.trim());

    if (validTranslations.length === 0) {
      showToast('Please provide Title and Content for at least one language (e.g. Hindi).', 'error');
      return;
    }

    const payload = {
      type_id: formCommon.type_id,
      deity_id: formCommon.deity_id || null,
      category_id: formCommon.category_id || null,
      image_url: formCommon.image_url || null,
      is_featured: formCommon.is_featured,
      sort_order: parseInt(formCommon.sort_order, 10) || 0,
      status: formCommon.status,
      type_specific_data: {
        samagri: formCommon.samagri,
        sacred_verse_sanskrit: formCommon.sacred_verse_sanskrit,
        ideal_time: formCommon.ideal_time,
        benefits: formCommon.benefits
      },
      tags: formCommon.tags.split(',').map(s => s.trim()).filter(Boolean),
      translations: validTranslations
    };

    setActionLoading(true);
    try {
      if (editingContentId) {
        await spiritualApi.adminUpdateContent(editingContentId, payload);
        showToast('Spiritual content updated successfully!');
      } else {
        await spiritualApi.adminCreateContent(payload);
        showToast('Spiritual content created and published successfully!');
      }
      setContentModalOpen(false);
      loadContents(pagination.page);
      loadInitialData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save content.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = async (id, newStatus) => {
    try {
      const res = await spiritualApi.adminUpdateStatus(id, newStatus);
      if (res.success) {
        showToast(`Status updated to ${newStatus}`);
        loadContents(pagination.page);
        loadInitialData();
      }
    } catch (err) {
      showToast('Could not update status.', 'error');
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (id) => {
    try {
      const res = await spiritualApi.adminToggleFeatured(id);
      if (res.success) {
        showToast('Featured status updated.');
        loadContents(pagination.page);
      }
    } catch (err) {
      showToast('Could not toggle featured.', 'error');
    }
  };

  // Delete Content
  const handleDeleteContent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will delete all language translations.`)) {
      return;
    }
    try {
      const res = await spiritualApi.adminDeleteContent(id);
      if (res.success) {
        showToast('Content deleted.');
        loadContents(pagination.page);
        loadInitialData();
      }
    } catch (err) {
      showToast('Could not delete content.', 'error');
    }
  };

  // Cover Image Upload Handler
  const handleCoverUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('coverImage', file);
    setCoverUploading(true);
    try {
      const res = await spiritualApi.adminUploadCover(formData);
      if (res?.data?.imageUrl) {
        setFormCommon(prev => ({ ...prev, image_url: res.data.imageUrl }));
        showToast('Cover image uploaded successfully!');
      }
    } catch (err) {
      showToast('Failed to upload image.', 'error');
    } finally {
      setCoverUploading(false);
    }
  };

  // Update Request Status
  const handleUpdateRequestStatus = async (id, newStatus) => {
    try {
      const res = await spiritualApi.adminUpdateRequestStatus(id, { status: newStatus });
      if (res.success) {
        showToast(`Request marked as ${newStatus}`);
        loadRequests();
        loadInitialData();
      }
    } catch (err) {
      showToast('Could not update request status.', 'error');
    }
  };

  if (user?.role?.toUpperCase() !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-3">
        <span className="text-4xl">🚫</span>
        <h2 className="text-lg font-semibold text-[#241631]">Access Denied</h2>
        <p className="text-xs text-[#6E6074]">This CMS requires Administrator privileges.</p>
        <button onClick={onBack} className="bg-[#E8862B] text-[#2A1503] font-semibold px-4 py-2 rounded-xl border-0 cursor-pointer">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-6 space-y-6 text-[#2A2036]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-[#6E6074] hover:text-[#241631] flex items-center gap-1.5 bg-[#F0E5CF] hover:bg-[#E3D6BF] px-3.5 py-1.5 rounded-full border-0 cursor-pointer mb-2"
          >
            ← Back to Spiritual Library
          </button>
          <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl sm:text-3xl font-normal text-[#241631] m-0">
            Dharmik &amp; Spiritual Content CMS
          </h1>
          <p className="text-xs text-[#6E6074] m-0 mt-0.5">
            Admin console for authoring, translating, moderating, and publishing Kathas, Mantras, Pujas &amp; Aartis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAddModal()}
          className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-xs px-4 py-2.5 rounded-xl border-0 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
        >
          <span>➕</span>
          <span>Add Spiritual Content</span>
        </button>
      </div>

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Content', value: stats.totalContent, bg: 'bg-[#FFFCF5]', text: 'text-[#241631]' },
          { label: 'Published', value: stats.published, bg: 'bg-[#EDF4ED]', text: 'text-[#4E6B4F]' },
          { label: 'Drafts', value: stats.drafts, bg: 'bg-[#FFF8EC]', text: 'text-[#8A5A12]' },
          { label: 'Archived', value: stats.archived, bg: 'bg-[#F2E9F3]', text: 'text-[#6B3B70]' },
          { label: 'User Requests', value: stats.requests, bg: 'bg-[#F9E2DC]', text: 'text-[#A33A1E]' }
        ].map((c, i) => (
          <div key={i} className={`${c.bg} border border-[#E3D6BF] rounded-2xl p-4 shadow-xs`}>
            <span className="text-[11px] font-semibold text-[#6E6074] block uppercase">{c.label}</span>
            <span className={`text-2xl font-bold ${c.text} mt-0.5 block`}>{c.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3D6BF] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('contents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-0 cursor-pointer ${
            activeTab === 'contents'
              ? 'bg-[#241631] text-[#F7EEDC] shadow-xs'
              : 'bg-transparent text-[#6E6074] hover:bg-[#F0E5CF]'
          }`}
        >
          📜 All Spiritual Content ({stats.totalContent})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-[#241631] text-[#F7EEDC] shadow-xs'
              : 'bg-transparent text-[#6E6074] hover:bg-[#F0E5CF]'
          }`}
        >
          <span>✍️ User Requests</span>
          {stats.requests > 0 && (
            <span className="bg-[#9E2B2B] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {stats.requests}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ALL CONTENT TABLE */}
      {activeTab === 'contents' && (
        <div className="space-y-4">
          
          {/* Table Toolbar Filters */}
          <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-3 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center flex-wrap gap-2">
              <input
                type="search"
                placeholder="Search title or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-[#E3D6BF] rounded-xl px-3 py-1.5 outline-none w-48 text-xs"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-[#E3D6BF] rounded-xl px-3 py-1.5 outline-none text-xs font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-[#E3D6BF] rounded-xl px-3 py-1.5 outline-none text-xs font-semibold"
              >
                <option value="">All Types</option>
                {types.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <span className="text-xs text-[#6E6074]">
              Showing <b>{contents.length}</b> records
            </span>
          </div>

          {/* Table Container */}
          <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-[#E8862B] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#6E6074]">Loading CMS records...</p>
              </div>
            ) : contents.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#6E6074]">
                No spiritual content records found matching filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F0E5CF] text-[#4A3D52] uppercase font-semibold border-b border-[#E3D6BF]">
                    <tr>
                      <th className="p-3.5 pl-5">Content / Title</th>
                      <th className="p-3.5">Type &amp; Deity</th>
                      <th className="p-3.5">Languages</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Featured</th>
                      <th className="p-3.5 text-right pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E5CF]">
                    {contents.map(item => (
                      <tr key={item.id} className="hover:bg-[#FFF8EC] transition-colors">
                        <td className="p-3.5 pl-5">
                          <b className="text-sm text-[#241631] block line-clamp-1">{item.title}</b>
                          <span className="text-[#8A5A12] text-[11px]">{item.category}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-[#241631] block">{item.type}</span>
                          <span className="text-[#6E6074]">{item.deity}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1">
                            <span className={`px-1.5 py-0.5 rounded-sm font-bold text-[9px] ${item.languages.hi ? 'bg-[#EDF4ED] text-[#4E6B4F]' : 'bg-gray-100 text-gray-400'}`}>HI</span>
                            <span className={`px-1.5 py-0.5 rounded-sm font-bold text-[9px] ${item.languages.mr ? 'bg-[#EDF4ED] text-[#4E6B4F]' : 'bg-gray-100 text-gray-400'}`}>MR</span>
                            <span className={`px-1.5 py-0.5 rounded-sm font-bold text-[9px] ${item.languages.en ? 'bg-[#EDF4ED] text-[#4E6B4F]' : 'bg-gray-100 text-gray-400'}`}>EN</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={item.status}
                            onChange={(e) => handleToggleStatus(item.id, e.target.value)}
                            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] outline-none border cursor-pointer ${
                              item.status === 'PUBLISHED'
                                ? 'bg-[#EDF4ED] text-[#4E6B4F] border-[#BFD4C0]'
                                : item.status === 'ARCHIVED'
                                ? 'bg-[#F2E9F3] text-[#6B3B70] border-[#D8C0DC]'
                                : 'bg-[#FFF8EC] text-[#8A5A12] border-[#E8862B]/40'
                            }`}
                          >
                            <option value="PUBLISHED">Published</option>
                            <option value="DRAFT">Draft</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>
                        </td>
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(item.id)}
                            className="bg-transparent border-0 text-base cursor-pointer hover:scale-125 transition-transform"
                          >
                            {item.is_featured ? '⭐' : '☆'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item.id)}
                              className="bg-[#F0E5CF] hover:bg-[#E3D6BF] text-[#2A2036] font-semibold text-xs px-2.5 py-1 rounded-lg border-0 cursor-pointer transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteContent(item.id, item.title)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-xs px-2.5 py-1 rounded-lg border-0 cursor-pointer transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: USER REQUESTS TABLE */}
      {activeTab === 'requests' && (
        <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#E8862B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#6E6074]">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#6E6074]">
              No user requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F0E5CF] text-[#4A3D52] uppercase font-semibold border-b border-[#E3D6BF]">
                  <tr>
                    <th className="p-3.5 pl-5">Requester</th>
                    <th className="p-3.5">Requested Text</th>
                    <th className="p-3.5">Type &amp; Language</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E5CF]">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-[#FFF8EC] transition-colors">
                      <td className="p-3.5 pl-5">
                        <b className="text-sm text-[#241631] block">{req.name}</b>
                        <span className="text-[#6E6074]">{req.email || req.phone || 'No contact'}</span>
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <b className="text-[#9E2B2B] block">{req.requested_title}</b>
                        <p className="text-[#6E6074] line-clamp-2 m-0 mt-0.5">{req.description}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold">{req.request_type}</span>
                        <span className="text-[#8A5A12] block uppercase text-[10px]">Lang: {req.language_code}</span>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateRequestStatus(req.id, e.target.value)}
                          className="bg-white border border-[#E3D6BF] rounded-lg px-2 py-1 text-[11px] font-bold outline-none"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right pr-5">
                        <button
                          type="button"
                          onClick={() => handleOpenAddModal({
                            title: req.requested_title,
                            description: req.description,
                            type_id: types.find(t => t.name.toLowerCase() === req.request_type.toLowerCase())?.id || types[0]?.id,
                            deity_id: req.deity_id
                          })}
                          className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-xs px-3 py-1.5 rounded-lg border-0 cursor-pointer shadow-xs"
                        >
                          Create Content
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT CONTENT MODAL (Tabbed Multi-Language Editor) */}
      {contentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[24px] p-6 sm:p-8 shadow-2xl text-[#2A2036] space-y-5">
            
            <button
              onClick={() => setContentModalOpen(false)}
              className="absolute right-4 top-4 text-sm font-bold bg-[#F0E5CF] hover:bg-[#E3D6BF] rounded-full w-8 h-8 flex items-center justify-center border-0 cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-xs uppercase font-bold text-[#8A5A12] bg-[#F6E7CE] px-2.5 py-0.5 rounded-md">
                Spiritual Authoring Engine
              </span>
              <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl font-normal text-[#241631] m-0 mt-1">
                {editingContentId ? 'Edit Spiritual Content' : 'Create New Spiritual Text'}
              </h2>
            </div>

            <form onSubmit={handleSaveContent} className="space-y-4 text-xs">
              
              {/* Section 1: Common Metadata */}
              <div className="bg-white border border-[#E3D6BF] rounded-2xl p-4 space-y-3">
                <h3 className="text-xs uppercase font-bold text-[#4A3D52] m-0 border-b border-[#F0E5CF] pb-1.5">
                  1. Common Metadata
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Content Type *</label>
                    <select
                      required
                      value={formCommon.type_id}
                      onChange={(e) => setFormCommon({ ...formCommon, type_id: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none font-medium"
                    >
                      <option value="">-- Select Type --</option>
                      {types.map(t => (
                        <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">God / Deity</label>
                    <select
                      value={formCommon.deity_id}
                      onChange={(e) => setFormCommon({ ...formCommon, deity_id: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none font-medium"
                    >
                      <option value="">-- None / All Deities --</option>
                      {deities.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      value={formCommon.category_id}
                      onChange={(e) => setFormCommon({ ...formCommon, category_id: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none font-medium"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Status</label>
                    <select
                      value={formCommon.status}
                      onChange={(e) => setFormCommon({ ...formCommon, status: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none font-semibold"
                    >
                      <option value="PUBLISHED">Published (Visible Publicly)</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Sort Priority (0 = Default)</label>
                    <input
                      type="number"
                      value={formCommon.sort_order}
                      onChange={(e) => setFormCommon({ ...formCommon, sort_order: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="isFeaturedChk"
                      checked={formCommon.is_featured}
                      onChange={(e) => setFormCommon({ ...formCommon, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-[#E8862B]"
                    />
                    <label htmlFor="isFeaturedChk" className="font-semibold cursor-pointer">
                      ⭐ Mark as Featured
                    </label>
                  </div>
                </div>

                {/* Tags & Cover Image URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Tags / Keywords (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Hanuman, Tuesday, Chalisa, Sankat Mochan"
                      value={formCommon.tags}
                      onChange={(e) => setFormCommon({ ...formCommon, tags: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Cover Image (Optional)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... or upload below"
                        value={formCommon.image_url}
                        onChange={(e) => setFormCommon({ ...formCommon, image_url: e.target.value })}
                        className="flex-1 bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
                      />
                      <label className="bg-[#F0E5CF] hover:bg-[#E3D6BF] px-3 py-2 rounded-xl cursor-pointer font-semibold flex items-center gap-1">
                        <span>{coverUploading ? '...' : '📁 Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleCoverUpload(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Type specific optional fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#F0E5CF]">
                  <div>
                    <label className="block font-semibold mb-1">Sacred Sanskrit Shloka / Beej Mantra (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्..."
                      value={formCommon.sacred_verse_sanskrit}
                      onChange={(e) => setFormCommon({ ...formCommon, sacred_verse_sanskrit: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Pooja Samagri Checklist (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Diya, Kapoor, Dhoop, Flowers, Modak, Ganga Jal..."
                      value={formCommon.samagri}
                      onChange={(e) => setFormCommon({ ...formCommon, samagri: e.target.value })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2 text-xs outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Section 2: Multi-Language Content Tabs */}
              <div className="bg-white border border-[#E3D6BF] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#F0E5CF] pb-2">
                  <h3 className="text-xs uppercase font-bold text-[#4A3D52] m-0">
                    2. Multi-Lingual Content &amp; Translations
                  </h3>

                  {/* Language Tab Selector */}
                  <div className="flex items-center gap-1 bg-[#F6E7CE] p-1 rounded-xl">
                    {[
                      { code: 'hi', label: '🇮🇳 हिन्दी (Hindi)' },
                      { code: 'mr', label: '🚩 मराठी (Marathi)' },
                      { code: 'en', label: '🇬🇧 English' }
                    ].map(l => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setFormActiveLang(l.code)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                          formActiveLang === l.code
                            ? 'bg-[#E8862B] text-[#2A1503] shadow-xs'
                            : 'bg-transparent text-[#6E6074] hover:bg-[#E3D6BF]'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Language Editor Fields */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">
                        Title ({formActiveLang.toUpperCase()}) *
                      </label>
                      <input
                        type="text"
                        required={formActiveLang === 'hi'}
                        placeholder={`e.g. ${formActiveLang === 'mr' ? 'श्री हनुमान चालीसा मराठी' : 'श्री हनुमान चालीसा'}`}
                        value={formTranslations[formActiveLang].title}
                        onChange={(e) => setFormTranslations({
                          ...formTranslations,
                          [formActiveLang]: { ...formTranslations[formActiveLang], title: e.target.value }
                        })}
                        className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">
                        URL Slug ({formActiveLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        placeholder="Leave blank to auto-generate"
                        value={formTranslations[formActiveLang].slug}
                        onChange={(e) => setFormTranslations({
                          ...formTranslations,
                          [formActiveLang]: { ...formTranslations[formActiveLang], slug: e.target.value }
                        })}
                        className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Short Description / Subtitle ({formActiveLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      placeholder="Brief overview of the katha, mantra, or aarti..."
                      value={formTranslations[formActiveLang].short_description}
                      onChange={(e) => setFormTranslations({
                        ...formTranslations,
                        [formActiveLang]: { ...formTranslations[formActiveLang], short_description: e.target.value }
                      })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Full Content / Complete Sacred Text ({formActiveLang.toUpperCase()}) *
                    </label>
                    <textarea
                      rows="8"
                      required={formActiveLang === 'hi'}
                      placeholder="Write complete verses, chapters, mantras, pooja vidhi or katha..."
                      value={formTranslations[formActiveLang].content}
                      onChange={(e) => setFormTranslations({
                        ...formTranslations,
                        [formActiveLang]: { ...formTranslations[formActiveLang], content: e.target.value }
                      })}
                      className="w-full bg-[#FFFCF5] border border-[#E3D6BF] rounded-xl p-3 text-xs outline-none font-mono"
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2 border-t border-[#F0E5CF]">
                <button
                  type="button"
                  onClick={() => setContentModalOpen(false)}
                  className="flex-1 bg-[#F0E5CF] hover:bg-[#E3D6BF] text-[#2A2036] font-semibold py-2.5 rounded-xl border-0 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold py-2.5 rounded-xl border-0 cursor-pointer shadow-xs transition-colors"
                >
                  {actionLoading ? 'Saving...' : (editingContentId ? 'Update Spiritual Content' : 'Publish Spiritual Content')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
