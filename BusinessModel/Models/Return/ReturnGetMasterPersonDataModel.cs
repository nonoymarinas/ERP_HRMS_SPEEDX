using BusinessModel.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel
{
	public class ReturnGetMasterPersonDataModel : DBStandardReturn
	{
		public List<MasterPersonData>? MasterPersonList { get; set; }
	}
}
