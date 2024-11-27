using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class createTableStatusWithRelationProduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "OfferStartDate",
                table: "Product",
                type: "DateTime",
                nullable: true,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "DateTime",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "Statuses",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StatusDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Statuses", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ProductStatus",
                columns: table => new
                {
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    StatusChangeDate = table.Column<DateTime>(type: "DateTime", nullable: false),
                    ChangedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductStatus", x => new { x.ProductId, x.StatusId });
                    table.ForeignKey(
                        name: "FK_ProductStatus_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductStatus_Statuses_StatusId",
                        column: x => x.StatusId,
                        principalTable: "Statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductStatus_StatusId",
                table: "ProductStatus",
                column: "StatusId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductStatus");

            migrationBuilder.DropTable(
                name: "Statuses");

            migrationBuilder.AlterColumn<DateTime>(
                name: "OfferStartDate",
                table: "Product",
                type: "DateTime",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "DateTime",
                oldNullable: true,
                oldDefaultValueSql: "GETDATE()");
        }
    }
}
