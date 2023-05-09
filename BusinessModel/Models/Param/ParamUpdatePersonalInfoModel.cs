using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel
{
	public class ParamUpdatePersonalInfoModel
	{
		public int MasterPersonID { get; set; }
		public string? PropertyName { get; set; }
		public string? PropertyValue { get; set; }
		
	}
}
