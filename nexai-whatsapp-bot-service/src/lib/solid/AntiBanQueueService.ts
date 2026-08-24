/**
 * Servicio de Protección Anti-Ban para WhatsApp (Baileys Safe Engine).
 * Emula comportamiento humano con tiempos de escritura aleatorios y control de tasa.
 */
export class AntiBanQueueService {
  private messageQueue: { toPhone: string; text: string; delayMs: number }[] = [];
  private isProcessing: boolean = false;

  public async queueMessage(toPhone: string, text: string, sendFn: (phone: string, msg: string) => Promise<boolean>): Promise<void> {
    // Retardo humano aleatorio entre 1.2s y 2.8s
    const humanDelay = Math.floor(1200 + Math.random() * 1600);
    this.messageQueue.push({ toPhone, text, delayMs: humanDelay });

    if (!this.isProcessing) {
      this.processQueue(sendFn);
    }
  }

  private async processQueue(sendFn: (phone: string, msg: string) => Promise<boolean>) {
    this.isProcessing = true;
    while (this.messageQueue.length > 0) {
      const item = this.messageQueue.shift();
      if (item) {
        await new Promise((r) => setTimeout(r, item.delayMs));
        await sendFn(item.toPhone, item.text);
      }
    }
    this.isProcessing = false;
  }
}
