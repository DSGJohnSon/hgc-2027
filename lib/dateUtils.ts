/**
 * Parse une date "YYYY-MM-DD" dans le fuseau LOCAL.
 * `new Date("2026-08-20")` serait interprété comme minuit UTC (= 02h00 à Paris
 * en été), ce qui décale toutes les comparaisons d'un jour partiel.
 */
export function parseLocalDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Limite d'affichage du bouton d'inscription : la fin de la dernière journée
 * de l'événement (23h59:59 heure locale), pour qu'il reste disponible pendant
 * toute la durée de l'événement.
 */
export function getRegistrationDeadline(
  startDate: string,
  endDate?: string
): Date {
  const lastDay = parseLocalDate(endDate || startDate);
  lastDay.setHours(23, 59, 59, 999);
  return lastDay;
}
