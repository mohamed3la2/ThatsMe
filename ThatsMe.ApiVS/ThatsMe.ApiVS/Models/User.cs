using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ThatsMe.ApiVS.Models
{
    public class User
    {
        public int Id { get; set; }
        public String Username { get; set; }
        public byte[] HashPassword { get; set; }
        public byte[] SaltPassword { get; set; }
    }
}
