import { Model } from "objection";

class Bids extends Model {
    id!: number;
    name!: string;
    description!: string;
    startingPrice! : number;   
    creatorId! : number;
    status! : string;

    static tableName = 'bids';

    static jsonSchema = {
        type: 'object',
        required: ['name', 'description', ],

        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            startingPrice: {type: 'number'},            
            creatorId: {type: 'number'},
            status: {type: 'string'}
        }
    }

    //static relationMappings
}

export default Bids;

