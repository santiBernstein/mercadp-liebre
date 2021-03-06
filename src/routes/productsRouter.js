const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');



const authMiddleware = require('../middlewares/auth');
const sellerMiddleware = require('../middlewares/seller');
const validator = require('../middlewares/validator');



const productsController = require('../controllers/productsController');



var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../public/images/products'))
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
   }
})

var upload = multer({
   storage,

  
   fileFilter: (req, file, cb) => {

      const acceptedExtensions = ['.jpg', '.jpeg', '.png'];

      const ext = path.extname(file.originalname);
      
      if (!acceptedExtensions.includes(ext)) {
         req.file = file;
      }

      cb(null, acceptedExtensions.includes(ext));
   }
});




router.get('/page/:page', productsController.index);
router.get('/detail/:id', productsController.detail); 


router.get('/create', authMiddleware, productsController.create); 
router.post('/', authMiddleware, upload.single('image'), validator.createProduct, productsController.store); 

 
router.get('/:id/edit', sellerMiddleware, productsController.edit); 
router.patch('/:id', sellerMiddleware, upload.single('image'), validator.editProduct, productsController.update); 

router.delete('/:id', sellerMiddleware, productsController.destroy); 



module.exports = router;
