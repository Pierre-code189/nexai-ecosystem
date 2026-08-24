export interface LeadScoreResult {
  score: number;
  category: 'hot' | 'warm' | 'cold';
  reason: string;
}

export class LeadScoringService {
  public calculateScore(contactData: Record<string, any>, dealsCount: number, chatMessagesCount: number): LeadScoreResult {
    let score = 30; // Base score
    if (chatMessagesCount > 3) score += 25;
    if (dealsCount > 0) score += 25;
    if (contactData.budgetRange || contactData.budget) score += 15;
    if (contactData.urgent) score += 15;

    score = Math.min(100, Math.max(10, score));

    if (score >= 70) {
      return { score, category: 'hot', reason: 'Alta interacción en WhatsApp e intención de compra detectada.' };
    }
    if (score >= 45) {
      return { score, category: 'warm', reason: 'Interacción moderada; requiere seguimiento comercial.' };
    }
    return { score, category: 'cold', reason: 'Prospecto nuevo o con baja interacción.' };
  }
}
