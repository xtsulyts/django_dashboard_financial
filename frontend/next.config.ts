import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      // Si tu avatar viene de otro dominio, agrégalo aquí también
      // Ejemplo si usas imágenes de tu propio dominio:
      // {
      //   protocol: 'https',
      //   hostname: 'tudominio.com',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
