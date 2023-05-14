using Microsoft.Data.SqlClient;
using System.Data;
using BusinessModel;

namespace DataAccess
{
    public class GetMasterPersonDataAccess : IGetMasterPersonData
    {
        private readonly ConnectionSettings _connection;

        public GetMasterPersonDataAccess(ConnectionSettings connection)
        {
            _connection = connection;
        }

        async public Task<ReturnGetMasterPersonDataModel> GetMasterPersonData()
        {
            ReturnGetMasterPersonDataModel data = new();
           List<MasterPersonData> dataList = new List<MasterPersonData>();

            using (SqlConnection conn = new SqlConnection(_connection.SQLString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "[speedx.hrms.master].[spGetAllCurrentCleanEmployee]";
                    cmd.CommandType = CommandType.StoredProcedure;


                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        //Check for errors and if true, retreive the error message!

                        if (reader.GetSchemaTable().Rows[0].ItemArray[0]?.ToString() == "ErrorMessage")
                        {
                            if (reader.HasRows)
                            {
                                reader.Read();
                                data.HasError = true;
                                data.ErrorMessage = reader["ErrorMessage"].ToString();
                            }
                        }
                        else
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    MasterPersonData? dataModel = new()
                                    {
                                        MasterPersonID = Convert.ToInt32(reader["MasterPersonID"]),
                                        EmployeeNumber = reader["EmployeeNumber"].ToString(),
                                        FirstName = reader["FirstName"].ToString(),
                                        MiddleName = reader["MiddleName"].ToString(),
                                        LastName = reader["LastName"].ToString()
                                    };

                                    dataList.Add(dataModel);
                                }

                                data.MasterPersonList = dataList;
                            }
                            reader.NextResult();
                            if (reader.HasRows)
                            {
                                reader.Read();
                                data.StatusCodeNumber = Convert.ToInt32(reader["StatusCodeNumber"]);
                            }

                        }
                    }
                }
            }
            return data;
        }
    }
}




