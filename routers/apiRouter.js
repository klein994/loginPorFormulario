import { Router } from 'express';
import apiControllers from '../controllers/apiControllers.js';

const router = new Router()

router.get('/login', apiControllers.getName);
router.post('/login/:name', apiControllers.apiLogin);
router.get('/logout', apiControllers.apiLogout);
router.get('/productos-test', apiControllers.productosTest)

export default router