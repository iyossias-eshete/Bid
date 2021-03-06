import { IResolvers } from "apollo-server-express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

import tokenUtils from "./utils/token.util";
import Bid from "./models/bid.model";
import User from "./models/user.model";
import Account from "./models/account.model";
import UsersBid from "./models/users_bid.model";

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
  creatorId: number,
  status: string
};

interface BidToBeCreatedType {
  name: string,
  description: string,
  startingPrice: number
}

interface AuthenticatedUserType {
  user: UserType,
  token: string
};

interface UsersBidType {
  userId: number,
  bidId: number,
  amount: number,
}

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

    if (existingAccount) {

      if (existingAccount.holdersEmail !== user.email || existingAccount.holdersFirstName !== user.firstName || existingAccount.holdersLastName !== user.lastName)
        throw new Error('User account exists. Try logging in instead');

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



const getAllBids = async () => {
  const bids = await Bid.query();
  return bids;
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

      if (!updateStatus)
        throw new Error('Update failed');
      return updatedBid;

    }
    throw new Error('Bid does not exist');
  }
  catch (error) {
    throw new Error(error);
  }

};

const deleteBid = async (bidId: number, req: Request) => {
  try {
    // get creator id
    const userId = tokenUtils.getIdFromToken(req);
    const bidToDelete = await Bid.query().findById(bidId);
    if (bidToDelete) {
      if (bidToDelete.creatorId !== userId)
        throw new Error('You are only authorized to delete bids you created');
      const deleteStatus = await Bid.query().deleteById(bidId);
      if (!deleteStatus)
        throw new Error('Delete failed');
      return bidToDelete;
    }
    throw new Error('Bid does not exist');
  }
  catch (error) {
    throw new Error(error);
  }
}

const placeBid = async (usersBid: UsersBidType, req: Request) => {
  try {
    const userId = tokenUtils.getIdFromToken(req);
    //verify account
    const user = await User.query().findById(userId);
    const userBalance = await Account.query().select('amount').where('holdersEmail', '=', user.email);
    if (userBalance[0].amount < usersBid.amount)
      throw new Error('You do not have enough balance in your account to place this bid.');

    // check the bid status
    const bidStatus = await Bid.query()
      .select('status', 'startingPrice')
      .where('id', '=', usersBid.bidId);
    if (bidStatus.length) {
      if (bidStatus[0].status === 'Closed') {
        throw new Error('This bid is closed');
      }

      if (bidStatus[0].startingPrice > usersBid.amount)
        throw new Error('You can not place a bid lower than the starting price');
      //get the highest bid placed
      let maxPlaced = await UsersBid.query()
        .select('bidId')
        .where('bidId', '=', usersBid.bidId)
        .groupBy('bidId')
        .max('amount');
      ;

      if (maxPlaced.length) {
        if (maxPlaced[0].max > usersBid.amount)
          throw new Error('You can place a bid that is lower than the highest bid already placed. Please place a higher bid');
      }
      usersBid.userId = userId;

      const placedUserBid = await UsersBid.query().insert({
        ...usersBid
      });
      return placedUserBid;
    }
    throw new Error('Bid not found');

    //place bid
  }
  catch (error) {
    throw new Error(error);
  }

};

const awardBid = async (bidId: number, winnersId: number, req: Request) => {
  try {
    const userId = tokenUtils.getIdFromToken(req);
    //check the users existence
    const userToBeAwarded = await User.query().findById(winnersId);
    if (!userToBeAwarded)
      throw new Error('The specified user does not exist');
    // check the bid status
    const bidInfo = await Bid.query()
      .select('status', 'creatorId')
      .where('id', '=', bidId);

    if (bidInfo.length) {
      if (bidInfo[0].status === 'Closed') {
        throw new Error('This bid can not be awarded because it is closed');
      }
      if (bidInfo[0].creatorId !== userId) {
        throw new Error('This bid is not yours to award');
      }
      const placedBid = await UsersBid.query().select('amount').where('userId', '=', winnersId);
      if (placedBid.length) {
        const awardedBid = await Bid.query().patchAndFetchById(bidId, {
          awardedTo: winnersId,
          status: 'Closed'
        });
        return awardedBid;
      }
      throw new Error('You can not award the bid to someone who has not placed a bid');
    }
    throw new Error('Bid not found');
  }
  catch (error) {
    throw new Error(error);
  }
};

const resolvers: IResolvers = {
  Query: {
    bids: async () => getAllBids()
  },

  Mutation: {

    register: async (parent, { email, password, firstName, lastName, accountNumber, sex }, context) => {
      let newUser: UserToBeCreatedType = { email, password, firstName, lastName, accountNumber, sex };
      let registeredUserData: AuthenticatedUserType = await registerUser(newUser);
      return registeredUserData;
    },
    signIn: async (parent, { email, password }, context) => {
      let AuthenticatedUserData: AuthenticatedUserType = await signInUser(email, password);
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
      let updatedBid: BidType = await updateBid(oldBid, context.req);
      return updatedBid;
    },

    deleteBid: async (parent, { id }, context) => {
      let deletedBid = await deleteBid(id, context.req);
      return deletedBid;
    },

    placeBid: async (parent, { bidId, amount }, context) => {
      let bidToPlace: UsersBidType = { bidId, amount, userId: -1 };
      let palacedBid = await placeBid(bidToPlace, context.req);
      return palacedBid;
    },

    awardBid: async (parent, { bidId, winnersId }, context) => {
      let awardedBid: Bid = await awardBid(bidId, winnersId, context.req);
      return awardedBid;
    }

  }
};

export default resolvers;