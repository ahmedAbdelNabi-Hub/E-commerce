using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repository.Migrations
{
    public partial class removeLanguageFromTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionAr",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "Navbar");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "MenuLinks");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "CategoryNameAr",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "CategoryNameEn",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "DescriptionAr",
                table: "Advertisement");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Advertisement");

            migrationBuilder.DropColumn(
                name: "SubtitleAr",
                table: "Advertisement");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "Product",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "DescriptionEn",
                table: "Product",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "Navbar",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "MenuLinks",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "NameEn",
                table: "Menu",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "CategoryTypeEn",
                table: "Category",
                newName: "CategoryType");

            migrationBuilder.RenameColumn(
                name: "CategoryTypeAr",
                table: "Category",
                newName: "CategoryName");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "Advertisement",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "TitleAr",
                table: "Advertisement",
                newName: "Subtitle");

            migrationBuilder.RenameColumn(
                name: "SubtitleEn",
                table: "Advertisement",
                newName: "Description");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Product",
                newName: "NameEn");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Product",
                newName: "DescriptionEn");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Navbar",
                newName: "NameEn");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "MenuLinks",
                newName: "NameEn");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Menu",
                newName: "NameEn");

            migrationBuilder.RenameColumn(
                name: "CategoryType",
                table: "Category",
                newName: "CategoryTypeEn");

            migrationBuilder.RenameColumn(
                name: "CategoryName",
                table: "Category",
                newName: "CategoryTypeAr");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Advertisement",
                newName: "TitleEn");

            migrationBuilder.RenameColumn(
                name: "Subtitle",
                table: "Advertisement",
                newName: "TitleAr");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Advertisement",
                newName: "SubtitleEn");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionAr",
                table: "Product",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "Product",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "Navbar",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "MenuLinks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "Menu",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CategoryNameAr",
                table: "Category",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CategoryNameEn",
                table: "Category",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionAr",
                table: "Advertisement",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Advertisement",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SubtitleAr",
                table: "Advertisement",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
