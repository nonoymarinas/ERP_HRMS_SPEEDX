using Microsoft.Data.SqlClient;
using System.Data;
using BusinessModel;

namespace DataAccess
{
	public class SaveCompensationDataAccess : ISaveCompensation
	{
		private readonly ConnectionSettings _connection;
		private readonly ParamCompensationModel _compensation;

		public SaveCompensationDataAccess(ConnectionSettings connection, ParamCompensationModel compensation)
		{
			_connection = connection;
			_compensation = compensation;
		}

       
		async public Task<ReturnSaveCompensationModel> SaveCompensation()
		{
			ReturnSaveCompensationModel dataModel = new();

			using (SqlConnection conn = new SqlConnection(_connection.SQLString))
			{
				conn.Open();
				using (SqlCommand cmd = new SqlCommand())
				{
					cmd.Connection = conn;
					cmd.CommandText = "[speedx.hrms.compensation].[spSaveCompensation]";
					cmd.CommandType = CommandType.StoredProcedure;

					cmd.Parameters.Add(new SqlParameter("@MasterPersonID", SqlDbType.Int));
					cmd.Parameters["@MasterPersonID"].Value = _compensation.MasterPersonID;

					cmd.Parameters.Add(new SqlParameter("@RatePeriodID", SqlDbType.Int));
					cmd.Parameters["@RatePeriodID"].Value = _compensation.RatePeriodID;

					cmd.Parameters.Add(new SqlParameter("@IsSalaryFixed", SqlDbType.Int));
					cmd.Parameters["@IsSalaryFixed"].Value = _compensation.IsSalaryFixed;

					cmd.Parameters.Add(new SqlParameter("@CurrencyID", SqlDbType.Int));
					cmd.Parameters["@CurrencyID"].Value = _compensation.CurrencyID;

					cmd.Parameters.Add(new SqlParameter("@HourPerDay", SqlDbType.Int));
					cmd.Parameters["@HourPerDay"].Value = _compensation.HourPerDay;

					cmd.Parameters.Add(new SqlParameter("@DayPerMonth", SqlDbType.Int));
					cmd.Parameters["@DayPerMonth"].Value = _compensation.DayPerMonth;

					cmd.Parameters.Add(new SqlParameter("@BasicSalary", SqlDbType.Decimal));
					cmd.Parameters["@BasicSalary"].Value = _compensation.BasicSalary;

					cmd.Parameters.Add(new SqlParameter("@Allowance", SqlDbType.Decimal));
					cmd.Parameters["@Allowance"].Value = _compensation.Allowance;


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
								dataModel.RatePeriodID = Convert.ToInt32(reader["RatePeriodID"]);
								dataModel.IsSalaryFixed = Convert.ToInt32(reader["IsSalaryFixed"]);
								dataModel.CurrencyID = Convert.ToInt32(reader["CurrencyID"]);
								dataModel.HourPerDay = Convert.ToInt32(reader["HourPerDay"]);
								dataModel.DayPerMonth = Convert.ToInt32(reader["DayPerMonth"]);
								dataModel.BasicSalary = Convert.ToDecimal(reader["BasicSalary"]);
								dataModel.Allowance = Convert.ToDecimal(reader["Allowance"]);
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




