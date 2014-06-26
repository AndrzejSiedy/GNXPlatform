namespace Portal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addModule1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ModuleModels", "OwnerId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ModuleModels", "OwnerId");
        }
    }
}
