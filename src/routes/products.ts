import express from 'express';
import { addProduct,updateProduct,getSingleProduct,getAllProducts,sellProduct } from '../controller/products';
import {auth} from '../middlewares/auth';


const router = express.Router();

router.post('/add-product',auth, addProduct);
router.post('/update-product/:id',auth, updateProduct);
router.get('/get-single-product/:id',getSingleProduct);
router.get('/get-all-products',getAllProducts);
router.post('/sell-product/:id',auth, sellProduct);


router.get('/', (req, res) => {
    res.send('MainStack Assessment API');
    });
export default router;
