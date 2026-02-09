import { DataSource } from "typeorm";
import { ormConfig } from "./src/config/orm.config";

export default new DataSource(ormConfig);