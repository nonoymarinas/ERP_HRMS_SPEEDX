using Microsoft.Data.SqlClient;
using System.Data;
using BusinessModel;

namespace DataAccess
{
	public class SavePersonalInformationDataAccess: ISavePersonalInfo
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamPersonalInfoModel? _personalInfo;

		public SavePersonalInformationDataAccess(ConnectionSettings connection, ParamPersonalInfoModel? personalInfo)
		{
			_connection = connection;
			_personalInfo= personalInfo;
		}


		async public Task<ReturnSavePersonalInfoModels> SavePersonalInfo()
		{
			ReturnSavePersonalInfoModels dataModel = new();

			using (SqlConnection conn = new SqlConnection(_connection.SQLString))
			{
				conn.Open();
				using (SqlCommand cmd = new SqlCommand())
				{
					cmd.Connection = conn;
					cmd.CommandText = "[speedx.hrms.master].[spSavePersonalInformation]";
					cmd.CommandType = CommandType.StoredProcedure;

					cmd.Parameters.Add(new SqlParameter("@FirstName", SqlDbType.NVarChar));
					cmd.Parameters["@FirstName"].Value = _personalInfo.FirstName;

					cmd.Parameters.Add(new SqlParameter("@MiddleName", SqlDbType.NVarChar));
					cmd.Parameters["@MiddleName"].Value = _personalInfo.MiddleName;

					cmd.Parameters.Add(new SqlParameter("@LastName", SqlDbType.NVarChar));
					cmd.Parameters["@LastName"].Value = _personalInfo.LastName;

					cmd.Parameters.Add(new SqlParameter("@DateOfBirth", SqlDbType.Date));
					cmd.Parameters["@DateOfBirth"].Value = _personalInfo.DateOfBirth;

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
								dataModel.EmployeeNumber = reader["EmployeeNumber"].ToString();
								dataModel.FirstName = reader["FirstName"].ToString();
								dataModel.MiddleName = reader["MiddleName"].ToString();
								dataModel.LastName = reader["LastName"].ToString();
								dataModel.DateOfBirth = reader["DateOfBirth"].ToString();
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




