with open("next.config.ts", "r") as f:
    text = f.read()

# Add withSentryConfig import
text = text.replace('import type { NextConfig } from "next";', 'import type { NextConfig } from "next";\nimport { withSentryConfig } from "@sentry/nextjs";')

# Update CSP img-src
csp_old = "img-src 'self' data: https://upload.wikimedia.org;"
csp_new = "img-src 'self' data: https://upload.wikimedia.org https://imagedelivery.net https://res.cloudinary.com https://*.s3.amazonaws.com;"
text = text.replace(csp_old, csp_new)

# Update remotePatterns
patterns_old = """  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },"""
patterns_new = """  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
    ],
  },"""
text = text.replace(patterns_old, patterns_new)

# Wrap withSentryConfig
text = text.replace("export default nextConfig;", "export default withSentryConfig(nextConfig, { silent: true, hideSourceMaps: true });")

with open("next.config.ts", "w") as f:
    f.write(text)

