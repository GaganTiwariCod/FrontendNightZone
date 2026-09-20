import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import PanchangBanner from './components/PanchangBanner';
import ServiceTiles from './components/ServiceTiles';
import CommunityBands from './components/CommunityBands';
import Footer from './components/Footer';
import AuthScreen from './components/AuthScreen';
import ServiceModal from './components/ServiceModal';
import Toast from './components/Toast';

// Matrimony Components
import MatrimonyDashboard from './components/matrimony/MatrimonyDashboard';
import MatrimonyOnboardingWizard from './components/matrimony/MatrimonyOnboardingWizard';
import MatrimonyProfilePreview from './components/matrimony/MatrimonyProfilePreview';
import MatrimonyBrowseProfiles from './components/matrimony/MatrimonyBrowseProfiles';
import MatrimonyAdminModeration from './components/matrimony/MatrimonyAdminModeration';
// Pandit Components
import PanditDirectory from './components/pandit/PanditDirectory';
import PanditProfileDetail from './components/pandit/PanditProfileDetail';
import PanditRegistrationWizard from './components/pandit/PanditRegistrationWizard';
import PanditAdminModeration from './components/pandit/PanditAdminModeration';
// Spiritual CMS Components
import SpiritualPortal from './components/spiritual/SpiritualPortal';
import SpiritualContentDetail from './components/spiritual/SpiritualContentDetail';
import SpiritualAdminDashboard from './components/spiritual/SpiritualAdminDashboard';

function MainLayout() {
  const { 
    user,
    currentScreen, 
    setCurrentScreen, 
    matrimonyWizardStep, 
    setMatrimonyWizardStep, 
    previewProfileId, 
    setPreviewProfileId,
    selectedPanditSlug,
    setSelectedPanditSlug,
    selectedSpiritualSlug,
    setSelectedSpiritualSlug,
    spiritualLang,
    setSpiritualLang,
    openAuth
  } = useAuth();

  const renderContent = () => {
    switch (currentScreen) {
      case 'auth':
        return <AuthScreen />;
      
      case 'matrimony':
        return (
          <>
            <Header />
            <main className="flex-1">
              <MatrimonyDashboard
                onStartWizard={(step = 2) => {
                  setMatrimonyWizardStep(step);
                  setCurrentScreen('matrimony-wizard');
                }}
                onPreviewProfile={(id) => {
                  setPreviewProfileId(id || null);
                  setCurrentScreen('matrimony-preview');
                }}
                onBrowseMatches={() => setCurrentScreen('matrimony-browse')}
                onOpenAdmin={() => setCurrentScreen('matrimony-admin')}
              />
            </main>
            <Footer />
          </>
        );

      case 'matrimony-wizard':
        return (
          <>
            <Header />
            <main className="flex-1">
              <MatrimonyOnboardingWizard
                initialStep={matrimonyWizardStep || 2}
                onExit={() => setCurrentScreen('matrimony')}
                onPreview={(id) => {
                  setPreviewProfileId(id || null);
                  setCurrentScreen('matrimony-preview');
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'matrimony-preview':
        return (
          <>
            <Header />
            <main className="flex-1">
              <MatrimonyProfilePreview
                profileId={previewProfileId}
                onBack={() => setCurrentScreen('matrimony')}
                onEdit={() => {
                  setMatrimonyWizardStep(2);
                  setCurrentScreen('matrimony-wizard');
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'matrimony-browse':
        return (
          <>
            <Header />
            <main className="flex-1">
              <MatrimonyBrowseProfiles
                onSelectProfile={(id) => {
                  setPreviewProfileId(id);
                  setCurrentScreen('matrimony-preview');
                }}
                onBack={() => setCurrentScreen('matrimony')}
              />
            </main>
            <Footer />
          </>
        );

      case 'matrimony-admin':
        return (
          <>
            <Header />
            <main className="flex-1">
              <MatrimonyAdminModeration
                onBack={() => setCurrentScreen('matrimony')}
              />
            </main>
            <Footer />
          </>
        );

      // --- Pandit Routes ---
      case 'pandit-directory':
        return (
          <>
            <Header />
            <main className="flex-1">
              <PanditDirectory
                onSelectPandit={(slug) => {
                  setSelectedPanditSlug(slug);
                  setCurrentScreen('pandit-profile');
                }}
                onRegisterClick={() => {
                  if (!user) {
                    openAuth('Register as Pandit', 'login');
                  } else {
                    setCurrentScreen('pandit-wizard');
                  }
                }}
                onOpenAdmin={() => setCurrentScreen('pandit-admin')}
              />
            </main>
            <Footer />
          </>
        );

      case 'pandit-profile':
        return (
          <>
            <Header />
            <main className="flex-1">
              <PanditProfileDetail
                slug={selectedPanditSlug}
                onBack={() => setCurrentScreen('pandit-directory')}
              />
            </main>
            <Footer />
          </>
        );

      case 'pandit-wizard':
        return (
          <>
            <Header />
            <main className="flex-1">
              <PanditRegistrationWizard
                initialStep={1}
                onExit={() => setCurrentScreen('pandit-directory')}
                onPreview={(slug) => {
                  setSelectedPanditSlug(slug);
                  setCurrentScreen('pandit-profile');
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'pandit-admin':
        return (
          <>
            <Header />
            <main className="flex-1">
              <PanditAdminModeration
                onBack={() => setCurrentScreen('pandit-directory')}
              />
            </main>
            <Footer />
          </>
        );

      // --- Spiritual / Dharmik CMS Routes ---
      case 'spiritual':
        return (
          <>
            <Header />
            <main className="flex-1">
              <SpiritualPortal
                onSelectContent={(slug) => {
                  setSelectedSpiritualSlug(slug);
                  setCurrentScreen('spiritual-detail');
                }}
                onOpenAdmin={() => setCurrentScreen('spiritual-admin')}
              />
            </main>
            <Footer />
          </>
        );

      case 'spiritual-detail':
        return (
          <>
            <Header />
            <main className="flex-1">
              <SpiritualContentDetail
                slug={selectedSpiritualSlug}
                initialLang={spiritualLang || 'hi'}
                onBack={() => setCurrentScreen('spiritual')}
                onSelectOtherSlug={(newSlug) => setSelectedSpiritualSlug(newSlug)}
                onOpenRequest={() => {}}
              />
            </main>
            <Footer />
          </>
        );

      case 'spiritual-admin':
        return (
          <>
            <Header />
            <main className="flex-1">
              <SpiritualAdminDashboard
                onBack={() => setCurrentScreen('spiritual')}
              />
            </main>
            <Footer />
          </>
        );

      case 'dashboard':
      default:
        return (
          <>
            <Header />
            <main className="flex-1">
              <PanchangBanner />
              <ServiceTiles />
              <CommunityBands />
            </main>
            <Footer />
            <ServiceModal />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EEDC] text-[#2A2036]">
      <Toast />
      {renderContent()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

