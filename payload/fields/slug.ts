import type { Field } from 'payload'

/**
 * Identifiant lisible du document (« slug »).
 *
 * Le site public identifie les contenus par une chaîne stable — `bollaert-cup-2026`,
 * `just_dance`, `fifaSeason` — utilisée dans les URLs et dans les références croisées
 * des fichiers `data/`. Payload attribue de son côté un ObjectId Mongo : ce champ
 * conserve donc l'identifiant historique, et c'est lui que les mappers exposent au
 * front sous le nom `id`.
 *
 * Volontairement **non normalisé** : les identifiants existants mélangent les
 * conventions (`gamingHouseTour`, `just_dance`, `gaming-house-tour`) et les réécrire
 * casserait les liens ainsi que les références croisées entre contenus. On se
 * contente donc de retirer les espaces superflus et de valider le format.
 */
export const slugField = (description?: string): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Identifiant (URL)',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      description ??
      "Utilisé dans l'adresse de la page. À ne plus modifier une fois la page en ligne : les liens existants casseraient.",
  },
  hooks: {
    beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim() : value)],
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string' || value.length === 0) {
      return 'Renseignez un identifiant.'
    }
    if (!/^[A-Za-z0-9_-]+$/.test(value)) {
      return 'Lettres, chiffres, tirets et underscores uniquement (pas d’espace ni d’accent).'
    }
    return true
  },
})
