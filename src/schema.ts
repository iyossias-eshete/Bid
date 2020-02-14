import { gql } from "apollo-server-express";

const typeDefs = gql`
  enum Sex{
    Male
    Female
  }

  enum BidStatus{
    Open,
    Closed
  }

  type User{
    id: Int
    email: String!
    firstName: String!
    lastName : String!
    password: String!
    accountNumber : Int!
    sex : Sex!
  }

  type AuthenticatedUser{
    user :User
    token : String
  }


type Account{
  accountNumber: Int!,
  holderFirstName: String!,
  holderLastName: String!,
  holderEmail: String!,
  amount: Int!
}



type Bid{
  id: Int
  name: String!
  description: String!
  startingPrice : Float
  creatorId : Int
  status : BidStatus
}

   type Query {
    
    users: [User]
    accounts: [Account]
    bids: [Bid]
    myBid: [Bid] #TODO: bids I've created
    bidding: [Bid] #TODO: ones I've bid on
  }

  type Mutation{
    register(email: String!, password: String!, firstName: String!, lastName: String!, accountNumber: Int!, sex: String!) : AuthenticatedUser
    signIn(email: String!, password: String!) : AuthenticatedUser
    createBid(name: String!, description: String!, startingPrice: Float) : Bid
    updateBid(id: Int!, name : String, description : String, startingPrice: Float, status : BidStatus ) : Bid
    deleteBid(id: Int!) : Bid
    
    #next todo
    #placeBid( bidId: Int!, price: Float!) : Boolean 
    #awardBid
    #id -> name
  }
`;

export default typeDefs;