const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const _ = require('lodash');

// Opsional: Pastikan file data.js tetap ada atau ganti dengan array kosong jika tidak digunakan
let dataGame = [];
try {
    dataGame = require('./utils/data').dataGame;
} catch (e) {
    console.log("Warning: utils/data not found, using empty array.");
}

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/test', express.static('public'));
app.use(cors());

// --- Core Functions (WWM & MLBB) ---

/**
 * Logic untuk pengecekan ID Where Winds Meet (WWM)
 */
const wwmGame = async (userId) => {
    const deviceid = Math.floor(Math.random() * 1e17).toString();
    const traceid = crypto.randomUUID();
    const timestamp = Date.now();

    const url = `https://pay.neteasegames.com/gameclub/wherewindsmeet/1/login-role?deviceid=${deviceid}&traceid=${traceid}&timestamp=${timestamp}&gc_client_version=1.12.13&roleid=${userId}&client_type=gameclub`;

    try {
        const response = await fetch(url);
        if (!response.ok) return { status: false, message: `HTTP error! status: ${response.status}` };

        const json = await response.json();
        if (json.code === "0000" && json.data) {
            return {
                status: true,
                nickname: json.data.rolename,
                userId: userId
            };
        }
        return { status: false, message: "User ID tidak ditemukan" };
    } catch (error) {
        return { status: false, message: error.message };
    }
};

/**
 * Logic untuk pengecekan MLBB First Topup
 */
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
            return { username: resJson.data.user_info.user_name, packages: packageList };
        }
        return { code: 404, status: false, message: 'ID tidak ditemukan' };
    } catch (err) {
        return null;
    }
}

// --- Static Pages ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dokumentasi', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dokumentasi.html')));
app.get('/donasi', (req, res) => res.sendFile(path.join(__dirname, 'public', 'donasi.html')));
app.get('/sewa', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sewa.html')));
app.get('/scraping', (req, res) => res.sendFile(path.join(__dirname, 'public', 'scraping.html')));
app.get('/ff-region', (req, res) => res.sendFile(path.join(__dirname, 'public', 'ff-region.html')));

// --- API Endpoints ---

// Endpoint WWM
app.get('/api/wwm/:id', async (req, res) => {
    try {
        const result = await wwmGame(req.params.id);
        const status = result.status ? 200 : 404;
        res.status(status).json({
            code: status,
            status: result.status,
            creator: 'ceknickname.vercel.app',
            ...(result.status ? { data: result } : { message: result.message })
        });
    } catch (error) {
        res.status(500).json({ code: 500, status: false, message: "Server Error" });
    }
});

// Endpoint MLBB Ganda
app.get('/api/mlbb/ganda', async (req, res) => {
    const { id, zone } = req.query;
    if (!id || !zone) return res.status(400).json({ code: 400, message: 'ID and Zone required' });
    
    const result = await MbFirstTopup(id, zone);
    if (!result) return res.status(500).json({ code: 500, message: 'Internal Error' });
    if (result.code === 404) return res.status(404).json(result);

    res.status(200).json({
        code: 200,
        status: true,
        creator: 'ceknickname.vercel.app',
        data: { username: result.username, user_id: id, zone, packages: result.packages }
    });
});

// Endpoint Stalk FF
app.post('/ffstalk', async (req, res) => {
   try {
       const { id } = req.body;
       if (!id) return res.status(400).json({ error: "ID required" });
       const response = await axios.get(`https://api.vreden.my.id/api/ffstalk?id=${id}`);
       res.status(200).json(response.data);
   } catch (error) {
       res.status(500).json({ error: "Gagal stalk FF" });
   }
});

app.get('/endpoint', (req, res) => {
   const data = dataGame.map((item) => ({
      name: item.name,
      slug: item.slug,
      endpoint: `/api/game/${item.slug}`,
      query: `?id=xxxx${item.isZone ? '&zone=xxx' : ''}`,
      hasZoneId: !!item.isZone,
      listZoneId: item.dropdown ? `/api/game/get-zone/${item.slug}` : null,
   }));
   res.json({ name: 'XSTBot Whatsapp', data: _.orderBy(data, ['name'], ['asc']) });
});

app.get('/*', (req, res) => res.status(404).json({ error: 'Not Found' }));

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
