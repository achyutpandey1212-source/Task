import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../middleware/validate.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  validateRequest({ body: registerSchema }),
  (req, res, next) => authController.register(req, res, next)
);

router.post(
  '/login',
  validateRequest({ body: loginSchema }),
  (req, res, next) => authController.login(req, res, next)
);

router.get(
  '/me',
  authenticate,
  (req, res, next) => authController.getMe(req, res, next)
);

export const authRouter = router;
