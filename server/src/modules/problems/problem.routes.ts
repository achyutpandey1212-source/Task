import { Router } from 'express';
import { problemController } from './problem.controller.js';
import { validateRequest } from '../../middleware/validate.js';
import { problemIdParamSchema } from './problem.schema.js';

const router = Router();

router.get('/', (req, res, next) => problemController.getAll(req, res, next));

router.get(
  '/:id',
  validateRequest({ params: problemIdParamSchema }),
  (req, res, next) => problemController.getById(req, res, next)
);

export const problemRouter = router;
