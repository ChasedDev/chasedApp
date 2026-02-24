/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@chased/shared'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
