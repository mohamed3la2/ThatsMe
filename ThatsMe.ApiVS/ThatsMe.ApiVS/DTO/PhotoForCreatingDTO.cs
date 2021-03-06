﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ThatsMe.ApiVS.DTO
{
    public class PhotoForCreatingDTO
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string PublicId { get; set; }
        public string Description { get; set; }
        public DateTime AddedIn { get; set; }

        public PhotoForCreatingDTO()
        {
            AddedIn = DateTime.Now; 
        }
    }
}
