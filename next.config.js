/** @type {import("next").NextConfig} */
const nextConfig = {
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";

    const cspDev =
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
      "connect-src 'self' ws: http: https:; " +
      "img-src 'self' data: blob:; " +
      "style-src 'self' 'unsafe-inline';";

    const cspProd =
      "default-src 'self'; " +
      "script-src 'self'; " +
      "connect-src 'self' https:; " +
      "img-src 'self' data:; " +
      "style-src 'self' 'unsafe-inline';";

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: isDev ? cspDev : cspProd,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
