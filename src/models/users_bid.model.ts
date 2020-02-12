import { Model } from "objection";

class UsersBid extends Model {
    userId!: number;
    bidId!: number;
    bidAmount! : number;

    static tableName = 'users_bid';

    static jsonSchema = {
        type: 'object',
        required: ['userId', 'bidId', 'bidAmount' ],

        properties: {
            userId: { type: 'number' },
            bidId: { type: 'number' },
            bidAmount: { type: 'number' },
        }
    }
    //static relationMappings
}

export default UsersBid;

