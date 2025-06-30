using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class giftTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GiftRule",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MainProductId = table.Column<int>(type: "int", nullable: false),
                    GiftProductId = table.Column<int>(type: "int", nullable: false),
                    AutoAdd = table.Column<bool>(type: "bit", nullable: false),
                    StartsAt = table.Column<DateTime>(type: "DateTime", nullable: false),
                    EndsAt = table.Column<DateTime>(type: "DateTime", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GiftRule");
        }
    }
}
