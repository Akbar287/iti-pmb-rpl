# Gunakan Node 20 LTS (paling stabil untuk CI + Prisma + Next 15)
FROM node:20

# Direktori kerja di dalam container
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# URL publik aplikasi. Variabel NEXT_PUBLIC_* di-inline ke client bundle saat
# `next build`, jadi WAJIB tersedia saat build di dalam container — kalau tidak,
# client bundle berisi "undefined" (mis. /undefined/api/protected/chart).
# ENV ini juga persist ke runtime, dipakai route server (avatar, dll).
ARG NEXT_PUBLIC_API_BASE_URL
ARG BACKEND_API_BASE_URL

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV BACKEND_API_BASE_URL=${BACKEND_API_BASE_URL}

# Copy file dependency dulu (optimasi cache Docker)
COPY package*.json ./

# Install dependency
RUN npm config set registry https://registry.npmjs.org/ \
    && npm install --no-audit --no-fund --ignore-scripts

# Copy seluruh source code
COPY . .

# Build Next.js (dijalankan di GitHub Actions, BUKAN di server)
RUN npm run build

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["sh", "-c", "npx prisma generate && npm run start"]

