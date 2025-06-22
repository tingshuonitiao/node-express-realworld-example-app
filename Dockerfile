# FROM docker.io/node:lts-alpine

# ENV HOST=0.0.0.0
# ENV PORT=3000

# WORKDIR /app

# RUN addgroup --system api && \
#           adduser --system -G api api

# 使用官方Node.js镜像作为基础镜像
FROM node:18-alpine

# 构建参数
ARG DATABASE_URL
ARG JWT_SECRET
ARG NODE_ENV
ARG PORT

# 转换为环境变量
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT

# 安装必要的依赖
RUN apk add --no-cache openssl

# 设置工作目录
WORKDIR /app

# 在现有基础上添加日志目录和PM2支持
RUN mkdir -p /app/logs && chown node:node /app/logs
VOLUME /app/logs

# 复制package.json和package-lock.json(或yarn.lock)
COPY package*.json .
# 复制NX配置文件
COPY nx.json .
COPY project.json .
COPY tsconfig*.json .
COPY jest.config.ts .

# 安装依赖
RUN npm install
COPY src/prisma/ ./src/prisma/
RUN rm -rf node_modules/.prisma && npx prisma generate
RUN npx prisma migrate deploy

# 安装PM2
RUN npm install pm2 -g

RUN npm install -g nx 

# 复制源代码
COPY . .

# 构建应用
RUN npx nx build api --prod

# 应用端口
EXPOSE 3000

# 修改启动命令（替换最后一行CMD）
CMD ["pm2-runtime", "dist/api/main.js", "--log", "/app/logs/app.log"]