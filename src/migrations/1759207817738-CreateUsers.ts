import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1759207817738 implements MigrationInterface {
    name = 'CreateUsers1759207817738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`user_name\` varchar(255) NOT NULL, \`pass_word\` varchar(255) NOT NULL, \`avatar_url\` varchar(255) NOT NULL, \`bio_text\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`Users\``);
    }

}
