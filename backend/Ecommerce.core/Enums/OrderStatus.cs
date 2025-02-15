using System.Runtime.Serialization;

public enum OrderStatus
{
    [EnumMember(Value = "Pending")]
    Pending, // Awaiting processing

    [EnumMember(Value = "Completed")]
    Completed, // Order finalized

    [EnumMember(Value = "Canceled")]
    Canceled, // Canceled before shipping

    [EnumMember(Value = "Failed")]
    Failed, // Payment failed

    [EnumMember(Value = "Returned")]
    Returned, // Customer returned the order

    [EnumMember(Value = "Awaiting Payment")]
    AwaitingPayment, // Waiting for payment

}
