import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFollow1759585229337 implements MigrationInterface {
    name = 'CreateFollow1759585229337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Follow\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_following\` tinyint NOT NULL, \`follower_id\` int NULL, \`following_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Follow\` ADD CONSTRAINT \`FK_51b5a9d73332ce0ad2ce788a0ef\` FOREIGN KEY (\`follower_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Follow\` ADD CONSTRAINT \`FK_38be673891273b113251e4a088a\` FOREIGN KEY (\`following_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Follow\` DROP FOREIGN KEY \`FK_38be673891273b113251e4a088a\``);
        await queryRunner.query(`ALTER TABLE \`Follow\` DROP FOREIGN KEY \`FK_51b5a9d73332ce0ad2ce788a0ef\``);
        await queryRunner.query(`DROP TABLE \`Follow\``);
    }

}
