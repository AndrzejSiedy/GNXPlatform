using System.Web;
using System.Web.Optimization;

namespace Portal
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));


            // jQuery UI
            bundles.Add(new StyleBundle("~/bundles/jqueryUiCss").Include(
                        "~/Content/themes/jquery-ui.all.css"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryUiJs").Include(
                        "~/Scripts/jquery-ui-1.10.4.js"));


            bundles.Add(new ScriptBundle("~/bundles/signalR").Include(
                        "~/Scripts/jquery.signalR-2.1.0.js"));



            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            //bundles.Add(new ScriptBundle("~/app/JakasNazwa").Include(
            //        "~/app/Workspace/app.js"));


            // Gnx modules
            bundles.Add(new ScriptBundle("~/app/Gnx").Include(
                    "~/Scripts/app/Utils/Utils.js",
                    "~/Scripts/app/Setup/Init.js",
                    "~/Scripts/app/Utils/Event.js",
                    "~/Scripts/app/Views/Layout.js",
                    "~/Scripts/app/Views/Wall.js",
                    "~/Scripts/app/Views/Center.js",
                    "~/Scripts/app/Views/ModuleInfo.js",
                    "~/Scripts/app/Module/Module.js",
                    "~/Scripts/app/Controller/SignalRClient.js",
                    "~/Scripts/app/AppLogic.js"));

            // Toastr
            bundles.Add(new StyleBundle("~/toastrCss").Include(
                    "~/Content/toastr.css"));

            bundles.Add(new ScriptBundle("~/toastrJs").Include(
                    "~/Scripts/toastr.min.js"));


            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = false;
        }
    }
}
