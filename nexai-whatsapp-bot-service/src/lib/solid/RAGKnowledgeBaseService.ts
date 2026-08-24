export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  chunkCount: number;
  contentSnippet: string;
  uploadedAt: string;
}

export class RAGKnowledgeBaseService {
  private documents: KnowledgeDocument[] = [
    {
      id: 'doc_1',
      title: 'Carta_Precios_Pizzas_2026.pdf',
      category: 'Precios & Menú',
      chunkCount: 12,
      contentSnippet: 'Pizza Familiar S/ 42.00, Combo Duetto S/ 69.90. Delivery gratis a Los Ejidos.',
      uploadedAt: new Date().toISOString(),
    },
  ];

  public getDocuments(): KnowledgeDocument[] {
    return this.documents;
  }

  public findRelevantContext(query: string): string {
    const q = query.toLowerCase();
    for (const doc of this.documents) {
      if (q.includes('precio') || q.includes('cuanto') || q.includes('combo') || q.includes('menu') || q.includes('carta')) {
        return `[Contexto RAG de ${doc.title}]: ${doc.contentSnippet}`;
      }
    }
    return '';
  }
}
