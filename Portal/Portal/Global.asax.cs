using Portal.App_Start;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Portal
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // this meant to proterct logging error after user re-logs after while
            // general exception was:
            // "The provided anti-forgery token was meant for a different claims-based user than the current user."
            //-------------------------
            AntiForgeryConfig.SuppressIdentityHeuristicChecks = true;
            Exception ex = Server.GetLastError();
            if (ex is HttpAntiForgeryException)
            {
                Response.Clear();
                Server.ClearError(); //make sure you log the exception first
                Response.Redirect("~/Home/Index", true);
            }
            //-------------------------



            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            MetroUICSSBundleConfig.RegisterBundles();

            Neo4jConfig.Register(ConfigurationManager.AppSettings["Neo4j"].ToString());
        }
    }
}
