import { Model } from "objection";

class Account extends Model {
    accountNumber!: number;
    holdersFirstName!: string;
    holdersLastName! : string;
    holdersEmail! : string;
    amount! : number

    static tableName = 'account';

    static jsonSchema = {
        type: 'object',
        required: ['holdersFirstName', 'holdersLastName', 'amount', 'holdersEmail' ],

        properties: {
            accountNumber: { type: 'number' },
            holdersEmail : { type : 'string'},
            holdersFirstName: { type: 'string' },
            holdersLastName: { type: 'string' },
            amount : {type : 'number'}
        }
    }
    //static relationMappings
}

export default Account;

