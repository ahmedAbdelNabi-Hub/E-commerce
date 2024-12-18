﻿using Ecommerce.Contracts;
using Ecommerce.Contracts.DTOs.Authentication;
using Ecommerce.Contracts.Interfaces;
using Ecommerce.core.Entities.identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.service
{
    public class JwtService : IJwtService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JwtConfig _jwt;

        public JwtService(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IOptions<JwtConfig> jwt)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwt = jwt.Value;
        }
        public async Task<AuthResponse> CreateJwtToken(AppUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            var roleClaims = new List<Claim>();

            foreach (var role in roles)
            {
                roleClaims.Add(new Claim("roles", role));
            }

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim("uid", user.Id)
    }
            .Union(userClaims)
            .Union(roleClaims);

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            // Set expiration time
            var expiration = DateTime.UtcNow.AddMinutes(_jwt.Expiration);

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: expiration,  // Use the calculated expiration time here
                signingCredentials: signingCredentials);

            var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            // Return the AuthResponse with the token and expiration
            return new AuthResponse
            {
                Token = token,
                Expiration = expiration,  // Pass the expiration time in the response
                RefreshToken = "Empty",
                statusCode = 200,
                massage= "successful"

            };
        }


        public Task<string> GenerateRefreshToken()
        {
            throw new NotImplementedException();
        }
    }
}
