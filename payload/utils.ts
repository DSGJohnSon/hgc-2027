/**
 * Identifiant d'une relation Payload.
 *
 * Selon la profondeur de la requête, une relation arrive peuplée (`{ id, ... }`)
 * ou réduite à son identifiant : cette fonction ramène les deux cas à une chaîne,
 * pour pouvoir comparer des relations entre elles.
 */
export const relationId = (value: unknown): string | undefined => {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return String(id)
  }
  return undefined
}
