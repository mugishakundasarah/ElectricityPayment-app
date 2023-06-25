const express = require('express');
const router = express.Router();
const PurchasedTokens = require('../models/PurchasedTokens');
const storeLog = require('../utils/log');
  
router.get("/:meterNumber", async(req, res) => {
    try{
        let token = await PurchasedTokens.find({meter_number: req.params.meterNumber});
        storeLog(`Request tokens of ${req.params.meterNumber}`)
        if(!token){
            return res.status(200).json({message: "No tokens found.", data: []})
        }
        return res.status(200).json({message: "Token retrieved successfully", data: token});
    }catch(error){
        console.error('Error retrieving token :', error);
        storeLog("Internal Server Error " + error)
        return res.status(500).json({ message: 'Internal server error' });
    }
})




module.exports = router;