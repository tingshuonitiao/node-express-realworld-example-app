# FROM docker.io/node:lts-alpine

# ENV HOST=0.0.0.0
# ENV PORT=3000

# WORKDIR /app

# RUN addgroup --system api && \
#           adduser --system -G api api

# # 复制必要的文件用于构建
# COPY package.json package-lock.json* ./

# # 安装依赖并生成Prisma客户端
# RUN npm install
# # 必须先复制prisma相关文件
# COPY src/prisma/schema.prisma ./src/prisma/
# RUN npx prisma generate

# # 复制源代码
# COPY . .

# # 构建应用
# RUN npm run build

# RUN chown -R api:api .

# # 安装生产依赖
# # RUN npm --prefix api --omit=dev -f install

# CMD [ "node", "api" ]


# 使用官方Node.js镜像作为基础镜像
FROM node:18-alpine

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

# 运行数据库迁移并启动应用
CMD npx prisma migrate deploy && node dist/api/main.js