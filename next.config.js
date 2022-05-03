/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  env: {
    API_KEY_PINATA : process.env.API_KEY_PINATA,
    API_SECRET_KEY_PINATA : process.env.API_SECRET_KEY_PINATA
  }
}
