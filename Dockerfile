# ใช้ Node.js 20 บน Alpine เป็น base image
ARG NODE_VERSION=20.18.2
FROM node:${NODE_VERSION}-alpine as base

# ตั้งค่าที่ทำงาน
WORKDIR /usr/src/app

################################################################################
# ติดตั้ง dependencies
FROM base as deps

# คัดลอกไฟล์ package.json และ package-lock.json ก่อนเพื่อลดการโหลด cache
COPY package.json package-lock.json ./

# ปรับสิทธิ์ไฟล์เพื่อให้สามารถเข้าถึงได้
RUN chown -R node:node /usr/src/app

RUN npm ci --omit=dev

################################################################################
# Build แอป
FROM base as build

# คัดลอกไฟล์ทั้งหมดเข้าไปใน container
COPY . .

# ปรับสิทธิ์ไฟล์
RUN chown -R node:node /usr/src/app

# ติดตั้ง dependencies รวม devDependencies เพื่อใช้ build
RUN npm ci

# Build แอป
RUN npm run build

################################################################################
# สร้าง Final Image สำหรับ Production
FROM base as final

# ใช้ production mode
ENV NODE_ENV production

# คัดลอก package.json และ node_modules จาก stage `deps`
COPY --from=deps /usr/src/app/node_modules ./node_modules

# คัดลอกไฟล์จาก `build`
COPY --from=build /usr/src/app /usr/src/app

# ปรับสิทธิ์ไฟล์
RUN chown -R node:node /usr/src/app

# ใช้ user node
USER node

# เปิดพอร์ต 4000
EXPOSE 4000

# คำสั่งเริ่มแอป
CMD ["npm", "run", "serve:ssr:SwaggerUI-test"]
