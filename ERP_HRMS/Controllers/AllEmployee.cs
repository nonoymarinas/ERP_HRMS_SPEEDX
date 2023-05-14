using Microsoft.AspNetCore.Mvc;
using BusinessLogic;
using BusinessModel;
using DataAccess;
using Microsoft.Extensions.Options;

namespace ERP_HRMS.Controllers
{
    public class AllEmployee : Controller
    {
        private readonly IOptions<ConnectionSettings> _connection;

        public AllEmployee(IOptions<ConnectionSettings> connection)
        {
            _connection = connection;
        }
        public IActionResult MainPage()
        {
            return View();
        }
        [Route("all-employee-data")]
        async public Task<IActionResult> GetMasterPersonData()
        {
            AllEmployeeLogic dataLogic = new(_connection);
            return Json(await dataLogic.GetMasterPersonData());
        }

        [Route("single-employee-data")]
        async public Task<IActionResult> GetMasterPersonDataByID(ParamMasterPersonByIDModel masterID)
        {
            AllEmployeeLogic dataLogic = new(_connection, masterID);
            return Json(await dataLogic.GetMasterPersonByID());
        }
    }
}
