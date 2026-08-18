/** Empty per-store database — isolated from other lojas. */

export function buildEmptyStoreDatabase(input: {
  orgId: string
  orgName: string
  slug: string
  userId: string
  username: string
  password: string
  ownerName: string
  city?: string
  phone?: string
}) {
  const now = new Date().toISOString()
  const short =
    input.orgName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .join(' ')
      .slice(0, 24) || input.orgName.slice(0, 24)

  return {
    version: 7,
    organization: {
      id: input.orgId,
      name: input.orgName,
      slug: input.slug,
      createdAt: now,
    },
    vehicles: [],
    sales: [],
    expenses: [],
    customers: [],
    users: [
      {
        id: input.userId,
        organizationId: input.orgId,
        username: input.username,
        password: input.password,
        nome: input.ownerName,
        role: 'admin',
        active: true,
        createdAt: now,
      },
    ],
    settings: [
      {
        id: 'settings_default',
        organizationId: input.orgId,
        nomeEmpresa: input.orgName,
        nomeCurto: short,
        slogan: 'Gestão profissional de estoque automotivo',
        logo: '',
        telefone: input.phone || '',
        whatsapp: input.phone || '',
        instagram: '',
        email: '',
        endereco: '',
        cidade: input.city || '',
        tema: 'dark',
        modoEscuro: true,
        brand: {
          presetId: 'lp',
          corPrimaria: '#0F766E',
          corSecundaria: '#C4A574',
          corFundo: '#0B1018',
          corSuperficie: '#121A26',
          corTexto: '#E8EEF6',
          corPainel: '#081018',
          aparencia: 'premium',
          atmosfera: 'showroom',
          intensidadeFoto: 42,
        },
        org: {
          alertDaysWarn: 30,
          alertDaysAlert: 45,
          alertDaysCritical: 60,
          minMarginPercent: 8,
          brandConcentrationLimit: 20,
          lowStockDemandGap: 15,
          docExpiryWarnDays: 30,
        },
        updatedAt: now,
      },
    ],
    history: [],
    documents: [],
    checklists: [],
    priceHistory: [],
    statusHistory: [],
    suppliers: [],
    payables: [],
    auditLogs: [
      {
        id: `aud_${Date.now().toString(36)}`,
        organizationId: input.orgId,
        userId: input.userId,
        username: input.username,
        action: 'org.register',
        entityType: 'organization',
        entityId: input.orgId,
        detail: `Loja ${input.orgName} cadastrada`,
        createdAt: now,
      },
    ],
  }
}
