import app from "./server.js"
import dotenv from "dotenv"
import dbConfig from './config/db.config.js'

import pkg from 'pg';
const { Pool } = pkg;

async function main(){
    dotenv.config();
    const port = process.env.PORT;
    const connectionPool = new Pool(dbConfig);
    try{
        await connectionPool.connect();
        console.log("Success: Connected to PostgreSQL db.");

        app.listen(process.env.PORT, ()=>{
            console.log(`The server is running on port ${process.env.PORT}`);
        })
    } catch(e){
        console.error("Error: Could not connected to PostgreSQL db.", e);
        process.exit(1);
    }
}

main().catch(console.error);