import type { NextConfig } from "next";

const { join } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'],
  },

};

export default nextConfig;
