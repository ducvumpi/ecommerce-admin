/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ✅ wildcard hostname

      },
    ],
    // domains: ["opjluoktkkgyqwujdhdu.supabase.co"]
  },
};

export default nextConfig;


