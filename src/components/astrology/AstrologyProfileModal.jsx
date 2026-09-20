import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Save
} from 'lucide-react';

const RELATIONSHIPS = [
  'Self',
  'Father',
  'Mother',
  'Brother',
  'Sister',
  'Partner',
  'Spouse',
  'Son',
  'Daughter',
  'Friend',
  'Relative',
  'Other'
];

export default function AstrologyProfileModal({ isOpen, onClose, editingProfile, onSaved }) {
  const { user, openAuth, loadAstrologyProfiles, switchAstrologyProfile, showToast } = useAuth();

  const [profileType, setProfileType] = useState('OTHER');
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Brother');
  const [customRelationship, setCustomRelationship] = useState('');
  const [gender, setGender] = useState('male');
  const [dob, setDob] = useState('1998-05-15');
  const [tob, setTob] = useState('12:00');
  const [accuracy, setAccuracy] = useState('ACCURATE');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [birthPlace, setBirthPlace] = useState('Mumbai, Maharashtra, India');
  const [latitude, setLatitude] = useState('19.0760');
  const [longitude, setLongitude] = useState('72.8777');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProfile) {
      setProfileType(editingProfile.profile_type || 'OTHER');
      setName(editingProfile.name || '');
      setRelationship(editingProfile.relationship || 'Brother');
      setGender(editingProfile.gender || 'male');
      setDob(editingProfile.date_of_birth || '1995-01-01');
      setTob(editingProfile.time_of_birth || '12:00');
      setAccuracy(editingProfile.birth_time_accuracy || 'ACCURATE');
      setCountry(editingProfile.birth_country || 'India');
      setState(editingProfile.birth_state || '');
      setCity(editingProfile.birth_city || '');
      setBirthPlace(editingProfile.birth_place || '');
      setLatitude(editingProfile.latitude ? String(editingProfile.latitude) : '');
      setLongitude(editingProfile.longitude ? String(editingProfile.longitude) : '');
      setTimezone(editingProfile.timezone || 'Asia/Kolkata');
      setNotes(editingProfile.notes || '');
    } else {
      // Default new profile
      setProfileType('OTHER');
      setName('');
      setRelationship('Brother');
      setCustomRelationship('');
      setGender('male');
      setDob('1998-05-15');
      setTob('12:00');
      setAccuracy('ACCURATE');
      setCountry('India');
      setState('');
      setCity('');
      setBirthPlace('');
      setLatitude('');
      setLongitude('');
      setTimezone('Asia/Kolkata');
      setNotes('');
    }
  }, [editingProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !dob) {
      showToast('Name and Date of Birth are required.', 'error');
      return;
    }

    if (!user) {
      openAuth('Astrology Profile', 'login');
      showToast('Please sign in or create an account to save your birth profile securely.', 'info');
      return;
    }

    setLoading(true);
    try {
      const finalRel = profileType === 'SELF' ? 'Self' : (relationship === 'Other' && customRelationship.trim() ? customRelationship.trim() : relationship);
      const payload = {
        profile_type: profileType,
        name: name.trim(),
        relationship: finalRel,
        gender,
        date_of_birth: dob,
        time_of_birth: tob || '12:00',
        birth_time_accuracy: accuracy,
        birth_country: country || 'India',
        birth_state: state,
        birth_city: city,
        birth_place: birthPlace.trim() || [city, state, country].filter(Boolean).join(', ') || 'India',
        latitude: latitude && !isNaN(parseFloat(latitude)) ? parseFloat(latitude) : null,
        longitude: longitude && !isNaN(parseFloat(longitude)) ? parseFloat(longitude) : null,
        timezone,
        notes
      };

      let res;
      if (editingProfile) {
        res = await astrologyApi.updateProfile(editingProfile.id, payload);
      } else {
        res = await astrologyApi.createProfile(payload);
      }

      if (res.success && res.profile) {
        showToast(editingProfile ? 'Profile updated successfully!' : `${res.profile.name}'s profile added!`, 'success');
        await loadAstrologyProfiles();
        switchAstrologyProfile(res.profile);
        if (onSaved) onSaved(res.profile);
        onClose();
      } else {
        showToast(res.message || 'Failed to save profile.', 'error');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      showToast('Network error while saving profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingProfile ? 'Edit Astrology Birth Profile' : 'Add Astrology Birth Profile'}
              </h3>
              <p className="text-xs text-amber-300/80">
                Enter details once and automatically reuse them across Kundli, Matching, & Consultations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Who is this for? Selector */}
          {!editingProfile && (
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                Who is this Astrology Profile for?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProfileType('SELF');
                    setRelationship('Self');
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                    profileType === 'SELF'
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Self (My Profile)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileType('OTHER');
                    if (relationship === 'Self') setRelationship('Brother');
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                    profileType === 'OTHER'
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Family Member / Friend
                </button>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800 pb-1">
              1. Basic Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Tiwari"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {profileType === 'OTHER' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Relationship <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    {RELATIONSHIPS.filter(r => r !== 'Self').map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {relationship === 'Other' && (
                    <input
                      type="text"
                      placeholder="Specify relationship (e.g. Uncle, Colleague)"
                      value={customRelationship}
                      onChange={(e) => setCustomRelationship(e.target.value)}
                      className="mt-2 w-full px-3.5 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs"
                    />
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Gender</label>
                <div className="flex rounded-xl bg-stone-800 p-1 border border-stone-700">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                        gender === g
                          ? 'bg-amber-500 text-stone-950 font-bold shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Birth Time & Accuracy */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800 pb-1">
              2. Birth Time & Accuracy
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Time of Birth (24-hour format)
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Time Accuracy
                </label>
                <select
                  value={accuracy}
                  onChange={(e) => setAccuracy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="ACCURATE">Accurate (Within ±5 mins)</option>
                  <option value="APPROXIMATE">Approximate (Within ±1 hour)</option>
                  <option value="UNKNOWN">Unknown / Don't Know</option>
                </select>
              </div>
            </div>
          </div>

          {/* Birth Location */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800 pb-1">
              3. Birth Location
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Birth Place (City, State, Country) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varanasi, Uttar Pradesh, India"
                  value={birthPlace}
                  onChange={(e) => {
                    setBirthPlace(e.target.value);
                    if (!city && e.target.value.includes(',')) {
                      setCity(e.target.value.split(',')[0].trim());
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">City</label>
                <input
                  type="text"
                  placeholder="e.g. Varanasi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">State</label>
                <input
                  type="text"
                  placeholder="e.g. Uttar Pradesh"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Personal Astrological Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Inquiring specifically about career switch or marriage timing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : editingProfile ? 'Update Profile' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
