using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class CreateTableProductAttributes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeliveryTimeInDays",
                table: "Product",
                type: "int",
                nullable: false,
                defaultValue: 4);

            migrationBuilder.CreateTable(
                name: "ProductAttributes",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AttributeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AttributeValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductAttributes", x => x.id);
                    table.ForeignKey(
                        name: "FK_ProductAttributes_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributes_ProductId",
                table: "ProductAttributes",
                column: "ProductId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductAttributes");

            migrationBuilder.DropColumn(
                name: "DeliveryTimeInDays",
                table: "Product");
        }
    }
}
