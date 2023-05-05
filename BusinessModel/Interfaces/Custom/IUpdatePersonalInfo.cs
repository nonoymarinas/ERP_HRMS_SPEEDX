using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel
{
	public interface IUpdatePersonalInfo
	{
		public Task<ReturnUpdatePersonalInfoModels> UpdatePersonalInfo();
	}
}
