import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTableChat1769085335987 implements MigrationInterface {
    name = 'NewTableChat1769085335987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`roomId\` int NOT NULL, \`userId\` int NOT NULL, \`message\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, INDEX \`IDX_aac22ad971dea43f27ee8f3663\` (\`roomId\`, \`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_aac22ad971dea43f27ee8f3663\` ON \`chat\``);
        await queryRunner.query(`DROP TABLE \`chat\``);
    }

}
