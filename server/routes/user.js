import User from '../controllers/user';
import checkAuth from '../middleware/checkAuthentication';
import { Router } from "express";

const router = Router();


    router.post('/register', User.register);

    router.post('/authenticate', User.authenticate);

    router.post('/delete/:userId', checkAuth , User.delete);

    router.post('/reset', checkAuth , User.passwordReset);

    router.get('/users', checkAuth , User.list);

 
export default router;