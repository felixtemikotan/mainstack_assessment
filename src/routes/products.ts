import express from 'express';
import { addProduct,updateProduct,getSingleProduct,getAllProducts } from '../controller/products';
import {auth} from '../middlewares/auth';


const router = express.Router();

router.post('/add-product',auth, addProduct);
router.put('/update-product/:id',auth, updateProduct);
router.get('/get-single-product/:id',getSingleProduct);
router.get('/get-all-products',getAllProducts);


router.get('/', (req, res) => {
    res.send('MainStack Assessment API');
    });
export default router;
