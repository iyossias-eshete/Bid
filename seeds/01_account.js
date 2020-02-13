
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('account').del()
    .then(function () {
      // Inserts seed entries
      return knex('account').insert([
        { holdersEmail: 'abc1@gmail.com' , holdersFirstName : 'Abebe', holdersLastName : 'Molla', amount : 45000 },
        { holdersEmail: 'abc2@gmail.com' , holdersFirstName : 'Birhan',holdersLastName : 'Mulu', amount : 100000 },
        { holdersEmail: 'abc3@gmail.com' , holdersFirstName : 'Caleb', holdersLastName : 'Teshome', amount : 70000 },
        { holdersEmail: 'abc4@gmail.com' , holdersFirstName : 'Dagim',  holdersLastName : 'Alebachew', amount : 2000 },
        { holdersEmail: 'abc5@gmail.com' , holdersFirstName : 'Henock', holdersLastName : 'Abebe', amount : 1500 },     
        
      ]);
    });
};
