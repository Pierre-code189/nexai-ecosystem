module.exports = {
  apps: [
    {
      name: 'nexai-web-builder',
      cwd: './nexai-web-builder',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '450M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        NEXT_PUBLIC_CRM_API_URL: 'http://127.0.0.1:3001/api/leads',
        NEXT_PUBLIC_CRM_DASHBOARD_URL: 'http://127.0.0.1:3001/dashboard',
        OLLAMA_API_URL: 'http://127.0.0.1:11434',
        OLLAMA_MODEL_NAME: 'qwen2.5:1.5b'
      }
    },
    {
      name: 'nexai-crm-core',
      cwd: './nexai-crm-core',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '450M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_APP_URL: 'http://localhost:3001',
        NEXT_PUBLIC_ENABLE_MOCK_STORAGE: 'false',
        NEXT_PUBLIC_WEB_BUILDER_URL: 'http://127.0.0.1:3000',
        NEXT_PUBLIC_WHATSAPP_BOT_URL: 'http://127.0.0.1:3002',
        OLLAMA_API_URL: 'http://127.0.0.1:11434',
        OLLAMA_MODEL_NAME: 'qwen2.5:1.5b'
      }
    },
    {
      name: 'nexai-whatsapp-bot',
      cwd: './nexai-whatsapp-bot-service',
      script: 'baileys-bot.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '350M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        CRM_SERVICE_URL: 'http://127.0.0.1:3001/api/leads',
        OLLAMA_API_URL: 'http://127.0.0.1:11434',
        OLLAMA_MODEL_NAME: 'qwen2.5:1.5b'
      }
    }
  ]
};
