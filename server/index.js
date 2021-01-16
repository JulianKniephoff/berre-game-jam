import path from 'path';

import express from 'express';


const app = express();

app.use(express.static(path.join(__dirname, '../client')));

app.listen(3000);

export default app;
