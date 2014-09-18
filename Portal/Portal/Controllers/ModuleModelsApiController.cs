using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Portal.Models;
using Neo4jClient;

namespace Portal.Controllers
{
    [Authorize]
    public class ModuleModelsApiController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/ModuleModelsApi
        public IEnumerable<Neo4jModule> GetModuleModels()
        {

            var id = Microsoft.AspNet.Identity.IdentityExtensions.GetUserId(User.Identity);


            // get realated modules
            var userNode = Portal.Neo4j.Controllers.Operations.GetAsNode<Neo4jUser>(id);
            // get list of modules linked to user by "OWNS_MODULE" relation
            var relNodes = Portal.Neo4j.Controllers.Operations.GetRelatedNodes<NodeReference<Neo4jUser>, Neo4jModule>(userNode.Reference, "OWNS_MODULE");

            //return db.ModuleModels.Where(m => m.OwnerId == id);
            return relNodes.OrderBy(m => m.Name);
        }

        [Route("api/ModuleModelsApiServer")]
        public IQueryable<ModuleModels> GetModuleModelsSQLSever()
        {
            var id = Microsoft.AspNet.Identity.IdentityExtensions.GetUserId(User.Identity);
            return db.ModuleModels.Where(m => m.OwnerId == id);
        }

        // GET: api/ModuleModelsApi/5
        [ResponseType(typeof(ModuleModels))]
        public async Task<IHttpActionResult> GetModuleModels(Guid id)
        {
            ModuleModels moduleModels = await db.ModuleModels.FindAsync(id);
            if (moduleModels == null)
            {
                return NotFound();
            }

            return Ok(moduleModels);
        }

        // PUT: api/ModuleModelsApi/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutModuleModels(Guid id, ModuleModels moduleModels)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != moduleModels.Id)
            {
                return BadRequest();
            }

            db.Entry(moduleModels).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ModuleModelsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/ModuleModelsApi
        [ResponseType(typeof(ModuleModels))]
        public async Task<IHttpActionResult> PostModuleModels(ModuleModels moduleModels)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // set OwnerId for now OwnerId == CreatorId
            moduleModels.Id = Guid.NewGuid();
            moduleModels.OwnerId = Microsoft.AspNet.Identity.IdentityExtensions.GetUserId(User.Identity);

            // MS SQL Server part - will be removed at some point, as intention is to keep them in Neo4j DB
            db.ModuleModels.Add(moduleModels);
            await db.SaveChangesAsync();

            Portal.Models.Neo4jModule neo4jModule = new Portal.Models.Neo4jModule()
            {
                Id = moduleModels.Id.ToString(),
                Name = moduleModels.Name,
                GadgetUrl = moduleModels.GadgetUrl,
                Thumbnail = moduleModels.Thumbnail,
                Description = moduleModels.Description,
                IsPublic = moduleModels.IsPublic,
                OwnerId = moduleModels.OwnerId
            };
            var moduleNode = Portal.Neo4j.Controllers.Operations.Create<Neo4jModule>(neo4jModule);

            var relation = new Neo4j.Relations.OwnsModule(moduleNode);

            // create retaion between owner node and module
            // get user node
            try
            {
                var userNodesRef = Portal.Neo4j.Controllers.Operations.GetAsNode<Neo4jUser>(moduleModels.OwnerId);
                // create relation
                var relRef = Neo4jConfig.client.CreateRelationship(userNodesRef.Reference, relation);
            }
            catch (Exception ex)
            {
                
            }


            return CreatedAtRoute("DefaultApi", new { id = moduleModels.Id }, moduleModels);
        }

        // DELETE: api/ModuleModelsApi/5
        [ResponseType(typeof(ModuleModels))]
        public async Task<IHttpActionResult> DeleteModuleModels(Guid id)
        {
            ModuleModels moduleModels = await db.ModuleModels.FindAsync(id);
            if (moduleModels == null)
            {
                return NotFound();
            }

            db.ModuleModels.Remove(moduleModels);
            await db.SaveChangesAsync();

            return Ok(moduleModels);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ModuleModelsExists(Guid id)
        {
            return db.ModuleModels.Count(e => e.Id == id) > 0;
        }
    }
}