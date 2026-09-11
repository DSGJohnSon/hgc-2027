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
      }
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
