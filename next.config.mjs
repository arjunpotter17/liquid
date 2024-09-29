/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'arweave.net',
          },
          {
            protocol: 'https',
            hostname: 'elementerra-mainnet.s3.us-east-1.amazonaws.com',
          }
        ],
      },
};

export default nextConfig;
