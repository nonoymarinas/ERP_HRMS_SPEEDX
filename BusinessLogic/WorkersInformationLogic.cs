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
	public class WorkersInformationLogic:ISavePersonalInfo, IUpdatePersonalInfo
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamPersonalInfoModels _personalInfo;

		public WorkersInformationLogic(IOptions<ConnectionSettings> connection, ParamPersonalInfoModels personalInfo)
		{
			_connection = connection.Value;
			_personalInfo = personalInfo;
		}

		async public Task<ReturnSavePersonalInfoModels> SavePersonalInfo()
		{
			SavePersonalInformationDataAccess dataAccessData = new(_connection,_personalInfo);
			return await dataAccessData.SavePersonalInfo();
		}

		async public Task<ReturnUpdatePersonalInfoModels> UpdatePersonalInfo()
		{
			UpdatePersonalInformationDataAccess dataAccessData = new(_connection, _personalInfo);
			return await dataAccessData.UpdatePersonalInfo();
		}
	}
}
