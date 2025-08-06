const express = require('express');
const app = express();
app.use(express.json());

// TODO: Add chat routes

app.get('/', (req, res) => res.send('Chat Service Running'));

const PORT = process.env.PORT || 4008;
app.listen(PORT, () => console.log(`Chat Service listening on port ${PORT}`)); 