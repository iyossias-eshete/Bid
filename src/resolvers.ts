import { IResolvers } from "apollo-server-express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

const SECRET = 'SECRET';

interface userToBeCreatedType {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  accountNumber: number,
  sex: string
}

interface userType extends userToBeCreatedType {
  id: number
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

interface bidType {
  id: number,
  name: string,
  description: string,
  startingPrice: number,
  creatorId: number
}


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

import User from "./models/user.model";
import Account from "./models/account.model";

const registerUser = async (user: userToBeCreatedType) => {
  try {
    user.password = (await bcrypt.hash(user.password.toString(), 10)).toString();

    // user exists
    const userExists = await User.query()
      .select('email')
      .where('email', '=', user.email);


    if (userExists.length)
      throw new Error('Account with the specified email already exists');

    // verify user's account number
    const existingAccount = await Account.query().findById(user.accountNumber);

    //TODO: correct message
    if (existingAccount) {

      if (existingAccount.holdersEmail !== user.email || existingAccount.holdersFirstName !== user.firstName || existingAccount.holdersLastName !== user.lastName)
        throw new Error('Account number you specified belongs to someone else');

      //console.log('I am user spread out');
      //console.log({...user});
      const registeredUser: userType = await User.query().insert({
        ...user
      });

      let token = jwt.sign(String(registeredUser.id), SECRET);
      return { user: registeredUser, token };

    };

    throw new Error('Please enter a vaild account. The account does not belong to you');


  }

  catch (error) {
    throw new Error(error);
  }

  /*const logins = await Logins.query().insert({
    email: (req as any).body.email,
    password: hashedPassword
  });*/

}

const signInUser = async (email: string, password: string) => {
  //get user
  try {    
    const userMatch = await User.query()
      .select('*')
      .where('email', '=', email);
    if (userMatch.length) {
      let user = userMatch[0];
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword)
        throw new Error('Invalid login user name or Password');
      
      let token = jwt.sign(user.id.toString(), SECRET);
      
      return { user, token };
    }
      throw new Error('Invalid login information');
    
  }
  catch (error) {
    throw new Error(error);
  }
}



const accountVerifier = () => {
  //email check

  //

};

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
      let newUser: userToBeCreatedType = { email, password, firstName, lastName, accountNumber, sex };

      let AuthenticatedUserData: authenticatedUserType = await registerUser(newUser);
      return AuthenticatedUserData;
    },
    //TODO: do signIn
    signIn: async (parent, { email, password }, context) => {
      return await signInUser(email, password) ;
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

      if (bid.creatorId !== userId)
        throw new Error('You are only authorized to update the bids you created');


      //updates bid in the array obj
      bid.name = name ? name.toString() : bid.name;
      bid.description = description ? description.toString() : bid.description;
      bid.startingPrice = startingPrice ? Number(startingPrice) : bid.startingPrice;
      bid.status = status ? status : bid.status;

      return bid;

    },

    deleteBid: async (parent, { id }, context) => {
      // verify that the user is authorized to update the bid
      let userId = verifyUser(context.req);

      //get bid
      let bid = bids.find(bid => bid.id === id);

      if (!bid)
        throw new Error('Bid could not be found');

      if (bid.creatorId !== userId)
        throw new Error('You are only authorized to delete the bids you created');

      let deletedBidId = bid.id;

      bid.id = NaN;
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
};

export default resolvers;