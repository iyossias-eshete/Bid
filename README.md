# Bid
A Typescript, Graphql, Postgres, Objectionjs implementations of a basic CRUD operation involved in a bidding process. Users will be able to register, signin, create bids, update and delete bids, as well as place bids, and award the bids you have created and others have bided on.

## Description
The idea behind this api is that there is a third party api that provides the bank account information for different users. It is being simulated using the Accounts table that was created and seeded in the getting started step. So every user that registered is supposed to have an account. Hence his/her information is validated to existing Accounts and if no match is found, he/she won't be able to proceed with the registration.

Once registered, the user will be able to create, update, and delete bids. Wherever you spot the create, update, and delete bid, it is actually referring to the object open for bidding. So another user can place his or her offer for the object. Whenever this happens, various checks are made before allowing them to be stored. Things like whether the user has enough balance in his/her bank account, whether or not they are placing a bid higher than the starting price and the highest placed bid by other users, are checked. Afterward the person who created the bid can award it to whoever he pleases from the bidders. Only users from bidders can be awarded the bid and a person who has not placed a bid will not be eligable to be able to get the award.

## Getting Started
You can start by creating a db with the name 'test_db'. If you prefer to use something else, then you can configure the name in the knexfile.js. Speaking of which, be sure to specify your corresponding username, password, host correctly in the knexfile.js. Onces that's done, you can run the migrations using 'knex migrate:latest'. This will create all the tables needed for this project. Afterwards, you should run the seeds that will create some account data for you to get started on. To do so, run 'knex seed:run'.

## Running the API (GraphQL Apollo Server) Examples

Registration of a new user. Remember that the login info has to correspond with the information found in the Account table #to be eligible to create a user Account.
 mutation {
   register(
     firstName: "Caleb"
     lastName: "Teshome"
     email: "abc3@gmail.com"
     password: "P@$$w0rd"
     accountNumber: 3
     sex: "Male"
   ) {
     token
     user {
       id  
     }
   }
 }
 Once account is created, the user can signIn using the email he/she specified. If you ran the seed from the prev section,
 then you should be able to login using the credentials listed below. You can the add the token returned, as a bearer, under the Http #Headers like so:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.OVBtcejCrbbOvp5FC3YB2T7QxAB-nIudmEbjr0DZzZo"
}

mutation {
  signIn(
    email: "abc2@gmail.com"
    password: "P@$$w0rd"
  ) {
    token
    user {
      email
			id
      firstName
    }
  }
}

Then you can do CRUDS with bids.
 mutation{
   createBid(name: "La Misera" , description : "French", startingPrice : 1234  ){
     id,
     name,
     description,
     startingPrice,
     status
   }
 }

  mutation{ 
   updateBid(id : 2 ,  startingPrice : 45000, name: "Cool",description: "Travis", status : Closed){ #name :"Red Moon Painting", description "La Misera blood moon"){
     name
     startingPrice,
     creatorId,
     status,
     description
   }
 }

 mutation{
   deleteBid(id : 1){
     name,
     description,
     creatorId,
     status,
     startingPrice
     id
   }
 }

 query {
   bids{
     name,
     description,
     creatorId,
     status,
     startingPrice
     id,
     awardedTo
   }
 }

You can also place bids that you find interest in. But make sure that you have enough money in your Account to be able to match the starting price and the maximum placed offer or you will not be able to proceed.
 mutation{
   placeBid(bidId : 3 , amount : 1236 ){
     userId
     bidId,
     amount
   }
 }

You can also award the bid to whoever has placed a bid on your item. Note that the person must have had placed a bid in order to be eligible to get the award.
 mutation{
   awardBid(bidId :3 , winnersId:2){
     id,description,creatorId,
   }
 }

