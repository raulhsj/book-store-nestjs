import { MigrationInterface, QueryRunner } from "typeorm";

export class userMigration1675848067819 implements MigrationInterface {
    name = 'userMigration1675848067819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
    }

}
