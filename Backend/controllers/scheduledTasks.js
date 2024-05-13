const cron = require('node-cron');
const { Op } = require('sequelize');
const Ads = require('../models/ads.model'); 

const deleteExpiredAds = cron.schedule('* * * * *', async () => {
    try {
      const result = await Ads.destroy({
        where: {
          ExpiryDate: {
            [Op.lt]: new Date(), 
          },
        },
      });
      if (result > 0) {
        console.log(`Expired ads removed: ${result}`);
      } else {
        console.log('No expired ads to remove at this time.');
      }
    } catch (error) {
      console.error('Error removing expired ads:', error);
    }
  }, {
    scheduled: false 
  });
  
  deleteExpiredAds.start();
  
  module.exports = {
    deleteExpiredAds
  };
  