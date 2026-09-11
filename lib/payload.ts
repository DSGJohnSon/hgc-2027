import { getPayload, type Payload } from 'payload'

import config from '@/payload.config'

/**
 * Accès à la Local API de Payload.
 *
 * On interroge la base directement, sans passer par HTTP : les pages du site sont
 * rendues côté serveur, un aller-retour réseau vers notre propre API n'aurait
 * aucun intérêt. `getPayload` met l'instance en cache, l'appeler à chaque requête
 * ne coûte rien.
 */
export const getPayloadClient = async (): Promise<Payload> => getPayload({ config })
