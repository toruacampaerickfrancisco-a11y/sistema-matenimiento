'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Convert attachments from JSONB to TEXT[] using a safe two-step approach
      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" ADD COLUMN "attachments_tmp" TEXT[] DEFAULT '{}'::TEXT[];`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `UPDATE "tickets" SET "attachments_tmp" = (
            CASE
              WHEN "attachments" IS NULL THEN '{}'::TEXT[]
              WHEN "attachments"::text = '[]'::text THEN '{}'::TEXT[]
              ELSE COALESCE((SELECT array_agg(value) FROM jsonb_array_elements_text("attachments"::jsonb) AS value), '{}'::TEXT[])
            END
          );`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" DROP COLUMN "attachments";`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" RENAME COLUMN "attachments_tmp" TO "attachments";`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" ALTER COLUMN "attachments" SET DEFAULT '{}'::TEXT[];`,
        { transaction }
      );

      // Convert tags from JSONB to TEXT[] using a safe two-step approach
      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" ADD COLUMN "tags_tmp" TEXT[] DEFAULT '{}'::TEXT[];`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `UPDATE "tickets" SET "tags_tmp" = (
            CASE
              WHEN "tags" IS NULL THEN '{}'::TEXT[]
              WHEN "tags"::text = '[]'::text THEN '{}'::TEXT[]
              ELSE COALESCE((SELECT array_agg(value) FROM jsonb_array_elements_text("tags"::jsonb) AS value), '{}'::TEXT[])
            END
          );`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" DROP COLUMN "tags";`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" RENAME COLUMN "tags_tmp" TO "tags";`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" ALTER COLUMN "tags" SET DEFAULT '{}'::TEXT[];`,
        { transaction }
      );
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Convert attachments from TEXT[] back to JSONB using temp column
      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" ADD COLUMN "attachments_tmp" JSONB DEFAULT '[]'::JSONB;`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `UPDATE "tickets" SET "attachments_tmp" = to_jsonb("attachments");`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" DROP COLUMN "attachments";`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" RENAME COLUMN "attachments_tmp" TO "attachments";`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" ALTER COLUMN "attachments" SET DEFAULT '[]'::JSONB;`,
        { transaction }
      );

      // Convert tags from TEXT[] back to JSONB using temp column
      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" ADD COLUMN "tags_tmp" JSONB DEFAULT '[]'::JSONB;`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `UPDATE "tickets" SET "tags_tmp" = to_jsonb("tags");`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" DROP COLUMN "tags";`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" RENAME COLUMN "tags_tmp" TO "tags";`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "tickets" ALTER COLUMN "tags" SET DEFAULT '[]'::JSONB;`,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
