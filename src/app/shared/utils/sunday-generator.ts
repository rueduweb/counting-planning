export function generateSundays(): Date[] {

  const start = new Date('2026-07-05');
  const end = new Date('2026-09-27');

  const dates: Date[] = [];

  const current = new Date(start);

  while (current <= end) {

    dates.push(new Date(current));

    current.setDate(current.getDate() + 7);
  }

  return dates;
}
