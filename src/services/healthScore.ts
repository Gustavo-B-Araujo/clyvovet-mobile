// Calcula o score de saúde do pet baseado em múltiplos fatores.
export function calculateHealthScore(pet, vaccines = [], reminders = []) {
  if (!pet) return 0;

  let score = 0;
  const weights = {
    vaccinesCurrent: 40,   // Vacinas em dia
    hasWeight: 15,          // Peso registrado
    remindersActive: 20,   // Lembretes ativos
    profileComplete: 25,   // Perfil completo
  };

  // Vacinas em dia
  const doneVaccines = vaccines.filter(v => v.status === 'done').length;
  const totalVaccines = vaccines.length;
  if (totalVaccines > 0) {
    score += (doneVaccines / totalVaccines) * weights.vaccinesCurrent;
  }

  // Peso registrado
  if (pet.weight && parseFloat(pet.weight) > 0) {
    score += weights.hasWeight;
  }

  // Lembretes ativos
  const activeReminders = reminders.filter(r => r.active).length;
  if (activeReminders > 0) {
    score += Math.min(activeReminders / 3, 1) * weights.remindersActive;
  }

  // Perfil completo
  const fields = ['name', 'species', 'breed', 'birthDate', 'sex', 'weight'];
  const filled = fields.filter(f => pet[f] && String(pet[f]).trim() !== '').length;
  score += (filled / fields.length) * weights.profileComplete;

  return Math.min(Math.round(score), 100);
}


 // Retorna rótulo e cor do score de saúde.
export function getScoreLabel(score) {
  if (score >= 85) return { label: 'Excelente', color: '#10B981' };
  if (score >= 70) return { label: 'Bom', color: '#6C3FC5' };
  if (score >= 50) return { label: 'Regular', color: '#F59E0B' };
  if (score >= 30) return { label: 'Atenção', color: '#F97316' };
  return { label: 'Crítico', color: '#EF4444' };
}


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
