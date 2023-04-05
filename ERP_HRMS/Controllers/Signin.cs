using Microsoft.AspNetCore.Mvc;

namespace ERP_HRMS.Controllers
{
    public class Signin : Controller
    {
        public IActionResult LoginWindow()
        {
            return View();
        }
    }
}
