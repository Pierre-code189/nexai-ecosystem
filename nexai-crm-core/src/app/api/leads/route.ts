import { NextResponse } from 'next/server';
import { StorageFactory } from '@/lib/solid/StorageFactory';
import { generateId } from '@/lib/utils';
import { PipelineDeal, Contact, ActivityLog } from '@/types/crm';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const storage = StorageFactory.getStorage();
    const tenantId = data.tenantId || 'tenant_default';

    // 1. Crear / Guardar Contacto
    const contactId = generateId('cont');
    const newContact: Contact = {
      id: contactId,
      tenantId,
      name: data.contactName || 'Lead Web',
      email: data.contactEmail || '',
      phone: data.contactPhone || '',
      company: data.company || '',
      status: 'lead',
      tags: ['Web Builder', 'Formulario Web'],
      customData: {},
      notes: data.notes || 'Prospecto capturado desde el sitio web en React.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await storage.saveContact(newContact);

    // 2. Crear / Guardar Trato en el Pipeline
    const newDeal: PipelineDeal = {
      id: generateId('deal'),
      tenantId,
      title: data.title || `Oportunidad Web: ${newContact.name}`,
      value: Number(data.value) || 1200,
      stageId: data.stageId || 'stage_lead',
      contactId: newContact.id,
      contactName: newContact.name,
      contactPhone: newContact.phone,
      priority: data.priority || 'high',
      expectedCloseDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      customData: data.customData || {},
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await storage.saveDeal(newDeal);

    // 3. Registrar Actividad en Vivo
    const act: ActivityLog = {
      id: generateId('act'),
      tenantId,
      type: 'contact_created',
      title: `Nuevo Prospecto Web: ${newContact.name}`,
      description: `Mensaje: ${data.notes || 'Consulta comercial recibida desde la página web'}`,
      timestamp: new Date().toISOString(),
      entityId: newDeal.id,
    };
    await storage.logActivity(act);

    return NextResponse.json({ success: true, deal: newDeal, contact: newContact });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error registrando lead' }, { status: 500 });
  }
}
