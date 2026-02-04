import { useMemo } from 'react';
import { addMonths } from 'date-fns';
import type { KautionInputs, KautionResults, KautionsArtOption } from '@/types/kaution';

export const KAUTIONS_ARTEN: KautionsArtOption[] = [
  { 
    value: 'sparkonto', 
    label: 'Mietkautionskonto (Bank)', 
    zinssatz: 0.5,
    description: 'Klassisches Kautionskonto bei einer Bank. Zinsen gehören dem Mieter.'
  },
  { 
    value: 'buergschaft', 
    label: 'Kautionsbürgschaft', 
    kosten_prozent: 5,
    description: 'Bürgschaft durch Versicherung. Kein Kapital gebunden, aber jährliche Kosten.'
  },
  { 
    value: 'sparbuch', 
    label: 'Sparbuch (verpfändet)', 
    zinssatz: 0.01,
    description: 'Verpfändetes Sparbuch des Mieters. Sehr niedrige Verzinsung.'
  },
  { 
    value: 'barzahlung', 
    label: 'Barzahlung (nicht empfohlen)', 
    zinssatz: 0,
    description: 'Barzahlung an Vermieter. Keine Verzinsung, rechtlich problematisch.'
  }
];

function round(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function getDefaultKautionInputs(): KautionInputs {
  return {
    kaltmiete: 800,
    warmmiete: null,
    vereinbarte_kaution: 3,
    mietbeginn: new Date(),
    kautions_art: 'sparkonto'
  };
}

export function useKautionCalculator(input: KautionInputs): KautionResults {
  return useMemo(() => {
    const {
      kaltmiete,
      warmmiete = null,
      vereinbarte_kaution = 3,
      mietbeginn,
      kautions_art = 'sparkonto'
    } = input;

    const max_kaution_monate = 3;
    const max_kaution_betrag = kaltmiete * max_kaution_monate;
    const kaution_monate = Math.min(vereinbarte_kaution, max_kaution_monate);
    const kaution_betrag = kaltmiete * kaution_monate;
    const kaution_zu_hoch = vereinbarte_kaution > 3;
    const ueberzahlung = kaution_zu_hoch ? (vereinbarte_kaution - 3) * kaltmiete : 0;

    const erste_rate = kaution_betrag / 3;
    const raten = [
      { monat: 1, betrag: erste_rate, faellig: mietbeginn },
      { monat: 2, betrag: erste_rate, faellig: addMonths(mietbeginn, 1) },
      { monat: 3, betrag: erste_rate, faellig: addMonths(mietbeginn, 2) }
    ];

    const kautionsDetails = KAUTIONS_ARTEN.find(k => k.value === kautions_art) || KAUTIONS_ARTEN[0];
    let jaehrliche_zinsen = 0;
    let jaehrliche_kosten = 0;

    if (kautionsDetails.zinssatz) {
      jaehrliche_zinsen = kaution_betrag * (kautionsDetails.zinssatz / 100);
    }
    if (kautionsDetails.kosten_prozent) {
      jaehrliche_kosten = kaution_betrag * (kautionsDetails.kosten_prozent / 100);
    }

    const jahre = 5;
    const zinsen_gesamt = jaehrliche_zinsen * jahre;
    const kosten_gesamt = jaehrliche_kosten * jahre;

    const endwert_5_jahre = kaution_betrag + zinsen_gesamt - kosten_gesamt;

    const empfehlung = kautions_art === 'buergschaft' && kaltmiete > 1000
      ? 'Kautionsbürgschaft kann sich bei hohen Mieten lohnen'
      : kautions_art === 'barzahlung'
        ? 'Barzahlung ist nicht empfohlen - fordern Sie ein Kautionskonto!'
        : 'Klassisches Mietkautionskonto ist die sicherste Variante';

    return {
      kaltmiete,
      warmmiete,
      max_kaution_betrag: round(max_kaution_betrag, 2),
      kaution_betrag: round(kaution_betrag, 2),
      kaution_monate,
      kaution_zu_hoch,
      ueberzahlung: round(ueberzahlung, 2),
      raten,
      erste_rate: round(erste_rate, 2),
      kautions_art,
      kautions_art_label: kautionsDetails.label,
      jaehrliche_zinsen: round(jaehrliche_zinsen, 2),
      jaehrliche_kosten: round(jaehrliche_kosten, 2),
      zinsen_5_jahre: round(zinsen_gesamt, 2),
      kosten_5_jahre: round(kosten_gesamt, 2),
      empfehlung,
      endwert_5_jahre: round(endwert_5_jahre, 2)
    };
  }, [input]);
}
