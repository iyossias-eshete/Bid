import { Model } from "objection";

class Users extends Model {
    id!: number;
    email!: string;
    password!: string;
    firstName!: string;
    lastName! : string;    
    accountNumber! : number;
    sex! : string;

    static tableName = 'users';

    static jsonSchema = {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName', 'accountNumber', 'sex'],

        properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            password: { type: 'string' },
            firstName: {type: 'string'},
            lastName: {type: 'string'},
            accountNumber: {type: 'integer'},
            sex: {type: 'string'}
        }
    }

    //static relationMappings
}

export default Users;

