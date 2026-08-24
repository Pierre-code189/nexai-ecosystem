import { GeneratedWebsite } from '@/types/builder';
import { generateId } from '@/lib/utils';

export class AIWebsiteBuilderService {
  async generateWebsiteFromPrompt(prompt: string, businessNameSuggestion?: string): Promise<GeneratedWebsite> {
    const raw = prompt.trim();
    const lower = raw.toLowerCase();

    let businessName = businessNameSuggestion || 'Kira\'s Pizza Artesanal';
    let industry = 'Gastronomía & Dark Kitchen';
    let primaryColor = '#ea580c';
    let secondaryColor = '#f59e0b';
    let bannerUrl = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80';
    let badge = '🍕 Masa Madre 48h en Piura';
    let heroTitle = 'Pizzas Artesanales con Sabor Auténtico';
    let heroSubtitle = 'Horneadas a la piedra con ingredientes frescos. Pide por WhatsApp y paga con Yape o Plin.';
    let ctaText = 'Pedir por WhatsApp';

    let services = [
      {
        id: 'p_1',
        title: 'Pizza Margherita Especial',
        description: 'Salsa de pomodoro italiano, mozzarella fresca y albahaca.',
        price: 'S/ 38.00',
        imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'p_2',
        title: 'Pizza Pepperoni Crunch',
        description: 'Doble pepperoni americano con queso fundido y borde crocante.',
        price: 'S/ 42.00',
        imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'p_3',
        title: 'Combo Familiar 2x1 + Bebida',
        description: '2 pizzas grandes + gaseosa 1.5L para disfrutar en familia.',
        price: 'S/ 65.00',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
      },
    ];

    if (lower.includes('dental') || lower.includes('sonrisas') || lower.includes('clinica') || lower.includes('dientes')) {
      businessName = businessNameSuggestion || 'Clínica Dental Sonrisas';
      industry = 'Salud & Odontología';
      primaryColor = '#10b981';
      secondaryColor = '#06b6d4';
      bannerUrl = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80';
      badge = '✨ Tu Sonrisa en Manos de Especialistas';
      heroTitle = 'Bienvenido a Clínica Dental Sonrisas';
      heroSubtitle = 'Atención odontológica integral con tecnología láser y especialistas certificados.';
      ctaText = 'Agendar Cita Dental';
      services = [
        {
          id: 'serv_1',
          title: 'Blanqueamiento Dental Láser',
          description: 'Aclarado profesional de hasta 4 tonos con tecnología LED de última generación.',
          price: 'S/ 250.00',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'serv_2',
          title: 'Ortodoncia Invisible & Brackets',
          description: 'Alineación perfecta con alineadores invisibles o brackets estéticos de zafiro.',
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
    }

    const initialReadme = `# 🚀 Especificación del Proyecto: ${businessName}

## 🎯 1. Visión y Objetivo
Sitio web y aplicación comercial interactiva generada por el Agente de IA de NexAI Web Builder.
• **Rubro:** ${industry}
• **Público Objetivo:** Clientes en Piura y Perú buscando atención y pedidos rápidos por WhatsApp.

## 📐 2. Estructura de Páginas y Funcionalidades Activas
- [x] **Hero Dinámico**: Títulos persuasivos con llamada a la acción vinculada a WhatsApp.
- [x] **Catálogo Interactivo**: ${services.length} productos/servicios con precios en Soles (PEN).
- [x] **Carrito de Compras**: Selector de cantidades y pasarela de checkout con Yape / Plin.
- [x] **Diseño Responsivo**: Adaptado 100% para celulares, tablets y computadoras.
- [x] **Soporte de Marca**: Paleta de colores primaria (${primaryColor}) y secundaria (${secondaryColor}).

## 🎨 3. Reglas de Diseño
- **Framework:** React 18 + Vite + Tailwind CSS.
- **Iconografía:** Lucide React.
- **Tipografía:** Inter / Sans-Serif moderna.

## 📝 4. Registro de Cambios de la IA (Changelog)
- **v1.0.0 (Inicial):** Estructuración base del proyecto a partir del prompt: "${prompt}".
`;

    return {
      id: generateId('site'),
      slug: businessName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      businessName,
      tagline: heroSubtitle,
      detectedIndustry: industry,
      phoneNumber: '+51 928 100 975',
      email: 'contacto@' + businessName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.pe',
      address: 'Av. Ramón Mujica 108, Piura',
      theme: {
        primaryColor,
        secondaryColor,
        accentColor: '#3b82f6',
        darkMode: true,
      },
      hero: {
        badge,
        title: heroTitle,
        subtitle: heroSubtitle,
        ctaText,
        bannerImageUrl: bannerUrl,
      },
      services,
      aboutText: 'Somos líderes en calidad y servicio personalizado en Piura.',
      testimonials: [
        {
          id: 't_1',
          author: 'María Elena Ramos',
          role: 'Cliente Verificada',
          comment: 'Excelente atención y rapidez. Los productos llegaron calientes y el pago por Yape fue inmediato.',
          rating: 5,
        },
      ],
      map: {
        enabled: true,
        address: 'Av. Ramón Mujica 108',
        city: 'Piura, Perú',
      },
      hasCart: true,
      readmeContent: initialReadme,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
