using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThatsMe.ApiVS.Helpers;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Data
{
    public class ThatsMeRepo : IThatsMeRepo
    {
        private readonly DataContext _context;

        public ThatsMeRepo(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delet<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int id, int recipientId)
        {
            var like = await _context.Likes.FirstOrDefaultAsync(k => k.LikerId == id && k.LikeeId == recipientId);
            return like;
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            return await _context.Photos.Where(p => p.UserId == userId).FirstOrDefaultAsync(p => p.IsMain) ; 
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PageList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(u => u.Photos).OrderByDescending(u => u.LastActive).AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);
            if (userParams.Gender != "all")
            {
                users = users.Where(u => u.Gender == userParams.Gender);
            }
            

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDoB = DateTime.Today.AddYears(-userParams.MaxAge -1);
                var maxDoB = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDoB && u.DateOfBirth <= maxDoB);
            }

            if (userParams.Likers)
            {
                var userLikers = await GetUserLike(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            if (userParams.Likees)
            {
                var userLikees = await GetUserLike(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch(userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.CreatedIn);
                        break;
                    default :
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PageList<User>.CreateAsync(users,userParams.PageNumber , userParams.PageSize); 
        }
        private async Task<IEnumerable<int>> GetUserLike(int id , bool liker)
        {
            var user = await _context.Users.Include(u => u.Likers).Include(u => u.Likees).FirstOrDefaultAsync(u => u.Id == id);

            if (liker)
            {
               return user.Likers.Where(k => k.LikeeId == id).Select(u => u.LikerId);
            }
            else
            {
                return user.Likees.Where(k => k.LikerId == id).Select(k => k.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return  await _context.SaveChangesAsync() > 0;
        }
    }
}
