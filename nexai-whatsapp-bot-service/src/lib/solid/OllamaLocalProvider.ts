/**
 * Proveedor de IA Autoalojada (Self-Hosted) con Ollama / vLLM.
 * Costo de Tokens: $0.00 USD (Ilimitado en servidor propio o VPS).
 */
export class OllamaLocalProvider {
  private endpoint: string;
  private model: string;

  constructor() {
    this.endpoint = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL_NAME || 'qwen2.5:1.5b';
  }

  public async generateLocalReply(prompt: string, systemPrompt: string): Promise<string | null> {
    try {
      const res = await fetch(`${this.endpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          system: systemPrompt,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 120,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.response;
      }
    } catch {
      // Si Ollama local no está corriendo en el puerto 11434
    }
    return null;
  }
}
