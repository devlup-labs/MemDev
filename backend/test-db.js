import dotenv from "dotenv";
import {Client} from "pg";

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,

});

async function main() {
    await client.connect();

    const result = await client.query("SELECT NOW()");

    console.log(result.rows);

    await client.end();
}

main();

