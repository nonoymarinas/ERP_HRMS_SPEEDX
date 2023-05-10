using Microsoft.Data.SqlClient;
using System.Data;
using BusinessModel;

namespace DataAccess
{
	public class SaveBenifitsDataAccess : ISaveBenifits
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamBenifitsModel? _benifits;

		public SaveBenifitsDataAccess(ConnectionSettings connection, ParamBenifitsModel? benifits)
		{
			_connection = connection;
			_benifits = benifits;
		}


		async public Task<ReturnSaveBenifitsModel> SaveBenifits()
		{
			ReturnSaveBenifitsModel dataModel = new();

			using (SqlConnection conn = new SqlConnection(_connection.SQLString))
			{
				conn.Open();
				using (SqlCommand cmd = new SqlCommand())
				{
					cmd.Connection = conn;
					cmd.CommandText = "[speedx.hrms.benifits].[spSaveBenifits]";
					cmd.CommandType = CommandType.StoredProcedure;

					cmd.Parameters.Add(new SqlParameter("@MasterPersonID", SqlDbType.Int));
					cmd.Parameters["@MasterPersonID"].Value = _benifits.MasterPersonID;


					cmd.Parameters.Add(new SqlParameter("@UMIDNumber", SqlDbType.NVarChar));
					cmd.Parameters["@UMIDNumber"].Value = _benifits.UMIDNumber;

					cmd.Parameters.Add(new SqlParameter("@SSSNumber", SqlDbType.NVarChar));
					cmd.Parameters["@SSSNumber"].Value = _benifits.SSSNumber;

					cmd.Parameters.Add(new SqlParameter("@PagIbigNumber", SqlDbType.NVarChar));
					cmd.Parameters["@PagibIgNumber"].Value = _benifits.PagIbigNumber;

					cmd.Parameters.Add(new SqlParameter("@PhilHealthNumber", SqlDbType.NVarChar));
					cmd.Parameters["@PhilHealthNumber"].Value = _benifits.PhilHealthNumber;

					
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
								dataModel.UMIDNumber = reader["UMIDNumber"].ToString();
								dataModel.SSSNumber = reader["SSSNumber"].ToString();
								dataModel.PagIbigNumber = reader["PagibigNumber"].ToString();
								dataModel.PhilHealthNumber = reader["PhilhealthNumber"].ToString();
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




