using Ecommerce.Contracts.DTOs;
using Ecommerce.Contracts.Interfaces;
using Ecommerce.Contracts.ErrorResponses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.core.Entities.identity;
using EcommerceContract.ErrorResponses;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Contracts.DTOs.Role;
using Microsoft.AspNetCore.Authorization;

namespace Ecommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles ="Admin")]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;

        public RoleController(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BaseApiResponse>> CreateRole([FromBody] string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return BadRequest(new ErrorApiResponse(new Dictionary<string, IEnumerable<string>>
                {
                    { "RoleName", new[] { "Role name cannot be empty." } }
                }));
            }

            var roleExists = await _roleManager.RoleExistsAsync(roleName);
            if (roleExists)
            {
                return Conflict(new BaseApiResponse(StatusCodes.Status409Conflict, "Role already exists."));
            }

            var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
            return result.Succeeded
                ? Ok(new BaseApiResponse(StatusCodes.Status201Created, "Role created successfully."))
                : HandleErrors(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<string>>> GetAllRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            return Ok(roles.Select(role => new { id=role.Id,roleName=role.Name}).ToList());
        }

        [HttpGet("{roleId}")]
        public async Task<ActionResult<string>> GetRoleById(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            return role == null
                ? NotFound(new BaseApiResponse(404, "Role not found."))
                : Ok(role.Name);
        }

        [HttpPost("assignUser")]
        public async Task<ActionResult<BaseApiResponse>> AssignRoleToUser([FromBody] RoleRequestDto request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFound(new BaseApiResponse(404, "User not found."));
            }

            var result = await _userManager.AddToRoleAsync(user, request.RoleName);
            return result.Succeeded
                ? Ok(new BaseApiResponse(200, "Role assigned successfully."))
                : HandleErrors(result);
        }

        [HttpDelete("RemoveRoleFromUser")]
        public async Task<ActionResult<BaseApiResponse>> RemoveRoleFromUser([FromBody] RoleRequestDto request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFound(new BaseApiResponse(404, "User not found."));
            }

            var result = await _userManager.RemoveFromRoleAsync(user, request.RoleName);
            return result.Succeeded
                ? Ok(new BaseApiResponse(200, "Role removed successfully."))
                : HandleErrors(result);
        }

        [HttpDelete("{roleId}")]
        public async Task<ActionResult<BaseApiResponse>> DeleteRole(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
            {
                return NotFound(new BaseApiResponse(404, "Role not found."));
            }

            var result = await _roleManager.DeleteAsync(role);
            return result.Succeeded
                ? Ok(new BaseApiResponse(200, "Role deleted successfully."))
                : HandleErrors(result);
        }

        private ActionResult<BaseApiResponse> HandleErrors(IdentityResult result)
        {
            var errors = result.Errors
                .GroupBy(e => e.Code) 
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description)); 

            return BadRequest(new ErrorApiResponse(errors));
        }

    }


}
