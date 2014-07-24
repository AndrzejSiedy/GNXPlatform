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


            // Gridster
            bundles.Add(new StyleBundle("~/bundles/gridsterCss").Include(
                        "~/Scripts/ducksboard-gridster/dist/jquery.gridster.css"));

            bundles.Add(new ScriptBundle("~/bundles/gridsterJs").Include(
                        "~/Scripts/ducksboard-gridster/dist/jquery.gridster.js"));

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

            bundles.Add(new ScriptBundle("~/app/JakasNazwa").Include(
                    "~/app/Workspace/app.js"
                ));

            // Toastr
            bundles.Add(new StyleBundle("~/toastrCss").Include(
                    "~/Content/toastr.css"
                ));

            bundles.Add(new ScriptBundle("~/toastrJs").Include(
                    "~/Scripts/toastr.min.js"
                ));



            //// //manos.malihu.gr/jquery-custom-content-scroller/
            //bundles.Add(new StyleBundle("~/malihu-scrollerCss").Include(
            //        "~/Scripts/malihu-scroller/jquery.mCustomScrollbar.css"
            //    ));
            //bundles.Add(new StyleBundle("~/malihu-scrollerJs").Include(
            //        "~/Scripts/malihu-scroller/jquery.mCustomScrollbar.concat.min.js"
            //    ));



            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = true;
        }
    }
}
