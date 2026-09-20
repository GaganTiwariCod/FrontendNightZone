import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { astrologyApi } from '../../api/astrologyApi';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  MapPin, 
  Award, 
  FileText, 
  ShieldCheck, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

const SPECIALIZATIONS_LIST = [
  'Vedic Astrology',
  'Kundli',
  'Kundli Matching',
  'Career Astrology',
  'Marriage Astrology',
  'Business Astrology',
  'Relationship Astrology',
  'Vastu Shastra',
  'Numerology',
  'Muhurta',
  'Palmistry',
  'Spiritual Guidance',
  'Dosha Remedies'
];

const METHODS_LIST = ['Parashari', 'Jaimini', 'KP Astrology', 'Nadi Astrology', 'Lal Kitab', 'Western Astrology'];
const LANGUAGES_LIST = ['Hindi', 'English', 'Sanskrit', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu'];

export default function AstrologerRegistrationWizard({ onExit, onPreview }) {
  const { user, showToast } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [registeredSlug, setRegisteredSlug] = useState(null);

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [displayName, setDisplayName] = useState(user?.name ? `Acharya ${user.name}` : '');
  const [gender, setGender] = useState('male');
  const [dob, setDob] = useState('1988-06-15');
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300');
  const [bio, setBio] = useState('');

  // Location & Contact
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [city, setCity] = useState('Varanasi');
  const [state, setState] = useState('Uttar Pradesh');
  const [address, setAddress] = useState('Dashashwamedh Ghat Road');
  const [pincode, setPincode] = useState('221001');

  // Professional Credentials
  const [yearsExperience, setYearsExperience] = useState(10);
  const [education, setEducation] = useState('Acharya in Jyotish, Sampurnanand Sanskrit University');
  const [certifications, setCertifications] = useState('Vedic Astrology Gold Medalist');
  const [selectedLanguages, setSelectedLanguages] = useState(['Hindi', 'English']);

  // Specializations & Pricing
  const [selectedSpecializations, setSelectedSpecializations] = useState(['Vedic Astrology', 'Kundli', 'Kundli Matching']);
  const [selectedMethods, setSelectedMethods] = useState(['Parashari']);
  const [chatPrice, setChatPrice] = useState(20);
  const [callPrice, setCallPrice] = useState(30);
  const [videoPrice, setVideoPrice] = useState(45);
  const [reportPrice, setReportPrice] = useState(599);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        display_name: displayName,
        gender,
        date_of_birth: dob,
        profile_photo: profilePhoto,
        bio,
        phone,
        alternate_phone: alternatePhone,
        city,
        state,
        address,
        pincode,
        years_of_experience: parseInt(yearsExperience),
        education,
        certifications,
        languages: selectedLanguages,
        specializations: selectedSpecializations,
        astrology_methods: selectedMethods,
        chat_price: parseFloat(chatPrice),
        call_price: parseFloat(callPrice),
        video_price: parseFloat(videoPrice),
        report_price: parseFloat(reportPrice)
      };

      const res = await astrologyApi.registerAstrologer(payload);
      if (res.success) {
        showToast('Registration submitted successfully!', 'success');
        setRegisteredSlug(res.profile?.slug);
        setCompleted(true);
      } else {
        showToast(res.message || 'Registration failed.', 'error');
      }
    } catch (err) {
      console.error('Error in astrologer onboarding:', err);
      showToast('Network error submitting registration.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-stone-950 py-16 px-4 text-center text-stone-100 flex items-center justify-center">
        <div className="max-w-md bg-stone-900 border border-amber-500/40 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-white">Application Submitted!</h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Thank you for registering as a Vedic Astrologer on Shubhkaal. Our administrative team will review your qualifications and activate your verified profile within 24–48 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onExit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs uppercase"
            >
              Return to Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Step {step} of 4
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Header */}
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Astrologer Onboarding Wizard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {step === 1 && 'Personal & Public Identity'}
              {step === 2 && 'Location & Contact Details'}
              {step === 3 && 'Credentials & Astrological Practice'}
              {step === 4 && 'Services, Specializations & Pricing'}
            </h1>
          </div>

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Public Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acharya Vidyadhar"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Profile Photo URL</label>
                  <input
                    type="url"
                    value={profilePhoto}
                    onChange={(e) => setProfilePhoto(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Professional Bio & Introduction *</label>
                <textarea
                  rows="4"
                  placeholder="Share your lineage, guru traditions, years of experience, and astrological philosophy..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact & Location */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Alternate Phone</label>
                  <input
                    type="tel"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Office / Temple Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 3: Professional Credentials */}
          {step === 3 && (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Years of Active Practice *</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Education / Degree</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Certifications & Awards</label>
                <input
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-2">Languages Spoken</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES_LIST.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                        className={`px-3 py-1.5 rounded-xl transition-all font-semibold ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold shadow'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Specializations & Pricing */}
          {step === 4 && (
            <div className="space-y-6 text-xs">
              <div>
                <label className="block font-semibold text-stone-300 mb-2">Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS_LIST.map((spec) => {
                    const isSelected = selectedSpecializations.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSelection(spec, selectedSpecializations, setSelectedSpecializations)}
                        className={`px-3 py-1.5 rounded-xl transition-all font-semibold ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold shadow'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
                        }`}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800">
                <h4 className="font-bold text-stone-300 uppercase tracking-wider mb-3">
                  Consultation Pricing Configuration (INR)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-400 mb-1">Chat (₹/min)</label>
                    <input
                      type="number"
                      value={chatPrice}
                      onChange={(e) => setChatPrice(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-400 mb-1">Audio Call (₹/min)</label>
                    <input
                      type="number"
                      value={callPrice}
                      onChange={(e) => setCallPrice(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-400 mb-1">Video Call (₹/min)</label>
                    <input
                      type="number"
                      value={videoPrice}
                      onChange={(e) => setVideoPrice(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-400 mb-1">PDF Report (₹ Base)</label>
                    <input
                      type="number"
                      value={reportPrice}
                      onChange={(e) => setReportPrice(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-bold text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-stone-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-semibold text-xs transition-colors"
              >
                Previous Step
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
