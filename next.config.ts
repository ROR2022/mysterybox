import type { Configuration } from 'webpack';
import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      }
    ],
  },
  serverExternalPackages: ['mongodb'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          // Proporcionar polyfills para módulos que MongoDB necesita
          "util": require.resolve("util/"),
          "stream": require.resolve("stream-browserify"),
          "buffer": require.resolve("buffer"),
          "crypto": require.resolve("crypto-browserify"),
          "path": require.resolve("path-browserify"),
          "zlib": require.resolve("browserify-zlib"),
          
          // Deshabilitar módulos que no se necesitan en el cliente
          fs: false,
          net: false,
          tls: false,
          dns: false,
          mongodb: false,
          'mongodb-client-encryption': false,
        },
      };
    }

    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'mongodb-client-encryption',
        'kerberos',
        'snappy',
        '@mongodb-js/zstd',
        'aws4',
        '@aws-sdk/credential-providers'
      ];
    }

    return config;
  },
  serverRuntimeConfig: {
    runtime: 'nodejs',
  },
};

export default nextConfig;