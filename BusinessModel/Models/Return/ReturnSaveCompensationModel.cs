﻿using BusinessModel.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel
{
	public class ReturnSaveCompensationModel : DBStandardReturn
	{
		public int MasterPersonID { get; set; }
		public int RatePeriodID { get; set; }
		public int IsSalaryFixedID { get; set; }
		public int CurrencyID { get; set; }
		public int HourPerDay { get; set; }
		public int DayPerMonth { get; set; }
		public decimal BasicSalary { get; set; }
		public decimal Allowance { get; set; }
	}
}