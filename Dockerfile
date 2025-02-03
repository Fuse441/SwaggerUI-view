# ใช้ Node.js 20 บน Alpine เป็น base image
ARG NODE_VERSION=20.18.2
FROM node:${NODE_VERSION}-alpine as base

# ตั้งค่าที่ทำงาน
WORKDIR /app

################################################################################
# ติดตั้ง dependencies
FROM base as deps

# คัดลอกไฟล์ package.json และ package-lock.json ก่อนเพื่อลดการโหลด cache
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

################################################################################
# Build แอป
FROM base as build

# คัดลอกไฟล์ทั้งหมดเข้าไปใน container
COPY . .

# ติดตั้ง dependencies รวม devDependencies เพื่อใช้ build
RUN npm ci

# Build แอป
RUN npm run build

################################################################################
# สร้าง Final Image สำหรับ Production
FROM base as final

ENV NODE_ENV production




COPY --from=deps /app/node_modules ./node_modules

COPY --from=build /app ./
COPY --from=build /app/dist ./

EXPOSE 4000

CMD ["node", "dist/swagger-ui-test/server/server.mjs"]
