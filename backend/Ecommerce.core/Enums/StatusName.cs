using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.core.Enums
{
    public enum StatusName
    {
        NewArrival,        // Recently added products
        InStock,           // Products available for immediate purchase
        OutOfStock,        // Products currently unavailable
        ComingSoon,        // Products that will be available soon
        PreOrder,          // Products available for order before their release
        Backordered,       // Products that are temporarily out of stock but can be ordered
        LimitedEdition,    // Products available in limited quantities
        Seasonal,          // Products available only during specific seasons
        Discontinued,      // Products that are no longer being produced
        Featured,          // Highlighted products for marketing purposes
        BestSeller,        // Popular products with high sales volume
        OnSale,            // Products currently discounted
        Exclusive,         // Products available only to specific customers or members
        Recommended,       // Products suggested based on user preferences
        Clearance,         // Products on clearance sale
        GiftItem           // Products that are ideal for gifting
    }

}
