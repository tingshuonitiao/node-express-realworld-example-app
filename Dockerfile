# FROM docker.io/node:lts-alpine

# ENV HOST=0.0.0.0
# ENV PORT=3000

# WORKDIR /app

# RUN addgroup --system api && \
#           adduser --system -G api api

# 使用官方Node.js镜像作为基础镜像
FROM node:18-alpine

# 安装必要的依赖
RUN apk add --no-cache openssl

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json(或yarn.lock)
COPY package*.json .

# 复制NX配置文件
COPY nx.json .
COPY project.json .
COPY tsconfig*.json .
COPY jest.config.ts .

# 安装依赖
RUN npm ci

COPY src/prisma/ ./src/prisma/
RUN npx prisma generate

# 复制源代码
COPY . .

# 构建应用
RUN npx nx build api --prod

# 应用端口
EXPOSE 3000

# 启动应用
CMD node dist/api/main.js