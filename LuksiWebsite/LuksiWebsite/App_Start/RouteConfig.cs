using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace LuksiWebsite
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapRoute(name: "Game", url: "game", defaults: new { controller = "Home", action = "Index" });
            //routes.MapRoute(name: "Blog", url: "blog", defaults: new { controller = "Home", action = "Index" });
            //routes.MapRoute(name: "Goals", url: "goals", defaults: new { controller = "Home", action = "Index" });
            //routes.MapRoute(name: "Subscribe", url: "subscribe", defaults: new { controller = "Home", action = "Index" });
            //routes.MapRoute(name: "Contact", url: "contact", defaults: new { controller = "Home", action = "Index" });

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}