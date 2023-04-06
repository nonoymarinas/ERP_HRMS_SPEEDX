using Microsoft.AspNetCore.Mvc;

namespace ERP_HRMS.Controllers
{
    public class DashBoard : Controller
    {
        public IActionResult MainPage()
        {
            return View();
        }
    }
}
