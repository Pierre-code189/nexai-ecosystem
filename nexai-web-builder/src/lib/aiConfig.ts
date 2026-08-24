import { db } from './firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export interface AIConfig {
  ollamaUrl: string;
  groqKey: string | null;
  modelName: string;
}

export async function getDynamicAIConfig(overrideUrl?: string): Promise<AIConfig> {
  let ollamaUrl: string = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434';
  let groqKey: string | null = process.env.GROQ_API_KEY || null;
  let modelName: string = process.env.OLLAMA_MODEL_NAME || 'qwen2.5:1.5b';

  if (overrideUrl && !overrideUrl.includes('trycloudflare.com')) {
    ollamaUrl = overrideUrl;
  }

  try {
    if (db) {
      const configSnap = await getDoc(doc(db, 'system', 'ai_server_config'));
      if (configSnap.exists()) {
        const data = configSnap.data();
        if (data.ollamaApiUrl && typeof data.ollamaApiUrl === 'string') {
          const cleanUrl = data.ollamaApiUrl.trim();
          if (cleanUrl.length > 0 && !cleanUrl.includes('trycloudflare.com')) {
            ollamaUrl = cleanUrl;
          }
        }
        if (data.groqApiKey && typeof data.groqApiKey === 'string') {
          groqKey = data.groqApiKey.trim();
        }
      }
    }
  } catch (err) {}

  return { ollamaUrl, groqKey, modelName };
}
