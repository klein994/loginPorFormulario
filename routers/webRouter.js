import { Router } from 'express';
import webControllers from '../controllers/webController.js';
import { auth } from '../middlewares/middlewares.js';

const router = new Router()

router.get('/', auth, webControllers.inicio)
router.get('/login', webControllers.login)
router.get('/logout', webControllers.logout)

export default router