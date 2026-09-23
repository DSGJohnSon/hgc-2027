import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // L'indicateur de dev (rond flottant) apparaît dans les <iframe> d'aperçu
  // du backoffice (voir app/(embed)) — sans intérêt là où on ne navigue pas.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        // Bibliothèque de médias en production : les images sont servies
        // directement par le CDN de Vercel Blob, et non plus recopiées par une
        // fonction serverless (voir `disablePayloadAccessControl` dans
        // payload.config.ts). L'identifiant du store préfixe le domaine et
        // change d'un projet à l'autre, d'où le joker.
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        // La version joueurs vit à la racine ; on garde l’URL explicite
        // fonctionnelle sans créer de contenu dupliqué.
        source: "/joueurs",
        destination: "/",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default withPayload(nextConfig);
