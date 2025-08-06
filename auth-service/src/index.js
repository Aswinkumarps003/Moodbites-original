const express = require('express');
const app = express();
app.use(express.json());

// TODO: Add auth routes

app.get('/', (req, res) => res.send('Auth Service Running'));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Auth Service listening on port ${PORT}`)); 