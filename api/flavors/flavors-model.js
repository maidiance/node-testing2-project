const db = require('../../data/dbConfig.js')

module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
}
function getAll() {
    return db('flavors')
  }
  
  function getById(id) {
    return db('flavors').where('id', id).first();
  }
  
  async function insert(flavor) {
    const [id] = await db('flavors').insert(flavor);
    return getById(id);
  }
  
  async function update(id, changes) {
    await db('flavors')
      .update({ name: changes.name })
      .where('id', id); 
    return getById(id);
  }
  
  async function remove(id) {
    const result = await getById(id);
    await db('flavors')
      .where('id', id)
      .del();
    
    return result;
  }
  