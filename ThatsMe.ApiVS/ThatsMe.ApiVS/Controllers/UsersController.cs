using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ThatsMe.ApiVS.Data;
using ThatsMe.ApiVS.DTO;
using ThatsMe.ApiVS.Helpers;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IThatsMeRepo _repo;
        private readonly IMapper _mapper;

        public UsersController(IThatsMeRepo repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user = await _repo.GetUser(userId);
            userParams.UserId = userId;
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = user.Gender == "male" ? "female" : "male";
            }
            if (userParams.Gender == "all")
            {
                userParams.Gender = "all";
            }




            var users = await _repo.GetUsers(userParams);
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDTO>>(users);
            Response.AddPaginationHeaders(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDTO>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdate userForUpdate)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) //prevent the user editing another user info
            {
                return StatusCode(401, "UnAuthorized");
            }

            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(userForUpdate, userFromRepo);
            if (await _repo.SaveAll())
                return NoContent();
            throw new Exception("fail Updating request");
        }
        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult>LikeUser(int id, int recipientId)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return StatusCode(401, "Unauthorized");
            }
            if (await _repo.GetUser(recipientId) == null)
                return NotFound();

            var like = await _repo.GetLike(id, recipientId);
            if (like != null)
                return BadRequest("You already liked this user");

            like = new Like
            {
                LikerId =id,
                LikeeId = recipientId
            };
            _repo.Add<Like>(like);

            if (await _repo.SaveAll())
                return Ok();
            return BadRequest("Something went wrong");
        }
    }
}