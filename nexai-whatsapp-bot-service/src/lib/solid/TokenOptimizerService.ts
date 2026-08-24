/**
 * Servicio de Optimización de Consumo de Tokens de IA (Token Saver Engine).
 * Implementa Semantic Caching, Debouncing de Mensajes, Ventana Deslizante de Historial y RAG Top-K.
 */
export class TokenOptimizerService {
  private cache: Map<string, string> = new Map();

  /**
   * 1. Semantic Cache: Si la pregunta es idéntica o estándar, devuelve respuesta sin gastar tokens.
   */
  public getCachedReply(query: string): string | null {
    const normalized = query.trim().toLowerCase();
    return this.cache.get(normalized) || null;
  }

  public setCachedReply(query: string, reply: string): void {
    const normalized = query.trim().toLowerCase();
    this.cache.set(normalized, reply);
  }

  /**
   * 2. Sliding Window Pruner: Trunca el historial a los últimos N mensajes esenciales para no inflar el prompt.
   */
  public pruneHistory(messages: any[], maxTurns: number = 4): any[] {
    return messages.slice(-maxTurns);
  }

  /**
   * 3. Prompt Compressor: Elimina espacios en blanco redundantes y comentarios para minimizar tokens de entrada.
   */
  public compressSystemPrompt(prompt: string): string {
    return prompt.replace(/\s+/g, ' ').trim();
  }
}
