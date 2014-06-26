namespace Portal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class moduleremoveimgBase64 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.ModuleModels", "ImgBase64");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ModuleModels", "ImgBase64", c => c.String());
        }
    }
}
