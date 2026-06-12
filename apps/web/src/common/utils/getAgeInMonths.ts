export function getAgeInMonths(
  birthDate: Date,
  currentDate = new Date(),
): number {
  if (birthDate.getTime() > currentDate.getTime()) {
    return 0;
  }

  const birthMonthIndex = birthDate.getFullYear() * 12 + birthDate.getMonth();
  const currentMonthIndex =
    currentDate.getFullYear() * 12 + currentDate.getMonth();
  const monthAdjustment = currentDate.getDate() < birthDate.getDate() ? 1 : 0;

  return Math.max(currentMonthIndex - birthMonthIndex - monthAdjustment, 0);
}
