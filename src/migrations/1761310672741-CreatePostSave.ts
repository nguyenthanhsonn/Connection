import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostSave1761310672741 implements MigrationInterface {
    name = 'CreatePostSave1761310672741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Posts\` DROP FOREIGN KEY \`FK_d0e17ba5d038b673303acd92405\``);
        await queryRunner.query(`CREATE TABLE \`Post_Saves\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`post_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Post_Saves\` ADD CONSTRAINT \`FK_a42e7f2bf6fda042b76eba797e5\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post_Saves\` ADD CONSTRAINT \`FK_dbb5e5a210d40759be9b1efeee1\` FOREIGN KEY (\`post_id\`) REFERENCES \`Posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Posts\` ADD CONSTRAINT \`FK_d0e17ba5d038b673303acd92405\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Posts\` DROP FOREIGN KEY \`FK_d0e17ba5d038b673303acd92405\``);
        await queryRunner.query(`ALTER TABLE \`Post_Saves\` DROP FOREIGN KEY \`FK_dbb5e5a210d40759be9b1efeee1\``);
        await queryRunner.query(`ALTER TABLE \`Post_Saves\` DROP FOREIGN KEY \`FK_a42e7f2bf6fda042b76eba797e5\``);
        await queryRunner.query(`DROP TABLE \`Post_Saves\``);
        await queryRunner.query(`ALTER TABLE \`Posts\` ADD CONSTRAINT \`FK_d0e17ba5d038b673303acd92405\` FOREIGN KEY (\`user_id\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
