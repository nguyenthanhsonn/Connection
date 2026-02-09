import { config } from 'dotenv';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

config();

const isTs = __filename.endsWith('.ts'); // dev = true, prod = false
const ext = isTs ? 'ts' : 'js';

export const ormConfig: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [join(__dirname, `/../**/*.entity.${ext}`)],
    migrations: [join(__dirname, `/../migrations/*.${ext}`)],
    synchronize: false,
    // logging: true
}

// console.log(`>>> orm config: ${JSON.stringify(ormConfig, null, 2)}`);
