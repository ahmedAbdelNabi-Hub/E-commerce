using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class addTheAssignableByToTheStatusesTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChangedBy",
                table: "ProductStatus");

            migrationBuilder.DropColumn(
                name: "StatusChangeDate",
                table: "ProductStatus");

            migrationBuilder.AddColumn<string>(
                name: "AssignableBy",
                table: "Statuses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignableBy",
                table: "Statuses");

            migrationBuilder.AddColumn<string>(
                name: "ChangedBy",
                table: "ProductStatus",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StatusChangeDate",
                table: "ProductStatus",
                type: "DateTime",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
