namespace Portal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class moduleimgBase64 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ModuleModels", "ImgBase64", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ModuleModels", "ImgBase64");
        }
    }
}
