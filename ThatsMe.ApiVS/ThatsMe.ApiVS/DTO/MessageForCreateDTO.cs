using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ThatsMe.ApiVS.DTO
{
    public class MessageForCreateDTO
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; }
        public MessageForCreateDTO()
        {
            MessageSent = DateTime.Now;
        }
    }
}
