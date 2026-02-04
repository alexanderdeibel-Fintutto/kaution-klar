import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon, Euro, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { KAUTIONS_ARTEN } from '@/hooks/useKautionCalculator';
import type { KautionInputs, KautionsArt } from '@/types/kaution';

interface KautionInputsSectionProps {
  inputs: KautionInputs;
  onChange: (inputs: KautionInputs) => void;
}

export function KautionInputsSection({ inputs, onChange }: KautionInputsSectionProps) {
  const updateField = <K extends keyof KautionInputs>(field: K, value: KautionInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Miete */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Euro className="h-4 w-4 text-primary" />
            Miete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="kaltmiete">Nettokaltmiete</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Miete ohne Nebenkosten – Basis für Kautionsberechnung nach §551 BGB</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Input
                id="kaltmiete"
                type="number"
                min="0"
                step="50"
                value={inputs.kaltmiete || ''}
                onChange={(e) => updateField('kaltmiete', Number(e.target.value))}
                className="pr-12"
                placeholder="z.B. 800"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                €/Monat
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="warmmiete">Warmmiete (optional)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zur Information – nicht relevant für Kautionsberechnung</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Input
                id="warmmiete"
                type="number"
                min="0"
                step="50"
                value={inputs.warmmiete ?? ''}
                onChange={(e) => updateField('warmmiete', e.target.value ? Number(e.target.value) : null)}
                className="pr-12"
                placeholder="z.B. 1100"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                €/Monat
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kautions-Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Kautions-Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="vereinbarte_kaution">Vereinbarte Kaution</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Maximum: 3 Monatsmieten nach §551 BGB</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={inputs.vereinbarte_kaution.toString()}
              onValueChange={(v) => updateField('vereinbarte_kaution', Number(v))}
            >
              <SelectTrigger id="vereinbarte_kaution">
                <SelectValue placeholder="Monatsmieten wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Monatsmiete</SelectItem>
                <SelectItem value="2">2 Monatsmieten</SelectItem>
                <SelectItem value="3">3 Monatsmieten (Maximum)</SelectItem>
                <SelectItem value="4">4 Monatsmieten ⚠️</SelectItem>
                <SelectItem value="5">5 Monatsmieten ⚠️</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mietbeginn</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !inputs.mietbeginn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {inputs.mietbeginn ? format(inputs.mietbeginn, "PPP", { locale: de }) : "Datum wählen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={inputs.mietbeginn}
                  onSelect={(date) => date && updateField('mietbeginn', date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kautions_art">Kautionsart</Label>
            <Select
              value={inputs.kautions_art}
              onValueChange={(v) => updateField('kautions_art', v as KautionsArt)}
            >
              <SelectTrigger id="kautions_art">
                <SelectValue placeholder="Kautionsart wählen" />
              </SelectTrigger>
              <SelectContent>
                {KAUTIONS_ARTEN.map((art) => (
                  <SelectItem key={art.value} value={art.value}>
                    <div className="flex flex-col items-start">
                      <span>{art.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {inputs.kautions_art && (
              <p className="text-xs text-muted-foreground mt-1">
                {KAUTIONS_ARTEN.find(a => a.value === inputs.kautions_art)?.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
