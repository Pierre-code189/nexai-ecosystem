import { GeneratedWebsite } from '@/types/builder';

export class AIProjectMemoryService {
  /**
   * Genera y actualiza automáticamente el archivo README.md del proyecto por la IA.
   * El cliente NO lo edita manualmente; la IA lo mantiene como el registro oficial de cambios y arquitectura.
   */
  public static generateAgentReadme(website: GeneratedWebsite, changelogHistory: string[] = []): string {
    const version = (1 + changelogHistory.length * 0.1).toFixed(1);

    return `# 🚀 Proyecto: ${website.businessName} (v${version})

> **Documentación generada y mantenida automáticamente por el Agente Copiloto de IA de NexAI.**
> *Este documento actúa como la memoria técnica y especificación de arquitectura del proyecto.*

---

## 🎯 1. Visión y Propuesta de Valor
- **Negocio:** ${website.businessName}
- **Eslogan Comercial:** "${website.tagline || 'Soluciones profesionales a medida'}"
- **Rubro Detectado:** ${website.detectedIndustry}
- **Ubicación & Contacto:** ${website.address || 'Piura, Perú'} | ${website.phoneNumber}

---

## 🎨 2. Especificación de Diseño y Estilo
- **Color Primario (Brand):** \`${website.theme.primaryColor || '#ea580c'}\`
- **Color Secundario:** \`${website.theme.secondaryColor || '#9a3412'}\`
- **Modo de Visualización:** ${website.theme.darkMode ? 'Modo Oscuro con selector a Claro' : 'Modo Claro'}
- **Tipografía:** \`Inter, system-ui, sans-serif\`

---

## 📦 3. Módulos y Funcionalidades Activas
- [x] **Navbar:** Logotipo dinámico, selector de tema oscuro/claro y botón directo a WhatsApp.
- [x] **Hero Section:** Titular persuasivo ("*${website.hero.title}*"), subtítulo y botón de acción directa.
- [x] **Catálogo de Productos / Servicios:** ${website.services.length} ítems configurados con precios en Soles (\`S/\`).
- [x] **Carrito de Compras:** ${website.hasCart ? 'Activo con pasarela de pedidos y cálculo en tiempo real.' : 'Disponible para activación por IA.'}
- [x] **Mapa de Ubicación:** ${website.map?.enabled ? `Incrustado en ${website.map.address}, ${website.map.city}.` : 'Configurado con enlace directo a mapa.'}
- [x] **Formulario de Cotización / Pedidos:** Conexión directa al CRM Universal (\`POST /api/leads\`).

---

## 📝 4. Registro de Cambios del Agente de IA (Changelog)
- **v1.0 (Inicial):** Creación de la arquitectura del sitio web en React 18 a partir del prompt natural del cliente.
${changelogHistory.map((entry, i) => `- **v${(1.1 + i * 0.1).toFixed(1)}:** ${entry}`).join('\n')}

---

## 💻 5. Instrucciones de Ejecución Local:
1. Descomprimir el archivo ZIP.
2. Instalar librerías:
   \`\`\`bash
   npm install
   \`\`\`
3. Iniciar el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Abrir en el navegador: [http://localhost:5173](http://localhost:5173)
`;
  }
}
