import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { AlertTriangle, CheckCircle, TrendingUp, Wallet, Calendar, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { KautionResults } from '@/types/kaution';

interface KautionResultsDisplayProps {
  results: KautionResults;
}

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

export function KautionResultsDisplay({ results }: KautionResultsDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Primary Result */}
      <div className="kaution-result-primary">
        <div className="text-primary-foreground/80 text-sm font-medium mb-1">Mietkaution</div>
        <div className="text-4xl font-bold tracking-tight">
          {formatCurrency(results.kaution_betrag)}
        </div>
        <div className="text-primary-foreground/70 text-sm mt-1">
          {results.kaution_monate} Monatsmiete{results.kaution_monate > 1 ? 'n' : ''}
        </div>
      </div>

      {/* Warning if too high */}
      {results.kaution_zu_hoch && (
        <Alert variant="destructive" className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Kaution zu hoch!</AlertTitle>
          <AlertDescription>
            Die vereinbarte Kaution übersteigt das gesetzliche Maximum von 3 Monatsmieten (§551 BGB).
            Sie würden <strong>{formatCurrency(results.ueberzahlung)}</strong> zu viel zahlen!
          </AlertDescription>
        </Alert>
      )}

      {/* Secondary Results Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Wallet className="h-3.5 w-3.5" />
              Erste Rate
            </div>
            <div className="font-semibold text-lg font-mono">
              {formatCurrency(results.erste_rate)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <CheckCircle className="h-3.5 w-3.5" />
              Max. erlaubt
            </div>
            <div className="font-semibold text-lg font-mono">
              {formatCurrency(results.max_kaution_betrag)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {results.jaehrliche_kosten > 0 ? 'Kosten/Jahr' : 'Zinsen/Jahr'}
            </div>
            <div className={`font-semibold text-lg font-mono ${results.jaehrliche_kosten > 0 ? 'text-destructive' : 'text-success'}`}>
              {results.jaehrliche_kosten > 0 
                ? `-${formatCurrency(results.jaehrliche_kosten)}`
                : `+${formatCurrency(results.jaehrliche_zinsen)}`
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Calendar className="h-3.5 w-3.5" />
              Nach 5 Jahren
            </div>
            <div className="font-semibold text-lg font-mono">
              {formatCurrency(results.endwert_5_jahre)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ratenzahlung */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Ratenzahlung nach §551 Abs. 2 BGB
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rate</TableHead>
                <TableHead>Fällig</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.raten.map((rate) => (
                <TableRow key={rate.monat}>
                  <TableCell className="font-medium">{rate.monat}. Rate</TableCell>
                  <TableCell>
                    {rate.monat === 1 ? 'Bei Mietbeginn' : `+ ${rate.monat - 1} Monat${rate.monat > 2 ? 'e' : ''}`}
                    <span className="text-muted-foreground text-xs ml-2">
                      ({format(rate.faellig, 'dd.MM.yyyy', { locale: de })})
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(rate.betrag)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empfehlung */}
      <Card className="kaution-info">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-[hsl(var(--kaution-info))] shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm mb-1">Empfehlung</div>
              <p className="text-sm text-muted-foreground">{results.empfehlung}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kautionsart Info */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Gewählte Kautionsart: </span>
            <span className="font-medium">{results.kautions_art_label}</span>
          </div>
          {results.jaehrliche_zinsen > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              Geschätzte Zinsen nach 5 Jahren: <span className="text-success font-medium">+{formatCurrency(results.zinsen_5_jahre)}</span>
            </div>
          )}
          {results.jaehrliche_kosten > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              Geschätzte Kosten nach 5 Jahren: <span className="text-destructive font-medium">-{formatCurrency(results.kosten_5_jahre)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
