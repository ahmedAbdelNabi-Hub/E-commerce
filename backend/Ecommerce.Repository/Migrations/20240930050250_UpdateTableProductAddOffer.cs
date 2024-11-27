using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class UpdateTableProductAddOffer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LinkImage",
                table: "Product",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "OfferEndDate",
                table: "Product",
                type: "DateTime",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OfferPrice",
                table: "Product",
                type: "decimal(8,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OfferStartDate",
                table: "Product",
                type: "DateTime",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LinkImage",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "OfferEndDate",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "OfferPrice",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "OfferStartDate",
                table: "Product");
        }
    }
}
