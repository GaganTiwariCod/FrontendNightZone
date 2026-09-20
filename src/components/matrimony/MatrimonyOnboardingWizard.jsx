import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { matrimonyApi } from '../../api/matrimonyApi';
import PhotoUploadManager from './PhotoUploadManager';
import FamilyMemberManager from './FamilyMemberManager';

const STEPS = [
  { id: 1, key: 'account', title: 'Account Info', icon: '👤' },
  { id: 2, key: 'basic', title: 'Basic Details', icon: '📝' },
  { id: 3, key: 'religion', title: 'Religion & Cultural', icon: '🪔' },
  { id: 4, key: 'location', title: 'Location', icon: '📍' },
  { id: 5, key: 'education', title: 'Education', icon: '🎓' },
  { id: 6, key: 'career', title: 'Career', icon: '💼' },
  { id: 7, key: 'lifestyle', title: 'Lifestyle & Hobbies', icon: '🌿' },
  { id: 8, key: 'family', title: 'Family Details', icon: '👨‍👩‍👦' },
  { id: 9, key: 'about', title: 'About Me', icon: '✍️' },
  { id: 10, key: 'photos', title: 'Photos', icon: '📷' },
  { id: 11, key: 'horoscope', title: 'Horoscope / Kundli', icon: '✨' },
  { id: 12, key: 'preferences', title: 'Partner Preferences', icon: '❤️' },
  { id: 13, key: 'privacy', title: 'Privacy Settings', icon: '🔒' },
  { id: 14, key: 'review', title: 'Review & Publish', icon: '🚀' }
];

export default function MatrimonyOnboardingWizard({ initialStep = 2, onExit, onPreview }) {
  const { user, showToast } = useAuth();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [masterData, setMasterData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState({ completionPercentage: 0, sections: {} });

  // Form states per step
  const [formData, setFormData] = useState({
    // Step 2: Basic
    profile_created_for: 'myself',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: 'male',
    date_of_birth: '',
    height: 170,
    height_unit: 'cm',
    marital_status: 'never_married',
    mother_tongue: 'Hindi',

    // Step 3: Religion
    religion: 'Hindu',
    community: 'Brahmin',
    sub_community: '',
    caste_no_bar: false,
    gotra: '',
    rashi: '',
    nakshatra: '',
    manglik_status: 'dont_know',
    religious_values: 'moderate',
    horoscope_available: false,

    // Step 4: Location
    country: 'India',
    state: '',
    city: '',
    district: '',
    current_country: 'India',
    current_state: 'Maharashtra',
    current_city: 'Mumbai',
    hometown: '',
    hometown_state: '',
    hometown_country: 'India',
    grew_up_in: '',
    residential_status: 'citizen',
    relocation_preference: 'not_sure',

    // Step 5: Education
    highest_education: 'Bachelor of Engineering / B.Tech',
    education_field: 'Computer Science',
    college_name: '',
    university_name: '',
    additional_qualification: '',
    education_description: '',

    // Step 6: Career
    employment_status: 'employed',
    profession: 'Software Engineer / IT Professional',
    job_title: '',
    company_name: '',
    industry: '',
    work_city: 'Mumbai',
    work_state: 'Maharashtra',
    work_country: 'India',
    years_of_experience: 3,
    annual_income: 1200000,
    income_currency: 'INR',
    income_visibility: 'visible',
    employment_type: 'full_time',

    // Step 7: Lifestyle
    diet: 'vegetarian',
    smoking: 'never',
    drinking: 'never',
    body_type: 'average',
    physical_status: 'normal',
    languages_spoken: ['Hindi', 'English'],
    hobby_ids: [],

    // Step 8: Family
    family_type: 'nuclear',
    family_values: 'moderate',
    family_status: 'middle_class',
    family_location: '',
    father_occupation: '',
    father_status: 'employed',
    mother_occupation: '',
    mother_status: 'homemaker',
    family_description: '',

    // Step 9: About
    about_me: '',

    // Step 11: Horoscope
    birth_time: '',
    birth_place: '',
    birth_city: '',
    birth_state: '',
    birth_country: 'India',
    horoscope_rashi: '',
    horoscope_nakshatra: '',
    horoscope_manglik: 'dont_know',
    horoscope_gotra: '',
    horoscope_visibility: 'registered_users',

    // Step 12: Partner Preferences
    min_age: 21,
    max_age: 30,
    pref_min_height: 155,
    pref_max_height: 185,
    pref_genders: ['female'],
    pref_religions: ['Hindu'],
    pref_communities: [],
    pref_mother_tongues: ['Hindi'],
    pref_marital_statuses: ['never_married'],
    pref_states: ['Maharashtra'],
    pref_cities: [],
    pref_education_levels: [],
    pref_professions: [],
    pref_diet: ['vegetarian', 'eggetarian'],
    pref_manglik: ['dont_know', 'no'],
    additional_preferences: '',

    // Step 13: Privacy Settings
    profile_visibility: 'public',
    photo_visibility: 'public',
    contact_visibility: 'private',
    priv_horoscope_visibility: 'registered_users',
    priv_income_visibility: 'visible'
  });

  // Load Profile & Master Data on mount
  const loadData = async () => {
    setFetching(true);
    try {
      const [profRes, masterRes] = await Promise.all([
        matrimonyApi.getMyProfile(),
        matrimonyApi.getMasterData()
      ]);

      if (masterRes?.data) {
        setMasterData(masterRes.data);
      }

      if (profRes?.data?.profile) {
        const p = profRes.data.profile;
        setProfile(p);
        setCompletion(profRes.data.completion || { completionPercentage: p.completion_percentage, sections: {} });

        // Prepopulate form
        setFormData((prev) => ({
          ...prev,
          profile_created_for: p.profile_created_for || 'myself',
          first_name: p.first_name || user?.name?.split(' ')[0] || '',
          middle_name: p.middle_name || '',
          last_name: p.last_name || (user?.name?.split(' ').slice(1).join(' ') || ''),
          gender: p.gender || 'male',
          date_of_birth: p.date_of_birth || '',
          height: p.height || 170,
          height_unit: p.height_unit || 'cm',
          marital_status: p.marital_status || 'never_married',
          mother_tongue: p.mother_tongue || 'Hindi',

          // Religion
          religion: p.religiousProfile?.religion || 'Hindu',
          community: p.religiousProfile?.community || 'Brahmin',
          sub_community: p.religiousProfile?.sub_community || '',
          caste_no_bar: !!p.religiousProfile?.caste_no_bar,
          gotra: p.religiousProfile?.gotra || '',
          rashi: p.religiousProfile?.rashi || '',
          nakshatra: p.religiousProfile?.nakshatra || '',
          manglik_status: p.religiousProfile?.manglik_status || 'dont_know',
          religious_values: p.religiousProfile?.religious_values || 'moderate',

          // Location
          current_country: p.locationProfile?.current_country || 'India',
          current_state: p.locationProfile?.current_state || 'Maharashtra',
          current_city: p.locationProfile?.current_city || 'Mumbai',
          hometown: p.locationProfile?.hometown || '',
          hometown_state: p.locationProfile?.hometown_state || '',
          residential_status: p.locationProfile?.residential_status || 'citizen',

          // Education
          highest_education: p.educationProfile?.highest_education || 'Bachelor of Engineering / B.Tech',
          education_field: p.educationProfile?.education_field || '',
          college_name: p.educationProfile?.college_name || '',
          university_name: p.educationProfile?.university_name || '',

          // Career
          employment_status: p.careerProfile?.employment_status || 'employed',
          profession: p.careerProfile?.profession || 'Software Engineer / IT Professional',
          job_title: p.careerProfile?.job_title || '',
          company_name: p.careerProfile?.company_name || '',
          work_city: p.careerProfile?.work_city || 'Mumbai',
          work_state: p.careerProfile?.work_state || 'Maharashtra',
          annual_income: p.careerProfile?.annual_income || 1200000,
          income_visibility: p.careerProfile?.income_visibility || 'visible',

          // Lifestyle
          diet: p.lifestyleProfile?.diet || 'vegetarian',
          smoking: p.lifestyleProfile?.smoking || 'never',
          drinking: p.lifestyleProfile?.drinking || 'never',
          languages_spoken: p.lifestyleProfile?.languages_spoken || ['Hindi', 'English'],
          hobby_ids: p.hobbies?.map(h => h.id) || [],

          // Family
          family_type: p.familyProfile?.family_type || 'nuclear',
          family_values: p.familyProfile?.family_values || 'moderate',
          family_status: p.familyProfile?.family_status || 'middle_class',
          father_status: p.familyProfile?.father_status || 'employed',
          father_occupation: p.familyProfile?.father_occupation || '',
          mother_status: p.familyProfile?.mother_status || 'homemaker',
          mother_occupation: p.familyProfile?.mother_occupation || '',
          family_description: p.familyProfile?.family_description || '',

          // About
          about_me: p.about_me || '',

          // Horoscope
          birth_time: p.horoscopeProfile?.time_of_birth || '',
          birth_place: p.horoscopeProfile?.birth_place || '',
          horoscope_rashi: p.horoscopeProfile?.rashi || '',
          horoscope_nakshatra: p.horoscopeProfile?.nakshatra || '',
          horoscope_manglik: p.horoscopeProfile?.manglik_status || 'dont_know',

          // Preferences
          min_age: p.partnerPreference?.min_age || 21,
          max_age: p.partnerPreference?.max_age || 30,
          pref_religions: p.partnerPreference?.religions || ['Hindu'],
          pref_mother_tongues: p.partnerPreference?.mother_tongues || ['Hindi'],
          pref_diet: p.partnerPreference?.diet_preferences || ['vegetarian'],
          additional_preferences: p.partnerPreference?.additional_preferences || '',

          // Privacy
          profile_visibility: p.privacySetting?.profile_visibility || 'public',
          photo_visibility: p.privacySetting?.photo_visibility || 'public',
          contact_visibility: p.privacySetting?.contact_visibility || 'private'
        }));
      }
    } catch (err) {
      showToast('Could not load profile details.', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save current step payload
  const handleSaveStep = async (stepId, isContinue = true) => {
    setLoading(true);
    try {
      let stepName = '';
      let payload = {};

      if (stepId === 2) {
        stepName = 'basic';
        payload = {
          profile_created_for: formData.profile_created_for,
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth || '1998-01-01',
          height: parseFloat(formData.height) || 170,
          height_unit: formData.height_unit,
          marital_status: formData.marital_status,
          mother_tongue: formData.mother_tongue
        };
      } else if (stepId === 3) {
        stepName = 'religion';
        payload = {
          religion: formData.religion,
          community: formData.community,
          sub_community: formData.sub_community,
          caste_no_bar: formData.caste_no_bar,
          gotra: formData.gotra,
          rashi: formData.rashi,
          nakshatra: formData.nakshatra,
          manglik_status: formData.manglik_status,
          religious_values: formData.religious_values
        };
      } else if (stepId === 4) {
        stepName = 'location';
        payload = {
          current_country: formData.current_country,
          current_state: formData.current_state,
          current_city: formData.current_city,
          hometown: formData.hometown,
          hometown_state: formData.hometown_state,
          residential_status: formData.residential_status
        };
      } else if (stepId === 5) {
        stepName = 'education';
        payload = {
          highest_education: formData.highest_education,
          education_field: formData.education_field,
          college_name: formData.college_name,
          university_name: formData.university_name
        };
      } else if (stepId === 6) {
        stepName = 'career';
        payload = {
          employment_status: formData.employment_status,
          profession: formData.profession,
          job_title: formData.job_title,
          company_name: formData.company_name,
          work_city: formData.work_city,
          work_state: formData.work_state,
          annual_income: parseFloat(formData.annual_income) || 0,
          income_visibility: formData.income_visibility,
          employment_type: formData.employment_type
        };
      } else if (stepId === 7) {
        stepName = 'lifestyle';
        payload = {
          diet: formData.diet,
          smoking: formData.smoking,
          drinking: formData.drinking,
          body_type: formData.body_type,
          languages_spoken: formData.languages_spoken,
          hobby_ids: formData.hobby_ids
        };
      } else if (stepId === 8) {
        stepName = 'family';
        payload = {
          family_type: formData.family_type,
          family_values: formData.family_values,
          family_status: formData.family_status,
          father_status: formData.father_status,
          father_occupation: formData.father_occupation,
          mother_status: formData.mother_status,
          mother_occupation: formData.mother_occupation,
          family_description: formData.family_description
        };
      } else if (stepId === 9) {
        stepName = 'about';
        payload = {
          about_me: formData.about_me
        };
      } else if (stepId === 11) {
        stepName = 'horoscope';
        payload = {
          time_of_birth: formData.birth_time,
          birth_place: formData.birth_place,
          rashi: formData.horoscope_rashi,
          nakshatra: formData.horoscope_nakshatra,
          manglik_status: formData.horoscope_manglik,
          horoscope_visibility: formData.horoscope_visibility
        };
      } else if (stepId === 12) {
        stepName = 'preferences';
        payload = {
          min_age: parseInt(formData.min_age, 10) || 18,
          max_age: parseInt(formData.max_age, 10) || 40,
          religions: formData.pref_religions,
          mother_tongues: formData.pref_mother_tongues,
          diet_preferences: formData.pref_diet,
          additional_preferences: formData.additional_preferences
        };
      } else if (stepId === 13) {
        stepName = 'privacy';
        payload = {
          profile_visibility: formData.profile_visibility,
          photo_visibility: formData.photo_visibility,
          contact_visibility: formData.contact_visibility
        };
      }

      if (stepName) {
        const res = await matrimonyApi.saveStep(stepName, payload);
        if (res?.data?.profile) {
          setProfile(res.data.profile);
          setCompletion(res.data.completion);
        }
      }

      showToast('Changes saved.');

      if (isContinue) {
        if (currentStep < 14) {
          setCurrentStep(currentStep + 1);
        }
      } else if (onExit) {
        onExit();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving step details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const res = await matrimonyApi.publishProfile();
      if (res.success) {
        showToast('🎉 Your matrimonial profile is published successfully!');
        if (onExit) onExit();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not publish profile yet.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#E8862B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#6E6074]">Loading Matrimonial Onboarding...</p>
        </div>
      </div>
    );
  }

  const currentStepObj = STEPS.find(s => s.id === currentStep) || STEPS[0];

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-6 text-[#2A2036]">
      
      {/* Top Header / Progress Bar */}
      <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentStepObj.icon}</span>
              <h1 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl font-normal text-[#241631] m-0">
                Step {currentStep} of 14: {currentStepObj.title}
              </h1>
            </div>
            <p className="text-xs text-[#6E6074] m-0 mt-0.5">
              Complete all sections to connect with verified community matches.
            </p>
          </div>

          {/* Completion pill */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-semibold text-[#6E6074]">Profile Completion</span>
              <div className="font-bold text-sm text-[#9E2B2B]">{completion.completionPercentage}%</div>
            </div>
            <button
              type="button"
              onClick={onExit}
              className="text-xs font-semibold text-[#6E6074] hover:text-[#241631] bg-[#F0E5CF] hover:bg-[#E3D6BF] px-3.5 py-1.5 rounded-full border-0 cursor-pointer transition-colors"
            >
              Save &amp; Exit
            </button>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="w-full h-2 bg-[#F0E5CF] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#E8862B] to-[#9E2B2B] transition-all duration-300"
            style={{ width: `${Math.max(5, (currentStep / 14) * 100)}%` }}
          />
        </div>

        {/* Quick step navigation pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id)}
              className={`flex-none text-[11.5px] font-semibold px-2.5 py-1 rounded-full transition-colors border-0 cursor-pointer ${
                currentStep === s.id
                  ? 'bg-[#9E2B2B] text-white'
                  : currentStep > s.id
                  ? 'bg-[#EDF4ED] text-[#4E6B4F]'
                  : 'bg-[#F6EFE1] text-[#8A7A64] hover:text-[#2A2036]'
              }`}
            >
              {s.id}. {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Step Form Card */}
      <div className="bg-[#FFFCF5] border-[1.5px] border-[#E3D6BF] rounded-[22px] p-6 sm:p-8 shadow-md">
        
        {/* ================= STEP 1: Account Info ================= */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Account &amp; Primary Identity</h2>
            <p className="text-sm text-[#6E6074]">
              Your matrimonial profile is securely linked to your registered Shubhkaal account.
            </p>

            <div className="bg-[#FFF8EC] border border-[#E8862B]/30 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6E6074]">Full Name:</span>
                <b className="text-[#241631]">{user?.name}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E6074]">Email (Verified):</span>
                <b className="text-[#241631]">{user?.email}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E6074]">Mobile Number:</span>
                <b className="text-[#241631]">{user?.phone || 'Captured on signup'}</b>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                Continue to Basic Details →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Basic Details ================= */}
        {currentStep === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(2, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Personal &amp; Basic Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Profile Created For *
                </label>
                <select
                  value={formData.profile_created_for}
                  onChange={(e) => setFormData({ ...formData, profile_created_for: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="myself">Myself</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="brother">Brother</option>
                  <option value="sister">Sister</option>
                  <option value="friend">Friend</option>
                  <option value="relative">Relative</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Gender *
                </label>
                <div className="flex gap-2">
                  {['male', 'female'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize border transition-colors cursor-pointer ${
                        formData.gender === g
                          ? 'bg-[#9E2B2B] text-white border-[#9E2B2B]'
                          : 'bg-white text-[#6E6074] border-[#E3D6BF]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Last Name / Surname *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Surname"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Date of Birth * (Calculates Age Dynamically)
                </label>
                <input
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  max="250"
                  placeholder="e.g. 175 cm (5'9'')"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Marital Status *
                </label>
                <select
                  value={formData.marital_status}
                  onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="never_married">Never Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="awaiting_divorce">Awaiting Divorce</option>
                  <option value="annulled">Annulled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Mother Tongue *
                </label>
                <select
                  value={formData.mother_tongue}
                  onChange={(e) => setFormData({ ...formData, mother_tongue: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  {(masterData?.motherTongues || ['Hindi', 'Marathi', 'Gujarati', 'Punjabi', 'Bengali', 'Tamil', 'Telugu']).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: Religion & Cultural ================= */}
        {currentStep === 3 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(3, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Religious &amp; Cultural Background</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Religion *
                </label>
                <select
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  {(masterData?.religions || [{ name: 'Hindu' }, { name: 'Jain' }, { name: 'Sikh' }]).map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Community / Caste *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brahmin, Maratha, Agarwal, Jain"
                  value={formData.community}
                  onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Sub-Community (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kanyakubja, Saraswat, Digambar"
                  value={formData.sub_community}
                  onChange={(e) => setFormData({ ...formData, sub_community: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Gotra (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kashyap, Shandilya, Bharadwaj"
                  value={formData.gotra}
                  onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Manglik Status
                </label>
                <select
                  value={formData.manglik_status}
                  onChange={(e) => setFormData({ ...formData, manglik_status: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="no">Non-Manglik</option>
                  <option value="yes">Manglik</option>
                  <option value="anshik">Anshik / Partial Manglik</option>
                  <option value="dont_know">Don't Know</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Rashi / Moon Sign
                </label>
                <select
                  value={formData.rashi}
                  onChange={(e) => setFormData({ ...formData, rashi: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="">Select Rashi</option>
                  {(masterData?.rashis || ['Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)']).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-[#6E6074] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formData.caste_no_bar}
                onChange={(e) => setFormData({ ...formData, caste_no_bar: e.target.checked })}
                className="accent-[#E8862B]"
              />
              <span>Caste is no bar for marriage</span>
            </label>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 4: Location ================= */}
        {currentStep === 4 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(4, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Current &amp; Native Location</h2>
            <p className="text-xs text-[#6E6074]">
              Exact residential house address is never displayed publicly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Current Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.current_country}
                  onChange={(e) => setFormData({ ...formData, current_country: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Current State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra, Karnataka, Delhi"
                  value={formData.current_state}
                  onChange={(e) => setFormData({ ...formData, current_state: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Current City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, Pune, Bengaluru"
                  value={formData.current_city}
                  onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Hometown / Native Place
                </label>
                <input
                  type="text"
                  placeholder="e.g. Varanasi, Nagpur, Jaipur"
                  value={formData.hometown}
                  onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Residential Status
                </label>
                <select
                  value={formData.residential_status}
                  onChange={(e) => setFormData({ ...formData, residential_status: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="citizen">Citizen</option>
                  <option value="permanent_resident">Permanent Resident (PR)</option>
                  <option value="work_permit">Work Permit / Visa</option>
                  <option value="student_visa">Student Visa</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 5: Education ================= */}
        {currentStep === 5 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(5, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Education Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Highest Education *
                </label>
                <select
                  value={formData.highest_education}
                  onChange={(e) => setFormData({ ...formData, highest_education: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  {(masterData?.educationLevels || ['Bachelor of Engineering / B.Tech', 'MBA', 'MBBS']).map(ed => (
                    <option key={ed} value={ed}>{ed}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Field / Major
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Finance, Marketing"
                  value={formData.education_field}
                  onChange={(e) => setFormData({ ...formData, education_field: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  College / Institute Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. IIT Bombay, Delhi University"
                  value={formData.college_name}
                  onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  University / Board
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai University, Pune University"
                  value={formData.university_name}
                  onChange={(e) => setFormData({ ...formData, university_name: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 6: Career ================= */}
        {currentStep === 6 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(6, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Career &amp; Professional Background</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Employment Status *
                </label>
                <select
                  value={formData.employment_status}
                  onChange={(e) => setFormData({ ...formData, employment_status: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="employed">Employed in Private Sector</option>
                  <option value="government">Government / Public Sector</option>
                  <option value="business">Business / Entrepreneur</option>
                  <option value="self_employed">Self Employed / Professional</option>
                  <option value="student">Student</option>
                  <option value="not_working">Not Working</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Profession *
                </label>
                <select
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  {(masterData?.professions || ['Software Engineer', 'Doctor', 'Chartered Accountant']).map(prof => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tata Consultancy Services, Infosys, Self"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Annual Income (INR Numeric) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  placeholder="e.g. 1500000 (15 Lakhs)"
                  value={formData.annual_income}
                  onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Income Visibility
                </label>
                <select
                  value={formData.income_visibility}
                  onChange={(e) => setFormData({ ...formData, income_visibility: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="visible">Visible to all registered members</option>
                  <option value="hidden">Keep income amount hidden</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 7: Lifestyle & Hobbies ================= */}
        {currentStep === 7 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(7, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Lifestyle &amp; Interests</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Diet Habits *
                </label>
                <select
                  value={formData.diet}
                  onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="jain">Jain Diet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Smoking
                </label>
                <select
                  value={formData.smoking}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="never">No / Non-Smoker</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="regularly">Regularly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Drinking
                </label>
                <select
                  value={formData.drinking}
                  onChange={(e) => setFormData({ ...formData, drinking: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="never">Non-Drinker</option>
                  <option value="occasionally">Social / Occasional Drinker</option>
                  <option value="regularly">Regularly</option>
                </select>
              </div>
            </div>

            {/* Hobbies Selection */}
            {masterData?.hobbies && masterData.hobbies.length > 0 && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#4A3D52] mb-2 uppercase tracking-wider">
                  Select Hobbies &amp; Interests ({formData.hobby_ids.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {masterData.hobbies.map((h) => {
                    const isSelected = formData.hobby_ids.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          const updated = isSelected 
                            ? formData.hobby_ids.filter(id => id !== h.id)
                            : [...formData.hobby_ids, h.id];
                          setFormData({ ...formData, hobby_ids: updated });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors border cursor-pointer ${
                          isSelected
                            ? 'bg-[#E8862B] text-[#2A1503] border-[#E8862B] font-bold shadow-xs'
                            : 'bg-white text-[#6E6074] border-[#E3D6BF] hover:border-[#E8862B]'
                        }`}
                      >
                        <span>{h.icon || '✨'}</span>
                        <span>{h.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 8: Family ================= */}
        {currentStep === 8 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(8, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Family Details &amp; Members</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Family Type
                </label>
                <select
                  value={formData.family_type}
                  onChange={(e) => setFormData({ ...formData, family_type: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="nuclear">Nuclear Family</option>
                  <option value="joint">Joint Family</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Family Values
                </label>
                <select
                  value={formData.family_values}
                  onChange={(e) => setFormData({ ...formData, family_values: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="traditional">Traditional</option>
                  <option value="moderate">Moderate</option>
                  <option value="liberal">Liberal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Family Status
                </label>
                <select
                  value={formData.family_status}
                  onChange={(e) => setFormData({ ...formData, family_status: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  <option value="middle_class">Middle Class</option>
                  <option value="upper_middle_class">Upper Middle Class</option>
                  <option value="rich">Rich</option>
                  <option value="affluent">Affluent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Father's Status / Occupation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Business Owner / Retired Bank Officer"
                  value={formData.father_occupation}
                  onChange={(e) => setFormData({ ...formData, father_occupation: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Mother's Status / Occupation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Homemaker / School Teacher"
                  value={formData.mother_occupation}
                  onChange={(e) => setFormData({ ...formData, mother_occupation: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Dynamic Sibling & Family Members Manager */}
            <FamilyMemberManager
              familyMembers={profile?.familyMembers || []}
              onMembersUpdated={loadData}
              showToast={showToast}
            />

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 9: About Me ================= */}
        {currentStep === 9 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(9, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">About Me (Self Introduction)</h2>
            <p className="text-xs text-[#6E6074]">
              Write about your personality, values, career goals, and what you are looking for in a partner.
            </p>

            {/* Privacy Warning Banner */}
            <div className="bg-[#FFF8EC] border border-[#E8862B]/50 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#8A5A12]">
              <span className="text-base flex-none">🛡️</span>
              <div>
                <b className="font-semibold block mb-0.5">Contact Privacy Protection Active:</b>
                Do NOT include phone numbers, email addresses, social media IDs, or external website URLs. The backend validator will reject contact leaks to ensure your safety.
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#4A3D52] uppercase tracking-wider">
                  Your Bio * (Min 20 characters)
                </label>
                <span className={`text-xs font-bold ${
                  formData.about_me.length > 950 ? 'text-red-500' : 'text-[#6E6074]'
                }`}>
                  {formData.about_me.length} / 1000 characters
                </span>
              </div>

              <textarea
                rows="6"
                required
                minLength="20"
                maxLength="1000"
                placeholder="I am an ambitious and kind-hearted person who enjoys travelling and spending time with family. Looking for an educated partner with shared cultural values..."
                value={formData.about_me}
                onChange={(e) => setFormData({ ...formData, about_me: e.target.value })}
                className="w-full bg-white border-[1.5px] border-[#E3D6BF] focus:border-[#E8862B] rounded-xl p-3.5 text-sm text-[#2A2036] outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(8)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading || formData.about_me.length < 20}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 10: Photos ================= */}
        {currentStep === 10 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Profile &amp; Additional Photos</h2>
            <p className="text-xs text-[#6E6074]">
              Profiles with photos receive 8x higher interest and connection requests.
            </p>

            <PhotoUploadManager
              photos={profile?.photos || []}
              onPhotosUpdated={loadData}
              showToast={showToast}
            />

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(9)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(11)}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                Continue to Horoscope →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 11: Horoscope / Astrology ================= */}
        {currentStep === 11 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(11, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Horoscope &amp; Astrology (Optional)</h2>
            <p className="text-xs text-[#6E6074]">
              Provide birth details for Guna Milan and astrological compatibility.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Time of Birth
                </label>
                <input
                  type="time"
                  value={formData.birth_time}
                  onChange={(e) => setFormData({ ...formData, birth_time: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Place of Birth
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Varanasi, Jaipur"
                  value={formData.birth_place}
                  onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(10)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 12: Partner Preferences ================= */}
        {currentStep === 12 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(12, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Desired Partner Preferences</h2>
            <p className="text-xs text-[#6E6074]">
              Set criteria for matches including age range, religion, community, education, and lifestyle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Partner Age Range ({formData.min_age} - {formData.max_age} yrs)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="18"
                    max="70"
                    value={formData.min_age}
                    onChange={(e) => setFormData({ ...formData, min_age: e.target.value })}
                    className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="18"
                    max="70"
                    value={formData.max_age}
                    onChange={(e) => setFormData({ ...formData, max_age: e.target.value })}
                    className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                  Preferred Religion
                </label>
                <select
                  value={formData.pref_religions[0] || 'Hindu'}
                  onChange={(e) => setFormData({ ...formData, pref_religions: [e.target.value] })}
                  className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none"
                >
                  {(masterData?.religions || [{ name: 'Hindu' }, { name: 'Jain' }, { name: 'Sikh' }]).map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A3D52] mb-1 uppercase tracking-wider">
                Specific Partner Expectations (Optional)
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Looking for someone based in Mumbai/Pune who is career-oriented..."
                value={formData.additional_preferences}
                onChange={(e) => setFormData({ ...formData, additional_preferences: e.target.value })}
                className="w-full bg-white border-[1.5px] border-[#E3D6BF] rounded-xl p-2.5 text-sm outline-none resize-none"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(11)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 13: Privacy Settings ================= */}
        {currentStep === 13 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveStep(13, true); }} className="space-y-4">
            <h2 className="text-lg font-semibold text-[#241631]">Profile &amp; Contact Privacy</h2>

            <div className="space-y-3">
              <div className="p-3.5 bg-white border border-[#E3D6BF] rounded-xl flex items-center justify-between">
                <div>
                  <b className="text-sm text-[#241631] block">Profile Visibility</b>
                  <span className="text-xs text-[#6E6074]">Control who can find your profile in searches</span>
                </div>
                <select
                  value={formData.profile_visibility}
                  onChange={(e) => setFormData({ ...formData, profile_visibility: e.target.value })}
                  className="bg-[#F6EFE1] border border-[#E3D6BF] rounded-lg p-2 text-xs font-semibold outline-none"
                >
                  <option value="public">Public (All verified users)</option>
                  <option value="registered_users">Registered Members Only</option>
                  <option value="private">Hidden / Private</option>
                </select>
              </div>

              <div className="p-3.5 bg-white border border-[#E3D6BF] rounded-xl flex items-center justify-between">
                <div>
                  <b className="text-sm text-[#241631] block">Photo Visibility</b>
                  <span className="text-xs text-[#6E6074]">Control who can see your full photo gallery</span>
                </div>
                <select
                  value={formData.photo_visibility}
                  onChange={(e) => setFormData({ ...formData, photo_visibility: e.target.value })}
                  className="bg-[#F6EFE1] border border-[#E3D6BF] rounded-lg p-2 text-xs font-semibold outline-none"
                >
                  <option value="public">Visible to All</option>
                  <option value="registered_users">Registered Members</option>
                  <option value="matches_only">Connected Matches Only</option>
                </select>
              </div>

              <div className="p-3.5 bg-white border border-[#E3D6BF] rounded-xl flex items-center justify-between">
                <div>
                  <b className="text-sm text-[#241631] block">Contact Number &amp; Email</b>
                  <span className="text-xs text-[#6E6074]">Direct contact info is guarded by default</span>
                </div>
                <span className="text-xs font-bold text-[#4E6B4F] bg-[#EDF4ED] px-2.5 py-1 rounded-full">
                  🔒 Private (On Request Only)
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(12)}
                className="bg-[#F0E5CF] text-[#2A2036] font-semibold text-sm px-5 py-2.5 rounded-xl border-0 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E8862B] hover:bg-[#D8791F] text-[#2A1503] font-semibold text-sm px-6 py-2.5 rounded-xl border-0 cursor-pointer shadow-sm"
              >
                {loading ? 'Saving...' : 'Review Profile →'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 14: Review & Publish ================= */}
        {currentStep === 14 && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-3xl">🪔</span>
              <h2 className="font-['Tiro_Devanagari_Hindi',serif] text-2xl font-normal text-[#241631] m-0">
                Ready to Publish Your Profile
              </h2>
              <p className="text-xs text-[#6E6074]">
                Review your completion status and publish to start connecting.
              </p>
            </div>

            {/* Completion Summary Card */}
            <div className="bg-[#FFF8EC] border-[1.5px] border-[#E8862B]/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#241631]">Profile Score</span>
                <span className="text-lg font-bold text-[#9E2B2B]">{completion.completionPercentage}%</span>
              </div>

              {/* Checklist grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {Object.entries(completion.sections || {}).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5 capitalize">
                    <span>{val ? '✅' : '⚠️'}</span>
                    <span className={val ? 'text-[#4E6B4F] font-medium' : 'text-[#8A5A12]'}>{key}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => onPreview && onPreview(profile?.id)}
                className="flex-1 bg-[#F0E5CF] hover:bg-[#E3D6BF] text-[#2A2036] font-semibold text-sm py-3 rounded-xl border-0 cursor-pointer transition-colors"
              >
                👁️ Preview Public Profile
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={loading || !completion.isPublishable}
                className="flex-1 bg-[#E8862B] hover:bg-[#D8791F] disabled:opacity-50 text-[#2A1503] font-semibold text-sm py-3 rounded-xl border-0 cursor-pointer shadow-sm transition-colors"
              >
                {loading ? 'Publishing...' : '🚀 Publish Matrimonial Profile'}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onExit}
                className="text-xs text-[#6E6074] hover:text-[#241631] underline bg-transparent border-0 cursor-pointer"
              >
                Return to Matrimony Dashboard
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
