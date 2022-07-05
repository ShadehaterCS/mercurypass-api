import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { Country, Message, UserPass, UserTrip } from "./entities/exports";

export default {
    port: 3306,
    entities: [Country, UserPass, UserTrip, Message],
    dbName: process.env.DBNAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    highlighter: new SqlHighlighter(),
    debug: true,
    seeder: {
        path: '../dist/entities', // path to the folder with seeders
        pathTs: './seeders', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
        defaultSeeder: 'DatabaseSeeder', // default seeder class name
        glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
        emit: 'ts', // seeder generation mode
        fileName: (className: string) => className, // seeder file naming convention
    },
    schemaGenerator: {
        createForeignKeyConstraints: true, // whether to generate FK constraints
    }
};