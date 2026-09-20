import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ServiceModal() {
  const { activeServiceModal, setActiveServiceModal, user, showToast } = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [note, setNote] = useState('');

  if (!activeServiceModal) return null;

  const serviceName = typeof activeServiceModal === 'string' ? activeServiceModal : activeServiceModal.name;
  const serviceData = typeof activeServiceModal === 'object' ? activeServiceModal.data : null;

  const handleAction = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    showToast(`Your request for ${serviceName} has been submitted! Our team will contact you shortly.`);
    setTimeout(() => {
      setActiveServiceModal(null);
      setFormSubmitted(false);
      setNote('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 shadow-2xl text-[#2A2036]">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveServiceModal(null)}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F0E5CF] hover:bg-[#E3D6BF] text-[#2A2036] flex items-center justify-center text-sm font-bold transition-colors bg-transparent border-0 cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-[#F6E7CE] text-[#8A5A12] grid place-items-center text-xl font-bold shadow-xs">
            🪔
          </div>
          <div>
            <h3 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl font-normal text-[#241631] m-0">
              {serviceName}
            </h3>
            <span className="text-xs text-[#4E6B4F] font-semibold bg-[#EDF4ED] px-2 py-0.5 rounded-full inline-block mt-0.5">
              Verified Shubhkaal Service
            </span>
          </div>
        </div>

        {serviceData?.title && (
          <div className="bg-[#F7EEDC] p-3 rounded-xl mb-4 border border-[#E3D6BF]">
            <p className="text-sm font-semibold text-[#241631] m-0">{serviceData.title}</p>
          </div>
        )}

        {formSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-[#EDF4ED] text-[#4E6B4F] text-2xl rounded-full mx-auto grid place-items-center">
              ✓
            </div>
            <h4 className="text-lg font-semibold text-[#241631]">Request Submitted Successfully</h4>
            <p className="text-sm text-[#6E6074]">We have sent the confirmation to {user?.email || user?.phone}.</p>
          </div>
        ) : (
          <form onSubmit={handleAction} className="space-y-4">
            <div className="text-sm text-[#6E6074]">
              Connected as <b className="text-[#2A2036]">{user?.name}</b> ({user?.email || user?.phone})
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                Special requirements or date / location details
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Need Hindi/Marathi pandit for Satyanarayan Pooja next Sunday at Matunga..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
                className="w-full bg-white border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-xl p-3 text-sm outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveServiceModal(null)}
                className="flex-1 bg-[#F0E5CF] hover:bg-[#E3D6BF] text-[#2A2036] font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer border-0 shadow-sm"
              >
                Confirm Request
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
