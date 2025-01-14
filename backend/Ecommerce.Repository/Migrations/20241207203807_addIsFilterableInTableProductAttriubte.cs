using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class addIsFilterableInTableProductAttriubte : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "ProductAttributes",
                type: "DateTime",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "DateTime");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "ProductAttributes",
                type: "DateTime",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "DateTime");

            migrationBuilder.AddColumn<bool>(
                name: "IsFilterable",
                table: "ProductAttributes",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFilterable",
                table: "ProductAttributes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "ProductAttributes",
                type: "DateTime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "DateTime",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "ProductAttributes",
                type: "DateTime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "DateTime",
                oldDefaultValueSql: "GETUTCDATE()");
        }
    }
}
