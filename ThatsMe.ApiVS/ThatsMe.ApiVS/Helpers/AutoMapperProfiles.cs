using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThatsMe.ApiVS.DTO;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDTO>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(
                    src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(
                    src => src.DateOfBirth.CalculateAge()));

            CreateMap<User, UserForDetailedDTO>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(
                    src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(
                    src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoForDetailedDTO>();

            CreateMap<UserForUpdate, User>();
            CreateMap<Photo,PhotoForReturnDTO>();
            CreateMap<PhotoForCreatingDTO,Photo>();
            CreateMap<RegisterUserDTO, User>();
        }
    }
}
