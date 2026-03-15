/*
const crypto = require('crypto'); 

const wwmGame = async (userId) => {
    const deviceid = Math.floor(Math.random() * 1e17).toString();
    const traceid = crypto.randomUUID();
    const timestamp = Date.now();

    const url = `https://pay.neteasegames.com/gameclub/wherewindsmeet/1/login-role?deviceid=${deviceid}&traceid=${traceid}&timestamp=${timestamp}&gc_client_version=1.12.13&roleid=${userId}&client_type=gameclub`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return {
                status: false,
                message: `HTTP error! status: ${response.status}`
            };
        }

        const json = await response.json();

        if (json.code === "0000" && json.data) {
            return {
                status: true,
                nickname: json.data.rolename,
                userId: userId
            };
        } else {
            return {
                status: false,
                message: "User ID tidak ditemukan"
            };
        }

    } catch (error) {
        return {
            status: false,
            message: error.message
        };
    }
};

module.exports = wwmGame;
*/
const crypto = require('crypto'); 
// Gunakan baris di bawah ini jika Node.js kamu di bawah versi 18
// const fetch = require('node-fetch');

const wwmGame = async (userId) => {
    const deviceid = Math.floor(Math.random() * 1e17).toString();
    const traceid = crypto.randomUUID();
    const timestamp = Date.now();

    const url = `https://pay.neteasegames.com/gameclub/wherewindsmeet/1/login-role?deviceid=${deviceid}&traceid=${traceid}&timestamp=${timestamp}&gc_client_version=1.12.13&roleid=${userId}&client_type=gameclub`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return {
                status: false,
                message: `HTTP error! status: ${response.status}`
            };
        }

        const json = await response.json();

        if (json.code === "0000" && json.data) {
            return {
                status: true,
                nickname: json.data.rolename,
                userId: userId
            };
        } else {
            return {
                status: false,
                message: "User ID tidak ditemukan"
            };
        }

    } catch (error) {
        return {
            status: false,
            message: error.message
        };
    }
};

module.exports = wwmGame;
