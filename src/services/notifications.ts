// Notificações locais de lembrete de medicamento.
// Os horários são fixos (10h e 22h) e os agendamentos são recalculados a partir dos medicamentos vindos da API.
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'medicamentos';
const NOTIFICATION_TYPE = 'medicamento';

const MORNING_HOUR = 10;
const NIGHT_HOUR = 22;

// Janela móvel de agendamento: o iOS aceita no máximo 64 notificações locais pendentes,
// então agendamos só o futuro próximo e reagendamos sempre que a lista de medicamentos é carregada.
const DAILY_WINDOW_DAYS = 7;
const PERIODIC_WINDOW_DAYS = 90;
const MAX_SCHEDULED_PER_PET = 30;

const MONTHS_BY_FREQUENCY = { Mensal: 1, Trimestral: 3, Anual: 12 };

export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Lembretes de medicamentos',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

export async function ensureNotificationPermission() {
  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function parseLocalDate(iso) {
  return new Date(`${iso}T00:00:00`);
}

function atHour(date, hour) {
  const result = new Date(date);
  result.setHours(hour, 0, 0, 0);
  return result;
}

// Soma meses mantendo o dia de início, limitando ao último dia do mês quando ele não existe (ex.: 31 -> 30).
function addMonths(date, months) {
  const result = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), lastDay));
  return result;
}

// Datas dos ciclos de uma frequência entre o início e o fim do tratamento.
function listCycleDays(frequencia, start, limit) {
  const days = [];
  if (frequencia === 'Diário') {
    for (let cursor = new Date(start); cursor <= limit; cursor.setDate(cursor.getDate() + 1)) {
      days.push(new Date(cursor));
    }
    return days;
  }
  if (frequencia === 'Semanal') {
    for (let cursor = new Date(start); cursor <= limit; cursor.setDate(cursor.getDate() + 7)) {
      days.push(new Date(cursor));
    }
    return days;
  }
  const step = MONTHS_BY_FREQUENCY[frequencia] || 1;
  for (let i = 0; addMonths(start, i * step) <= limit; i++) {
    days.push(addMonths(start, i * step));
  }
  return days;
}

// Calcula quando disparar os lembretes de um medicamento ativo, a partir de `now`.
export function buildReminderDates(medicamento, now = new Date()) {
  if (!medicamento.active || !medicamento.dataInicio) return [];

  const windowDays = medicamento.frequencia === 'Diário' ? DAILY_WINDOW_DAYS : PERIODIC_WINDOW_DAYS;
  const windowEnd = new Date(now);
  windowEnd.setDate(windowEnd.getDate() + windowDays);
  const treatmentEnd = medicamento.dataFim ? atHour(parseLocalDate(medicamento.dataFim), 23) : null;
  const limit = treatmentEnd && treatmentEnd < windowEnd ? treatmentEnd : windowEnd;

  const hours = medicamento.frequencia === 'Diário' ? [MORNING_HOUR, NIGHT_HOUR] : [MORNING_HOUR];
  const dates = [];
  listCycleDays(medicamento.frequencia, parseLocalDate(medicamento.dataInicio), limit).forEach((day) => {
    hours.forEach((hour) => {
      const at = atHour(day, hour);
      if (at > now && at <= limit) dates.push(at);
    });
  });
  return dates;
}

async function cancelPetReminders(petId) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const own = scheduled.filter(
    (n) => n.content.data?.type === NOTIFICATION_TYPE && String(n.content.data?.petId) === String(petId)
  );
  await Promise.all(own.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

// Substitui os lembretes agendados do pet pelos calculados a partir dos medicamentos atuais.
export async function syncMedicationReminders(pet, medicamentos) {
  await cancelPetReminders(pet.id);

  const reminders = medicamentos
    .flatMap((medicamento) => buildReminderDates(medicamento).map((at) => ({ medicamento, at })))
    .sort((a, b) => a.at - b.at)
    .slice(0, MAX_SCHEDULED_PER_PET);
  if (reminders.length === 0) return;

  const allowed = await ensureNotificationPermission();
  if (!allowed) return;

  await Promise.all(
    reminders.map(({ medicamento, at }) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: `💊 Hora do medicamento de ${pet.name}`,
          body: [medicamento.title, medicamento.dosagem].filter(Boolean).join(' · '),
          data: { type: NOTIFICATION_TYPE, petId: pet.id, medicamentoId: medicamento.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: at,
          channelId: CHANNEL_ID,
        },
      })
    )
  );
}

export function cancelAllReminders() {
  return Notifications.cancelAllScheduledNotificationsAsync();
}
