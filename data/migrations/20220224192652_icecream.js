
exports.up = function(knex) {
    return knex.schema.createTable("flavors", tbl => {
        tbl.increments();
    
        tbl.string("name", 255).unique().notNullable();
      });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("flavors");
};
