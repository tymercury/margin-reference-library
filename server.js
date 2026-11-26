import express from 'express';
import { fileURLToPath } from 'node:url';
import app from './app.js';
app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));
app.listen(process.env.PORT || 5051, '127.0.0.1', () => console.log('Margin is ready at http://127.0.0.1:5051'));
