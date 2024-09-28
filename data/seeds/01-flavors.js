exports.seed = function(knex, Promise) {
  return knex('flavors')
    .truncate()
    .then(function() {
      return knex('flavors').insert([
        { name: 'chocolate' },
        { name: 'vanilla' },
        { name: 'mint' },
        { name: 'strawberry' },
      ]);
    });
};
