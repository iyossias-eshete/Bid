import  jwt from "jsonwebtoken";
const SECRET = 'SECRET';



const getIdFromToken = (req : Request )=>{
    try {
        const Authorization = req.header('authorization');

        if (Authorization === undefined || Authorization === null)
          throw new Error('Authorization bearer token not provided.');

        const token = Authorization.replace('Bearer ', '');
        let userId = Number(jwt.verify(token, SECRET ));
        return userId;
      }
      catch (error) {
        throw new Error(error);
      }
};

const utils = {
    getIdFromToken
}

export default utils;