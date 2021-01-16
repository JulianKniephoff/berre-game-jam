import path from 'path';

import express from 'express';


const app = express();

console.log(path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));

app.listen(3000);

export default app;
