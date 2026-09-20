import React, { useState } from 'react';
import { spiritualApi } from '../../api/spiritualApi';
import { useAuth } from '../../context/AuthContext';
import { getTranslation } from '../../utils/i18n';

export default function SpiritualRequestModal({ isOpen, onClose, deities = [], activeLang = 'hi' }) {
  const { user, showToast } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [requestType, setRequestType] = useState('Katha');
  const [deityId, setDeityId] = useState('');
  const [requestedTitle, setRequestedTitle] = useState('');
  const [languageCode, setLanguageCode] = useState(activeLang);
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !requestedTitle.trim() || !description.trim()) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await spiritualApi.submitRequest({
        name,
        email,
        phone,
        request_type: requestType,
        deity_id: deityId || undefined,
        requested_title: requestedTitle,
        language_code: languageCode,
        description,
        additional_information: additionalInfo
      });

      if (res.success) {
        showToast('Request submitted successfully! Our team will verify and add it.');
        onClose();
        setRequestedTitle('');
        setDescription('');
        setAdditionalInfo('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const types = ['Katha', 'Pooja', 'Mantra', 'Aarti', 'Stotra', 'Chalisa', 'Vrat', 'Festival', 'Bhajan', 'Pooja Vidhi', 'Other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[24px] p-6 sm:p-7 shadow-2xl text-[#2A2036] space-y-4">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-sm font-bold bg-[#F0E5CF] hover:bg-[#E3D6BF] rounded-full w-8 h-8 flex items-center justify-center border-0 cursor-pointer"
        >
          ✕
        </button>

        <div>
          <span className="text-xs uppercase font-bold text-[#8A5A12] bg-[#F6E7CE] px-2.5 py-0.5 rounded-md">
            🙏 {getTranslation('requestContentBtn', activeLang)}
          </span>
          <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl font-normal text-[#241631] m-0 mt-1">
            {getTranslation('requestModalTitle', activeLang)}
          </h2>
          <p className="text-xs text-[#6E6074] m-0 mt-0.5 leading-relaxed">
            {getTranslation('requestModalSubtitle', activeLang)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Name & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#4A3D52] mb-1">
                {getTranslation('yourName', activeLang)} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rameshwar Sharma"
                className="w-full bg-white border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none focus:border-[#E8862B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3D52] mb-1">
                {getTranslation('preferredLanguage', activeLang)}
              </label>
              <select
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                className="w-full bg-white border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
              >
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="en">English</option>
                <option value="sa">संस्कृतम् (Sanskrit)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#4A3D52] mb-1">
                {getTranslation('yourEmail', activeLang)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rameshwar@example.com"
                className="w-full bg-white border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none focus:border-[#E8862B]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#4A3D52] mb-1">
                {getTranslation('yourPhone', activeLang)}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-white border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none focus:border-[#E8862B]"
              />
            </div>
          </div>

          {/* Type & Deity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#4A3D52] mb-1">
                {getTranslation('requestType', activeLang)} *
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full bg-white border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
              >
                {types.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#4A3D52] mb-1">
                {getTranslation('deity', activeLang)}
              </label>
              <select
                value={deityId}
                onChange={(e) => setDeityId(e.target.value)}
                className="w-full bg-white border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none"
              >
                <option value="">-- Optional (Select Deity) --</option>
                {deities.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Requested Title */}
          <div>
            <label className="block font-semibold text-[#4A3D52] mb-1">
              {getTranslation('requestedTitle', activeLang)} *
            </label>
            <input
              type="text"
              required
              value={requestedTitle}
              onChange={(e) => setRequestedTitle(e.target.value)}
              placeholder="e.g. प्रदोष व्रत कथा एवं विधि, महालक्ष्मी अष्टकम, संकट नाशन गणेश स्तोत्र..."
              className="w-full bg-white border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none focus:border-[#E8862B]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-[#4A3D52] mb-1">
              {getTranslation('description', activeLang)} *
            </label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context on what chapters, samagri, or verses you are looking for..."
              className="w-full bg-white border border-[#E3D6BF] rounded-xl p-2.5 text-xs outline-none focus:border-[#E8862B]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2 border-t border-[#F0E5CF]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#F0E5CF] hover:bg-[#E3D6BF] text-[#2A2036] font-semibold py-2.5 rounded-xl border-0 cursor-pointer transition-colors"
            >
              {getTranslation('cancel', activeLang)}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold py-2.5 rounded-xl border-0 cursor-pointer shadow-xs transition-colors"
            >
              {submitting ? getTranslation('submitting', activeLang) : getTranslation('submitRequest', activeLang)}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
