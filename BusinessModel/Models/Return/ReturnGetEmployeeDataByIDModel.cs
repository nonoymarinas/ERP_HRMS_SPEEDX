using BusinessModel.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel
{
	public class ReturnGetEmployeeDataByIDModel : DBStandardReturn
	{
		public PersonalInformationModel? PersonalInfo { get; set; }
		public WorkersBenifitsModel? Benifits { get; set; }
		public WorkersContactsModel? Contacts { get; set; }
		public WorkersCompensationModel? Compensation { get; set; }
	}
}
