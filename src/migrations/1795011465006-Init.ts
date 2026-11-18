import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1795011465006 implements MigrationInterface {
    name = 'Init1795011465006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "leadId" text NOT NULL, "type" text NOT NULL, "description" text NOT NULL, "userId" text, "userName" text NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_3603ebbaf4b4db169e33bc148a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_032f6b974c1135cd6cbb59b752" ON "Activity" ("leadId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_032f6b974c1135cd6cbb59b752"`);
        await queryRunner.query(`DROP TABLE "Activity"`);
    }

}
