using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public PartialViewResult About()
        {
            ViewBag.Message = "Your application description page.";

            return PartialView();
        }

        public PartialViewResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return PartialView();
        }

        public PartialViewResult Welcome()
        {
            ViewBag.Message = "Your welcome page.";

            return PartialView();
        }

        public PartialViewResult App()
        {
            ViewBag.Message = "Your app page.";

            return PartialView();
        }
    }
}