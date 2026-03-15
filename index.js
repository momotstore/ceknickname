const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const _ = require('lodash');
const { dataGame } = require('./utils/data');
const router = require('./routes');

// [REVISI]: Memperbaiki path require, menghapus huruf 's' di belakang wwmGame
const wwmGame = require('./services/wwmGame'); 

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/test', express.static('public'));
app.use(cors());

app.use('/api', router);

// --- Static Pages ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/dokumentasi', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'dokumentasi.html'));
});
app.get('/donasi', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'donasi.html'));
});
app.get('/sewa', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'sewa.html'));
});
app.get('/scraping', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'scraping.html'));
});
app.get('/ff-region', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'ff-region.html'));
});

// --- API Endpoints ---

// Endpoint Stalk Free Fire
app.post('/ffstalk', async (req, res) => {
   try {
       const { id } = req.body;
       if (!id) {
           return res.status(400).json({ error: "ID tidak boleh kosong." });
       }

       const apiUrl = `https://api.vreden.my.id/api/ffstalk?id=${id}`;
       const response = await axios.get(apiUrl);

       res.status(200).json(response.data);
   } catch (error) {
       console.error("Error saat stalk akun FF:", error.message);
       res.status(500).json({ error: "Gagal mengambil data Free Fire." });
   }
});

// Endpoint Where Winds Meet (WWM)
app.get('/api/wwm/:id', async (req, res) => {
    try {
        const userId = req.params.id; 
        const result = await wwmGame(userId);

        if (result.status) {
            return res.status(200).json({
                code: 200,
                status: true,
                creator: 'ceknickname.vercel.app',
                data: result
            });
        } 
        
        return res.status(404).json({
            code: 404,
            status: false,
            creator: 'ceknickname.vercel.app',
            message: result.message || "User ID tidak ditemukan"
        });

    } catch (error) {
        console.error("Error pada route /api/wwm:", error);
        return res.status(500).json({
            code: 500,
            status: false,
            creator: 'ceknickname.vercel.app',
            message: "Terjadi kesalahan pada server"
        });
    }
});

// Endpoint MLBB First Topup
app.get('/api/mlbb/ganda', async (req, res) => {
    const { id, zone } = req.query;
    
    if (!id || !zone) {
        return res.status(400).json({
            code: 400,
            status: false,
            creator: 'ceknickname.vercel.app',
            message: 'Missing required parameters: id and zone are required'
        });
    }
    
    try {
        const mlFirstTopup = await MbFirstTopup(id, zone);
        
        if (mlFirstTopup === null) {
            return res.status(500).json({
                code: 500,
                status: false,
                creator: 'ceknickname.vercel.app',
                message: 'Internal Server Error'
            });
        } else if (mlFirstTopup.code === 404) {
            return res.status(404).json(mlFirstTopup);
        } else {
            return res.status(200).json({
                code: 200,
                status: true,
                creator: 'ceknickname.vercel.app',
                message: 'First Topup packages retrieved successfully',
                data: {
                    username: mlFirstTopup.username || null,
                    user_id: id,
                    zone: zone || null,
                    packages: mlFirstTopup.packages || mlFirstTopup
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            status: false,
            creator: 'ceknickname.vercel.app',
            message: 'Internal Server Error'
        });
    }
});

// Helper Function MLBB
async function MbFirstTopup(user_id, zone_id) {
    try {
        const res = await fetch(
            `https://api.mobapay.com/api/app_shop?app_id=100000&user_id=${user_id}&server_id=${zone_id}&country=ID&language=en&net=luckym`,
            {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json, text/plain, */*',
                    'origin': 'https://www.mobapay.com',
                    'referer': 'https://www.mobapay.com/',
                }
            }
        );

        const resJson = await res.json();
        
        if (resJson.code == 0 && resJson.data?.user_info?.code == 0) {
            const items = resJson?.data?.shop_info?.good_list || [];
            const daftarSku = {
                "com.moonton.diamond_mt_id_50": "50 + 50",
                "com.moonton.diamond_mt_id_150": "150 + 150",
                "com.moonton.diamond_mt_id_250": "250 + 250",
                "com.moonton.diamond_mt_id_500": "500 + 500"
            };

            let packageList = [];
            for (const kode in daftarSku) {
                const found = items.find(item => item.sku === kode);
                packageList.push({
                    package: daftarSku[kode],
                    available: found?.game_can_buy ? true : false
                });
            }

            return {
                username: resJson.data.user_info.user_name,
                packages: packageList
            };
        } else {
            return {
                code: 404,
                status: false,
                creator: 'ceknickname.vercel.app',
                message: 'ID tidak ditemukan'
            };
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}

app.get('/endpoint', (req, res) => {
   const newDataGame = dataGame.map((item) => {
      return {
         name: item.name,
         slug: item.slug,
         endpoint: `/api/game/${item.slug}`,
         query: `?id=xxxx${item.isZone ? '&zone=xxx' : ''}`,
         hasZoneId: item.isZone ? true : false,
         listZoneId: item.dropdown ? `/api/game/get-zone/${item.slug}` : null,
      };
   });

   return res.json({
      name: 'XSTBot Whatsapp',
      data: _.orderBy(newDataGame, ['name'], ['asc']),
   });
});

app.get('/*', (req, res) => {
   res.status(404).json({ error: 'Error' });
});

app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
