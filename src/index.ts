import { ApolloServer, gql, IResolvers } from 'apollo-server-express';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import express from 'express';
import { graphql } from 'graphql';

const app = express();

const SECRET = 'SECRET';

interface userType {
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  accountNumber: number,
  sex: string
};

interface BidType {
  id: number,
  name: string,
  description: string,
  startingPrice: number,
  creatorId: number
  status: string,
}

interface authenticatedUserType {
  user: userType,
  token: string
};

interface accountType {
  accountNumber: number,
  accountHolderFirstName: string,
  accountHolderLastName: string,
  amount: number
}

interface bidType {
  id: number,
  name: string,
  description: string,
  startingPrice: number,
  creatorId: number
}



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
  accountHolderFirstName: String!,
  accountHolderLastName: String!,
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
    deleteBid(id: Int!) : Int 
  }
`;

//data source
const accounts = [
  {
    accountNumber: 1,
    accountHolderFirstName: 'Leroy',
    accountHolderLastName: 'Sane',
    amount: 500000
  },
  {
    accountNumber: 2,
    accountHolderFirstName: 'Thomas',
    accountHolderLastName: 'Tukils',
    amount: 2500000
  },
  {
    accountNumber: 3,
    accountHolderFirstName: 'Collins',
    accountHolderLastName: 'Muller', // pwd:ManCity token:eyJhbGciOiJIUzI1NiJ9.NQ.iDIkQeIGNPBDihC2GVVoC1bIKjLiQMiEhMN2ebkeMsI
    amount: 2500
  },
  {
    accountNumber: 12,
    accountHolderFirstName: 'Ben',
    accountHolderLastName: 'Orlando',
    amount: 1000
  }
];

const users = [
  // {
  //   id: 1,
  //   email: 'Liam@gmail.com',
  //   firstName: 'liam',
  //   lastName: 'Nelson',
  //   accountNumber: 2,
  //   sex: "Male",
  //   password:'ajksdhjashdjksa277319812'
  // },
  {
    id: 2,
    email: 'Benji@gmail.com',
    firstName: 'Benjamin',
    lastName: 'Loyd',
    accountNumber: 4,
    sex: "Male",
    password: 'ajksdhjashdjksa277319812'
  },
  {
    id: 4,
    email: 'Liya@gmail.com',
    firstName: 'Tres',
    lastName: 'Loy',
    accountNumber: 5,
    sex: "Female",
    password: 'ajksdhjashdjksa277319812'
  },
  {
    id: 3,
    email: 'Glena@gmail.com',
    firstName: 'Glen',
    lastName: 'Lo',
    accountNumber: 7,
    sex: "Female",
    password: 'ajksdhjashdjksa277319812'
  },
  {
    id: 5,
    firstName: "LeRoY",
    lastName: "sAnE",
    email: "Leroy@ManCity.com",
    accountNumber: 1,
    sex: "Male",
    password: "$2a$10$adJvj/GLNx7O0qH1XGRLX.NHUEbHDrmoOQxS1KuDQENrCDx7UMRmK" //ManCity
    //bearer eyJhbGciOiJIUzI1NiJ9.NQ.iDIkQeIGNPBDihC2GVVoC1bIKjLiQMiEhMN2ebkeMsI
  }


];

const bids = [
  {
    id: 1,
    name: 'Paradise',
    description: 'By Micheal Angelo. High quality imitation',
    startingPrice: 100000,
    creatorId: 1,
    status: 'Open'
  },
  {
    id: 2,
    name: 'Jackson Gloves',
    description: 'Micheal Jackson\'s original gold gloves.',
    startingPrice: 5000000,
    creatorId: 3,
    status: 'Open'
  },
  {
    id: 3,
    status: 'Open',
    name: 'The Medievals',
    description: 'Poems collections from various ancient literates.',
    startingPrice: 30000,
    creatorId: 2,
  },
  {
    id: 4,
    name: 'The Mac',
    description: '1974 Apple laptop. Still stunning.',
    startingPrice: 2000,
    creatorId: 4,
    status: 'Open'
  }
];

const registerUser = async (user: userType) => {
  //TODO: check for unique email

  //encrypt password
  user.password = (await bcrypt.hash(user.password.toString(), 10)).toString();

  //verify specified account
  let userAccount = accounts.find(account => account.accountNumber === user.accountNumber
    && account.accountHolderFirstName.toLowerCase() === user.firstName.toLowerCase()
    && account.accountHolderLastName.toLowerCase() === user.lastName.toLowerCase());
  if (!userAccount)
    throw new Error('Invalid Bank Account');

  // check if account already exists

  let existingAccount = users.find(existingUser => existingUser.accountNumber === user.accountNumber);
  if (existingAccount)
    throw new Error('You already have an account. Try logging in instead');
  //userType

  //store user
  user.id = users.length + 1;
  users.push(user);
  
  //generate token
  let token = jwt.sign(user.id.toString(), SECRET);

  //send user with token
  return {
    token,
    user
  }

}

const bidCreator = async (bid: BidType, userId: number) => {
  // verify sent bid


  // create bid and link it to the user
  const userBid: BidType = { ...bid };
  userBid.creatorId = userId;
  userBid.id = bids.length + 1;
  bids.push(userBid);

  //send bid to user
  return userBid;

}

const resolvers: IResolvers = {
  Query: {
    users: () => users,
    bids: () => bids
  },

  Mutation: {

    register: async (parent, { email, password, firstName, lastName, accountNumber, sex }, context) => {
      let newUser: userType = { id: -1, email, password, firstName, lastName, accountNumber, sex };

      let AuthenticatedUserData: authenticatedUserType = await registerUser(newUser);
      return AuthenticatedUserData;
    },
    //TODO: do signIn
    signIn: async (parent, { email, password }, context) => {

      //get user
      
      const user = users.find(user => user.email === email);
      if (!user) {
        throw new Error('Your account does not exist.');
      }

      //check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid email or password');
      }
      //assign token
      let token = jwt.sign(user.id.toString(), SECRET);

      //send user
      return { user, token };
    },


    createBid: async (parent, { name, description, startingPrice }, context) => {

      let userId = undefined;

      //util
      try {
        const Authorization = context.req.get('Authorization');
       
        if (Authorization === undefined)
          throw new Error('Authorization bearer token not provided.');

        const token = Authorization.replace('Bearer ', '');
       
        userId = Number(jwt.verify(token, SECRET));

      }
      catch (error) {
                
        throw new Error(error);

        
      }
      // end-of-util
      
      
      let newBid: BidType = { id: -1, name, description, startingPrice, status: 'Open', creatorId: -1 };
      newBid = await bidCreator(newBid, userId);
      return newBid;

    },

    //updateBid(id: Int!, name : String, description : String, startingPrice: Float, status : BidStatus ) : Bid 
    updateBid: async (parent, { id, name, description, startingPrice, status }, context) => {
      // verify that the user is authorized to update the bid
      let userId = verifyUser(context.req);

      //get bid
      const bid = bids.find(bid => bid.id === id);

      if (!bid)
        throw new Error('Bid could not be found');

      if ( bid.creatorId !== userId)
        throw new Error('You are only authorized to update the bids you created');

   
      //updates bid in the array obj
      bid.name = name ? name.toString() : bid.name;
      bid.description = description ? description.toString() : bid.description;
      bid.startingPrice = startingPrice ? Number(startingPrice) : bid.startingPrice;
      bid.status = status ? status : bid.status;

      return bid;
      
    },

    deleteBid : async ( parent, { id }, context ) =>{
       // verify that the user is authorized to update the bid
       let userId = verifyUser(context.req);

       //get bid
      let bid = bids.find(bid => bid.id === id);

      if (!bid)
        throw new Error('Bid could not be found');

      if ( bid.creatorId !== userId)
          throw new Error('You are only authorized to delete the bids you created');

    let deletedBidId = bid.id;
    
    bid.id =  NaN;
    bid.description = '';
    bid.name = '';
    bid.status = 'Closed',
    bid.startingPrice = -1;
    bid.creatorId = NaN;
    
    return deletedBidId;    

    }

  }
};

const verifyUser = (req: Express.Request) => {
  //util
  let userId = undefined;
  try {
    const Authorization = req.get('Authorization');
    
    if (Authorization === undefined)
      throw new Error('Authorization bearer token not provided.');

    const token = Authorization.replace('Bearer ', '');
   
    userId = Number(jwt.verify(token, SECRET));

  }
  catch (error) {   
    throw new Error(error);   
  }
  // end-of-util

  return userId;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })

});

//app.use('/', graphqlEx)

server.applyMiddleware({ app, path: '/' });

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});