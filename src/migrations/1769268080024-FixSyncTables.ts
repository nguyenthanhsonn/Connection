import { MigrationInterface, QueryRunner } from "typeorm";

export class FixSyncTables1769268080024 implements MigrationInterface {
    name = 'FixSyncTables1769268080024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // All tables (Room, room_members, Post_Likes) already exist in the database.
        // This migration is used to sync the migration history.
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
