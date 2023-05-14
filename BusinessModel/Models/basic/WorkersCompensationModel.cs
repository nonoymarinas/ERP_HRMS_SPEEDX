using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel
{
    public class WorkersCompensationModel
    {
        public decimal BasicSalary { get; set; } = 0;
        public decimal Allowance { get; set; } = 0;
        public int CurrencyID { get; set; } = 0;
        public int DayPerMonth { get; set; } = 0;
        public int HourPerDay { get; set; } = 0;
        public int IsSalaryFixed { get; set; } = 0;
        public int RatePeriodID { get; set; } = 0;
    }
}
