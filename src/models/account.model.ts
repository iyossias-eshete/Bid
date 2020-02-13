import { Model } from "objection";

class Account extends Model {
    accountNumber!: number;
    holdersFirstName!: string;
    holdersLastName! : string;
    amount! : number

    static tableName = 'account';

    static jsonSchema = {
        type: 'object',
        required: ['holdersFirstName', 'holdersLastName', 'amount' ],

        properties: {
            accountNumber: { type: 'number' },
            holdersFirstName: { type: 'string' },
            holdersLastName: { type: 'string' },
            amount : {type : 'number'}
        }
    }
    //static relationMappings
}

export default Account;

