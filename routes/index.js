const express = require('express');
const router = express.Router();
const { getZoneController, idCheckController } = require('../controllers');

const wwmGame = require('./wwmGames'); 

const routes = [
   {
      method: 'GET',
      path: '/game/:game',
      controller: idCheckController,
   },
   {
      method: 'GET',
      path: '/game/get-zone/:game',
      controller: getZoneController,
   },
];

router.get('/api/wwm/:id', async (req, res) => {
    try {
        const userId = req.params.id; 

        const result = await wwmGame(userId);

        if (result.status) {
            return res.status(200).json(result);
        } 
        
        return res.status(404).json(result);

    } catch (error) {
        console.error("Error pada route /api/check-role:", error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server"
        });
    }
});

// Menetapkan rute menggunakan objek
routes.forEach((route) => {
   const { method, path, controller } = route;
   console.log(`Menambahkan route ${method} ${path}`);
   router[method.toLowerCase()](path, controller);
});

module.exports = router;
