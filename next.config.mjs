/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["pdfkit"],
  },
  //  serverExternalPackages: ["pdfkit"],?]
  allowedDevOrigins :  ["192.168.31.75"],
};

export default nextConfig;
