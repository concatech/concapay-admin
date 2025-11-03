import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silenciar aviso de lockfiles múltiplos
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
