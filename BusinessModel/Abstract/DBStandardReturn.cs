using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel.Abstract
{
    public class DBStandardReturn
    {
        public string? ErrorMessage { get; set; }
        public bool HasError { get; set; }
        public int StatusCodeNumber { get; set; }
    }
}
