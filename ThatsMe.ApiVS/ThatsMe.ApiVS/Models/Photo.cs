﻿using System;

namespace ThatsMe.ApiVS.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public string Description { get; set; }
        public DateTime AddedIn { get; set; }
        public bool IsMain { get; set; }
        //user can't be Null with cascade delete so if we remove user photos removed too
        public User User { get; set; }
        public int UserId { get; set; }

    }
}