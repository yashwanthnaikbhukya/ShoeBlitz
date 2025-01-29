import {Router} from 'express'
import { allProducts, addProduct, product, getReview } from '../controllers/products.controller.js'

const router = Router()

router.route('/allproducts').post(allProducts)
router.route('/product/:_id').get(product)
router.route('/product/get-review').post( getReview)
export default router