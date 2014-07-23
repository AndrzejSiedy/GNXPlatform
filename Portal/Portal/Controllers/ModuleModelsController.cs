using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Portal.Models;

namespace Portal.Controllers
{
    [Authorize]
    public class ModuleModelsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: ModuleModels
        public async Task<ActionResult> Index()
        {

            // NOTE:
            // We should get modules from Neo4j that are linked to the user
            // for now we keep same set of objects in MS SQL Server and Neo4j DB

            // user (owner) id
            var id = Microsoft.AspNet.Identity.IdentityExtensions.GetUserId(User.Identity);
            
            // filter out modules that user owns - created
            return View(await db.ModuleModels.Where(m => m.OwnerId == id).ToListAsync());
        }

        // GET: ModuleModels/Details/5
        public async Task<ActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ModuleModels moduleModels = await db.ModuleModels.FindAsync(id);
            if (moduleModels == null)
            {
                return HttpNotFound();
            }
            return View(moduleModels);
        }

        // GET: ModuleModels/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ModuleModels/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Name,Desciption,IsPublic,OwnerId")] ModuleModels moduleModels)
        {
            if (ModelState.IsValid)
            {
                moduleModels.Id = Guid.NewGuid();

                var id = Microsoft.AspNet.Identity.IdentityExtensions.GetUserId(User.Identity);

                moduleModels.OwnerId = id;
                //var logins = user.Logins;

                //foreach (var login in logins)
                //{
                //    await _userManager.RemoveLoginAsync(User.Identity.GetUserId(), new UserLoginInfo(login.LoginProvider, login.ProviderKey));
                //}


                db.ModuleModels.Add(moduleModels);
                await db.SaveChangesAsync();

                Portal.Models.Neo4jModule neo4jModule = new Portal.Models.Neo4jModule()
                {
                    Id =  moduleModels.Id.ToString(),
                    Name = moduleModels.Name ,
                    GadgetUrl = moduleModels.GadgetUrl,
                    Thumbnail = moduleModels.Thumbnail,
                    Desciption = moduleModels.Desciption,
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

                return RedirectToAction("Index");
            }

            return View(moduleModels);
        }

        // GET: ModuleModels/Edit/5
        public async Task<ActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ModuleModels moduleModels = await db.ModuleModels.FindAsync(id);
            if (moduleModels == null)
            {
                return HttpNotFound();
            }
            return View(moduleModels);
        }

        // POST: ModuleModels/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Name,Desciption,IsPublic,OwnerId")] ModuleModels moduleModels)
        {
            if (ModelState.IsValid)
            {
                db.Entry(moduleModels).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(moduleModels);
        }

        // GET: ModuleModels/Delete/5
        public async Task<ActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ModuleModels moduleModels = await db.ModuleModels.FindAsync(id);
            if (moduleModels == null)
            {
                return HttpNotFound();
            }
            return View(moduleModels);
        }

        // POST: ModuleModels/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(Guid id)
        {
            ModuleModels moduleModels = await db.ModuleModels.FindAsync(id);
            db.ModuleModels.Remove(moduleModels);
            await db.SaveChangesAsync();

            // get realated module
            var userNode = Portal.Neo4j.Controllers.Operations.GetAsNode<Neo4jModule>(id.ToString());
            Portal.Neo4jConfig.client.Delete(userNode.Reference, Neo4jClient.DeleteMode.NodeAndRelationships);
            

            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
