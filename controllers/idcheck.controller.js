const { dataGame } = require('../utils/data');
const {
   codashopServices,
   duniaGamesServices,
   au2mobileServices,
   roGlobalServices,
   jollymaxServices,
   elitediasServices,
   bosBosGameServices,
   gamekuServices,
   au2mobile2Services,
   statsRoyaleService,
   clashOfStatsService,
   brawlStarService,
   vocagameServices,
} = require('../services');
const topupLiveServices = require('../services/topupLive.services');
const mobapayService = require('../services/mobapay.services');

const idCheckController = async (req, res) => {
   try {
      const slug = req.params.game;
      const { id, zone } = req.query;

      // Input validation
      if (!slug) {
         return res.status(400).json({ status: false, message: 'Game slug is required' });
      }

      const game = dataGame.find((item) => item.slug === slug);
      if (!game) {
         return res.status(404).json({ status: false, message: 'Game not found' });
      }
      
      if (!id) {
         return res.status(400).json({ status: false, message: 'ID is required' });
      }
      
      if (game.isZone && !zone) {
         return res.status(400).json({ status: false, message: 'Zone is required' });
      }

      // Sanitize inputs
      const sanitizedId = String(id).trim();
      const sanitizedZone = zone ? String(zone).trim() : undefined;

      switch (game.provider) {
         case 'codashop':
            const getCoda = await codashopServices(game, sanitizedId, sanitizedZone);
            return res.status(getCoda.code).json(getCoda);
         case 'duniagames':
            const getDg = await duniaGamesServices(game, sanitizedId, sanitizedZone);
            return res.status(getDg.code).json(getDg);
         case 'au2mobile':
            const getAu = await au2mobileServices(game, sanitizedId, sanitizedZone);
            return res.status(getAu.code).json(getAu);
         case 'roglobal':
            const getRo = await roGlobalServices(game, sanitizedId, sanitizedZone);
            return res.status(getRo.code).json(getRo);
         case 'jollymax':
            const checkJolly = await jollymaxServices(game, sanitizedId, sanitizedZone);
            return res.status(checkJolly.code).json(checkJolly);
         case 'elitedias':
            const checkElite = await elitediasServices(game, sanitizedId, sanitizedZone);
            return res.status(checkElite.code).json(checkElite);
         case 'topuplive':
            const checkTL = await topupLiveServices(game, sanitizedId, sanitizedZone);
            return res.status(checkTL.code).json(checkTL);
         case 'bosbosgame':
            const checkBosBos = await bosBosGameServices(game, sanitizedId, sanitizedZone);
            return res.status(checkBosBos.code).json(checkBosBos);
         case 'gameku':
            const checkGameku = await gamekuServices(game, sanitizedId, sanitizedZone);
            return res.status(checkGameku.code).json(checkGameku);
         case 'au2mobile2':
            const au2mobile2 = await au2mobile2Services(game, sanitizedId, sanitizedZone);
            return res.status(au2mobile2.code).json(au2mobile2);
         case 'mobapay':
            const mobapay = await mobapayService(game, sanitizedId, sanitizedZone);
            return res.status(mobapay.code).json(mobapay);
         case 'statsroyale':
            const statsroyale = await statsRoyaleService(game, sanitizedId, sanitizedZone);
            return res.status(statsroyale.code).json(statsroyale);
         case 'clashofstats':
            const clashofstats = await clashOfStatsService(game, sanitizedId, sanitizedZone);
            return res.status(clashofstats.code).json(clashofstats);
         case 'brawlstar':
            const brawlStar = await brawlStarService(game, sanitizedId, sanitizedZone);
            return res.status(brawlStar.code).json(brawlStar);
         case 'vocagame':
            const vocagame = await vocagameServices(game, sanitizedId, sanitizedZone);
            return res.status(vocagame.code).json(vocagame);

         default:
            return res.status(400).json({ status: false, message: 'Provider not found' });
      }
   } catch (error) {
      console.error('Error in idCheckController:', error);
      return res.status(500).json({
         status: false,
         message: 'Internal server error',
         error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
   }
};

module.exports = idCheckController;