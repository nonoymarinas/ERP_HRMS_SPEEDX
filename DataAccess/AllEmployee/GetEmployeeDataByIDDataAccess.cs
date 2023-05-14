using Microsoft.Data.SqlClient;
using System.Data;
using BusinessModel;

namespace DataAccess
{
    public class GetEmployeeDataByIDDataAccess : IGetMasterPersonByID
    {
        private readonly ConnectionSettings _connection;
        private readonly ParamMasterPersonByIDModel _masterID;

        public GetEmployeeDataByIDDataAccess(ConnectionSettings connection, ParamMasterPersonByIDModel masterID)
        {
            _connection = connection;
            _masterID = masterID;
        }

        async public Task<ReturnGetEmployeeDataByIDModel> GetMasterPersonByID()
        {
            ReturnGetEmployeeDataByIDModel returnData = new();


            using (SqlConnection conn = new SqlConnection(_connection.SQLString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "[speedx.hrms.master].spGetSearchEmployeeByID";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@MasterPersonID", SqlDbType.Int));
                    cmd.Parameters["@MasterPersonID"].Value = _masterID.MasterPersonID;

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        //Check for errors and if true, retreive the error message!

                        if (reader.GetSchemaTable().Rows[0].ItemArray[0]?.ToString() == "ErrorMessage")
                        {
                            if (reader.HasRows)
                            {
                                reader.Read();
                                returnData.HasError = true;
                                returnData.ErrorMessage = reader["ErrorMessage"].ToString();
                            }
                        }
                        else
                        {

                            if (reader.HasRows)
                            {
                                reader.Read();
                                PersonalInformationModel personalInfo = new PersonalInformationModel()
                                {
                                    MasterPersonID = Convert.ToInt32(reader["MasterPersonID"]),
                                    EmployeeNumber = reader["EmployeeNumber"].ToString(),
                                    FirstName = reader["FirstName"].ToString(),
                                    MiddleName = reader["MiddleName"].ToString(),
                                    LastName = reader["LastName"].ToString(),
                                    DateOfBirth = reader["DateOfBirth"].ToString(),
                                };

                                returnData.PersonalInfo = personalInfo;
                            }
                            reader.NextResult();
                            if (reader.HasRows)
                            {
                                reader.Read();
                                WorkersBenifitsModel workersBenifits = new WorkersBenifitsModel()
                                {
                                    UMIDNumber = reader["UMIDNumber"].ToString(),
                                    SSSNumber = reader["SSSNumber"].ToString(),
                                    PagIbigNumber = reader["PagIbigNumber"].ToString(),
                                    PhilHealthNumber = reader["PhilHealthNumber"].ToString(),
                                };

                                returnData.Benifits = workersBenifits;
                            }
                            reader.NextResult();
                            if (reader.HasRows)
                            {
                                reader.Read();
                                WorkersContactsModel workersContacts = new WorkersContactsModel()
                                {
                                    MobileNumber = reader["MobileNumber"].ToString(),
                                    LandLineNumber = reader["LandLineNumber"].ToString(),
                                    EmailAddress = reader["EmailAddress"].ToString()
                                };

                                returnData.Contacts = workersContacts;
                            }

                            reader.NextResult();
                            if (reader.HasRows)
                            {
                                reader.Read();
                                WorkersCompensationModel workersCompensation = new WorkersCompensationModel()
                                {
                                    BasicSalary = Convert.ToDecimal(reader["BasicSalary"]),
                                    Allowance = Convert.ToDecimal(reader["Allowance"]),
                                    CurrencyID = Convert.ToInt32(reader["CurrencyID"]),
                                    RatePeriodID = Convert.ToInt32(reader["RatePeriodID"]),
                                    IsSalaryFixed = Convert.ToInt32(reader["IsSalaryFixed"]),
                                    HourPerDay = Convert.ToInt32(reader["HourPerDay"]),
                                    DayPerMonth = Convert.ToInt32(reader["DayPerMonth"]),
                                };

                                returnData.Compensation = workersCompensation;
                            }

                            reader.NextResult();
                            if (reader.HasRows)
                            {
                                reader.Read();
                                returnData.StatusCodeNumber = Convert.ToInt32(reader["StatusCodeNumber"]);
                            }

                        }
                    }
                }
            }
            return returnData;
        }
    }
}




