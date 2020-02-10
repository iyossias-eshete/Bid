import { ApolloServer, gql, IResolvers } from 'apollo-server';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

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
    createBid(name: String!, description: String!, startingPrice: Float!) : Bid  #TODO: CreateBid resolver
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
    accountNumber: 2,
    accountHolderFirstName: 'Collins',
    accountHolderLastName: 'Muller',
    amount: 2500
  },
  {
    accountNumber: 2,
    accountHolderFirstName: 'Ben',
    accountHolderLastName: 'Orlando',
    amount: 1000
  }
];

const users = [
  {
    id: 1,
    email: 'Liam@gmail.com',
    firstName: 'liam',
    lastName: 'Nelson',
    accountNumber: 2,
    sex: "Male",
    password:'ajksdhjashdjksa277319812'
  },
  {
    id: 2,
    email: 'Benji@gmail.com',
    firstName: 'Benjamin',
    lastName: 'Loyd',
    accountNumber: 4,
    sex: "Male",
    password:'ajksdhjashdjksa277319812'
  },
  {
    id: 4,
    email: 'Liya@gmail.com',
    firstName: 'Tres',
    lastName: 'Loy',
    accountNumber: 5,
    sex: "Female",
    password:'ajksdhjashdjksa277319812'
  },
  {
    id: 3,
    email: 'Glena@gmail.com',
    firstName: 'Glen',
    lastName: 'Lo',
    accountNumber: 7,
    sex: "Female",
    password:'ajksdhjashdjksa277319812'
  },


];

const bids = [
  {
    id: 1,
    name: 'Paradise',
    description: 'By Micheal Angelo. High quality imitation',
    startingPrice: 100000,
    creatorId: 1,
  },
  {
    id: 2,
    name: 'Jackson Gloves',
    description: 'Micheal Jackson\'s original gold gloves.',
    startingPrice: 5000000,
    creatorId: 3,
  },
  {
    id: 3,
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
    throw new Error('Invalid Account');

  // check if account already exists
  
  let existingAccount = users.find(existingUser => existingUser.accountNumber === user.accountNumber);
  if (existingAccount)
    throw new Error('You already have an account. Try logging in instead');
  //userType

  //store user
  user.id = users.length + 1;
  users.push(user);
  console.log('Added user');
  console.log(users);
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

    register: async (parent, { email, password, firstName, lastName, accountNumber, sex }, context ) => {
      let newUser: userType = { id: -1, email, password, firstName, lastName, accountNumber, sex };


      // await registerUser(newUser);
      // console.log('Done')

      let AuthenticatedUserData: authenticatedUserType = await registerUser(newUser);
      return AuthenticatedUserData;
    },
    //TODO: do signIn
    signIn: async (parent, { email , password } , context ) => {
      
      //get user
      console.log(`Email si ${email}`);
      const user = users.find( user => user.email === email );
      if(!user){
        throw new Error('Your account does not exist.');
      }
      
      //check password
      const validPassword = await bcrypt.compare( password, user.password );
      if(!validPassword ){
        throw new Error('Invalid email or password');
      }
      //assign token
      let token = jwt.sign(user.id.toString(), SECRET);

      //send user
      return { user, token };
    },


    createBid: async (parent, { name, description, startingPrice }, context) => {

      //util
      const Authorization = context.request.get('Authorization');
      if (!Authorization) {
        throw new Error('Not Authenticated');
      }

      const token = Authorization.replace('Bearer ', '');
      const userId = Number( jwt.verify(token, SECRET) ); //jwt.sign(user.id.toString(), SECRET);
      let newBid: BidType = { id: -1, name, description, startingPrice, status: 'OPEN', creatorId: -1 };
      newBid = await bidCreator(newBid, userId );
      return newBid;
      // end-of-util

    }

  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: request => {
    return {
      ...request,
      // db-client
    }
  }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});