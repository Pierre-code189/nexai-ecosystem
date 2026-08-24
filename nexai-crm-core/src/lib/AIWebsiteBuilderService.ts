import { GeneratedWebsite, WebsitePage, WebsiteServiceItem } from '@/types/builder';

export class AIWebsiteBuilderService {
  public generateDefaultReadme(bName: string, industry: string, prompt: string): string {
    return `# 🚀 ${bName} — Especificación y Memoria del Proyecto

> **Proyecto Web generado por el Agente de Creación de Software NexAI**  
> **Giro / Industria:** ${industry}  
> **Fecha de Creación:** ${new Date().toLocaleDateString()}  
> **Versión Activa:** v1.0.0

---

## 🎯 1. Visión y Requerimientos del Cliente
${prompt || `Presencia digital completa y plataforma de captación comercial para ${bName}.`}

---

## 📐 2. Estructura de Páginas & Componentes Activos
- [x] **Página de Inicio (\`/\`)**: Hero interactivo, propuesta de valor y llamada a la acción hacia WhatsApp.
- [x] **Catálogo / Menú (\`/catalogo\` o sección)**: Lista de productos/servicios con precios en Soles (S/) y descripciones.
- [x] **Carrito de Compras**: Selector de cantidades con pasarela de confirmación por WhatsApp y Yape.
- [x] **Ubicación & Contacto (\`#contacto\`)**: Mapa referencial y formulario de captación directa conectado al CRM.

---

## 🎨 3. Reglas de Diseño, Identidad & Estilo
- **Paleta de Colores:** Primario dinámico según identidad de marca.
- **Tipografía:** Sans-serif moderna con soporte para Modo Oscuro y Claro.
- **Responsividad:** 100% adaptado a dispositivos móviles, tablets y escritorio.

---

## 📝 4. Registro de Iteraciones de la IA (Changelog)
- **v1.0.0 (${new Date().toLocaleDateString()}):** Creación inicial del proyecto a partir de la instrucción del usuario.

---

## 💻 5. Instrucciones de Ejecución Local
Para correr este proyecto en tu computadora:
\`\`\`bash
npm install
npm run dev
\`\`\`
El proyecto estará disponible en \`http://localhost:5173\`.
`;
  }

  public async generateWebsiteFromPrompt(prompt: string, businessNameHint?: string): Promise<GeneratedWebsite> {
    const raw = prompt.toLowerCase();
    let bName = businessNameHint || 'Mi Negocio';
    let industry = 'Servicios Generales & Comercio';
    let primaryColor = '#3b82f6';
    let secondaryColor = '#1d4ed8';
    let heroTitle = `Impulsa tu Éxito con ${bName}`;
    let heroSubtitle = `Soluciones a tu medida y atención personalizada en ${bName}.`;
    let bannerImg = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80';
    let services: WebsiteServiceItem[] = [];

    if (raw.includes('pizza') || raw.includes('dark kitchen') || raw.includes('restaurante') || raw.includes('comida') || raw.includes('kira')) {
      bName = businessNameHint || "Kira's Pizza Artesanal";
      industry = 'Gastronomía & Dark Kitchen';
      primaryColor = '#ea580c';
      secondaryColor = '#c2410c';
      heroTitle = "Pizzas Artesanales con Masa Madre Crujiente";
      heroSubtitle = "Ingredientes frescos, horneadas a la piedra y delivery directo por WhatsApp en Piura.";
      bannerImg = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80';
      services = [
        {
          id: 'serv_1',
          title: 'Pizza Margherita Suprema',
          description: 'Salsa pomodoro San Marzano, mozzarella fior di latte, albahaca fresca y aceite de oliva extra virgen.',
          price: 'S/ 38.00',
          imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'serv_2',
          title: 'Pizza Pepperoni Crunch',
          description: 'Doble porción de pepperoni premium americano, queso fundido y borde relleno de queso crema.',
          price: 'S/ 44.00',
          imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'serv_3',
          title: 'Combo Familiar Kira',
          description: '2 Pizzas grandes + 1 Porción de Pan al Ajo con Queso + 1 Bebida de 1.5L.',
          price: 'S/ 79.00',
          imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&auto=format&fit=crop&q=80',
        },
      ];
    } else if (raw.includes('dental') || raw.includes('sonrisas') || raw.includes('salud') || raw.includes('odontolog')) {
      bName = businessNameHint || 'Clínica Dental Sonrisas';
      industry = 'Salud & Odontología';
      primaryColor = '#10b981';
      secondaryColor = '#06b6d4';
      heroTitle = 'Tu Sonrisa en Manos de Especialistas';
      heroSubtitle = 'Tratamientos odontológicos modernos, tecnología digital y atención sin dolor en Piura.';
      bannerImg = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80';
      services = [
        {
          id: 'serv_1',
          title: 'Blanqueamiento Dental Láser',
          description: 'Aclarado profesional de hasta 4 tonos con tecnología LED de última generación sin sensibilidad.',
          price: 'S/ 250.00',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'serv_2',
          title: 'Ortodoncia Invisible & Brackets',
          description: 'Alineación perfecta con alineadores invisibles o brackets estéticos de zafiro de alta precisión.',
          price: 'S/ 120.00 / mes',
          imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'serv_3',
          title: 'Profilaxis & Limpieza Ultrasonido',
          description: 'Eliminación profunda de sarro, placa bacteriana y pulido dental completo.',
          price: 'S/ 80.00',
          imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
        },
      ];
    } else {
      services = [
        {
          id: 'serv_1',
          title: 'Asesoría Especializada',
          description: 'Diagnóstico integral y plan de trabajo adaptado a las necesidades de tu proyecto.',
          price: 'S/ 150.00',
          imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'serv_2',
          title: 'Servicio Estándar Premium',
          description: 'Implementación completa con garantía de calidad y soporte continuo.',
          price: 'S/ 320.00',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80',
        },
      ];
    }

    const slug = bName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const readme = this.generateDefaultReadme(bName, industry, prompt);

    const pages: WebsitePage[] = [
      {
        id: 'page_home',
        route: '/',
        title: 'Inicio',
        isHomePage: true,
        sections: [
          { id: 'sec_hero', type: 'hero', title: heroTitle, subtitle: heroSubtitle },
          { id: 'sec_cat', type: 'catalog', title: 'Catálogo & Servicios', items: services },
          { id: 'sec_contact', type: 'contact', title: 'Contacto & Pedidos' },
        ],
      },
      {
        id: 'page_catalog',
        route: '/catalogo',
        title: 'Catálogo Completo',
        sections: [
          { id: 'sec_full_cat', type: 'catalog', title: 'Nuestra Carta / Servicios', items: services },
        ],
      },
      {
        id: 'page_about',
        route: '/nosotros',
        title: 'Nosotros',
        sections: [
          { id: 'sec_about', type: 'features', title: `Acerca de ${bName}`, content: heroSubtitle },
        ],
      },
    ];

    return {
      id: `site_${Date.now().toString(36)}`,
      slug,
      businessName: bName,
      tagline: heroSubtitle,
      detectedIndustry: industry,
      phoneNumber: '+51 928 100 975',
      email: `contacto@${slug}.pe`,
      address: 'Av. Ramón Mujica 108, Piura',
      theme: {
        primaryColor,
        secondaryColor,
        accentColor: '#f59e0b',
        darkMode: true,
      },
      hero: {
        badge: '✨ Calidad y Atención Garantizada',
        title: heroTitle,
        subtitle: heroSubtitle,
        ctaText: 'Solicitar por WhatsApp',
        bannerImageUrl: bannerImg,
      },
      services,
      aboutText: `En ${bName} nos dedicamos a ofrecer la máxima calidad en ${industry}, combinando pasión, experiencia y atención personalizada para cada uno de nuestros clientes.`,
      testimonials: [
        {
          id: 'test_1',
          author: 'María Fernández',
          role: 'Cliente Frecuente',
          comment: 'La mejor experiencia en Piura. Atención puntual, producto de primera y respuesta inmediata por WhatsApp.',
          rating: 5,
        },
      ],
      map: {
        enabled: true,
        address: 'Av. Ramón Mujica 108',
        city: 'Piura, Perú',
      },
      hasCart: true,
      readmeContent: readme,
      pages,
      language: 'es',
      framework: 'React 18 + Vite + Tailwind CSS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
