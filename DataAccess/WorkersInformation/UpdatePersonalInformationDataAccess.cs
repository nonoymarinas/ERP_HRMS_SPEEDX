using Microsoft.Data.SqlClient;
using System.Data;
using BusinessModel;

namespace DataAccess
{
	public class UpdatePersonalInformationDataAccess: IUpdatePersonalInfo
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamUpdatePersonalInfoModel? _personalInfo;

		public UpdatePersonalInformationDataAccess(ConnectionSettings connection, ParamUpdatePersonalInfoModel? personalInfo)
		{
			_connection = connection;
			_personalInfo= personalInfo;
		}


		async public Task<ReturnUpdatePersonalInfoModels> UpdatePersonalInfo()
		{
			ReturnUpdatePersonalInfoModels dataModel = new();

			using (SqlConnection conn = new SqlConnection(_connection.SQLString))
			{
				conn.Open();
				using (SqlCommand cmd = new SqlCommand())
				{
					cmd.Connection = conn;
					cmd.CommandText = "[speedx.hrms.master].[spUpdatePersonalInformation]";
					cmd.CommandType = CommandType.StoredProcedure;

					cmd.Parameters.Add(new SqlParameter("@MasterPersonID", SqlDbType.Int));
					cmd.Parameters["@MasterPersonID"].Value = _personalInfo.MasterPersonID;

					cmd.Parameters.Add(new SqlParameter("@PropertyName", SqlDbType.NVarChar));
					cmd.Parameters["@PropertyName"].Value = _personalInfo.PropertyName;

					cmd.Parameters.Add(new SqlParameter("@PropertyValue", SqlDbType.NVarChar));
					cmd.Parameters["@PropertyValue"].Value = _personalInfo.PropertyValue;

					
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
								dataModel.PropertyValue = reader["PropertyValue"].ToString();
								dataModel.PropertyName = reader["PropertyName"].ToString();
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




