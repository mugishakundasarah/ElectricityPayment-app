const router = require("express").Router()
const Token = require("../models/PurchasedTokens")
const storeLog = require("../utils/log")
const paymentRoutes = require("./payment.controller")
const tokenRoutes = require("./token.controller")

// for buying a token 
router.use("/pay", paymentRoutes)
// for getting tokens of a specific meter number
router.use("/tokens", tokenRoutes)
// when they get a token and you find that it is expired, you update the status to expired and return expired
router.use("/token/:tokenId", async(req, res) => {
    const { tokenId } = req.params;

  try {
    const token = await Token.findOne({
        token: tokenId 
    });

    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    if (token.expiry_date <= Date.now() && token.token_status != 'EXPIRED') {
      token.token_status = 'EXPIRED';
      await token.save();
      storeLog(`Token ${token.token} has expired`)
      return res.status(200).json({ message: 'Token has expired' });
    }

    return res.status(200).json({ message: 'Token fetched successfully', data: token });
  } catch (error) {
    console.error('Error updating token status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
})


module.exports = router

