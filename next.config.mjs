/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.sndcdn.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "atzgfuygesjvyxthvfwg.supabase.co",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "files.virgool.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
