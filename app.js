import express from 'express';
import mongoose from 'mongoose';

export const categories = ['Typography', 'Branding', 'Packaging', 'UI & Web', 'Editorial', 'Motion'];
const httpUrl = value => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
};
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  url: { type: String, required: true, trim: true, maxlength: 2000, validate: httpUrl },
  category: { type: String, required: true, enum: categories },
  project: { type: String, trim: true, maxlength: 80, default: '' },
  note: { type: String, required: true, trim: true, maxlength: 1200 },
  deletedAt: { type: Date, default: null },
}, { timestamps: true, collection: 'references', strict: 'throw' });
export const Reference = mongoose.models.Reference || mongoose.model('Reference', schema);
let connection;
async function connect() {
  if (!process.env.MONGODB_URI) throw new Error('Database is not configured');
  connection ??= mongoose.connect(process.env.MONGODB_URI, { dbName: 'margin', serverSelectionTimeoutMS: 8000 }).catch(error => { connection = null; throw error; });
  await connection;
}
function fields(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw Object.assign(new Error('Please send a reference object.'), { status: 400 });
  const result = {};
  for (const key of ['title', 'url', 'category', 'project', 'note']) {
    if (body[key] !== undefined && typeof body[key] !== 'string') throw Object.assign(new Error(`${key} must be text.`), { status: 400 });
    result[key] = body[key] ?? '';
  }
  return result;
}
export function createApp({ model = Reference, database = connect } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.get('/api/health', async (req, res) => { await database(); res.json({ status: 'connected' }); });
  app.use('/api/references', async (req, res, next) => { await database(); next(); });
  app.get('/api/references', async (req, res) => {
    const items = await model.find({ deletedAt: null }).sort({ createdAt: -1, _id: -1 }).lean();
    res.json(items);
  });
  app.post('/api/references', async (req, res) => {
    const item = await model.create(fields(req.body));
    res.status(201).json(item);
  });
  app.param('id', (req, res, next, id) => {
    if (!/^[a-f0-9]{24}$/i.test(id)) return res.status(400).json({ error: 'Invalid reference ID.' });
    next();
  });
  app.put('/api/references/:id', async (req, res) => {
    const data = fields(req.body);
    const version = req.body.__v;
    if (!Number.isInteger(version) || version < 0) return res.status(400).json({ error: 'Reload the reference before editing.' });
    // Validate the complete replacement before applying an atomic version check.
    await new Reference(data).validate();
    const item = await model.findOneAndUpdate({ _id: req.params.id, deletedAt: null, __v: version }, { $set: data, $inc: { __v: 1 } }, { new: true, runValidators: true });
    if (!item) return res.status(409).json({ error: 'This reference changed or was removed. Reload the library before editing again.' });
    res.json(item);
  });
  app.delete('/api/references/:id', async (req, res) => {
    await model.updateOne({ _id: req.params.id, deletedAt: null }, { $set: { deletedAt: new Date() }, $inc: { __v: 1 } });
    res.status(204).end();
  });
  app.post('/api/references/:id/restore', async (req, res) => {
    const item = await model.findOneAndUpdate({ _id: req.params.id, deletedAt: { $ne: null } }, { $set: { deletedAt: null }, $inc: { __v: 1 } }, { new: true });
    if (!item) return res.status(404).json({ error: 'Reference could not be restored.' });
    res.json(item);
  });
  app.use('/api', (req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
  app.use((error, req, res, next) => {
    if (error.name === 'ValidationError' || error.name === 'StrictModeError') return res.status(400).json({ error: 'Check the title, source link, category and design note.' });
    if (error.status && error.status < 500) return res.status(error.status).json({ error: error.status === 413 ? 'This reference is too large.' : 'Check your submitted data.' });
    console.error('API request failed:', error.name);
    res.status(503).json({ error: 'The library is temporarily unavailable. Check your connection and try again.' });
  });
  return app;
}
export default createApp();
