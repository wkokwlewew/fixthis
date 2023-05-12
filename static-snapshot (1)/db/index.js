const dbFile = "./w3s-dynamic-storage/database.db";
const sqlite = require('better-sqlite3');
const path = require('path');

// Initialize the database
const db = new sqlite(path.resolve(dbFile), { fileMustExist: false });

const createTableIfNotExist = () => {
  const stmt_keyvaluepairs = db.prepare(`CREATE TABLE IF NOT EXISTS key_value_pairs (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, value TEXT)`);
  stmt_keyvaluepairs.run();
};

const getKeyValuePairs = () => {
  const stmt = db.prepare('SELECT * FROM key_value_pairs');
  return stmt.all();
};

const getKeyValuePairByKey = (key) => {
  const stmt = db.prepare('SELECT * FROM key_value_pairs WHERE key = ?');
  const response = stmt.get(key);
  return response;
};

const getKeyValuePairByID = (id) => {
  const stmt = db.prepare('SELECT * FROM key_value_pairs WHERE id = ?');
  const response = stmt.get(id);
  return response;
};

const checkIfIdExists = (id) => {
  const stmt = db.prepare('SELECT * FROM key_value_pairs WHERE id = ?');
  const response = stmt.get(id);
  return response ? true : false;
};

const checkIfKeyExists = (key) => {
  const stmt = db.prepare('SELECT * FROM key_value_pairs WHERE key = ?');
  const response = stmt.get(key);
  return response ? true : false;
};

const updateKeyValuePairFromKey = (request) => {
  const ifExists = checkIfKeyExists(request.key);
  if (!ifExists) {
    return {
      success: false,
      msg: "Update failed. Key does not exist.",
    };
  }

  try {
    const stmt = db.prepare("UPDATE key_value_pairs SET value = ? WHERE key = ?");
    stmt.run(request.value, request.key);
    return {
      success: true,
      msg: "Key-Value Pair updated successfully!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: error,
    };
  }
};

const insertKeyValuePair = (request) => {
  const ifExists = checkIfKeyExists(request.key);
  if (ifExists) {
    return {
      success: false,
      msg: "Insert failed. Key already exists.",
    };
  }

  try {
    const stmt = db.prepare('INSERT INTO key_value_pairs (key, value) VALUES (?, ?)');
    stmt.run(request.key, request.value);
    const stmt2 = db.prepare('SELECT * FROM key_value_pairs WHERE key = ?');
    const obj = stmt2.get(request.key);
    return {
      success: true,
      msg: "Key-Value Pair added successfully!",
      id: obj.id,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: error,
    };
  }
};

const deleteKeyValuePair = (id) => {
  const ifExists = checkIfIdExists(id);
  if (!ifExists) {
    return {
      success: false,
      msg: "Delete failed. Key does not exist.",
    };
  }

  try {
    const stmt = db.prepare('DELETE FROM key_value_pairs WHERE id = ?');
    stmt.run(id);
    return {
      success: true,
      msg: "Key-Value Pair deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      msg: error,
    };
  }
};

module.exports = {
  createTableIfNotExist,
  insertKeyValuePair,
  getKeyValuePairs,
  deleteKeyValuePair,
  getKeyValuePairByID,
  getKeyValuePairByKey,
  getKeyValuePair,
  updateKeyValuePairFromKey,
};
