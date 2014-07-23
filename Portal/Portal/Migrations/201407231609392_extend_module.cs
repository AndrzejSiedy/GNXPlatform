namespace Portal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class extend_module : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ModuleModels", "GadgetUrl", c => c.String());
            AddColumn("dbo.ModuleModels", "Thumbnail", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ModuleModels", "Thumbnail");
            DropColumn("dbo.ModuleModels", "GadgetUrl");
        }
    }
}
