import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePost1760682417224 implements MigrationInterface {
    name = 'UpdatePost1760682417224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post_Images\` ADD \`image_url\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`Post_Images\` ADD \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`Post_Images\` ADD CONSTRAINT \`FK_c204b57a680d0242f4adf3d70a6\` FOREIGN KEY (\`post_id\`) REFERENCES \`Posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post_Images\` DROP FOREIGN KEY \`FK_c204b57a680d0242f4adf3d70a6\``);
        await queryRunner.query(`ALTER TABLE \`Post_Images\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`Post_Images\` DROP COLUMN \`image_url\``);
    }

}
