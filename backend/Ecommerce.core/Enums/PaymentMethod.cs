using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Core.Enums
{
    public enum PaymentMethods
    {
        [EnumMember(Value = "CreditCard")]
        CreditCard, 

        [EnumMember(Value = "COD")]
        COD, 

        [EnumMember(Value = "paypal")]
        Paypal, 
    
    }
}
