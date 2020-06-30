using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ThatsMe.ApiVS.Data;
using ThatsMe.ApiVS.DTO;
using ThatsMe.ApiVS.Helpers;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IThatsMeRepo _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IThatsMeRepo repo , IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret);
            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("{id}",Name ="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);
            var photoForReturn = _mapper.Map<PhotoForReturnDTO>(photoFromRepo);
            return Ok(photoForReturn);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhoto(int userId, [FromForm]PhotoForCreatingDTO photoForCreating)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return StatusCode(401, "Unauthorize");

            var userFromRepo = await _repo.GetUser(userId);
            var file = photoForCreating.File;
            var uploadResult = new ImageUploadResult();

             if (file == null)
               return BadRequest();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParam = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(450).Height(450).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParam);
                }
            }
            else if (file == null)
                return BadRequest();
             
            photoForCreating.Url = uploadResult.Uri.ToString();
            photoForCreating.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreating);    
            
            if (!userFromRepo.Photos.Any())
            {
                photo.IsMain = true;
            }
            userFromRepo.Photos.Add(photo);
            


            if (await _repo.SaveAll())
            {
                var photoForReturn = _mapper.Map<PhotoForReturnDTO>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoForReturn);
            }
            return BadRequest("Could not add photo");

        }
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return StatusCode(401, "Unauthorized");
            }
            var userFromRepo = await _repo.GetUser(userId);

            if(!userFromRepo.Photos.Any(p => p.Id == id))
            {
                return StatusCode(401, "Unauthorized");
            }
            var photoFromRepo = userFromRepo.Photos.FirstOrDefault(p => p.Id == id);

            if (photoFromRepo.IsMain)
            {
                return BadRequest("this Photo is the main ");
            }
            else
            {
                var mainPhoto = await _repo.GetMainPhoto(userId);
                mainPhoto.IsMain = false;
                photoFromRepo.IsMain = true;
                if (await _repo.SaveAll())
                    return NoContent();
                else
                    return BadRequest("couldn't set this photo to main ");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return StatusCode(401, "Unauthorized");
            }
            var userFromRepo = await _repo.GetUser(userId);

            if (!userFromRepo.Photos.Any(p => p.Id == id))
            {
                return StatusCode(401, "Unauthorized");
            }
            var photoFromRepo = userFromRepo.Photos.FirstOrDefault(p => p.Id == id);

            if (photoFromRepo.IsMain)
            {
                return BadRequest("You cannot delete Your main photo ");
            }

            if (photoFromRepo.PublicId != null)
            {
               var deleteParams = new DeletionParams(photoFromRepo.PublicId);
               var result = _cloudinary.Destroy(deleteParams);
                if (result.Result == "ok")
                {
                   _repo.Delet(photoFromRepo);
                }
               
            }
            if (photoFromRepo.PublicId == null)
            {
                _repo.Delet(photoFromRepo);
            }
            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to Delete this Photo");
        }
    }
}