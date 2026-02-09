import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckSync1769272047368 implements MigrationInterface {
    name = 'CheckSync1769272047368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post_Likes\` DROP FOREIGN KEY \`FK_post_likes_post\``);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_c2b21d8086193c56faafaf1b97c\` FOREIGN KEY (\`senderId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_a27f901523ddfa2eaecb16a5976\` FOREIGN KEY (\`roomId\`) REFERENCES \`Room\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_ca3c84760fb37c2f14658a0a2ec\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_ca3c84760fb37c2f14658a0a2ec\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_a27f901523ddfa2eaecb16a5976\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_c2b21d8086193c56faafaf1b97c\``);
        await queryRunner.query(`ALTER TABLE \`Post_Likes\` ADD CONSTRAINT \`FK_post_likes_post\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
