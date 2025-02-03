using AutoMapper;
using Ecommerce.Contracts.DTOs;

namespace Ecommerce.Helpers
{
    public class GroupingHelper
    {
        public static List<GroupByDto<TKey, TDto>> GroupEntitiesByKey<T, TKey, TDto>(
             IEnumerable<T> entities,
             Func<T, TKey> groupKeySelector,
             IMapper mapper)
        {
            return entities
                .GroupBy(groupKeySelector)
                .Select(group => new GroupByDto<TKey, TDto>
                {
                    Key = group.Key,
                    Items = group.Select(entity => mapper.Map<TDto>(entity)).Take(5).ToList() 
                })
                .ToList(); 
        }
    }
}
