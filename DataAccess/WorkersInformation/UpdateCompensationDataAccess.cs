using Microsoft.Data.SqlClient;
using System.Data;
using BusinessModel;

namespace DataAccess
{
	public class UpdateCompensationDataAccess : IUpdateCompensation
    {
		private readonly ConnectionSettings _connection;
		private readonly ParamUpdateCompensationModel? _compensation;

		public UpdateCompensationDataAccess(ConnectionSettings connection, ParamUpdateCompensationModel? compensation)
		{
			_connection = connection;
            _compensation = compensation;
		}

        async public Task<ReturnUpdateCompensationModel> UpdateCompensation()
        {
            ReturnUpdateCompensationModel dataModel = new();

            using (SqlConnection conn = new SqlConnection(_connection.SQLString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "[speedx.hrms.compensation].[spUpdateCompensation]";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@MasterPersonID", SqlDbType.Int));
                    cmd.Parameters["@MasterPersonID"].Value = _compensation?.MasterPersonID;

                    cmd.Parameters.Add(new SqlParameter("@PropertyName", SqlDbType.NVarChar));
                    cmd.Parameters["@PropertyName"].Value = _compensation?.PropertyName;

                    cmd.Parameters.Add(new SqlParameter("@PropertyValue", SqlDbType.NVarChar));
                    cmd.Parameters["@PropertyValue"].Value = _compensation?.PropertyValue;

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
                                dataModel.PropertyName = reader["PropertyName"].ToString();
                                dataModel.PropertyValue = reader["PropertyValue"].ToString();
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




