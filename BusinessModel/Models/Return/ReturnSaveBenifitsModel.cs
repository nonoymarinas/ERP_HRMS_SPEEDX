using BusinessModel.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel
{
	public class ReturnSaveBenifitsModel : DBStandardReturn
	{
		public int MasterPersonID { get; set; }
		public string? UMIDNumber { get; set; }
		public string? SSSNumber { get; set; }
		public string? PagIbigNumber { get; set; }
		public string? PhilHealthNumber { get; set; }
	}
}
