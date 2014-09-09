namespace Portal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateDescrCol : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ModuleModels", "Description", c => c.String());
            DropColumn("dbo.ModuleModels", "Desciption");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ModuleModels", "Desciption", c => c.String());
            DropColumn("dbo.ModuleModels", "Description");
        }
    }
}
