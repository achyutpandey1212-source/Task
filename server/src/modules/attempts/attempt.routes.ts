import { Router } from 'express';
import { attemptController } from './attempt.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate.js';
import {
  createAttemptSchema,
  attemptIdParamSchema,
  submitSolutionSchema,
} from './attempt.schema.js';

const router = Router();

// All attempt operations require authentication
router.use(authenticate);

router.post(
  '/',
  validateRequest({ body: createAttemptSchema }),
  (req, res, next) => attemptController.create(req, res, next)
);

router.get('/', (req, res, next) => attemptController.getAll(req, res, next));

router.get(
  '/:id',
  validateRequest({ params: attemptIdParamSchema }),
  (req, res, next) => attemptController.getById(req, res, next)
);

router.post(
  '/:id/submit',
  validateRequest({
    params: attemptIdParamSchema,
    body: submitSolutionSchema,
  }),
  (req, res, next) => attemptController.submit(req, res, next)
);

export const attemptRouter = router;
