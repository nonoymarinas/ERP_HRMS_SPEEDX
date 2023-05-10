using DataAccess;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddControllersWithViews();
builder.Services.Configure<ConnectionSettings>(builder.Configuration.GetSection("ConnectionStrings"));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Error");
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
	name: "default",

pattern: "{controller=Signin}/{action=LoginWindow}/{id?}");
//pattern: "{controller=Demo}/{action=SVGDemo1}/{id?}");
//pattern: "{controller=Demo}/{action=spinner}/{id?}");

app.Run();
