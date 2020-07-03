using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ThatsMe.ApiVS.DTO
{
    public class RegisterUserDTO
    {
        [Required]
        public String Username { get; set; }

        [Required]
        [StringLength(8,MinimumLength = 4 ,ErrorMessage ="Password must contain 4 to 8 characters")]
        public String Password { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        public DateTime DateOfBirth { get; set; }

        public DateTime CreatedIn { get; set; }
        public DateTime LastActive { get; set; }
        public RegisterUserDTO()
        {
            CreatedIn = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}
