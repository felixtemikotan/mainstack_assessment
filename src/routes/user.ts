import express from 'express';
import { createUser,login } from '../controller/user';


const router = express.Router();

router.post('/create', createUser);
router.post('/login', login);


router.get('/', (req, res) => {
    res.send('MainStack Assessment API');
    });
export default router;
