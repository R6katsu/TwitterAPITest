require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { TwitterApi } = require('twitter-api-v2');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔴 【修正】静的ファイルを提供する設定をAPIの前に記述
//app.use(express.static('public'));

// X API v2 の認証情報
const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
});

// ツイート投稿API
app.post('/tweet', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "メッセージが空です。" });
        }

        const tweet = await client.v2.tweet(message);
        res.json({ success: true, message: "ツイートしました。" });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: "ツイートに失敗しました。" });
    }
});

// サーバー起動
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
