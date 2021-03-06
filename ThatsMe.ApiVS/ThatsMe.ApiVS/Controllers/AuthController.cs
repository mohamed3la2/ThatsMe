﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ThatsMe.ApiVS.Data;
using ThatsMe.ApiVS.DTO;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDTO registerUserDTO)
        {
         
            registerUserDTO.Username = registerUserDTO.Username.ToLower();
            if (await _repo.UserExists(registerUserDTO.Username))
                return BadRequest("Username Already Taken");

            var userForRegister = _mapper.Map<User>(registerUserDTO);
            await _repo.Register(userForRegister, registerUserDTO.Password);
            var usertoReturn = _mapper.Map<UserForDetailedDTO>(userForRegister);

            return CreatedAtRoute("GetUser", new { controller = "Users", id = userForRegister.Id }, usertoReturn);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginUserDTO loginUserDTO)
        {
            var user = await _repo.Login(loginUserDTO.Username.ToLower(),loginUserDTO.Password);
            if (user == null)
               // return Unauthorized();
                return StatusCode(401, "Wrong Username or Password");
            var claims = new[]
            {
              new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
              new Claim(ClaimTypes.Name,user.Username)
              
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.    
                UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires =  DateTime.Now.AddDays(1),
                SigningCredentials = cred
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var userForReturn = _mapper.Map<UserForListDTO>(user);
            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                userForReturn
            }) ;

        }
    }
}