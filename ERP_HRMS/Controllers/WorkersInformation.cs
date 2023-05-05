using Microsoft.AspNetCore.Mvc;
using BusinessLogic;
using BusinessModel;
using DataAccess;
using Microsoft.Extensions.Options;

namespace ERP_HRMS.Controllers
{
    public class WorkersInformation : Controller
    {
		private readonly IOptions<ConnectionSettings> _connection;

		public WorkersInformation(IOptions<ConnectionSettings> connection)
		{
			_connection = connection;
		}

		public IActionResult MainPage()
        {
            return View();
        }

        [Route("save-personal-information")]
        async public Task<IActionResult> SavePersonalInfo(ParamPersonalInfoModels persInfo) {
            WorkersInformationLogic dataLogic = new(_connection, persInfo);
            return Json(await dataLogic.SavePersonalInfo());
        }

		[Route("update-personal-information")]
		async public Task<IActionResult> UpdatePersonalInfo(ParamPersonalInfoModels persInfo)
		{
			WorkersInformationLogic dataLogic = new(_connection, persInfo);
			return Json(await dataLogic.UpdatePersonalInfo());
		}
	}
}
