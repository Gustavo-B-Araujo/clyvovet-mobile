const OPEN_HOUR = 8;
const CLOSE_HOUR = 18;
const SLOT_MINUTES = 30;
const BUSINESS_DAYS = [1, 2, 3, 4, 5, 6]; // 0=Dom ... 6=Sáb (domingo fechado)

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

// Formata uma Date no fuso local como "AAAA-MM-DD", sem passar por UTC
// (toISOString() converteria para UTC e adiantaria/atrasaria o dia).
export function toLocalIsoDate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function todayIsoDate() {
  return toLocalIsoDate(new Date());
}

// Soma (ou subtrai, com delta negativo) dias corridos a uma data "AAAA-MM-DD".
export function addDays(iso, delta) {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + delta);
  return toLocalIsoDate(date);
}

// Lista `count` dias corridos a partir de `startIso`, sem filtro de dia útil
// (diferente de generateUpcomingDays, que é específico do expediente da
// clínica) — usado por qualquer tirinha de datas que não seja agendamento de
// consulta, como o início/término de um medicamento.
export function generateDayRange(startIso, count) {
  const days = [];
  const cursor = new Date(`${startIso}T00:00:00`);
  for (let i = 0; i < count; i++) {
    days.push({
      iso: toLocalIsoDate(cursor),
      weekday: WEEKDAY_LABELS[cursor.getDay()],
      day: cursor.getDate(),
      month: MONTH_LABELS[cursor.getMonth()],
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

// Lista os próximos `count` dias úteis da clínica (Seg-Sáb), a partir de hoje.
export function generateUpcomingDays(count = 14) {
  const days = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.length < count) {
    if (BUSINESS_DAYS.includes(cursor.getDay())) {
      days.push({
        iso: toLocalIsoDate(cursor),
        weekday: WEEKDAY_LABELS[cursor.getDay()],
        day: cursor.getDate(),
        month: MONTH_LABELS[cursor.getMonth()],
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

// Lista todos os horários "HH:MM" do expediente (08:00, 08:30, ..., 17:30).
export function generateDaySlots() {
  const slots = [];
  const totalMinutes = (CLOSE_HOUR - OPEN_HOUR) * 60;
  for (let m = 0; m < totalMinutes; m += SLOT_MINUTES) {
    const hour = OPEN_HOUR + Math.floor(m / 60);
    const minute = m % 60;
    slots.push(`${pad2(hour)}:${pad2(minute)}`);
  }
  return slots;
}

// Horários do expediente que já passaram, só relevante quando o dia
// selecionado é hoje — não faz sentido oferecer um horário já decorrido.
export function isSlotInPast(dateIso, time) {
  if (dateIso !== todayIsoDate()) return false;
  const [hour, minute] = time.split(':').map(Number);
  const slot = new Date();
  slot.setHours(hour, minute, 0, 0);
  return slot.getTime() <= Date.now();
}
