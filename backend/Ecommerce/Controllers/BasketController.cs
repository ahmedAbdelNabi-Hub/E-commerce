using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using EcommerceContract.ErrorResponses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Controllers
{
    public class BasketController : BaseController
    {
        private IBasketRepository _basketRepository;
        public BasketController(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;
        }

        // get the basket 
        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasket(string id)
        {
            var Baskets = await _basketRepository.GetBasketAsync(id);
            return Baskets == null ? new CustomerBasket(id) : Baskets;
        }

        [HttpPut]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdateBasket(CustomerBasket basket)
        {

            var CreateOrUpdateBasket = await _basketRepository.UpdateBasketAsync(basket);
            return CreateOrUpdateBasket == null ? BadRequest(new BaseApiResponse(StatusCodes.Status400BadRequest)) : Ok(CreateOrUpdateBasket);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteBasket(string id)
        {
            var result = await _basketRepository.DeleteBasketAsync(id);
            return result ? Ok(true) : NotFound(new BaseApiResponse(StatusCodes.Status404NotFound));
        }

    }
}

