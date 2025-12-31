import express from 'express';
import * as billingController from '../src/controllers/billingController';

const router = express.Router();

router.get('/', billingController.list);
router.get('/:id', billingController.get);
router.post('/', billingController.create);
router.put('/:id', billingController.update);
router.post('/:id/pay', billingController.pay);

export default router;
