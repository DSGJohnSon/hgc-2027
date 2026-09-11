'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChangeEvent } from 'react'
import { TextInput, useField } from '@payloadcms/ui'

/**
 * Champ texte hexadécimal doublé d'un sélecteur visuel (`<input type="color">`).
 * Les deux sont synchronisés sur la même valeur : le sélecteur écrit un hex
 * complet, le texte reste éditable directement pour coller une valeur exacte.
 *
 * Enregistré par `payload/fields/color.ts` (`colorField()`), jamais posé seul
 * sur un champ.
 */

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export const ColorField = (props: any) => {
  const { field, path, readOnly } = props
  const { value, setValue, showError } = useField<string>({ path })

  const swatchValue = typeof value === 'string' && HEX_RE.test(value) ? value : '#000000'
  const label = typeof field?.label === 'string' ? field.label : 'Couleur'

  return (
    <TextInput
      AfterInput={
        <input
          aria-label={`${label} — sélecteur visuel`}
          className="hgc-color-swatch"
          disabled={readOnly}
          onChange={(event) => setValue(event.target.value)}
          type="color"
          value={swatchValue}
        />
      }
      description={field?.admin?.description}
      label={field?.label}
      onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
      path={path}
      placeholder={field?.admin?.placeholder}
      readOnly={readOnly}
      required={field?.required}
      showError={showError}
      value={value ?? ''}
    />
  )
}

export default ColorField
