using Microsoft.Data.SqlClient;
using System.Data;
using BusinessModel;

namespace DataAccess
{
	public class SaveContactsDataAccess : ISaveContacts
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamContactModel? _contacts;

		public SaveContactsDataAccess(ConnectionSettings connection, ParamContactModel? contacts)
		{
			_connection = connection;
			_contacts = contacts;
		}


        async public Task<ReturnSaveContactModel> SaveContacts()
        {
			ReturnSaveContactModel dataModel = new();

			using (SqlConnection conn = new SqlConnection(_connection.SQLString))
			{
				conn.Open();
				using (SqlCommand cmd = new SqlCommand())
				{
					cmd.Connection = conn;
					cmd.CommandText = "[speedx.hrms.contacts].[spSaveContacts]";
					cmd.CommandType = CommandType.StoredProcedure;

					cmd.Parameters.Add(new SqlParameter("@MasterPersonID", SqlDbType.Int));
					cmd.Parameters["@MasterPersonID"].Value = _contacts.MasterPersonID;

					cmd.Parameters.Add(new SqlParameter("@MobileNumber", SqlDbType.NVarChar));
					cmd.Parameters["@MobileNumber"].Value = _contacts.MobileNumber;

					cmd.Parameters.Add(new SqlParameter("@LandlineNumber", SqlDbType.NVarChar));
					cmd.Parameters["@LandlineNumber"].Value = _contacts.LandLineNumber;

					cmd.Parameters.Add(new SqlParameter("@EmailAddress", SqlDbType.NVarChar));
					cmd.Parameters["@EmailAddress"].Value = _contacts.EmailAddress;


					using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
					{
						//Check for errors and if true, retreive the error message!

						if (reader.GetSchemaTable().Rows[0].ItemArray[0]?.ToString() == "ErrorMessage")
						{
							if (reader.HasRows)
							{
								reader.Read();
								dataModel.HasError = true;
								dataModel.ErrorMessage = reader["ErrorMessage"].ToString();
							}
						}
						else
						{
							if (reader.HasRows)
							{
								reader.Read();
								dataModel.MasterPersonID = Convert.ToInt32(reader["MasterPersonID"]);
								dataModel.MobileNumber = reader["MobileNumber"].ToString();
								dataModel.LandLineNumber = reader["LandlineNumber"].ToString();
								dataModel.EmailAddress = reader["EmailAddress"].ToString();
								dataModel.StatusCodeNumber = Convert.ToInt32(reader["StatusCodenumber"]);
							}

						}
					}
				}
			}
			return dataModel;
		}
    }
}




