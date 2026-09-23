/**
 * Normalisation des URLs de média, partagée par le site et le backoffice.
 *
 * Une image de la bibliothèque arrive sous deux formes selon l'environnement :
 *
 *  - **en production**, une URL absolue vers le CDN de Vercel Blob
 *    (`https://<store>.public.blob.vercel-storage.com/…`). Les images y sont
 *    servies directement, sans passer par une fonction serverless — voir le
 *    commentaire de `disablePayloadAccessControl` dans `payload.config.ts` ;
 *  - **en local**, sans jeton Blob, une URL absolue servie par l'application
 *    elle-même (`http://localhost:3000/api/media/file/x.png`).
 *
 * Seule la seconde doit être ramenée à un chemin relatif : `next/image` traite
 * toute URL absolue comme distante et la fait passer par son optimiseur, qui
 * depuis Next 16 refuse un hôte résolvant vers une IP privée (« upstream image
 * … resolved to private ip »). Le chemin relatif désigne la même ressource, sert
 * quel que soit le domaine de déploiement, et évite l'aller-retour.
 *
 * Les URLs pointant ailleurs — CDN Blob, stockage externe, images de
 * démonstration — sont renvoyées intactes : leur hôte est déclaré dans
 * `images.remotePatterns` (`next.config.ts`), qui autorise l'optimiseur à les
 * charger. Les tronquer produirait un chemin local inexistant.
 */
export const toLocalMediaPath = (url: string): string => {
  try {
    const { pathname, search } = new URL(url, 'http://localhost')
    return pathname.startsWith('/api/media/') ? `${pathname}${search}` : url
  } catch {
    return url // déjà relative
  }
}
