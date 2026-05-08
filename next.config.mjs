/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { 
    serverComponentsExternalPackages: ['mongoose', 'bcrypt'] 
  }
};

export default nextConfig;
