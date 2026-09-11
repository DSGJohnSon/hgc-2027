import type { Field } from 'payload'

/**
 * Accès en transports — miroir de `Event["transports"]`.
 *
 * Partagé par les événements et par chaque étape d'une série : la même structure
 * est reprise à l'identique aux deux endroits.
 */

const lineStopFields = (label: string): Field => ({
  name: label.toLowerCase(),
  type: 'array',
  label,
  labels: { singular: 'Arrêt', plural: 'Arrêts' },
  fields: [
    {
      name: 'lines',
      type: 'array',
      label: 'Lignes',
      labels: { singular: 'Ligne', plural: 'Lignes' },
      fields: [{ name: 'value', type: 'text', label: 'Ligne', required: true }],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'station',
          type: 'text',
          label: 'Station / arrêt',
          required: true,
          admin: { width: '60%' },
        },
        {
          name: 'walkTimeInMin',
          type: 'number',
          label: 'Marche (min)',
          required: true,
          min: 0,
          admin: { width: '40%' },
        },
      ],
    },
  ],
})

export const transportsField = (): Field => ({
  name: 'transports',
  type: 'group',
  label: 'Accès',
  admin: {
    description: 'Laisser vide si aucune information de transport n’est à afficher.',
  },
  fields: [
    lineStopFields('Metro'),
    lineStopFields('Bus'),
    lineStopFields('Tramway'),
    {
      name: 'car',
      type: 'group',
      label: 'Voiture',
      fields: [
        {
          name: 'parkings',
          type: 'array',
          label: 'Parkings',
          labels: { singular: 'Parking', plural: 'Parkings' },
          fields: [
            { name: 'name', type: 'text', label: 'Nom', required: true },
            { name: 'address', type: 'text', label: 'Adresse', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'distanceInMeters',
                  type: 'number',
                  label: 'Distance (m)',
                  required: true,
                  min: 0,
                  admin: { width: '50%' },
                },
                {
                  name: 'walkTimeInMin',
                  type: 'number',
                  label: 'Marche (min)',
                  required: true,
                  min: 0,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})
