import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateComments1760689803580 implements MigrationInterface {
    name = 'UpdateComments1760689803580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_68844d71da70caf0f0f4b0ed72d\``);
        await queryRunner.query(`ALTER TABLE \`Comments\` CHANGE \`postId\` \`post_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_f249fc15272c4fa4c4e3e073c12\` FOREIGN KEY (\`post_id\`) REFERENCES \`Posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_f249fc15272c4fa4c4e3e073c12\``);
        await queryRunner.query(`ALTER TABLE \`Comments\` CHANGE \`post_id\` \`postId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_68844d71da70caf0f0f4b0ed72d\` FOREIGN KEY (\`postId\`) REFERENCES \`Posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
