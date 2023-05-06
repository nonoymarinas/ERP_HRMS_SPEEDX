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
	public class WorkersCompensationLogic : ISaveCompensation
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamCompensationModel _compensation;

		
		public WorkersCompensationLogic(IOptions<ConnectionSettings> connection, ParamCompensationModel compensation)
		{
			_connection = connection.Value;
			_compensation = compensation;
		}

		async public Task<ReturnSaveCompensationModel> SaveCompensation()
        {
			SaveCompensationDataAccess dataAccessData = new(_connection, _compensation);
			return await dataAccessData.SaveCompensation();
		}

       
    }
}
