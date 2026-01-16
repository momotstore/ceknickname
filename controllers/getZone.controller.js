const { dataGame } = require('../utils/data');

const getZoneController = (req, res) => {
   try {
      const { game } = req.params;
      
      // Input validation
      if (!game) {
         return res.status(400).json({ status: false, message: 'Game is required' });
      }

      const sanitizedGame = String(game).trim();
      const gameData = dataGame.find((item) => item.slug === sanitizedGame);
      
      if (!gameData) {
         return res.status(404).json({ status: false, message: 'Game not found' });
      }

      if (!gameData.dropdown) {
         return res.status(404).json({ status: false, message: 'Zone data not available for this game' });
      }

      return res.status(200).json({ 
         status: true, 
         message: 'Zone ID berhasil ditemukan', 
         data: gameData.dropdown 
      });
   } catch (error) {
      console.error('Error in getZoneController:', error);
      return res.status(500).json({
         status: false,
         message: 'Internal server error',
         error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
   }
};

module.exports = getZoneController;