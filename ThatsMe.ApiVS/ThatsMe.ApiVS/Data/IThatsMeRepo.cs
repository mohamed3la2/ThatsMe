using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Data
{
    public interface IThatsMeRepo
    {
        void Add<T>(T entity) where T : class;
        void Delet<T>(T entity) where T : class;
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<IEnumerable<User>> GetUsers();
        Task<Photo> GetMainPhoto(int userId);
        Task<bool> SaveAll();

    }
}
