import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostSave1761311090036 implements MigrationInterface {
    name = 'UpdatePostSave1761311090036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post_Saves\` ADD \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post_Saves\` DROP COLUMN \`created_at\``);
    }

}
