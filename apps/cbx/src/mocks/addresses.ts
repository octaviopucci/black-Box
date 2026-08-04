import type { Address } from '@/types'

export const addresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Casa',
    street: 'Rua Barão do Rio Branco',
    number: '412',
    neighborhood: 'Centro',
    city: 'Capão Bonito',
    state: 'SP',
    zip: '18300-070',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Trabalho',
    street: 'Avenida Nove de Julho',
    number: '1280',
    neighborhood: 'Jardim Europa',
    city: 'Capão Bonito',
    state: 'SP',
    zip: '18305-120',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Mãe',
    street: 'Rua José Bonifácio',
    number: '89',
    neighborhood: 'Vila Nova',
    city: 'Capão Bonito',
    state: 'SP',
    zip: '18302-340',
    isDefault: false,
  },
]
