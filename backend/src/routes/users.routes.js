import {Router} from 'express'
import { loginUser, registerUser, logoutUser, isLoggedIn } from "../controllers/users.controller.js"
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {addToCart, allOrder, cart, confirmOrder, isInCart, removeFromCart, updateQuantity} from '../controllers/order.controller.js'
import { addReview, updateReview } from '../controllers/products.controller.js'
const router = Router()
//user routes
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/check-login').post(verifyJWT, isLoggedIn)

// order and cart routes
router.route('/add-to-cart').patch(verifyJWT, addToCart)
router.route('/remove-from-cart').patch(verifyJWT, removeFromCart)
router.route('/update-quantity').patch(verifyJWT, updateQuantity)
router.route('/cart').get(verifyJWT, cart)
router.route('/check-cart').post(verifyJWT, isInCart)

router.route('/confirm-order').post(verifyJWT, confirmOrder)
router.route('/all-order').post(verifyJWT, allOrder)

//review route
router.route('/product/add-review').post(verifyJWT, addReview)

router.route('/product/update-review').post(verifyJWT, updateReview)

export default router