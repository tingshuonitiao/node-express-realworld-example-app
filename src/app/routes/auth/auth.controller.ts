import { NextFunction, Request, Response, Router } from 'express';
import auth from './auth';
// 在现有import中添加
import { createUser, getCurrentUser, login, updateUser, getAllUsers } from './auth.service';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * Create an user
 * @auth none
 * @route {POST} /users
 * @bodyparam user User
 * @returns user User
 */
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUser({ ...req.body.user, demo: false });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * Login
 * @auth none
 * @route {POST} /users/login
 * @bodyparam user User
 * @returns user User
 */
router.post('/users/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await login(req.body.user);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * Get current user
 * @auth required
 * @route {GET} /user
 * @returns user User
 */
router.get('/user', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getCurrentUser(req.auth?.user?.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user
 * @auth required
 * @route {PUT} /user
 * @bodyparam user User
 * @returns user User
 */
router.put('/user', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUser(req.body.user, req.auth?.user?.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// 添加新路由（建议加权限控制）
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

router.get('/verify-token', (req, res) => {
  const testPayload = { test: 'validation' };
  const testToken = jwt.sign(testPayload, process.env.JWT_SECRET, {
    expiresIn: '1h' // 添加1小时过期时间
  });
  const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
  res.json({ 
    generated: testToken,
    verified: decoded,
    expiresIn: '1h' // 返回过期时间配置
  });
});

export default router;
