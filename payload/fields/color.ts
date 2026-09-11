import type { TextField } from 'payload'

type ColorFieldOptions = {
  name?: string
  label?: string
  required?: boolean
  defaultValue?: string
  placeholder?: string
  admin?: TextField['admin']
}

/**
 * Champ couleur réutilisable : un champ texte classique (hexadécimal, tel que
 * lu par le rendu du site), doublé d'un sélecteur visuel natif
 * (`components/admin/fields/ColorField.tsx`) pour ne pas avoir à connaître le
 * code hexadécimal de tête. Les deux restent synchronisés — le texte reste
 * modifiable directement pour coller une valeur exacte.
 */
export const colorField = ({
  name = 'color',
  label = 'Couleur',
  required = false,
  defaultValue,
  placeholder = '#6240cf',
  admin,
}: ColorFieldOptions = {}): TextField => ({
  name,
  type: 'text',
  label,
  required,
  defaultValue,
  admin: {
    ...admin,
    placeholder,
    components: {
      Field: '/components/admin/fields/ColorField#ColorField',
    },
  },
})
