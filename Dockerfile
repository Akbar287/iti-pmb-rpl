# Gunakan Node 20 LTS (paling stabil untuk CI + Prisma + Next 15)
FROM node:20

# Direktori kerja di dalam container
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy file dependency dulu (optimasi cache Docker)
COPY package*.json ./

# Install dependency
RUN npm config set registry https://registry.npmjs.org/ \
    && npm install --no-audit --no-fund

# Copy seluruh source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js (dijalankan di GitHub Actions, BUKAN di server)
RUN npm run build

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start"]
