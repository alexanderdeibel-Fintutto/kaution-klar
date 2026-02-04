import { useState } from 'react';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { KautionInputsSection } from '@/components/kaution/KautionInputs';
import { KautionResultsDisplay } from '@/components/kaution/KautionResults';
import { CrossSellBanner } from '@/components/CrossSellBanner';
import { Button } from '@/components/ui/button';
import { RotateCcw, Scale, ExternalLink } from 'lucide-react';
import { useKautionCalculator, getDefaultKautionInputs } from '@/hooks/useKautionCalculator';
import type { KautionInputs } from '@/types/kaution';

const Kautionsrechner = () => {
  const [inputs, setInputs] = useState<KautionInputs>(getDefaultKautionInputs());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const results = useKautionCalculator(inputs);

  const handleReset = () => {
    setInputs(getDefaultKautionInputs());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => setShowAuthModal(true)} />

      {/* Hero Section */}
      <div className="gradient-primary text-primary-foreground py-10 px-4">
        <div className="container">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-primary-foreground/15 rounded-lg">
              <Scale className="h-6 w-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Kautions-Rechner</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Berechne die Mietkaution nach deutschem Mietrecht – mit Ratenzahlung, 
            Zinsvorschau und rechtlicher Prüfung nach §551 BGB.
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-primary-foreground/70">
            <ExternalLink className="h-3.5 w-3.5" />
            <a 
              href="https://www.gesetze-im-internet.de/bgb/__551.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary-foreground transition-colors"
            >
              §551 BGB – Begrenzung und Anlage von Mietsicherheiten
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-4">
            <KautionInputsSection inputs={inputs} onChange={setInputs} />
            
            <Button variant="outline" onClick={handleReset} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <KautionResultsDisplay results={results} />
            
            {/* Cross-Sell Banner */}
            <CrossSellBanner />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Mietkaution</div>
            <div className="font-mono text-xl font-bold text-primary">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(results.kaution_betrag)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Erste Rate</div>
            <div className="font-mono font-semibold">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(results.erste_rate)}
            </div>
          </div>
        </div>
      </div>

      {/* Padding for mobile sticky footer */}
      <div className="lg:hidden h-24" />

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Kautionsrechner;
