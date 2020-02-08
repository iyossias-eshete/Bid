import { ApolloServer, gql, IResolvers } from 'apollo-server';
import jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Context } from 'apollo-server-core';

const SECRET = 'SECRET';

interface userType{
  id: number,
  email: string,
  firstName: string,
  lastName : string,
  password: string,
  accountNumber : number,
  sex : string
};

interface authenticatedUserType{
  user: userType,
  token : string
};



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

  type authenticatedUser{
    user :User
    token : String
  }
  
   type Query {
    
    users: [User]
  }

  type Mutation{
    register(email: String!, password: String!, firstName: String!, lastName: String!, accountNumber: Int!, sex: String!) : authenticatedUser
    signIn(email: String!, password: String!) : authenticatedUser  
  }
`;

const accouts = [{

}];

  const users = [
    {
      id: 1,
      email: 'Liam@gmail.com',
      firstName: 'liam',
      lastName : 'Nelson',
      accountNumber : 2,
      sex: "Male"
    },
    {
      id: 2,
      email: 'Benji@gmail.com',
      firstName: 'Benjamin',
      lastName : 'Loyd',
      accountNumber : 4,
      sex: "Male"
    },
    {
      id: 4,
      email: 'Liya@gmail.com',
      firstName: 'Tres',
      lastName : 'Loy',
      accountNumber : 5,
      sex: "Female"
    },
    {
      id: 3,
      email: 'Glena@gmail.com',
      firstName: 'Glen',
      lastName : 'Lo',
      accountNumber : 7,
      sex: "Female"
    },
  
  
  ];

  const registerUser = async( user: userType  )=>{
    //TODO: check for unique email

    //encrypt password
    user.password = await (await bcrypt.hash( user.password.toString() , 10 )).toString() ;

    

    //store user
    users.push(  user  ); 

    //generate token
    let token = jwt.sign(  user.id.toString() , SECRET );

    //send user with token
    return{
      token,
      user
    }

  }

  const resolvers : IResolvers = {
    Query: {
      users: () => users
    },

    Mutation: {

      register: async ( parent, { email , password, firstName, lastName , accountNumber, sex}, context: Context)=>{
        let newUser : userType = { id : -1 ,  email, password, firstName, lastName, accountNumber, sex  };
          
         // await registerUser(newUser);
         // console.log('Done')
          
          let authenticatedUserData : authenticatedUserType = await registerUser(newUser);
          return authenticatedUserData;
      },
      signIn: async (email : string, password: string )=>{
        const user: userType = { id: -1, accountNumber: 1 , email : 'pspd@gmail.com', firstName: 'James', lastName: 'Grechen', password: 'ppp' , sex: 'Male'};  
        return { user, token: '' };
      }
    }
  };

  const server = new ApolloServer({ typeDefs , resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});