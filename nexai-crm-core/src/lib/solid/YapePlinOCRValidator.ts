export interface PaymentValidationResult {
  isValid: boolean;
  amount?: number;
  operationNumber?: string;
  senderName?: string;
  paymentPlatform?: 'yape' | 'plin' | 'bcp' | 'desconocido';
  confidenceScore: number;
}

export class YapePlinOCRValidator {
  /**
   * Analiza el texto o metadatos de una captura de pago de Yape/Plin enviada por WhatsApp.
   */
  public parseVoucherText(rawText: string): PaymentValidationResult {
    const text = rawText.toLowerCase();

    // Detección de plataforma
    let platform: PaymentValidationResult['paymentPlatform'] = 'desconocido';
    if (text.includes('yape') || text.includes('yapeaste')) platform = 'yape';
    else if (text.includes('plin') || text.includes('plinaste')) platform = 'plin';
    else if (text.includes('bcp') || text.includes('banco de credito')) platform = 'bcp';

    // Extracción de monto (ej. S/ 42.00, S/. 69.90, 42.00)
    let amount: number | undefined;
    const amountMatch = rawText.match(/(?:s\/|\$|s\/\.)\s*([0-9]+(?:\.[0-9]{1,2})?)/i) || rawText.match(/([0-9]+\.[0-9]{2})/);
    if (amountMatch) {
      amount = parseFloat(amountMatch[1]);
    }

    // Extracción de número de operación (ej. Op: 148592, Operación: 987654)
    let opNumber: string | undefined;
    const opMatch = rawText.match(/(?:operaci[oó]n|op|nro)\s*:?\s*([0-9]{4,10})/i);
    if (opMatch) {
      opNumber = opMatch[1];
    }

    const isValid = Boolean((platform !== 'desconocido' || text.includes('transferencia')) && (amount || opNumber));

    return {
      isValid,
      amount,
      operationNumber: opNumber,
      paymentPlatform: platform,
      confidenceScore: isValid ? 0.95 : 0.2,
    };
  }
}
