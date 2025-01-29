import {Router} from 'express'
import { verifyAdminJWT } from '../middlewares/auth.middleware.js'
import { adminLogin, adminLogout } from '../controllers/admin.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import { addProduct, deleteProduct } from '../controllers/products.controller.js'
const router = Router()

router.route('/login').post(adminLogin)
router.route('/logout').post(verifyAdminJWT, adminLogout)
router.route('/add-product').post(verifyAdminJWT,upload.single('image'), addProduct)
router.route('/delete-product/').post(verifyAdminJWT, deleteProduct)
router.post('/verify-token', verifyAdminJWT, (req, res) => {
    res.json({ valid: true }); 
  });
export default router