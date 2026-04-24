using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions <AppDbContext> options)
    : base(options){}
    public DbSet<Game> Games{get;set;}
    public DbSet<WishListItem> WishList{get;set;}
}