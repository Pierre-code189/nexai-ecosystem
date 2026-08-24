import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function downloadReactProjectZip(title: string, jsxCode: string, readmeMd?: string): Promise<void> {
  const zip = new JSZip();
  const projectName = (title || 'mi-app-react').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') || 'apio-project';
  const folder = zip.folder(projectName) || zip;

  // 1. package.json
  const packageJson = {
    name: projectName,
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'lucide-react': '^0.428.0',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.5.2',
    },
    devDependencies: {
      '@types/react': '^18.3.3',
      '@types/react-dom': '^18.3.0',
      '@vitejs/plugin-react': '^4.3.1',
      autoprefixer: '^10.4.20',
      postcss: '^8.4.41',
      tailwindcss: '^3.4.10',
      vite: '^5.4.1',
    },
  };
  folder.file('package.json', JSON.stringify(packageJson, null, 2));

  // 2. README.md generado por Apio
  const defaultReadme = `# 🚀 ${title} — Aplicación React 18 + Vite

> **Generado automáticamente por el Agente de Creación de Software Apio 🤖**

## 🛠️ Instrucciones de Ejecución:
1. Descomprimir el archivo ZIP.
2. Instalar dependencias:
   \`\`\`bash
   npm install
   \`\`\`
3. Iniciar el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Abrir en el navegador: [http://localhost:5173](http://localhost:5173)
`;
  folder.file('README.md', readmeMd || defaultReadme);

  // 3. vite.config.js
  folder.file(
    'vite.config.js',
    `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n});\n`
  );

  // 4. tailwind.config.js & postcss.config.js
  folder.file(
    'tailwind.config.js',
    `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n`
  );

  folder.file(
    'postcss.config.js',
    `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n`
  );

  // 5. index.html
  folder.file(
    'index.html',
    `<!DOCTYPE html>\n<html lang="es">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${title}</title>\n  </head>\n  <body class="bg-slate-950 text-slate-100">\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>\n`
  );

  // 6. src/
  const src = folder.folder('src');
  if (src) {
    src.file(
      'index.css',
      `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody { margin: 0; font-family: system-ui, sans-serif; background-color: #020617; color: #f8fafc; }\n`
    );

    src.file(
      'main.jsx',
      `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.jsx';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n`
    );

    // Inyectar el código JSX generado por Apio directamente en App.jsx
    let finalJsx = jsxCode.trim();
    if (!finalJsx.includes('export default')) {
      finalJsx = `${finalJsx}\n\nexport default App;`;
    }
    src.file('App.jsx', finalJsx);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${projectName}-react18-tailwind.zip`);
}
