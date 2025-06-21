import * as jwt from 'jsonwebtoken';
import logger from '../../../logger';

const generateToken = (id: number): string => {
  const payload = { user: { id } };
  logger.error(`生成token secret: ${process.env.JWT_SECRET || 'superSecret'}`);
  logger.error('生成Token详情:', {
    payload,
    envLoaded: !!process.env.JWT_SECRET // 确认环境变量是否加载
  });
  return jwt.sign(payload, process.env.JWT_SECRET || 'superSecret', {
    expiresIn: '60d',
    algorithm: 'HS256'  // 显式指定
  });
}
  

export default generateToken;
