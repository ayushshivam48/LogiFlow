import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI_USER = process.env.MONGODB_URI_USER || MONGODB_URI;
const MONGODB_URI_ADMIN = process.env.MONGODB_URI_ADMIN || MONGODB_URI;
const MONGODB_URI_OWNER = process.env.MONGODB_URI_OWNER || MONGODB_URI;
const MONGODB_URI_ORDER = process.env.MONGODB_URI_ORDER || MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env');
}

// Separate cache objects for each database
let cached = global.mongoose || {};
let cachedUser = global.mongooseUser || { conn: null, promise: null };
let cachedAdmin = global.mongooseAdmin || { conn: null, promise: null };
let cachedOwner = global.mongooseOwner || { conn: null, promise: null };
let cachedOrder = global.mongooseOrder || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

async function connectUserDB() {
  if (cachedUser.conn) {
    return cachedUser.conn;
  }

  if (!cachedUser.promise) {
    cachedUser.promise = mongoose
      .connect(MONGODB_URI_USER, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((mongoose) => mongoose);
  }

  cachedUser.conn = await cachedUser.promise;
  return cachedUser.conn;
}

async function connectAdminDB() {
  if (cachedAdmin.conn) {
    return cachedAdmin.conn;
  }

  if (!cachedAdmin.promise) {
    cachedAdmin.promise = mongoose
      .connect(MONGODB_URI_ADMIN, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((mongoose) => mongoose);
  }

  cachedAdmin.conn = await cachedAdmin.promise;
  return cachedAdmin.conn;
}

async function connectOwnerDB() {
  if (cachedOwner.conn) {
    return cachedOwner.conn;
  }

  if (!cachedOwner.promise) {
    cachedOwner.promise = mongoose
      .connect(MONGODB_URI_OWNER, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((mongoose) => mongoose);
  }

  cachedOwner.conn = await cachedOwner.promise;
  return cachedOwner.conn;
}

async function connectOrderDB() {
  if (cachedOrder.conn) {
    return cachedOrder.conn;
  }

  if (!cachedOrder.promise) {
    cachedOrder.promise = mongoose
      .connect(MONGODB_URI_ORDER, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((mongoose) => mongoose);
  }

  cachedOrder.conn = await cachedOrder.promise;
  return cachedOrder.conn;
}

export default connectDB;
export { connectUserDB, connectAdminDB, connectOwnerDB, connectOrderDB };
