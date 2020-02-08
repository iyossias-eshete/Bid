import { ApolloServer, gql, IResolvers } from 'apollo-server';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Context } from 'apollo-server-core';

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



const typeDefs = gql`
  enum Sex{
    Male
    Female
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

   type Query {
    
    users: [User]
    accounts: [Account]
  }

  type Mutation{
    register(email: String!, password: String!, firstName: String!, lastName: String!, accountNumber: Int!, sex: String!) : AuthenticatedUser
    signIn(email: String!, password: String!) : AuthenticatedUser  
  }
`;

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
    sex: "Male"
  },
  {
    id: 2,
    email: 'Benji@gmail.com',
    firstName: 'Benjamin',
    lastName: 'Loyd',
    accountNumber: 4,
    sex: "Male"
  },
  {
    id: 4,
    email: 'Liya@gmail.com',
    firstName: 'Tres',
    lastName: 'Loy',
    accountNumber: 5,
    sex: "Female"
  },
  {
    id: 3,
    email: 'Glena@gmail.com',
    firstName: 'Glen',
    lastName: 'Lo',
    accountNumber: 7,
    sex: "Female"
  },


];

const registerUser = async (user: userType) => {
  //TODO: check for unique email

  //encrypt password
  user.password = await (await bcrypt.hash(user.password.toString(), 10)).toString();

  //verify specified account
  let userAccount = accounts.find( account => account.accountNumber === user.accountNumber 
                        && account.accountHolderFirstName.toLowerCase() === user.firstName.toLowerCase() 
                        && account.accountHolderLastName.toLowerCase()  === user.lastName.toLowerCase() );
  if(!userAccount)
    throw new Error('Invalid Account');

  // check if account already exists
  let existingAccount = users.find( existingUser => existingUser.accountNumber === user.accountNumber );
  if(userAccount)
    throw new Error('You already have an account. Try logging in instead');
  //userType

  //store user
  users.push(user);

  //generate token
  let token = jwt.sign(user.id.toString(), SECRET);

  //send user with token
  return {
    token,
    user
  }

}

const resolvers: IResolvers = {
  Query: {
    users: () => users
  },

  Mutation: {

    register: async (parent, { email, password, firstName, lastName, accountNumber, sex }, context: Context) => {
      let newUser: userType = { id: -1, email, password, firstName, lastName, accountNumber, sex };

      // await registerUser(newUser);
      // console.log('Done')

      let AuthenticatedUserData: authenticatedUserType = await registerUser(newUser);
      return AuthenticatedUserData;
    },
    signIn: async (email: string, password: string) => {
      const user: userType = { id: -1, accountNumber: 1, email: 'pspd@gmail.com', firstName: 'James', lastName: 'Grechen', password: 'ppp', sex: 'Male' };
      return { user, token: '' };
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});