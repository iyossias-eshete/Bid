import Knex from 'knex';

import knexConfig from '../../knexfile';
import { Model, ForeignKeyViolationError, ValidationError } from 'objection';

const dbInitializer = ()=>{
    let knex: any = {};
    const knexEnvironment = process.env.KNEX_ENVIRONMENT;
    if (knexEnvironment == 'production')
        knex = Knex(knexConfig.production);
    if (knexEnvironment == 'staging')
        knex = Knex(knexConfig.staging);
    else
        knex = Knex(knexConfig.development);
    
    Model.knex(knex);
};

export default dbInitializer;