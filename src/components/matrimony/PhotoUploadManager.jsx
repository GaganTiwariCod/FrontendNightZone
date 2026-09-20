import React, { useState, useRef } from 'react';
import { matrimonyApi } from '../../api/matrimonyApi';

export default function PhotoUploadManager({ photos = [], onPhotosUpdated, showToast }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const API_BASE = 'http://localhost:5001';

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be less than 5MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    try {
      const res = await matrimonyApi.uploadPhoto(formData);
      if (res.success) {
        showToast('Photo uploaded successfully!');
        if (onPhotosUpdated) onPhotosUpdated();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload photo.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (photoId) => {
    if (!confirm('Are you sure you want to remove this photo?')) return;
    try {
      const res = await matrimonyApi.deletePhoto(photoId);
      if (res.success) {
        showToast('Photo removed.');
        if (onPhotosUpdated) onPhotosUpdated();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not remove photo.', 'error');
    }
  };

  const handleSetPrimary = async (photoId) => {
    try {
      const res = await matrimonyApi.setPrimaryPhoto(photoId);
      if (res.success) {
        showToast('Primary profile photo updated.');
        if (onPhotosUpdated) onPhotosUpdated();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update primary photo.', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#E3D6BF] hover:border-[#E8862B] bg-[#FFF8EC] rounded-2xl p-6 text-center cursor-pointer transition-colors"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/jpeg,image/png,image/webp" 
          className="hidden" 
        />
        <div className="w-12 h-12 rounded-full bg-[#F6E7CE] text-[#8A5A12] mx-auto grid place-items-center text-xl mb-2">
          📸
        </div>
        <p className="text-sm font-semibold text-[#241631] m-0">
          {uploading ? 'Uploading image...' : 'Click to Upload Profile / Additional Photos'}
        </p>
        <p className="text-xs text-[#6E6074] mt-1 m-0">
          Supports JPG, PNG, WEBP up to 5MB (Max 10 photos)
        </p>
      </div>

      {/* Photo Gallery Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {photos.map((p) => {
            const fullUrl = p.file_url.startsWith('http') ? p.file_url : `${API_BASE}${p.file_url}`;
            return (
              <div 
                key={p.id} 
                className="relative group rounded-xl overflow-hidden border-[1.5px] border-[#E3D6BF] bg-white aspect-square shadow-xs"
              >
                <img 
                  src={fullUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />

                {/* Primary Tag */}
                {p.is_profile_photo ? (
                  <span className="absolute top-2 left-2 bg-[#E8862B] text-[#2A1503] text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    ★ Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(p.id)}
                    className="absolute top-2 left-2 bg-black/60 hover:bg-[#E8862B] text-white hover:text-[#2A1503] text-[11px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border-0 cursor-pointer"
                  >
                    Set Primary
                  </button>
                )}

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-600/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity border-0 cursor-pointer shadow-sm"
                  title="Delete photo"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
