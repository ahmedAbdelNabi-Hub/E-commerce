using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class createCategoryTableWithRelationProdcut : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Advertisement",
                type: "DateTime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Advertisement",
                type: "DateTime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CategoryNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CategoryTypeAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CategoryTypeEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NameAr = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DescriptionAr = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    DescriptionEn = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Brand = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SKU = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Discount = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    StockQuantity = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Rating = table.Column<decimal>(type: "decimal(3,2)", nullable: false, defaultValue: 0m),
                    ReviewsCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Weight = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Dimensions = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.id);
                    table.ForeignKey(
                        name: "FK_Product_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Product_CategoryId",
                table: "Product",
                column: "CategoryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Advertisement",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "DateTime");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Advertisement",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "DateTime");
        }
    }
}
