import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QuoteEditor from './components/QuoteEditor';
import QuoteView from './components/QuoteView';
import SettingsModal from './components/SettingsModal';
import PricingModal from './components/PricingModal';
import VoiceQuoteModal from './components/VoiceQuoteModal';
import FollowUpModal from './components/FollowUpModal';
import LandingPage from './components/LandingPage';
import { 
  getStoredQuotes, 
  saveStoredQuotes, 
  getStoredBusiness, 
  saveStoredBusiness 
} from './utils/storage';
import { decodeQuoteFromUrl } from './utils/shareUtils';

export default function App() {
  const [clientSharedData, setClientSharedData] = useState(() => decodeQuoteFromUrl());
  const [quotes, setQuotes] = useState(() => getStoredQuotes());
  const [business, setBusiness] = useState(() => getStoredBusiness());
  const [currentView, setCurrentView] = useState(() => clientSharedData ? 'client-view' : 'dashboard');
  const [selectedQuote, setSelectedQuote] = useState(() => clientSharedData ? clientSharedData.quote : null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [followUpQuote, setFollowUpQuote] = useState(null);

  // Sync quotes to localStorage (only in contractor mode)
  useEffect(() => {
    if (!clientSharedData) {
      saveStoredQuotes(quotes);
    }
  }, [quotes, clientSharedData]);

  // Sync business to localStorage
  useEffect(() => {
    if (!clientSharedData) {
      saveStoredBusiness(business);
    }
  }, [business, clientSharedData]);

  const handleCreateQuote = () => {
    setSelectedQuote(null);
    setCurrentView('editor');
  };

  const handleEditQuote = (quote) => {
    setSelectedQuote(quote);
    setCurrentView('editor');
  };

  const handleViewQuote = (quote) => {
    setSelectedQuote(quote);
    setCurrentView('view');
  };

  const handleVoiceQuoteGenerated = (parsedData) => {
    const newQuote = {
      id: `COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientName: parsedData.clientName || 'Cliente Nuevo',
      clientPhone: parsedData.clientPhone || '',
      clientEmail: '',
      clientAddress: parsedData.clientAddress || '',
      date: new Date().toISOString().split('T')[0],
      validDays: 15,
      status: 'draft',
      notes: parsedData.notes || '',
      discountPercent: 0,
      taxPercent: business.taxRate || 19,
      depositPercent: parsedData.depositPercent || 30,
      depositPaid: false,
      items: parsedData.items || [],
      signedAt: null,
      signedBy: null,
      signatureDataUrl: null
    };

    setShowVoiceModal(false);
    setSelectedQuote(newQuote);
    setCurrentView('editor');
  };

  const handleSaveQuote = (quoteData) => {
    const existingIndex = quotes.findIndex(q => q.id === quoteData.id);
    let updatedQuotes;
    if (existingIndex >= 0) {
      updatedQuotes = [...quotes];
      updatedQuotes[existingIndex] = quoteData;
    } else {
      updatedQuotes = [quoteData, ...quotes];
    }
    setQuotes(updatedQuotes);
    setSelectedQuote(quoteData);
    setCurrentView('view');
  };

  const handleUpdateQuote = (updatedQuote) => {
    if (clientSharedData) {
      // In client mode, update state in memory
      setSelectedQuote(updatedQuote);
    } else {
      const updatedQuotes = quotes.map(q => q.id === updatedQuote.id ? updatedQuote : q);
      setQuotes(updatedQuotes);
      setSelectedQuote(updatedQuote);
    }
  };

  const handleDeleteQuote = (quoteId) => {
    if (window.confirm('¿Seguro que deseas eliminar esta cotización?')) {
      const updatedQuotes = quotes.filter(q => q.id !== quoteId);
      setQuotes(updatedQuotes);
      if (selectedQuote && selectedQuote.id === quoteId) {
        setSelectedQuote(null);
        setCurrentView('dashboard');
      }
    }
  };

  const handleDuplicateQuote = (quote) => {
    const cloned = {
      ...quote,
      id: `COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      signedAt: null,
      signedBy: null,
      signatureDataUrl: null,
      depositPaid: false,
      depositPaidAt: null
    };
    const updatedQuotes = [cloned, ...quotes];
    setQuotes(updatedQuotes);
    setSelectedQuote(cloned);
    setCurrentView('editor');
  };

  const handleExitClientMode = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    setClientSharedData(null);
    setSelectedQuote(null);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Hide navbar if in public client view mode */}
      {currentView !== 'client-view' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenPricing={() => setShowPricing(true)}
          onOpenVoiceQuote={() => setShowVoiceModal(true)}
          business={business}
        />
      )}

      <main className="flex-1">
        {/* Client Shared View (Direct from WhatsApp link) */}
        {currentView === 'client-view' && selectedQuote && (
          <QuoteView
            quote={selectedQuote}
            business={clientSharedData ? clientSharedData.business : business}
            isClientMode={true}
            onUpdateQuote={handleUpdateQuote}
            onGoToApp={handleExitClientMode}
          />
        )}

        {currentView === 'landing' && (
          <LandingPage
            onGoToApp={() => setCurrentView('dashboard')}
            onOpenVoiceDemo={() => setShowVoiceModal(true)}
            onOpenPricing={() => setShowPricing(true)}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            quotes={quotes}
            business={business}
            onCreateQuote={handleCreateQuote}
            onVoiceQuote={() => setShowVoiceModal(true)}
            onOpenFollowUp={(quote) => setFollowUpQuote(quote)}
            onViewQuote={handleViewQuote}
            onEditQuote={handleEditQuote}
            onDeleteQuote={handleDeleteQuote}
            onDuplicateQuote={handleDuplicateQuote}
          />
        )}

        {currentView === 'editor' && (
          <QuoteEditor
            quote={selectedQuote}
            business={business}
            onSave={handleSaveQuote}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'view' && selectedQuote && (
          <QuoteView
            quote={selectedQuote}
            business={business}
            onBack={() => setCurrentView('dashboard')}
            onUpdateQuote={handleUpdateQuote}
          />
        )}
      </main>

      {/* Modals */}
      {showSettings && (
        <SettingsModal
          business={business}
          onSave={(newBusiness) => setBusiness(newBusiness)}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
        />
      )}

      {showVoiceModal && (
        <VoiceQuoteModal
          onClose={() => setShowVoiceModal(false)}
          onQuoteGenerated={handleVoiceQuoteGenerated}
        />
      )}

      {followUpQuote && (
        <FollowUpModal
          quote={followUpQuote}
          business={business}
          onClose={() => setFollowUpQuote(null)}
        />
      )}

      {/* Footer (Hidden in client view) */}
      {currentView !== 'client-view' && (
        <footer className="no-print mt-auto py-6 border-t border-slate-200/60 bg-white/50 text-center text-xs text-slate-400">
          <p>
            <strong>CotiZone</strong> — Plataforma SaaS de Presupuestos & Firma Express.
          </p>
        </footer>
      )}
    </div>
  );
}
