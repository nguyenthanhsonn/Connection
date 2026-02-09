import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotiTable1763098531468 implements MigrationInterface {
    name = 'CreateNotiTable1763098531468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Notificaitons\` (\`id\` int NOT NULL AUTO_INCREMENT, \`message\` varchar(255) NOT NULL, \`is_read\` tinyint NOT NULL, \`created_at\` datetime NOT NULL, \`sender_id\` int NULL, \`receiver_id\` int NULL, \`post_id\` int NULL, \`comment_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` ADD CONSTRAINT \`FK_968217591bfb5416f1d8aad4407\` FOREIGN KEY (\`sender_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` ADD CONSTRAINT \`FK_84dfb616149885151766e0dafdc\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` ADD CONSTRAINT \`FK_7c7fca2d67f97716446a0d54525\` FOREIGN KEY (\`post_id\`) REFERENCES \`Posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` ADD CONSTRAINT \`FK_931d4bd29846891ee7e161c86d9\` FOREIGN KEY (\`comment_id\`) REFERENCES \`Comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` DROP FOREIGN KEY \`FK_931d4bd29846891ee7e161c86d9\``);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` DROP FOREIGN KEY \`FK_7c7fca2d67f97716446a0d54525\``);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` DROP FOREIGN KEY \`FK_84dfb616149885151766e0dafdc\``);
        await queryRunner.query(`ALTER TABLE \`Notificaitons\` DROP FOREIGN KEY \`FK_968217591bfb5416f1d8aad4407\``);
        await queryRunner.query(`DROP TABLE \`Notificaitons\``);
    }

}
