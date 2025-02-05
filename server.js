import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors()); // Allow frontend to access backend
app.use(express.json());

const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.mistral.ai/v1/chat/completions';

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-medium", 
                messages: [{ role: "user", content: `Please only correct this text: "${prompt}".` }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
