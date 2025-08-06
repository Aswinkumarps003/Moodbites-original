const express = require('express');
const app = express();
app.use(express.json());

// TODO: Add fridge scanner routes

app.get('/', (req, res) => res.send('Fridge Scanner Service Running'));

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => console.log(`Fridge Scanner Service listening on port ${PORT}`)); 