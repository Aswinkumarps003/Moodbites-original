const express = require('express');
const app = express();
app.use(express.json());

// TODO: Add notification routes

app.get('/', (req, res) => res.send('Notification Service Running'));

const PORT = process.env.PORT || 4007;
app.listen(PORT, () => console.log(`Notification Service listening on port ${PORT}`)); 