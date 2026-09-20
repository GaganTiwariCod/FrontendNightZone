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
// Astrology Components
import AstrologyLanding from './components/astrology/AstrologyLanding';
import AstrologyDashboard from './components/astrology/AstrologyDashboard';
import KundliViewer from './components/astrology/KundliViewer';
import KundliMatching from './components/astrology/KundliMatching';
import AstrologerDirectory from './components/astrology/AstrologerDirectory';
import AstrologerProfileDetail from './components/astrology/AstrologerProfileDetail';
import AstrologerRegistrationWizard from './components/astrology/AstrologerRegistrationWizard';
import ConsultationRoom from './components/astrology/ConsultationRoom';
import AstrologyAdminDashboard from './components/astrology/AstrologyAdminDashboard';
// News & Local Updates Components
import LocalUpdatesPage from './components/news/LocalUpdatesPage';
import NewsDetailsPage from './components/news/NewsDetailsPage';
import AdminNewsDashboard from './components/news/AdminNewsDashboard';
// Spiritual Events & Meetup Components
import EventsDiscoveryPage from './components/events/EventsDiscoveryPage';
import EventDetailsPage from './components/events/EventDetailsPage';
import EventCreationWizard from './components/events/EventCreationWizard';
import OrganizerDashboard from './components/events/OrganizerDashboard';
import AdminEventDashboard from './components/events/AdminEventDashboard';
import SplashScreen from './components/SplashScreen';
import SEOHead from './components/SEOHead';

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
    selectedAstrologerSlug,
    setSelectedAstrologerSlug,
    selectedConsultationId,
    setSelectedConsultationId,
    selectedNewsSlug,
    setSelectedNewsSlug,
    selectedEventSlug,
    setSelectedEventSlug,
    selectedEventId,
    setSelectedEventId,
    showToast,
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
                onBack={() => setCurrentScreen('dashboard')}
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
                onBack={() => setCurrentScreen('dashboard')}
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
                onBack={() => setCurrentScreen('dashboard')}
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

      // --- Astrology Routes ---
      case 'astrology':
        return (
          <>
            <Header />
            <main className="flex-1">
              <AstrologyLanding
                onBack={() => setCurrentScreen('dashboard')}
                onOpenKundli={() => setCurrentScreen('astrology-kundli')}
                onOpenMatching={() => setCurrentScreen('astrology-matching')}
                onOpenDirectory={() => setCurrentScreen('astrologer-directory')}
                onSelectAstrologer={(slug) => {
                  setSelectedAstrologerSlug(slug);
                  setCurrentScreen('astrologer-profile');
                }}
                onOpenDashboard={() => setCurrentScreen('astrology-dashboard')}
                onOpenAdmin={() => setCurrentScreen('astrology-admin')}
                onOpenPanditRemedy={() => setCurrentScreen('pandit-directory')}
              />
            </main>
            <Footer />
          </>
        );

      case 'astrology-dashboard':
        return (
          <>
            <Header />
            <main className="flex-1">
              <AstrologyDashboard
                onBack={() => setCurrentScreen('astrology')}
                onOpenKundli={() => setCurrentScreen('astrology-kundli')}
                onOpenMatching={() => setCurrentScreen('astrology-matching')}
                onOpenDirectory={() => setCurrentScreen('astrologer-directory')}
                onJoinConsultation={(cid) => {
                  setSelectedConsultationId(cid);
                  setCurrentScreen('consultation-room');
                }}
                onOpenPanditRemedy={() => setCurrentScreen('pandit-directory')}
              />
            </main>
            <Footer />
          </>
        );

      case 'astrology-kundli':
        return (
          <>
            <Header />
            <main className="flex-1">
              <KundliViewer
                onBack={() => setCurrentScreen('astrology')}
                onConsultAstrologer={() => setCurrentScreen('astrologer-directory')}
                onBookRemedy={() => setCurrentScreen('pandit-directory')}
              />
            </main>
            <Footer />
          </>
        );

      case 'astrology-matching':
        return (
          <>
            <Header />
            <main className="flex-1">
              <KundliMatching
                onBack={() => setCurrentScreen('astrology')}
                onConsultAstrologer={() => setCurrentScreen('astrologer-directory')}
                onBookRemedy={() => setCurrentScreen('pandit-directory')}
              />
            </main>
            <Footer />
          </>
        );

      case 'astrologer-directory':
        return (
          <>
            <Header />
            <main className="flex-1">
              <AstrologerDirectory
                onBack={() => setCurrentScreen('astrology')}
                onSelectAstrologer={(slug) => {
                  setSelectedAstrologerSlug(slug);
                  setCurrentScreen('astrologer-profile');
                }}
                onRegisterClick={() => {
                  if (!user) {
                    openAuth('Register as Astrologer', 'login');
                  } else {
                    setCurrentScreen('astrologer-wizard');
                  }
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'astrologer-profile':
        return (
          <>
            <Header />
            <main className="flex-1">
              <AstrologerProfileDetail
                slug={selectedAstrologerSlug}
                onBack={() => setCurrentScreen('astrologer-directory')}
                onBookingSuccess={(cid) => {
                  setSelectedConsultationId(cid);
                  setCurrentScreen('consultation-room');
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'astrologer-wizard':
        return (
          <>
            <Header />
            <main className="flex-1">
              <AstrologerRegistrationWizard
                onExit={() => setCurrentScreen('astrology')}
                onPreview={(slug) => {
                  setSelectedAstrologerSlug(slug);
                  setCurrentScreen('astrologer-profile');
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'consultation-room':
        return (
          <>
            <Header />
            <main className="flex-1">
              <ConsultationRoom
                consultationId={selectedConsultationId}
                onBack={() => setCurrentScreen('astrology-dashboard')}
                onOpenPanditBooking={() => setCurrentScreen('pandit-directory')}
              />
            </main>
            <Footer />
          </>
        );

      case 'astrology-admin':
        return (
          <>
            <Header />
            <main className="flex-1">
              <AstrologyAdminDashboard
                onBack={() => setCurrentScreen('astrology')}
              />
            </main>
            <Footer />
          </>
        );

      case 'local-updates':
        return (
          <>
            <Header />
            <main className="flex-1">
              <LocalUpdatesPage
                onBack={() => setCurrentScreen('dashboard')}
                onSelectArticle={(art) => {
                  setSelectedNewsSlug(art.slug);
                  setCurrentScreen('local-updates-detail');
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'local-updates-detail':
        return (
          <>
            <Header />
            <main className="flex-1">
              <NewsDetailsPage
                articleSlug={selectedNewsSlug}
                onBack={() => setCurrentScreen('local-updates')}
                onSelectArticle={(art) => {
                  setSelectedNewsSlug(art.slug);
                  setCurrentScreen('local-updates-detail');
                }}
              />
            </main>
            <Footer />
          </>
        );

      // --- Spiritual Events & Meetup Routes ---
      case 'events':
        return (
          <>
            <Header />
            <main className="flex-1">
              <EventsDiscoveryPage
                onBack={() => setCurrentScreen('dashboard')}
                currentUser={user}
                onNotify={(msg, type) => showToast(msg, type)}
                onSelectEvent={(ev) => {
                  setSelectedEventSlug(ev.slug);
                  setCurrentScreen('event-detail');
                }}
                onNavigateCreate={() => {
                  if (!user) {
                    openAuth('Host Event', 'login');
                  } else {
                    setCurrentScreen('event-create');
                  }
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'event-detail':
        return (
          <>
            <Header />
            <main className="flex-1">
              <EventDetailsPage
                slug={selectedEventSlug}
                currentUser={user}
                onNotify={(msg, type) => showToast(msg, type)}
                onBack={() => setCurrentScreen('events')}
                onNavigateOrganizer={(eventId) => {
                  setSelectedEventId(eventId);
                  setCurrentScreen('organizer-events');
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'event-create':
        return (
          <>
            <Header />
            <main className="flex-1">
              <EventCreationWizard
                currentUser={user}
                onNotify={(msg, type) => showToast(msg, type)}
                onCancel={() => setCurrentScreen('events')}
                onSuccess={(newEvent) => {
                  if (newEvent?.slug) {
                    setSelectedEventSlug(newEvent.slug);
                    setCurrentScreen('event-detail');
                  } else {
                    setCurrentScreen('events');
                  }
                }}
              />
            </main>
            <Footer />
          </>
        );

      case 'organizer-events':
        return (
          <>
            <Header />
            <main className="flex-1">
              <OrganizerDashboard
                initialEventId={selectedEventId}
                currentUser={user}
                onNotify={(msg, type) => showToast(msg, type)}
                onBack={() => setCurrentScreen('events')}
                onNavigateCreate={() => setCurrentScreen('event-create')}
              />
            </main>
            <Footer />
          </>
        );

      case 'admin-events':
      case 'events-admin':
        return (
          <>
            <Header />
            <main className="flex-1">
              <AdminEventDashboard
                onNotify={(msg, type) => showToast(msg, type)}
                onBack={() => setCurrentScreen('events')}
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
      <SEOHead />
      <SplashScreen />
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

