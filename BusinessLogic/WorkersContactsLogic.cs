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
	public class WorkersContactsLogic : ISaveContacts,IUpdateContacts
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamContactModel? _contacts;
        private readonly ParamUpdateContactsModel? _updateContacts;

        public WorkersContactsLogic(IOptions<ConnectionSettings> connection, ParamContactModel contacts)
		{
			_connection = connection.Value;
			_contacts = contacts;
		}
        public WorkersContactsLogic(IOptions<ConnectionSettings> connection, ParamUpdateContactsModel updateContacts)
        {
            _connection = connection.Value;
            _updateContacts = updateContacts;
        }
        async public Task<ReturnSaveContactModel> SaveContacts()
		{
			SaveContactsDataAccess dataAccessData = new(_connection, _contacts);
			return await dataAccessData.SaveContacts();
		}

        async public Task<ReturnUpdateContactModel> UpdateContacts()
        {
			UpdateContactsDataAccess dataAccessData = new(_connection, _updateContacts);
			return await dataAccessData.UpdateContacts();
		}
    }
}
