﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Contracts.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreateCheckoutSessionAsync(int orderId);
    }
}
