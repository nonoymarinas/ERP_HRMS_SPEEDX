using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessModel.Interfaces.Generics
{
    public interface IPostDatabaseData<T>
    {
         Task<T> PostDatabaseData();
    }
}
