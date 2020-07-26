using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ThatsMe.ApiVS.Data;
using ThatsMe.ApiVS.DTO;
using ThatsMe.ApiVS.Helpers;
using ThatsMe.ApiVS.Hubs;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IThatsMeRepo _repo;
        private readonly IMapper _mapper;
        private readonly IHubContext<MessageHub> _hubContext;

        public MessagesController(IThatsMeRepo repo, IMapper mapper,IHubContext<MessageHub> hubContext)
        {
            _repo = repo;
            _mapper = mapper;
            _hubContext = hubContext;
        }


        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessages(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return StatusCode(401, "Unauthorize");
            }
            var message = await _repo.GetMessage(id);
            if (message == null)
                return NotFound();

            return Ok(message);
        }
        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery]MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return StatusCode(401, "Unauthorize");
            }
            messageParams.UserId = userId;

            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);
            Response.AddPaginationHeaders(messagesFromRepo.CurrentPage, messagesFromRepo.PageSize, messagesFromRepo.TotalCount, messagesFromRepo.TotalPages);

            var messageToReturn = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messagesFromRepo);
            return Ok(messageToReturn);


        }
        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return StatusCode(401, "Unauthorize");

            if (await _repo.GetUser(recipientId) == null)
                return BadRequest("User doesn't exist anymore");

            var messagesThreadFromRepo = await _repo.GetMessageThread(userId, recipientId);
            messagesThreadFromRepo.Where(m => m.RecipientId == userId).ToList().ForEach(mm => mm.IsRead = true);
            messagesThreadFromRepo.Where(m => m.RecipientId == userId).ToList().ForEach(mm => mm.DateRead = DateTime.Now);
            var messagesThreadToReturn = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messagesThreadFromRepo);
           
            await _repo.SaveAll();
            return Ok(messagesThreadToReturn);

          

        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreateDTO messageForCreateDTO)
        {
            var sender = await _repo.GetUser(userId);
            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return StatusCode(401, "Unauthorize");
            }
            messageForCreateDTO.SenderId = userId;

            if (await _repo.GetUser(messageForCreateDTO.RecipientId) == null)
                return BadRequest("Recipient Isn't available");

            var message = _mapper.Map<Message>(messageForCreateDTO);

            _repo.Add(message);

            if (await _repo.SaveAll())
            {
                var messageToReturn = _mapper.Map<MessageToReturnDTO>(message);
                string connectionId; 
                if (ConnectedUser.UserConnectedList.TryGetValue(messageForCreateDTO.RecipientId, out connectionId))
                {
                    messageToReturn.IsRead = true;
                    await _hubContext.Clients.Client(connectionId).SendAsync("newmsg",messageToReturn);
                }
                return CreatedAtRoute("GetMessage", new { id = message.Id }, messageToReturn);
            }


            throw new Exception("Couldn't save Message");
        }
        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return StatusCode(401, "Unauthorize");
            }
            var message = await _repo.GetMessage(id);
            if (message == null)
                return NotFound("Message doesn't exist");
            if (message.SenderId == userId)
                message.SenderDeleted = true;
            if (message.RecipientId == userId)
                message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _repo.Delet(message);
            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception("Something went wrong while deleting MSGS");
        }
        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return StatusCode(401, "Unauthorize");
           
            var message = await _repo.GetMessage(id);
            if (message == null)
                return NotFound("Message doesn't exist");

            if (message.RecipientId != userId)
                return StatusCode(401, "Unauthorize");

            message.IsRead = true;
            message.DateRead = DateTime.Now;
            
            await _repo.SaveAll();
            return NoContent();
        } 
    }
}