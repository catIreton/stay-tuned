import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Set NEXT_PUBLIC_BASE_PATH in CI to /your-repo-name.
  // Leave empty for local dev or a custom domain deployment.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: {
    // next/image optimization requires a server; not available in static export.
    unoptimized: true,
  },
};

export default nextConfig;
