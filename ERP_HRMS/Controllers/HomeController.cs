using Microsoft.AspNetCore.Mvc;

namespace ERP_HRMS.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult MainPage()
        {
            return View();
        }
    }
}
