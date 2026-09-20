import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SEOHead() {
  const { currentScreen, selectedCity, selectedSpiritualSlug, selectedEventSlug, selectedNewsSlug, selectedPanditSlug } = useAuth();

  useEffect(() => {
    let title = 'Shubhkaal — Community Hub, Verified Pandits, Kundli & Pooja Seva';
    let description = 'Maharashtra\'s trusted Sanatan community platform for verified Pandit bookings, Janam Kundli 36 Guna matching, sacred Kathas & Aartis, local temple updates, and spiritual events.';
    let ogType = 'website';
    let keywords = 'shubhkaal, pandit booking, janam kundli, 36 guna matching, matrimony, satyanarayan katha, spiritual events, maharashtra, mumbai';

    const city = selectedCity || 'Mumbai';

    switch (currentScreen) {
      case 'matrimony':
      case 'matrimony-browse':
        title = `Matrimony & Kundli Matching Profiles in ${city} | Shubhkaal`;
        description = `Find trusted Marathi and Sanatan matrimonial profiles with Gotra, horoscope, and 36 Gunas matching in ${city}.`;
        keywords += ', marathi matrimony, kundli matching, gotra search';
        break;

      case 'pandit-directory':
        title = `Book Verified Pandits & Acharyas in ${city} | Shubhkaal`;
        description = `Book experienced Vedic priests in ${city} for Satyanarayan Pooja, Rudrabhishek, Vivah, and Griha Pravesh in Sanskrit, Marathi, Hindi.`;
        keywords += ', book pandit, pooja booking, vedic acharya';
        break;

      case 'pandit-profile':
        title = `Verified Pandit Profile | Shubhkaal`;
        description = `Explore Vedic rituals, experience, samagri details, and devotee reviews for verified Acharya.`;
        break;

      case 'spiritual':
        title = `Sacred Dharmik Kathas, Aartis, Mantras & Vrat Vidhi | Shubhkaal`;
        description = `Read complete Satyanarayan Katha, Shiv Stotras, Navratri Vrat Vidhi, and Aartis in Hindi, Marathi, and English.`;
        ogType = 'article';
        keywords += ', satyanarayan katha, aarti sangrah, vrat vidhi, chalisa';
        break;

      case 'spiritual-detail':
        title = `Read Sacred Scripture & Pooja Vidhi | Shubhkaal`;
        description = `Complete spiritual text, recitation instructions, and sacred significance on Shubhkaal.`;
        ogType = 'article';
        break;

      case 'astrology':
      case 'astrology-kundli':
        title = `Free Janam Kundli & Horoscope Chart Generator | Shubhkaal`;
        description = `Generate accurate Vedic Janam Kundli, Lagna analysis, planetary charts, and daily rashi predictions instantly.`;
        keywords += ', free janam kundli, horoscope, lagna chart, rashi';
        break;

      case 'astrology-matching':
        title = `Vedic Kundli Matching (36 Gunas Ashtakoot Milan) | Shubhkaal`;
        description = `Calculate authentic 36 Gunas matching for prospective bride and groom with Nadi, Bhakoot, and Gana dosha analysis.`;
        keywords += ', 36 gunas matching, kundli milan, ashtakoot';
        break;

      case 'astrologer-directory':
        title = `Consult Certified Vedic Astrologers in ${city} | Shubhkaal`;
        description = `Connect with authentic Jyotishis for career, marriage, health, and gemstone recommendations.`;
        break;

      case 'local-updates':
        title = `Local Dharmik News & Temple Updates in ${city} | Shubhkaal`;
        description = `Latest temple notices, festival dates, bhandara announcements, and community news in ${city}.`;
        keywords += ', temple news, local updates, bhandara dates';
        break;

      case 'local-updates-detail':
        title = `Local Update & News | Shubhkaal`;
        description = `Read full temple announcement and verified community report on Shubhkaal.`;
        ogType = 'article';
        break;

      case 'events':
        title = `Discover Nearby Spiritual Events, Jagrans & Yatras in ${city} | Shubhkaal`;
        description = `Find upcoming Poojas, Satsangs, Bhajan Sandhyas, and coordinate carpool/group travel to sacred pilgrimage dhams.`;
        keywords += ', spiritual events, yatra carpool, satsang near me, jagran';
        break;

      case 'event-detail':
        title = `Spiritual Event Details, Schedule & Carpool | Shubhkaal`;
        description = `Event schedule, deity, dress code, Prasad arrangements, and group travel coordination on Shubhkaal.`;
        ogType = 'event';
        break;

      default:
        title = `Shubhkaal — Sanatan Community Hub, Pooja Seva & Events in ${city}`;
        description = `Discover verified Pandits, Janam Kundli matching, sacred Kathas, local news, and community events across ${city}, Maharashtra.`;
        break;
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or create meta tags
    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Standard SEO Meta
    setMeta('description', description);
    setMeta('keywords', keywords);

    // Geo-Location Targeting (Maharashtra / City Coordinates)
    setMeta('geo.region', 'IN-MH');
    setMeta('geo.placename', `${city}, Maharashtra, India`);
    setMeta('geo.position', '19.0760;72.8777');
    setMeta('ICBM', '19.0760, 72.8777');

    // OpenGraph Tags
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', 'Shubhkaal', true);
    setMeta('og:url', window.location.href, true);
    setMeta('og:image', 'https://images.unsplash.com/photo-1545232979-fbf67839352e?q=80&w=1200&auto=format&fit=crop', true);

    // Twitter Card Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', 'https://images.unsplash.com/photo-1545232979-fbf67839352e?q=80&w=1200&auto=format&fit=crop');

    // JSON-LD Structured Data Schema
    let schemaTag = document.getElementById('shubhkaal-jsonld-schema');
    if (!schemaTag) {
      schemaTag = document.createElement('script');
      schemaTag.id = 'shubhkaal-jsonld-schema';
      schemaTag.type = 'application/ld+json';
      document.head.appendChild(schemaTag);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://shubhkaal.com/#website',
          'url': 'https://shubhkaal.com',
          'name': 'Shubhkaal',
          'description': description,
          'inLanguage': ['hi', 'mr', 'en'],
          'publisher': {
            '@type': 'Organization',
            'name': 'Shubhkaal Sanatan Seva',
            'logo': 'https://shubhkaal.com/logo.png',
            'areaServed': 'Maharashtra, India'
          }
        },
        {
          '@type': 'Organization',
          '@id': 'https://shubhkaal.com/#organization',
          'name': 'Shubhkaal Community Platform',
          'url': 'https://shubhkaal.com',
          'location': {
            '@type': 'Place',
            'address': {
              '@type': 'PostalAddress',
              'addressRegion': 'Maharashtra',
              'addressCountry': 'IN'
            }
          }
        }
      ]
    };

    schemaTag.textContent = JSON.stringify(structuredData);
  }, [currentScreen, selectedCity, selectedSpiritualSlug, selectedEventSlug, selectedNewsSlug, selectedPanditSlug]);

  return null;
}
