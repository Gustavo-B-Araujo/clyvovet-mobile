// Conteúdo estático de referência do app (dicas de saúde e sinais de emergência). Não vem da API nem representa dados fictícios de um pet.
export const HEALTH_TIPS = [
  {
    id: '1',
    title: 'Hidratação é fundamental',
    description: 'Certifique-se de que seu pet tenha acesso a água limpa e fresca durante todo o dia.',
    category: 'nutrição',
    icon: '💧',
  },
  {
    id: '2',
    title: 'Exercício regular previne obesidade',
    description: 'Cães adultos precisam de pelo menos 30 minutos de atividade física diária.',
    category: 'bem-estar',
    icon: '🏃',
  },
  {
    id: '3',
    title: 'Atenção ao peso',
    description: 'Obesidade reduz em até 2 anos a expectativa de vida do seu pet. Consulte seu veterinário.',
    category: 'prevenção',
    icon: '⚖️',
  },
  {
    id: '4',
    title: 'Saúde bucal importa',
    description: 'Doenças periodontais afetam 80% dos cães acima de 3 anos. Escove os dentes regularmente.',
    category: 'preventivo',
    icon: '🦷',
  },
];

export const EMERGENCY_SIGNS = [
  {
    id: '1',
    sign: 'Dificuldade para respirar',
    severity: 'critical',
    action: 'Procure emergência imediatamente',
  },
  {
    id: '2',
    sign: 'Convulsões ou tremores',
    severity: 'critical',
    action: 'Procure emergência imediatamente',
  },
  {
    id: '3',
    sign: 'Abdômen distendido e rígido',
    severity: 'critical',
    action: 'Procure emergência imediatamente',
  },
  {
    id: '4',
    sign: 'Sangramento intenso',
    severity: 'critical',
    action: 'Aplique pressão e vá à emergência',
  },
  {
    id: '5',
    sign: 'Vômitos repetidos (mais de 3x)',
    severity: 'high',
    action: 'Contate a clínica em até 2 horas',
  },
  {
    id: '6',
    sign: 'Letargia intensa / não responde',
    severity: 'high',
    action: 'Contate a clínica em até 2 horas',
  },
  {
    id: '7',
    sign: 'Ingestão de produto tóxico',
    severity: 'high',
    action: 'Ligue para a clínica imediatamente',
  },
  {
    id: '8',
    sign: 'Perda de apetite por mais de 24h',
    severity: 'medium',
    action: 'Agende consulta hoje',
  },
  {
    id: '9',
    sign: 'Coceira excessiva / lesões de pele',
    severity: 'medium',
    action: 'Agende consulta em até 48h',
  },
  {
    id: '10',
    sign: 'Claudicação / mancar',
    severity: 'medium',
    action: 'Agende consulta em até 48h',
  },
];
