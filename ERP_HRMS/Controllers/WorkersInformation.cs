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
		[Route("employee-detail-page")]
		public IActionResult MainPage()
        {
            return View();
        }

        [Route("save-personal-information")]
        async public Task<IActionResult> SavePersonalInfo(ParamPersonalInfoModel persInfo) {
            PersonalInformationLogic dataLogic = new(_connection, persInfo);
            return Json(await dataLogic.SavePersonalInfo());
        }

		[Route("update-personal-information")]
		async public Task<IActionResult> UpdatePersonalInfo(ParamUpdatePersonalInfoModel persInfo)
		{
			PersonalInformationLogic dataLogic = new(_connection, persInfo);
			return Json(await dataLogic.UpdatePersonalInfo());
		}

		[Route("save-benifits")]
		async public Task<IActionResult> SaveBenifits(ParamBenifitsModel benifits)
		{
			WorkersBenifitsLogic dataLogic = new(_connection, benifits);
			return Json(await dataLogic.SaveBenifits());
		}

		[Route("update-benifits")]
		async public Task<IActionResult> UpdateBenifits(ParamUpdateBenifitsModel benifit)
		{
			WorkersBenifitsLogic dataLogic = new(_connection, benifit);
			return Json(await dataLogic.UpdateBenifits());
		}


		[Route("save-contacts")]
		async public Task<IActionResult> SaveContacts(ParamContactModel contacts)
		{
			WorkersContactsLogic dataLogic = new(_connection, contacts);
			return Json(await dataLogic.SaveContacts());
		}

		[Route("update-contacts")]
		async public Task<IActionResult> UpdateContacts(ParamUpdateContactsModel contacts)
		{
			WorkersContactsLogic dataLogic = new(_connection, contacts);
			return Json(await dataLogic.UpdateContacts());
		}

		[Route("save-compensation")]
		async public Task<IActionResult> SaveCompensation(ParamCompensationModel compensation)
		{
			WorkersCompensationLogic dataLogic = new(_connection, compensation);
			return Json(await dataLogic.SaveCompensation());
		}

        [Route("update-compensation")]
        async public Task<IActionResult> UpdateCompensation(ParamUpdateCompensationModel updateCompensation)
        {
            WorkersCompensationLogic dataLogic = new(_connection, updateCompensation);
            return Json(await dataLogic.UpdateCompensation());
        }
    }

}
