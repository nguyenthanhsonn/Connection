import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCascadeDelete1770135906771 implements MigrationInterface {
    name = 'FixCascadeDelete1770135906771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post_Likes\` DROP FOREIGN KEY \`FK_a9e487bb0cbca4c637165cba9f0\``);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` DROP FOREIGN KEY \`FK_7c7fca2d67f97716446a0d54525\``);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` DROP FOREIGN KEY \`FK_931d4bd29846891ee7e161c86d9\``);
        await queryRunner.query(`ALTER TABLE \`Room\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`Room\` ADD \`type\` enum ('PERSONAL', 'GROUP') NOT NULL DEFAULT 'PERSONAL'`);
        await queryRunner.query(`ALTER TABLE \`Post_Likes\` ADD CONSTRAINT \`FK_a9e487bb0cbca4c637165cba9f0\` FOREIGN KEY (\`post_id\`) REFERENCES \`Posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` ADD CONSTRAINT \`FK_7c7fca2d67f97716446a0d54525\` FOREIGN KEY (\`post_id\`) REFERENCES \`Posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` ADD CONSTRAINT \`FK_931d4bd29846891ee7e161c86d9\` FOREIGN KEY (\`comment_id\`) REFERENCES \`Comments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` DROP FOREIGN KEY \`FK_931d4bd29846891ee7e161c86d9\``);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` DROP FOREIGN KEY \`FK_7c7fca2d67f97716446a0d54525\``);
        await queryRunner.query(`ALTER TABLE \`Post_Likes\` DROP FOREIGN KEY \`FK_a9e487bb0cbca4c637165cba9f0\``);
        await queryRunner.query(`ALTER TABLE \`Room\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`Room\` ADD \`type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` ADD CONSTRAINT \`FK_931d4bd29846891ee7e161c86d9\` FOREIGN KEY (\`comment_id\`) REFERENCES \`Comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` ADD CONSTRAINT \`FK_7c7fca2d67f97716446a0d54525\` FOREIGN KEY (\`post_id\`) REFERENCES \`Posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post_Likes\` ADD CONSTRAINT \`FK_a9e487bb0cbca4c637165cba9f0\` FOREIGN KEY (\`post_id\`) REFERENCES \`Posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
