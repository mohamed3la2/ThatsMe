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
    }
}
