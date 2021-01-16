import path from 'path';

import express from 'express';

import Server from "./server";

const server = new Server();
import DUMMY_WORLD from '../server/worlds/0.json';
server.loadWorld(DUMMY_WORLD);
server.listen();

const app = express();

app.use(express.static(path.join(__dirname, '../client')));

app.listen(3000, '0.0.0.0');

export default app;
