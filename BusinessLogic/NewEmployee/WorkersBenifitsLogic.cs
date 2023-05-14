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
	public class WorkersBenifitsLogic : ISaveBenifits, IUpdateBenifits
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamBenifitsModel? _benifits;
        private readonly ParamUpdateBenifitsModel? _updateBenifits;


        public WorkersBenifitsLogic(IOptions<ConnectionSettings> connection,  ParamBenifitsModel benifits)
		{
			_connection = connection.Value;
			_benifits = benifits;
		}
        public WorkersBenifitsLogic(IOptions<ConnectionSettings> connection, ParamUpdateBenifitsModel updateBenifits)
        {
            _connection = connection.Value;
            _updateBenifits = updateBenifits;
        }

        async public Task<ReturnSaveBenifitsModel> SaveBenifits()
		{
			SaveBenifitsDataAccess dataAccessData = new(_connection, _benifits);
			return await dataAccessData.SaveBenifits();
		}

		async public Task<ReturnUpdateBenifitsModel> UpdateBenifits()
        {
			UpdateBenifitsDataAccess dataAccessData = new(_connection, _updateBenifits);
			return await dataAccessData.UpdateBenifits();
		}
    }
}
