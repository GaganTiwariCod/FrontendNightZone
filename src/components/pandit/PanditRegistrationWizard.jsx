import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { panditApi } from '../../api/panditApi';

export default function PanditRegistrationWizard({ initialStep = 1, onExit, onPreview }) {
  const { user, showToast } = useAuth();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masterData, setMasterData] = useState({ services: [], languages: [], vedas: [], panditTitles: [], panditTypes: [] });

  // Profile data state
  const [profile, setProfile] = useState(null);

  // Form states
  const [basicForm, setBasicForm] = useState({
    title: 'Pandit',
    full_name: user?.name || '',
    display_name: '',
    gender: 'male',
    date_of_birth: '',
    primary_phone: user?.phone || '',
    whatsapp_number: '',
    email: user?.email || '',
    years_of_experience: 5,
    pandit_types: ['Vedic Ritualist (Karma Kanda)'],
    short_bio: '',
    about: ''
  });

  const [religiousForm, setReligiousForm] = useState({
    gotra: '',
    pravara: '',
    veda: 'Rigveda',
    shakha: '',
    sutra: 'Grihya Sutra',
    sampradaya: 'Smartha',
    kul_devta: '',
    ishta_devta: '',
    guru_parampara: ''
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);

  const [locationForm, setLocationForm] = useState({
    residential: {
      current_address: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postal_code: '',
      travel_available: true,
      max_travel_distance_km: 50,
      outstation_available: false,
      international_travel: false,
      travel_expenses_extra: true
    },
    service_locations: []
  });

  const [availabilityForm, setAvailabilityForm] = useState({
    available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    morning_slot: true,
    afternoon_slot: true,
    evening_slot: true,
    allows_home_visit: true,
    allows_temple_service: true,
    allows_online_puja: false,
    advance_booking_days: 2,
    consultation_available: true,
    notes: ''
  });

  const [documents, setDocuments] = useState([]);
  const [docUploadForm, setDocUploadForm] = useState({
    document_type: 'AADHAAR',
    document_number: '',
    document_title: '',
    issuing_authority: '',
    issued_year: ''
  });
  const [selectedDocFile, setSelectedDocFile] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

  // Load master data and current profile
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [masterRes, profileRes] = await Promise.all([
          panditApi.getMasterData(),
          panditApi.getMyProfile()
        ]);

        if (masterRes.success && masterRes.data) {
          setMasterData(masterRes.data);
        }

        if (profileRes.success && profileRes.data?.profile) {
          const p = profileRes.data.profile;
          setProfile(p);

          setBasicForm({
            title: p.title || 'Pandit',
            full_name: p.full_name || user?.name || '',
            display_name: p.display_name || '',
            gender: p.gender || 'male',
            date_of_birth: p.date_of_birth ? p.date_of_birth.substring(0, 10) : '',
            primary_phone: p.primary_phone || user?.phone || '',
            whatsapp_number: p.whatsapp_number || '',
            email: p.email || user?.email || '',
            years_of_experience: p.years_of_experience !== undefined ? p.years_of_experience : 5,
            pandit_types: p.pandit_types || ['Vedic Ritualist (Karma Kanda)'],
            short_bio: p.short_bio || '',
            about: p.about || ''
          });

          if (p.religiousDetail) {
            setReligiousForm({
              gotra: p.religiousDetail.gotra || '',
              pravara: p.religiousDetail.pravara || '',
              veda: p.religiousDetail.veda || 'Rigveda',
              shakha: p.religiousDetail.shakha || '',
              sutra: p.religiousDetail.sutra || 'Grihya Sutra',
              sampradaya: p.religiousDetail.sampradaya || 'Smartha',
              kul_devta: p.religiousDetail.kul_devta || '',
              ishta_devta: p.religiousDetail.ishta_devta || '',
              guru_parampara: p.religiousDetail.guru_parampara || ''
            });
          }

          if (p.services) {
            setSelectedServices(p.services.map(s => ({
              service_id: s.id,
              name: s.name,
              is_primary: s.PanditService?.is_primary || false,
              years_experience: s.PanditService?.years_experience || p.years_of_experience || 5,
              price_type: s.PanditService?.price_type || 'dakshina_only',
              fixed_price: s.PanditService?.fixed_price || '',
              min_price: s.PanditService?.min_price || '',
              max_price: s.PanditService?.max_price || '',
              duration_minutes: s.PanditService?.duration_minutes || 60,
              includes_samagri: s.PanditService?.includes_samagri || false
            })));
          }

          if (p.languages) {
            setSelectedLanguages(p.languages.map(l => ({
              language_id: l.id,
              name: l.name,
              fluency: l.PanditLanguage?.fluency || 'fluent',
              can_recite_mantras: l.PanditLanguage?.can_recite_mantras !== undefined ? l.PanditLanguage.can_recite_mantras : true,
              is_primary: l.PanditLanguage?.is_primary || false
            })));
          }

          if (p.education) {
            setEducationList(p.education);
          }

          if (p.experience) {
            setExperienceList(p.experience);
          }

          setLocationForm({
            residential: {
              current_address: p.current_address || '',
              city: p.city || 'Mumbai',
              state: p.state || 'Maharashtra',
              country: p.country || 'India',
              postal_code: p.postal_code || '',
              travel_available: p.travel_available !== undefined ? p.travel_available : true,
              max_travel_distance_km: p.max_travel_distance_km || 50,
              outstation_available: p.outstation_available || false,
              international_travel: p.international_travel || false,
              travel_expenses_extra: p.travel_expenses_extra !== undefined ? p.travel_expenses_extra : true
            },
            service_locations: p.locations || []
          });

          if (p.availability) {
            setAvailabilityForm({
              available_days: p.availability.available_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
              morning_slot: p.availability.morning_slot !== undefined ? p.availability.morning_slot : true,
              afternoon_slot: p.availability.afternoon_slot !== undefined ? p.availability.afternoon_slot : true,
              evening_slot: p.availability.evening_slot !== undefined ? p.availability.evening_slot : true,
              allows_home_visit: p.availability.allows_home_visit !== undefined ? p.availability.allows_home_visit : true,
              allows_temple_service: p.availability.allows_temple_service !== undefined ? p.availability.allows_temple_service : true,
              allows_online_puja: p.availability.allows_online_puja !== undefined ? p.availability.allows_online_puja : false,
              advance_booking_days: p.availability.advance_booking_days || 2,
              consultation_available: p.availability.consultation_available !== undefined ? p.availability.consultation_available : true,
              notes: p.availability.notes || ''
            });
          }

          if (p.documents) {
            setDocuments(p.documents);
          }
        }
      } catch (err) {
        console.error('Error initializing wizard:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [user]);

  // Step 1: Save Basic Info
  const handleSaveBasic = async () => {
    setSaving(true);
    try {
      const res = await panditApi.saveBasicInfo(basicForm);
      if (res.success) {
        setProfile(res.data.profile);
        showToast('Basic information saved!');
        setCurrentStep(2);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save basic info', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Step 2: Save Religious Info
  const handleSaveReligious = async () => {
    setSaving(true);
    try {
      const res = await panditApi.saveReligiousDetails(religiousForm);
      if (res.success) {
        showToast('Religious & Vedic lineage saved!');
        setCurrentStep(3);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save religious details', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Step 3: Save Services
  const handleSaveServices = async () => {
    if (selectedServices.length === 0) {
      showToast('Please select at least one puja or ceremony you perform.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        services: selectedServices.map(s => ({
          service_id: s.service_id,
          custom_service_name: s.custom_service_name || null,
          is_primary: s.is_primary || false,
          years_experience: Number(s.years_experience) || 5,
          price_type: s.price_type || 'dakshina_only',
          fixed_price: s.fixed_price ? Number(s.fixed_price) : null,
          min_price: s.min_price ? Number(s.min_price) : null,
          max_price: s.max_price ? Number(s.max_price) : null,
          duration_minutes: Number(s.duration_minutes) || 60,
          includes_samagri: !!s.includes_samagri
        }))
      };
      const res = await panditApi.saveServices(payload);
      if (res.success) {
        showToast('Puja services saved!');
        setCurrentStep(4);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save services', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Step 4: Save Languages
  const handleSaveLanguages = async () => {
    if (selectedLanguages.length === 0) {
      showToast('Please select at least one language.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        languages: selectedLanguages.map(l => ({
          language_id: l.language_id,
          fluency: l.fluency || 'fluent',
          can_recite_mantras: l.can_recite_mantras !== undefined ? l.can_recite_mantras : true,
          is_primary: l.is_primary || false
        }))
      };
      const res = await panditApi.saveLanguages(payload);
      if (res.success) {
        showToast('Languages saved!');
        setCurrentStep(5);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save languages', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Step 5: Save Education
  const handleSaveEducation = async () => {
    setSaving(true);
    try {
      const res = await panditApi.saveEducation({ education: educationList });
      if (res.success) {
        showToast('Education history saved!');
        setCurrentStep(6);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save education', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Step 6: Save Experience
  const handleSaveExperience = async () => {
    setSaving(true);
    try {
      const res = await panditApi.saveExperience({ experience: experienceList });
      if (res.success) {
        showToast('Experience records saved!');
        setCurrentStep(7);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save experience', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Step 7: Save Location & Travel
  const handleSaveLocation = async () => {
    if (!locationForm.residential.city || !locationForm.residential.state) {
      showToast('Please enter your primary residential city and state.', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await panditApi.saveLocations(locationForm);
      if (res.success) {
        showToast('Location and travel settings saved!');
        setCurrentStep(8);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save locations', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Step 8: Save Availability
  const handleSaveAvailability = async () => {
    setSaving(true);
    try {
      const res = await panditApi.saveAvailability(availabilityForm);
      if (res.success) {
        showToast('Availability schedule saved!');
        setCurrentStep(9);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save availability', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Photo Upload Handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await panditApi.uploadProfilePhoto(formData);
      if (res.success) {
        setProfile(prev => ({ ...prev, profile_photo: res.data.profile_photo }));
        showToast('Profile portrait photo uploaded!');
      }
    } catch (err) {
      showToast('Failed to upload profile photo', 'error');
    }
  };

  // Document Upload Handler
  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (!selectedDocFile) {
      showToast('Please select a document file (PDF or Image)', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('document', selectedDocFile);
    formData.append('document_type', docUploadForm.document_type);
    if (docUploadForm.document_number) formData.append('document_number', docUploadForm.document_number);
    if (docUploadForm.document_title) formData.append('document_title', docUploadForm.document_title);
    if (docUploadForm.issuing_authority) formData.append('issuing_authority', docUploadForm.issuing_authority);
    if (docUploadForm.issued_year) formData.append('issued_year', docUploadForm.issued_year);

    try {
      const res = await panditApi.uploadDocument(formData);
      if (res.success) {
        setDocuments(prev => [...prev, res.data.document]);
        setSelectedDocFile(null);
        setDocUploadForm({
          document_type: 'AADHAAR',
          document_number: '',
          document_title: '',
          issuing_authority: '',
          issued_year: ''
        });
        showToast('Document uploaded successfully for verification!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload document', 'error');
    }
  };

  // Document Delete Handler
  const handleDeleteDoc = async (id) => {
    try {
      const res = await panditApi.deleteDocument(id);
      if (res.success) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        showToast('Document removed');
      }
    } catch (err) {
      showToast('Failed to delete document', 'error');
    }
  };

  // Step 10: Final Submission
  const handleSubmitVerification = async () => {
    setSaving(true);
    try {
      const res = await panditApi.submitForVerification();
      if (res.success) {
        showToast('Your Pandit registration is submitted for Vedic council verification! 🪔');
        if (onPreview && profile?.slug) {
          onPreview(profile.slug);
        } else {
          onExit();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit for verification', 'error');
    } finally {
      setSaving(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Vedic Lineage' },
    { num: 3, label: 'Puja Services' },
    { num: 4, label: 'Languages' },
    { num: 5, label: 'Gurukul & Education' },
    { num: 6, label: 'Temple Experience' },
    { num: 7, label: 'Location & Travel' },
    { num: 8, label: 'Availability' },
    { num: 9, label: 'KYC & Verification' },
    { num: 10, label: 'Review & Submit' }
  ];

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-24 text-center">
        <div className="inline-block w-10 h-10 border-4 border-[#E8862B] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#6E6074] text-sm">Preparing Pandit Registration Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      {/* Wizard Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onExit}
            className="text-xs text-[#8A5A12] font-semibold hover:underline flex items-center gap-1 mb-1"
          >
            <span>← Exit to Dashboard</span>
          </button>
          <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl md:text-3xl font-bold text-[#241631]">
            Pandit Registration Portal
          </h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#8A5A12] font-semibold block">Step {currentStep} of 10</span>
          <span className="text-xs text-[#6E6074]">{stepsList[currentStep - 1]?.label}</span>
        </div>
      </div>

      {/* Steps Progression Bar */}
      <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-2xl p-3 mb-8 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-[720px]">
          {stepsList.map((st) => (
            <button
              key={st.num}
              onClick={() => {
                if (profile || st.num === 1) setCurrentStep(st.num);
              }}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl text-xs transition-all ${
                currentStep === st.num
                  ? 'bg-[#2B1736] text-[#F7EEDC] font-bold shadow-xs'
                  : currentStep > st.num
                  ? 'bg-[#E8F3EA] text-[#2E5E35] font-semibold'
                  : 'text-[#8C7558] hover:bg-[#F6E7CE]'
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] mb-1 font-bold">
                {currentStep > st.num ? '✓' : st.num}
              </span>
              <span className="truncate max-w-[80px] text-[10.5px]">{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Container Box */}
      <div className="bg-[#FFFCF5] border border-[#E3D6BF] rounded-3xl p-6 md:p-8 shadow-sm">
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>🪔</span>
              <span>Step 1: Personal &amp; Professional Bio</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Enter your official name, title, experience, and contact numbers.
            </p>

            {/* Profile Photo */}
            <div className="flex items-center gap-5 p-4 bg-[#F8F4EB] rounded-2xl border border-[#EBE1D0] mb-6">
              {profile?.profile_photo ? (
                <img
                  src={`http://localhost:5001${profile.profile_photo}`}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E8862B]"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#E8862B] text-white text-2xl font-bold flex items-center justify-center font-['Tiro_Devanagari_Hindi',serif]">
                  {basicForm.title?.substring(0, 1) || 'पं'}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#241631] mb-1">Portrait Profile Photo</label>
                <p className="text-[11px] text-[#6E6074] mb-2">Upload a traditional portrait photo in puja attire (JPG, PNG, max 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-[#8A5A12] file:mr-3 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#E8862B] file:text-[#2A1503] hover:file:bg-[#D8791F] cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Vedic Title *</label>
                <select
                  value={basicForm.title}
                  onChange={(e) => setBasicForm({ ...basicForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                >
                  {['Pandit', 'Acharya', 'Shastri', 'Jyotishacharya', 'Mahant', 'Purohit', 'Dr.', 'Vedacharya'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={basicForm.full_name}
                  onChange={(e) => setBasicForm({ ...basicForm, full_name: e.target.value })}
                  placeholder="e.g. Rameshchandra Sharma"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Years of Experience *</label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  required
                  value={basicForm.years_of_experience}
                  onChange={(e) => setBasicForm({ ...basicForm, years_of_experience: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Primary Phone *</label>
                <input
                  type="tel"
                  value={basicForm.primary_phone}
                  onChange={(e) => setBasicForm({ ...basicForm, primary_phone: e.target.value })}
                  placeholder="e.g. 9820012345"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={basicForm.whatsapp_number}
                  onChange={(e) => setBasicForm({ ...basicForm, whatsapp_number: e.target.value })}
                  placeholder="e.g. 9820012345"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#6E6074] mb-1">Pandit Specialisation Category *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Vedic Ritualist (Karma Kanda)',
                  'Jyotish / Astrologer',
                  'Vastu Consultant',
                  'Pooja Specialist',
                  'Kathavachak / Pravachankar',
                  'Havankari / Yajna Specialist',
                  'Sanskrit Scholar',
                  'Temple Priest (Pujari)'
                ].map((type) => {
                  const isChecked = basicForm.pandit_types.includes(type);
                  return (
                    <label
                      key={type}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isChecked ? 'bg-[#FFF2DE] border-[#E8862B] text-[#241631] font-semibold' : 'bg-white border-[#D5C7B0] text-[#6E6074]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBasicForm({ ...basicForm, pandit_types: [...basicForm.pandit_types, type] });
                          } else {
                            setBasicForm({ ...basicForm, pandit_types: basicForm.pandit_types.filter(t => t !== type) });
                          }
                        }}
                        className="accent-[#E8862B]"
                      />
                      <span>{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#6E6074] mb-1">Short Tagline / Bio (Max 300 chars)</label>
              <input
                type="text"
                maxLength="300"
                value={basicForm.short_bio}
                onChange={(e) => setBasicForm({ ...basicForm, short_bio: e.target.value })}
                placeholder="e.g. Rigveda Shastri with 15+ years conducting authentic Vivah and Griha Pravesh rituals."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#6E6074] mb-1">Detailed About Me / Philosophy</label>
              <textarea
                rows="4"
                value={basicForm.about}
                onChange={(e) => setBasicForm({ ...basicForm, about: e.target.value })}
                placeholder="Share your Vedic background, ancestral learning, Gurukul education, and experience..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveBasic}
                className="px-8 py-3 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{saving ? 'Saving...' : 'Save & Continue to Step 2'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Vedic & Religious Lineage */}
        {currentStep === 2 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>🕉️</span>
              <span>Step 2: Vedic Lineage &amp; Religious Details</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Specify your Veda tradition, Gotra, Pravara, Shakha, and Kuldevta to ensure accurate matchmaking with Yajman traditions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Veda Tradition *</label>
                <select
                  value={religiousForm.veda}
                  onChange={(e) => setReligiousForm({ ...religiousForm, veda: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                >
                  {['Rigveda', 'Yajurveda (Shukla)', 'Yajurveda (Krishna)', 'Samaveda', 'Atharvaveda', 'Other', 'Not Specified'].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Gotra</label>
                <input
                  type="text"
                  value={religiousForm.gotra}
                  onChange={(e) => setReligiousForm({ ...religiousForm, gotra: e.target.value })}
                  placeholder="e.g. Kashyapa, Bharadwaja, Vashishta"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Pravara</label>
                <input
                  type="text"
                  value={religiousForm.pravara}
                  onChange={(e) => setReligiousForm({ ...religiousForm, pravara: e.target.value })}
                  placeholder="e.g. Tryarsheya (3 rishis)"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Shakha</label>
                <input
                  type="text"
                  value={religiousForm.shakha}
                  onChange={(e) => setReligiousForm({ ...religiousForm, shakha: e.target.value })}
                  placeholder="e.g. Madhyandina / Shakala"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Sutra</label>
                <input
                  type="text"
                  value={religiousForm.sutra}
                  onChange={(e) => setReligiousForm({ ...religiousForm, sutra: e.target.value })}
                  placeholder="e.g. Katyayana / Ashvalayana"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Sampradaya</label>
                <input
                  type="text"
                  value={religiousForm.sampradaya}
                  onChange={(e) => setReligiousForm({ ...religiousForm, sampradaya: e.target.value })}
                  placeholder="e.g. Smartha, Vaishnava, Shaiva"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Kul Devta / Devi</label>
                <input
                  type="text"
                  value={religiousForm.kul_devta}
                  onChange={(e) => setReligiousForm({ ...religiousForm, kul_devta: e.target.value })}
                  placeholder="e.g. Khandoba, Tulja Bhavani"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Ishta Devta</label>
                <input
                  type="text"
                  value={religiousForm.ishta_devta}
                  onChange={(e) => setReligiousForm({ ...religiousForm, ishta_devta: e.target.value })}
                  placeholder="e.g. Lord Shiva, Shri Ram"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#6E6074] mb-1">Guru Parampara / Peeth</label>
              <textarea
                rows="3"
                value={religiousForm.guru_parampara}
                onChange={(e) => setReligiousForm({ ...religiousForm, guru_parampara: e.target.value })}
                placeholder="Mention your spiritual guru or Matha / Peeth affiliation if any..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
              ></textarea>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveReligious}
                className="px-8 py-3 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{saving ? 'Saving...' : 'Save & Continue to Step 3'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Puja Services Offered */}
        {currentStep === 3 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>🪔</span>
              <span>Step 3: Puja Services &amp; Dakshina</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Select all rituals, havans, and ceremonies you perform. You can customize duration, samagri inclusion, and pricing.
            </p>

            <div className="space-y-4 mb-6 max-h-[450px] overflow-y-auto pr-1">
              {masterData.services.map((svc) => {
                const existing = selectedServices.find(s => s.service_id === svc.id);
                const isSelected = !!existing;

                return (
                  <div
                    key={svc.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected ? 'bg-[#FFF9EE] border-[#E8862B]' : 'bg-white border-[#D5C7B0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-start gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServices([
                                ...selectedServices,
                                {
                                  service_id: svc.id,
                                  name: svc.name,
                                  is_primary: false,
                                  years_experience: 5,
                                  price_type: 'dakshina_only',
                                  fixed_price: '',
                                  duration_minutes: 60,
                                  includes_samagri: false
                                }
                              ]);
                            } else {
                              setSelectedServices(selectedServices.filter(s => s.service_id !== svc.id));
                            }
                          }}
                          className="mt-1 accent-[#E8862B]"
                        />
                        <div>
                          <span className="text-sm font-bold text-[#241631] block">{svc.name}</span>
                          <span className="text-xs text-[#6E6074]">{svc.description}</span>
                        </div>
                      </label>

                      <span className="text-[11px] font-semibold text-[#8A5A12] bg-[#F6E7CE] px-2 py-0.5 rounded-md flex-none">
                        {svc.category}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-3 border-t border-[#EFE5D2] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#6E6074] mb-1">Pricing Mode</label>
                          <select
                            value={existing.price_type}
                            onChange={(e) => {
                              setSelectedServices(selectedServices.map(s => s.service_id === svc.id ? { ...s, price_type: e.target.value } : s));
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#D5C7B0] rounded-lg focus:border-[#E8862B] outline-none"
                          >
                            <option value="dakshina_only">Yajman Dakshina Only</option>
                            <option value="fixed">Fixed Price (₹)</option>
                            <option value="range">Range (₹ Min - Max)</option>
                            <option value="on_request">On Request</option>
                          </select>
                        </div>

                        {existing.price_type === 'fixed' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-[#6E6074] mb-1">Fixed Dakshina (₹)</label>
                            <input
                              type="number"
                              value={existing.fixed_price}
                              onChange={(e) => {
                                setSelectedServices(selectedServices.map(s => s.service_id === svc.id ? { ...s, fixed_price: e.target.value } : s));
                              }}
                              placeholder="e.g. 2100"
                              className="w-full px-2.5 py-1.5 bg-white border border-[#D5C7B0] rounded-lg focus:border-[#E8862B] outline-none"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[11px] font-semibold text-[#6E6074] mb-1">Duration (Mins)</label>
                          <input
                            type="number"
                            value={existing.duration_minutes}
                            onChange={(e) => {
                              setSelectedServices(selectedServices.map(s => s.service_id === svc.id ? { ...s, duration_minutes: e.target.value } : s));
                            }}
                            placeholder="60"
                            className="w-full px-2.5 py-1.5 bg-white border border-[#D5C7B0] rounded-lg focus:border-[#E8862B] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3 flex items-center gap-4 mt-1">
                          <label className="flex items-center gap-1.5 text-xs text-[#241631] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={existing.includes_samagri}
                              onChange={(e) => {
                                setSelectedServices(selectedServices.map(s => s.service_id === svc.id ? { ...s, includes_samagri: e.target.checked } : s));
                              }}
                              className="accent-[#E8862B]"
                            />
                            <span>Includes complete Puja Samagri</span>
                          </label>

                          <label className="flex items-center gap-1.5 text-xs text-[#8A5A12] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={existing.is_primary}
                              onChange={(e) => {
                                setSelectedServices(selectedServices.map(s => s.service_id === svc.id ? { ...s, is_primary: e.target.checked } : s));
                              }}
                              className="accent-[#E8862B]"
                            />
                            <span>Highlight as My Core Speciality</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveServices}
                className="px-8 py-3 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{saving ? 'Saving...' : 'Save & Continue to Step 4'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Languages */}
        {currentStep === 4 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>🗣️</span>
              <span>Step 4: Languages &amp; Vedic Chanting</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Select all languages you speak and can explain rituals in to Yajmans.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {masterData.languages.map((lang) => {
                const existing = selectedLanguages.find(l => l.language_id === lang.id);
                const isSelected = !!existing;

                return (
                  <div
                    key={lang.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected ? 'bg-[#FFF9EE] border-[#E8862B]' : 'bg-white border-[#D5C7B0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-[#241631]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLanguages([
                                ...selectedLanguages,
                                {
                                  language_id: lang.id,
                                  name: lang.name,
                                  fluency: 'fluent',
                                  can_recite_mantras: true,
                                  is_primary: false
                                }
                              ]);
                            } else {
                              setSelectedLanguages(selectedLanguages.filter(l => l.language_id !== lang.id));
                            }
                          }}
                          className="accent-[#E8862B]"
                        />
                        <span>{lang.name}</span>
                      </label>
                      <span className="text-xs text-[#8C7558]">{lang.script}</span>
                    </div>

                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-[#EFE5D2] flex items-center justify-between text-xs">
                        <select
                          value={existing.fluency}
                          onChange={(e) => {
                            setSelectedLanguages(selectedLanguages.map(l => l.language_id === lang.id ? { ...l, fluency: e.target.value } : l));
                          }}
                          className="px-2 py-1 bg-white border border-[#D5C7B0] rounded-lg outline-none text-xs"
                        >
                          <option value="native">Native</option>
                          <option value="fluent">Fluent</option>
                          <option value="intermediate">Intermediate</option>
                        </select>

                        <label className="flex items-center gap-1.5 text-xs text-[#2E5E35] font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={existing.can_recite_mantras}
                            onChange={(e) => {
                              setSelectedLanguages(selectedLanguages.map(l => l.language_id === lang.id ? { ...l, can_recite_mantras: e.target.checked } : l));
                            }}
                            className="accent-[#2E5E35]"
                          />
                          <span>Recite Mantras</span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveLanguages}
                className="px-8 py-3 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{saving ? 'Saving...' : 'Save & Continue to Step 5'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Gurukul & Education */}
        {currentStep === 5 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>📜</span>
              <span>Step 5: Gurukul &amp; Vedic Education</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Add your Gurukul, Veda Pathshala, or Sanskrit University certifications (Shastri, Acharya, Vedavidya).
            </p>

            <div className="space-y-3 mb-6">
              {educationList.map((edu, idx) => (
                <div key={idx} className="p-4 bg-[#F8F4EB] rounded-2xl border border-[#EBE1D0] flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#241631]">{edu.degree_or_title}</h4>
                    <p className="text-xs text-[#8A5A12] font-semibold">{edu.institution_name} ({edu.institution_type})</p>
                    {edu.year_of_passing && <p className="text-xs text-[#6E6074]">Passing Year: {edu.year_of_passing}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setEducationList(educationList.filter((_, i) => i !== idx))}
                    className="text-xs text-red-600 hover:text-red-800 font-bold"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setEducationList([
                    ...educationList,
                    {
                      institution_name: 'Sampurnanand Sanskrit Vishwavidyalaya',
                      institution_type: 'sanskrit_university',
                      degree_or_title: 'Shastri (Veda)',
                      field_of_study: 'Karma Kanda & Vedic Chanting',
                      year_of_passing: 2015,
                      honors: 'Gold Medalist in Rigveda Samhita'
                    }
                  ]);
                }}
                className="w-full py-2.5 border-2 border-dashed border-[#D5C7B0] hover:border-[#E8862B] text-xs font-bold text-[#8A5A12] rounded-2xl transition-colors"
              >
                + Add Education / Gurukul Record
              </button>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveEducation}
                className="px-8 py-3 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{saving ? 'Saving...' : 'Save & Continue to Step 6'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Temple / Sansthan Experience */}
        {currentStep === 6 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>🛕</span>
              <span>Step 6: Temple &amp; Ashram Experience</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Detail your experience serving at temples, ashrams, trusts, or independent Purohit practice.
            </p>

            <div className="space-y-3 mb-6">
              {experienceList.map((exp, idx) => (
                <div key={idx} className="p-4 bg-[#F8F4EB] rounded-2xl border border-[#EBE1D0] flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#241631]">{exp.role_title}</h4>
                    <p className="text-xs text-[#8A5A12] font-semibold">{exp.organization_or_temple_name} ({exp.temple_type})</p>
                    <p className="text-xs text-[#6E6074]">{exp.city}, {exp.state} ({exp.start_year} - {exp.is_current ? 'Present' : exp.end_year})</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExperienceList(experienceList.filter((_, i) => i !== idx))}
                    className="text-xs text-red-600 hover:text-red-800 font-bold"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setExperienceList([
                    ...experienceList,
                    {
                      organization_or_temple_name: 'Shri Siddhivinayak Temple Trust',
                      role_title: 'Head Purohit',
                      temple_type: 'temple',
                      city: 'Mumbai',
                      state: 'Maharashtra',
                      start_year: 2016,
                      is_current: true,
                      key_rituals_handled: 'Ganesh Yajna, Abhishek, Vivah'
                    }
                  ]);
                }}
                className="w-full py-2.5 border-2 border-dashed border-[#D5C7B0] hover:border-[#E8862B] text-xs font-bold text-[#8A5A12] rounded-2xl transition-colors"
              >
                + Add Temple / Sansthan Experience
              </button>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveExperience}
                className="px-8 py-3 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{saving ? 'Saving...' : 'Save & Continue to Step 7'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Location & Travel */}
        {currentStep === 7 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>📍</span>
              <span>Step 7: Service Locations &amp; Travel Radius</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Specify your primary base city, travel distance, and outstation availability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Primary Base City *</label>
                <input
                  type="text"
                  required
                  value={locationForm.residential.city}
                  onChange={(e) => setLocationForm({
                    ...locationForm,
                    residential: { ...locationForm.residential, city: e.target.value }
                  })}
                  placeholder="e.g. Mumbai"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={locationForm.residential.state}
                  onChange={(e) => setLocationForm({
                    ...locationForm,
                    residential: { ...locationForm.residential, state: e.target.value }
                  })}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Max Travel Distance (KM)</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={locationForm.residential.max_travel_distance_km}
                  onChange={(e) => setLocationForm({
                    ...locationForm,
                    residential: { ...locationForm.residential, max_travel_distance_km: Number(e.target.value) }
                  })}
                  placeholder="50"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E6074] mb-1">Residential Address / Area (Private)</label>
                <input
                  type="text"
                  value={locationForm.residential.current_address}
                  onChange={(e) => setLocationForm({
                    ...locationForm,
                    residential: { ...locationForm.residential, current_address: e.target.value }
                  })}
                  placeholder="Street / Colony name (Never displayed publicly)"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D5C7B0] rounded-xl focus:border-[#E8862B] outline-none text-[#241631]"
                />
              </div>
            </div>

            <div className="bg-[#F8F4EB] p-4 rounded-2xl border border-[#EBE1D0] space-y-2 mb-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={locationForm.residential.travel_available}
                  onChange={(e) => setLocationForm({
                    ...locationForm,
                    residential: { ...locationForm.residential, travel_available: e.target.checked }
                  })}
                  className="accent-[#E8862B]"
                />
                <span className="font-semibold text-[#241631]">Travel Available to Yajman's House / Venue</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={locationForm.residential.outstation_available}
                  onChange={(e) => setLocationForm({
                    ...locationForm,
                    residential: { ...locationForm.residential, outstation_available: e.target.checked }
                  })}
                  className="accent-[#E8862B]"
                />
                <span className="font-semibold text-[#241631]">Outstation Travel Available for Destination Weddings &amp; Havans</span>
              </label>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveLocation}
                className="px-8 py-3 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{saving ? 'Saving...' : 'Save & Continue to Step 8'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: Availability & Service Modes */}
        {currentStep === 8 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>📅</span>
              <span>Step 8: Weekly Availability &amp; Service Modes</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Configure which days and time slots you are open for pujas.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#6E6074] mb-2">Available Days of Week</label>
              <div className="flex flex-wrap gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const isChecked = availabilityForm.available_days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setAvailabilityForm({
                            ...availabilityForm,
                            available_days: availabilityForm.available_days.filter(d => d !== day)
                          });
                        } else {
                          setAvailabilityForm({
                            ...availabilityForm,
                            available_days: [...availabilityForm.available_days, day]
                          });
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        isChecked ? 'bg-[#2E5E35] text-white shadow-xs' : 'bg-white border border-[#D5C7B0] text-[#6E6074]'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer ${
                availabilityForm.morning_slot ? 'bg-[#FFF2DE] border-[#E8862B] font-semibold' : 'bg-white border-[#D5C7B0]'
              }`}>
                <input
                  type="checkbox"
                  checked={availabilityForm.morning_slot}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, morning_slot: e.target.checked })}
                  className="accent-[#E8862B]"
                />
                <span>Morning (6 AM - 12 PM)</span>
              </label>

              <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer ${
                availabilityForm.afternoon_slot ? 'bg-[#FFF2DE] border-[#E8862B] font-semibold' : 'bg-white border-[#D5C7B0]'
              }`}>
                <input
                  type="checkbox"
                  checked={availabilityForm.afternoon_slot}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, afternoon_slot: e.target.checked })}
                  className="accent-[#E8862B]"
                />
                <span>Afternoon (12 PM - 5 PM)</span>
              </label>

              <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer ${
                availabilityForm.evening_slot ? 'bg-[#FFF2DE] border-[#E8862B] font-semibold' : 'bg-white border-[#D5C7B0]'
              }`}>
                <input
                  type="checkbox"
                  checked={availabilityForm.evening_slot}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, evening_slot: e.target.checked })}
                  className="accent-[#E8862B]"
                />
                <span>Evening (5 PM - 10 PM)</span>
              </label>
            </div>

            <div className="bg-[#F8F4EB] p-4 rounded-2xl border border-[#EBE1D0] space-y-2.5 mb-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityForm.allows_home_visit}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, allows_home_visit: e.target.checked })}
                  className="accent-[#E8862B]"
                />
                <span className="font-semibold text-[#241631]">Home Visit Pujas (Yajman Residence)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityForm.allows_online_puja}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, allows_online_puja: e.target.checked })}
                  className="accent-[#E8862B]"
                />
                <span className="font-semibold text-[#241631]">Online Video E-Puja &amp; Sankalpa Support</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityForm.consultation_available}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, consultation_available: e.target.checked })}
                  className="accent-[#E8862B]"
                />
                <span className="font-semibold text-[#241631]">Astrology &amp; Muhurat Pre-Consultation</span>
              </label>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveAvailability}
                className="px-8 py-3 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{saving ? 'Saving...' : 'Save & Continue to Step 9'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 9: KYC & Document Verification */}
        {currentStep === 9 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>🛡️</span>
              <span>Step 9: KYC &amp; Verification Documents</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Upload proof of identity (Aadhaar / Voter ID / Purohit Card / Gurukul Degree). Documents are encrypted and strictly restricted to the verification council.
            </p>

            {/* Uploaded Documents List */}
            <div className="space-y-3 mb-6">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 bg-[#F8F4EB] rounded-2xl border border-[#EBE1D0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#241631]">{doc.document_title || doc.document_type}</h4>
                      <p className="text-[11px] text-[#6E6074]">
                        Status: <b className={`capitalize ${doc.verification_status === 'verified' ? 'text-green-700' : 'text-amber-700'}`}>{doc.verification_status}</b>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-bold"
                  >
                    ✕ Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Document Upload Box */}
            <form onSubmit={handleDocUpload} className="p-5 bg-white border border-[#D5C7B0] rounded-2xl mb-6">
              <h4 className="text-xs font-bold text-[#241631] mb-3">Upload New Verification Document</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E6074] mb-1">Document Type</label>
                  <select
                    value={docUploadForm.document_type}
                    onChange={(e) => setDocUploadForm({ ...docUploadForm, document_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#D5C7B0] rounded-xl outline-none"
                  >
                    <option value="AADHAAR">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="VOTER_ID">Voter ID</option>
                    <option value="EDUCATION_CERTIFICATE">Gurukul / University Degree</option>
                    <option value="PUROHIT_ID">Temple Purohit ID</option>
                    <option value="TEMPLE_LETTER">Temple Letter of Recommendation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6E6074] mb-1">Document Title / Number</label>
                  <input
                    type="text"
                    value={docUploadForm.document_title}
                    onChange={(e) => setDocUploadForm({ ...docUploadForm, document_title: e.target.value })}
                    placeholder="e.g. Gurukul Acharya Sanad"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#D5C7B0] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-[#6E6074] mb-1">Select File (PDF, JPG, PNG - Max 10MB)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => setSelectedDocFile(e.target.files?.[0] || null)}
                  className="text-xs text-[#8A5A12] file:mr-3 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#E8862B] file:text-[#2A1503] hover:file:bg-[#D8791F] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-[#2B1736] hover:bg-[#3B1F4B] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                + Upload Document
              </button>
            </form>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(8)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(10)}
                className="px-8 py-3 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Proceed to Review &amp; Submit</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 10: Preview & Final Submission */}
        {currentStep === 10 && (
          <div>
            <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-xl font-bold text-[#241631] mb-2 flex items-center gap-2">
              <span>🕉️</span>
              <span>Step 10: Review Profile &amp; Submit</span>
            </h2>
            <p className="text-xs text-[#6E6074] mb-6">
              Review your information before submitting to the Vedic moderation council for public listing.
            </p>

            <div className="bg-[#F8F4EB] p-5 rounded-2xl border border-[#EBE1D0] space-y-4 mb-6 text-xs text-[#241631]">
              <div className="flex items-center justify-between border-b border-[#E3D6BF] pb-3">
                <div>
                  <h3 className="font-bold text-sm">{basicForm.title} {basicForm.full_name}</h3>
                  <p className="text-[#6E6074]">{locationForm.residential.city}, {locationForm.residential.state} · {basicForm.years_of_experience} Years Experience</p>
                </div>
                <span className="bg-[#FFF2DE] text-[#8A5A12] px-3 py-1 rounded-full font-bold">
                  {profile?.status || 'Draft'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><b>Veda Tradition:</b> {religiousForm.veda}</div>
                <div><b>Gotra:</b> {religiousForm.gotra || 'Not Specified'}</div>
                <div><b>Sampradaya:</b> {religiousForm.sampradaya || 'Smartha'}</div>
                <div><b>Services Offered:</b> {selectedServices.length} Ceremonies</div>
                <div><b>Languages:</b> {selectedLanguages.map(l => l.name).join(', ') || 'Sanskrit, Hindi'}</div>
                <div><b>Documents Uploaded:</b> {documents.length} Files</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(9)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#6E6074] hover:bg-[#EFE5D2]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSubmitVerification}
                className="px-9 py-3.5 rounded-full bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-bold text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <span>{saving ? 'Submitting...' : 'Submit Profile for Verification 🪔'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
