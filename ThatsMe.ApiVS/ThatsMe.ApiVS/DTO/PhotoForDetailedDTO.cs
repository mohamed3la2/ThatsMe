using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ThatsMe.ApiVS.DTO
{
    public class PhotoForDetailedDTO
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime AddedIn { get; set; }
        public bool IsMain { get; set; }
    }
}
