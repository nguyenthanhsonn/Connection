import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsers1759226286148 implements MigrationInterface {
    name = 'UpdateUsers1759226286148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`avatar_url\` \`avatar_url\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`bio_text\` \`bio_text\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`updated_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`created_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`bio_text\` \`bio_text\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`avatar_url\` \`avatar_url\` varchar(255) NOT NULL`);
    }

}
