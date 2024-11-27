using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class updateProductTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dimensions",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ReviewsCount",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Product");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Dimensions",
                table: "Product",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                table: "Product",
                type: "decimal(3,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "ReviewsCount",
                table: "Product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "Product",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Weight",
                table: "Product",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
