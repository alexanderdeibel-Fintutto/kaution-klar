import { ExternalLink, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CrossSellBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-1">
            Vermietify
          </p>
          
          <p className="text-sm text-muted-foreground">
            Verwalten Sie Ihre Kautionen digital mit Vermietify – 
            die moderne Verwaltungslösung für Vermieter.
          </p>
          
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 mt-2 text-primary"
            asChild
          >
            <a href="https://vermietify.de" target="_blank" rel="noopener noreferrer">
              Mehr erfahren
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
