
exports.up = function (knex) {
    return knex.schema.createTable('bid', table => {
        table.increments();
        table.string('name').notNullable();
        table.string('description');
        table.float('startingPrice');
        table.string('status').notNullable().defaultsTo('Open');
        table.integer('creatorId')
            .references('id')
            .inTable('user')
            .onDelete('CASCADE')
            .index();
        table.integer('awardedTo')
            .references('id')
            .inTable('user')
            .index();

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('bid');
};
