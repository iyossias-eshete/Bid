import { Model } from "objection";

class UsersBid extends Model {
    userId!: number;
    bidId!: number;
    amount! : number;
    max: number;
    static tableName = 'usersBid';

    static jsonSchema = {
        type: 'object',
        required: ['userId', 'bidId', 'amount' ],

        properties: {
            userId: { type: 'number' },
            bidId: { type: 'number' },
            amount: { type: 'number' },
        }
    }
  
    //static relationMappings
}

export default UsersBid;

