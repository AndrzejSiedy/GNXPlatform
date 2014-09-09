namespace Portal.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addModule : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ModuleModels",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        IsPublic = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ModuleModels");
        }
    }
}
