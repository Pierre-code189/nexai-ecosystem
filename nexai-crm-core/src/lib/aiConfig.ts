import { db } from './firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export interface AIConfig {
  ollamaUrl: string;
  groqKey: string | null;
  modelName: string;
}

export async function getDynamicAIConfig(overrideUrl?: string): Promise<AIConfig> {
  // En VPS Self-Hosted, el valor por defecto es el servidor Ollama local (0 ms de latencia)
  let ollamaUrl: string = overrideUrl || process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434';
  let groqKey: string | null = process.env.GROQ_API_KEY || null;
  let modelName: string = process.env.OLLAMA_MODEL_NAME || 'qwen2.5:1.5b';

  // Consulta opcional de configuración en Firestore si está disponible
  try {
    if (db) {
      const configSnap = await getDoc(doc(db, 'system', 'ai_server_config'));
      if (configSnap.exists()) {
        const data = configSnap.data();
        if (data.ollamaApiUrl && !overrideUrl && data.ollamaApiUrl.trim().length > 0) {
          ollamaUrl = data.ollamaApiUrl.trim();
        }
        if (data.groqApiKey && !groqKey && data.groqApiKey.trim().length > 0) {
          groqKey = data.groqApiKey.trim();
        }
        if (data.modelName && data.modelName.trim().length > 0) {
          modelName = data.modelName.trim();
        }
      }
    }
  } catch (err) {
    // Si Firestore no responde, se usan los valores locales del VPS
  }

  return { ollamaUrl, groqKey, modelName };
}
