using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using DataAccess;
using BusinessModel;

namespace BusinessLogic
{
    public class AllEmployeeLogic : IGetMasterPersonData, IGetMasterPersonByID
    {
        private readonly ConnectionSettings _connection;
        private readonly ParamMasterPersonByIDModel _masterID;
        public AllEmployeeLogic(IOptions<ConnectionSettings> connection)
        {
            _connection = connection.Value;
           
        }
        public AllEmployeeLogic(IOptions<ConnectionSettings> connection,ParamMasterPersonByIDModel masterID)
        {
            _connection = connection.Value;
            _masterID = masterID;

        }
        async public Task<ReturnGetMasterPersonDataModel> GetMasterPersonData()
        {
            GetMasterPersonDataAccess accessData = new GetMasterPersonDataAccess(_connection);
            ReturnGetMasterPersonDataModel data = await accessData.GetMasterPersonData();

            for (var i = 0; i < data.MasterPersonList.Count; i++){
                StringBuilder fullName = new StringBuilder();
                fullName.Append(data.MasterPersonList[i].EmployeeNumber.ToUpper());
                fullName.Append(" ");
                fullName.Append(data.MasterPersonList[i].FirstName.ToUpper());
                fullName.Append(" ");
                fullName.Append(data.MasterPersonList[i].LastName.ToUpper());
                data.MasterPersonList[i].FullName = fullName.ToString();
            }

            return data;

        }

        async public Task<ReturnGetEmployeeDataByIDModel> GetMasterPersonByID()
        {
            GetEmployeeDataByIDDataAccess accessData = new GetEmployeeDataByIDDataAccess(_connection,_masterID);
            return await accessData.GetMasterPersonByID();
        }
    }
}
