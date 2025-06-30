using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class updateProductAttrubite : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GiftRule");

            migrationBuilder.DropColumn(
                name: "AttributeName",
                table: "ProductAttributes");

            migrationBuilder.DropColumn(
                name: "AttributeValue",
                table: "ProductAttributes");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "ProductAttributes");

            migrationBuilder.DropColumn(
                name: "IsFilterable",
                table: "ProductAttributes");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "ProductAttributes");

            migrationBuilder.AddColumn<int>(
                name: "AttributeId",
                table: "ProductAttributes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AttributeValueId",
                table: "ProductAttributes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Attribute",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attribute", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AttributeValue",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AttributeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttributeValue", x => x.id);
                    table.ForeignKey(
                        name: "FK_AttributeValue_Attribute_AttributeId",
                        column: x => x.AttributeId,
                        principalTable: "Attribute",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributes_AttributeId",
                table: "ProductAttributes",
                column: "AttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributes_AttributeValueId",
                table: "ProductAttributes",
                column: "AttributeValueId");

            migrationBuilder.CreateIndex(
                name: "IX_AttributeValue_AttributeId",
                table: "AttributeValue",
                column: "AttributeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributes_Attribute_AttributeId",
                table: "ProductAttributes",
                column: "AttributeId",
                principalTable: "Attribute",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductAttributes_AttributeValue_AttributeValueId",
                table: "ProductAttributes",
                column: "AttributeValueId",
                principalTable: "AttributeValue",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributes_Attribute_AttributeId",
                table: "ProductAttributes");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductAttributes_AttributeValue_AttributeValueId",
                table: "ProductAttributes");

            migrationBuilder.DropTable(
                name: "AttributeValue");

            migrationBuilder.DropTable(
                name: "Attribute");

            migrationBuilder.DropIndex(
                name: "IX_ProductAttributes_AttributeId",
                table: "ProductAttributes");

            migrationBuilder.DropIndex(
                name: "IX_ProductAttributes_AttributeValueId",
                table: "ProductAttributes");

            migrationBuilder.DropColumn(
                name: "AttributeId",
                table: "ProductAttributes");

            migrationBuilder.DropColumn(
                name: "AttributeValueId",
                table: "ProductAttributes");

            migrationBuilder.AddColumn<string>(
                name: "AttributeName",
                table: "ProductAttributes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AttributeValue",
                table: "ProductAttributes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "ProductAttributes",
                type: "DateTime",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<bool>(
                name: "IsFilterable",
                table: "ProductAttributes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "ProductAttributes",
                type: "DateTime",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.CreateTable(
                name: "GiftRule",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GiftProductId = table.Column<int>(type: "int", nullable: false),
                    MainProductId = table.Column<int>(type: "int", nullable: false),
                    AutoAdd = table.Column<bool>(type: "bit", nullable: false),
                    EndsAt = table.Column<DateTime>(type: "DateTime", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    StartsAt = table.Column<DateTime>(type: "DateTime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GiftRule", x => x.id);
                    table.ForeignKey(
                        name: "FK_GiftRule_Product_GiftProductId",
                        column: x => x.GiftProductId,
                        principalTable: "Product",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GiftRule_Product_MainProductId",
                        column: x => x.MainProductId,
                        principalTable: "Product",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GiftRule_GiftProductId",
                table: "GiftRule",
                column: "GiftProductId");

            migrationBuilder.CreateIndex(
                name: "IX_GiftRule_MainProductId",
                table: "GiftRule",
                column: "MainProductId");
        }
    }
}
