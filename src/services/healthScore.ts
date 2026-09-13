// Gera alertas preventivos baseados no estado do pet.
export function generateAlerts(pet, vaccines = []) {
  const alerts = [];

  const overdueVaccines = vaccines.filter(v => v.status === 'overdue');
  if (overdueVaccines.length > 0) {
    alerts.push({
      id: 'vax-overdue',
      type: 'warning',
      title: 'Vacinas em atraso',
      description: `${overdueVaccines.length} vacina(s) estão em atraso. Agende a aplicação.`,
      action: 'Agendar',
      route: 'Vaccines',
    });
  }

  const upcomingVaccines = vaccines.filter(v => v.status === 'upcoming');
  if (upcomingVaccines.length > 0) {
    alerts.push({
      id: 'vax-upcoming',
      type: 'info',
      title: 'Vacinas próximas',
      description: `${upcomingVaccines.length} vacina(s) próximas do vencimento.`,
      action: 'Ver detalhes',
      route: 'Vaccines',
    });
  }

  if (pet && !pet.weight) {
    alerts.push({
      id: 'no-weight',
      type: 'info',
      title: 'Peso não registrado',
      description: 'Registre o peso do seu pet para um acompanhamento mais preciso.',
      action: 'Registrar',
      route: 'PetForm',
    });
  }

  return alerts;
}


// Formata data ISO para exibição em PT-BR.
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
