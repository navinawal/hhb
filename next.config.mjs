const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
