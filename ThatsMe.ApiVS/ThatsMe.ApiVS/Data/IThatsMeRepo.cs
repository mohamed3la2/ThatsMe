using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThatsMe.ApiVS.Helpers;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Data
{
    public interface IThatsMeRepo
    {
        void Add<T>(T entity) where T : class;
        void Delet<T>(T entity) where T : class;
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<PageList<User>> GetUsers(UserParams userParams);
        Task<Photo> GetMainPhoto(int userId);
        Task<Like> GetLike(int id, int recipientId);
        Task<bool> SaveAll();

        Task<Message> GetMessage(int id);
        Task<PageList<Message>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
    }
}
