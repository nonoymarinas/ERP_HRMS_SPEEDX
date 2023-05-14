using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using BusinessModel;
using DataAccess;

namespace BusinessLogic
{
	public class PersonalInformationLogic:ISavePersonalInfo, IUpdatePersonalInfo
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamPersonalInfoModel? _personalInfo;
		private readonly ParamUpdatePersonalInfoModel? _updatepersonalInfo;

		public PersonalInformationLogic(IOptions<ConnectionSettings> connection, ParamPersonalInfoModel personalInfo)
		{
			_connection = connection.Value;
			_personalInfo = personalInfo;
		}

		public PersonalInformationLogic(IOptions<ConnectionSettings> connection, ParamUpdatePersonalInfoModel updatepersonalInfo)
		{
			_connection = connection.Value;
			_updatepersonalInfo = updatepersonalInfo;
		}

		async public Task<ReturnSavePersonalInfoModels> SavePersonalInfo()
		{
			SavePersonalInformationDataAccess dataAccessData = new(_connection,_personalInfo);
			return await dataAccessData.SavePersonalInfo();
		}

		async public Task<ReturnUpdatePersonalInfoModels> UpdatePersonalInfo()
		{
			UpdatePersonalInformationDataAccess dataAccessData = new(_connection, _updatepersonalInfo);
			return await dataAccessData.UpdatePersonalInfo();
		}

	}
}
