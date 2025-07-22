const express = require('express');
const router = express.Router();
const { userinfor, updateMyInfo, shipingform, getshipping, updateShippingAddress, deleteShippingAddress , addWishlistItem, getWishlistItems,deleteWishlistItem } = require('../controllers/userController');

router.get('/infor', userinfor);

router.put('/infor',updateMyInfo );

router.post('/shipping', shipingform);

router.post('/getshipping' , getshipping);

router.put('/updateshipping/:addressId', updateShippingAddress);

router.delete('/updateshipping/:addressId', deleteShippingAddress);

router.post('/wishlists', addWishlistItem);

router.get('/wishlists', getWishlistItems);

router.delete('/wishlists/:wishlistId', deleteWishlistItem);

module.exports = router;