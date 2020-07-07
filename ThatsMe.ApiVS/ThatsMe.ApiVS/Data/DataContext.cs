using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThatsMe.ApiVS.Models;

namespace ThatsMe.ApiVS.Data
{
    public class DataContext:DbContext
    { 
        //Entities
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }

        public DataContext(DbContextOptions<DataContext> option):base(option)
        {       
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Like>().HasKey(k => new { k.LikerId, k.LikeeId });

            builder.Entity<Like>().HasOne(k => k.Liker).WithMany(u => u.Likees)
                .HasForeignKey(k => k.LikerId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Like>().HasOne(k => k.Likee).WithMany(u => u.Likers)
                .HasForeignKey(k => k.LikeeId).OnDelete(DeleteBehavior.Restrict);
        }

    }
}
