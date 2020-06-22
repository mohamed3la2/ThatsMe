using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Data
{
    public class Seed
    {
        public static void SeedData(DataContext context)
        {
            if (!context.Users.Any()) {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach(var user in users)
                {
                    byte[] pwSalt, pwHash;
                    CreatePasswordHash("password", out pwHash, out pwSalt);
                    user.HashPassword = pwHash;
                    user.SaltPassword = pwSalt;
                    user.Username = user.Username.ToLower();
                    context.Users.Add(user);

                }
                context.SaveChanges();
            }
            
        }
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
