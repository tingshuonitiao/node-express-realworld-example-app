import { config } from 'dotenv';
import path from 'path';
import logger from './logger';


// 必须最先执行！使用绝对路径确保可靠性
config({ path: path.join(__dirname, '../.env') });

// 添加环境变量验证
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in .env');
}

import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import routes from './app/routes/routes';
import HttpException from './app/models/http-exception.model';

logger.info('=== 启动测试日志 ===');
logger.warn('测试警告级别日志');
logger.error('测试错误级别日志');
logger.debug('测试调试级别日志'); 
logger.error(`JWT_SECRET in main.ts is: ${process.env.JWT_SECRET}`); 

config({ path: __dirname + '/../.env' }); 
// 在app初始化前添加时区设置
process.env.TZ = 'Asia/Shanghai'; // 设置为北京时间
const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Serves images
app.use(express.static(__dirname + '/assets'));

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ status: 'API is running on /api' });
});

/* eslint-disable */
app.use(
  (
    err: Error | HttpException,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    // @ts-ignore
    if (err && err.name === 'UnauthorizedError') {
    logger.error('JWT验证失败详情:', {
      message: err.message,
      stack: err.stack,
      inner: JSON.stringify((err as any).inner) || 'N/A',
      code: (err as any)?.code,
      timestamp: new Date(),
      token: req.headers.authorization?.split(' ')[1],
      secretUsed: process.env.JWT_SECRET?.substring(0, 3) + '...'
    });
      return res.status(401).json({
        status: 'error',
        message: 'missing authorization credentials',
      });
      // @ts-ignore
    } else if (err && err.errorCode) {
      // @ts-ignore
      res.status(err.errorCode).json(err.message);
    } else if (err) {
      res.status(500).json(err.message);
    }
  },
);

/**
 * Server activation
 */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
