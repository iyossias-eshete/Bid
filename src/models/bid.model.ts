import { Model } from "objection";

class Bid extends Model {
    id!: number;
    name!: string;
    description!: string;
    startingPrice! : number;   
    creatorId! : number;
    status! : string;
    awardedTo! : number; 

    static tableName = 'bid';

    static jsonSchema = {
        type: 'object',
        required: ['name', 'description', ],

        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            startingPrice: {type: 'number'},            
            creatorId: {type: 'number'},
            status: {type: 'string'},
            awardedTo : { type: 'number'}
        }
    }

    //static relationMappings
}

export default Bid;

