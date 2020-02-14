import { IResolvers } from "apollo-server-express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import tokenUtils from "./utils/token.util";
import Bid from "./models/bid.model";

const SECRET = 'SECRET';

interface UserToBeCreatedType {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  accountNumber: number,
  sex: string
}

interface UserType extends UserToBeCreatedType {
  id: number
};

interface BidType extends BidToBeCreatedType {
  id: number,
  creatorId: number
  status: string,
};

interface BidToBeCreatedType {
  name: string,
  description: string,
  startingPrice: number
}

interface authenticatedUserType {
  user: UserType,
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

const registerUser = async (user: UserToBeCreatedType) => {
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
      const registeredUser: UserType = await User.query().insert({
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

const createBid = async (bid: BidToBeCreatedType, req: Request) => {
  // get creator id
  const userId = tokenUtils.getIdFromToken(req);
  const newBid = await Bid.query().insert({
    ...bid,
    status: 'Open',
    creatorId: userId
  });
  return newBid;
  // return a BID TYPE
};

const updateBid = async (bid: BidType, req: Request) => {
  try {
    // get creator id
    const userId = tokenUtils.getIdFromToken(req);
    const oldBid = await Bid.query().findById(bid.id);
    if (oldBid) {
      if (oldBid.creatorId !== userId)
        throw new Error('You are only authorized to update bids you created');

      const updatedBid: BidType = {
        id: oldBid.id,
        creatorId: oldBid.creatorId,
        status: bid.status ? bid.status : oldBid.status,
        description: bid.description ? bid.description : oldBid.description,
        name: bid.name ? bid.name : oldBid.name,
        startingPrice: bid.startingPrice ? bid.startingPrice : oldBid.startingPrice
      };

      const updateStatus = await Bid.query()
        .findById(bid.id)
        .patch({
         ...updatedBid
        });
      
        if(!updateStatus)
          throw new Error('Update failed');
      return updatedBid;

    }
    throw new Error('Bid does not exist');
  }
  catch (error) {
    throw new Error(error);
  }

};



const resolvers: IResolvers = {
  Query: {
    users: () => users,
    bids: () => bids
  },

  Mutation: {

    register: async (parent, { email, password, firstName, lastName, accountNumber, sex }, context) => {
      let newUser: UserToBeCreatedType = { email, password, firstName, lastName, accountNumber, sex };
      let registeredUserData: authenticatedUserType = await registerUser(newUser);
      return registeredUserData;
    },
    //TODO: do signIn
    signIn: async (parent, { email, password }, context) => {
      let AuthenticatedUserData: authenticatedUserType = await signInUser(email, password);
      return AuthenticatedUserData;
    },


    createBid: async (parent, { name, description, startingPrice }, context) => {
      let newBid: BidToBeCreatedType = { name, description, startingPrice };
      let createdBid: BidType = await createBid(newBid, context.req);
      return createdBid;
    },

    //updateBid(id: Int!, name : String, description : String, startingPrice: Float, status : BidStatus ) : Bid 
    updateBid: async (parent, { id, name, description, startingPrice, status, creatorId }, context) => {
      let oldBid: BidType = { id, name, description, startingPrice, status, creatorId };
      let updatedBid = await updateBid(oldBid, context.req);
      return updatedBid;
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