using BusinessModel.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel
{
	public class ReturnUpdateContactModel : DBStandardReturn
	{
		public int MasterPersonID { get; set; }
		public string? MobileNumber { get; set; }
		public string? LandlineNumber { get; set; }
		public string? EmailAddress { get; set; }
	}
}
