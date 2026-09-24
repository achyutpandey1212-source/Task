import { Router } from 'express';
import { evaluationController } from './evaluation.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate.js';
import { evaluationIdParamSchema } from './evaluation.schema.js';

const router = Router();

router.use(authenticate);

router.get(
  '/:id',
  validateRequest({ params: evaluationIdParamSchema }),
  (req, res, next) => evaluationController.getById(req, res, next)
);

export const evaluationRouter = router;
