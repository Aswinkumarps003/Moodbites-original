const express = require('express');
const app = express();
app.use(express.json());

// TODO: Add recommendation routes

app.get('/', (req, res) => res.send('Recommendation Service Running'));

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => console.log(`Recommendation Service listening on port ${PORT}`)); 