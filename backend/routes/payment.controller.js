const express = require('express');
const tokenValidationSchema = require('../utils/validation');
const router = express.Router();
const PurchasedTokens = require('../models/PurchasedTokens');
const storeLog = require('../utils/log');

// util functions for generating token and days
const generateToken = () => {
    // Generate a random 8-digit number for the token
    const token = Math.floor(10000000 + Math.random() * 90000000);
  
    return token;
  };
  
const calculateDaysFromAmount = (amount) => {
  // Calculate the number of days based on the given amount
  let days = 0;

  let fiveYearDays = 365 * 5;
  if (amount >= 100 && amount <= fiveYearDays * 100) {
    // Convert the amount to days based on the policy
    days = Math.floor(amount / 100);
    days = Math.min(days, 365 * 5); // Limit to a maximum of 5 years (365 days * 5)
  }

  return days;
};

const generateTokenAndDays = (amount) => {
  const token = generateToken();
  const days = calculateDaysFromAmount(amount);

  return { token, days };
};
  
router.post('/', async (req, res) => {
    try {
      // Validate purchase data
      const { error, value } = tokenValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

        //  Create new token if meter number does not have an active token
      let token = new PurchasedTokens({
        meter_number: value.meterNumber,
        token: generateTokenAndDays(value.amount).token,
        token_status: 'NEW',
        token_value_days: generateTokenAndDays(value.amount).days,
        amount: value.amount,
      });
  
      let result = await token.save();
      storeLog(`Token ${token.token} purchased successfully`);
      return res.status(201).json({ message: "Token purchased successfully", data: result });
    } catch (error) {
      storeLog("Internal Server Error " + error);
      console.error('Error purchasing token:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;