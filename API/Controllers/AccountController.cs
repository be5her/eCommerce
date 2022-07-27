
namespace API.Controllers;
public class AccountController : BaseApiController
{
    private readonly UserManager<User> _userManger;
    private readonly TokenService _tokenService;
    private readonly StoreContext _context;
    private readonly IEmailService _mailService;
    private readonly IConfiguration _config;
    private readonly IWebHostEnvironment _hostingEnv;

    public AccountController(UserManager<User> userManger,
                             TokenService tokenService,
                             StoreContext context,
                             IEmailService mailService,
                             IConfiguration config,
                             IWebHostEnvironment hostingEnv)
    {
        _tokenService = tokenService;
        _context = context;
        _mailService = mailService;
        _config = config;
        _hostingEnv = hostingEnv;
        _userManger = userManger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManger.FindByNameAsync(loginDto.Username);
        if (user == null || !await _userManger.CheckPasswordAsync(user, loginDto.Password))
        {
            return Unauthorized();
        }
        if (!user.EmailConfirmed)
        {
            return BadRequest(new ProblemDetails { Title = "Your Email is not confirmed check your email for confirmation link" });
        }
        var userBasket = await RetrieveBasket(loginDto.Username);
        var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);
        if (anonBasket != null)
        {
            if (userBasket != null) _context.Baskets.Remove(userBasket);
            anonBasket.BuyerId = user.UserName;
            Response.Cookies.Delete("buyerId");
            await _context.SaveChangesAsync();
        }
        return new UserDto
        {
            Email = user.Email,
            Token = await _tokenService.GenerateToken(user),
            Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
        };
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var user = new User { UserName = registerDto.Username, Email = registerDto.Email };

        var result = await _userManger.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        await _userManger.AddToRoleAsync(user, "Member");

        await SendConfirmationEmail(user.Email, user.UserName, user.Id);

        return StatusCode(201);
    }

    [Authorize]
    [HttpGet("currentUser")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await _userManger.FindByNameAsync(User.Identity.Name);
        var userBasket = await RetrieveBasket(User.Identity.Name);

        return new UserDto
        {
            Email = user.Email,
            Token = await _tokenService.GenerateToken(user),
            Basket = userBasket?.MapBasketToDto()
        };
    }

    [Authorize]
    [HttpGet("savedAddress")]
    public async Task<ActionResult<UserAddress>> GetSavedAddress()
    {
        return await _userManger.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(User => User.Address)
                .FirstOrDefaultAsync();
    }

    [HttpGet("tokenVerifier/{token}")]
    public async Task<ActionResult<UserDto>> TokenVerifier(string token)
    {
        var emailToken = await _context.EmailToken.FindAsync(Guid.Parse(token));
        if (emailToken == null || emailToken.ExpDate < DateTime.UtcNow)
        {
            return BadRequest(new ProblemDetails { Title = "Link is wrong or expired" });
        }
        _context.EmailToken.Remove(emailToken);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == emailToken.UserId);
        user.EmailConfirmed = true;
        await _context.SaveChangesAsync();

        var userBasket = await RetrieveBasket(user.UserName);
        var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);
        if (anonBasket != null)
        {
            if (userBasket != null) _context.Baskets.Remove(userBasket);
            anonBasket.BuyerId = user.UserName;
            Response.Cookies.Delete("buyerId");
            await _context.SaveChangesAsync();
        }
        return new UserDto
        {
            Email = user.Email,
            Token = await _tokenService.GenerateToken(user),
            Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
        };
    }

    private async Task<Basket> RetrieveBasket(string buyerId)
    {
        if (string.IsNullOrEmpty(buyerId))
        {
            Response.Cookies.Delete("buyerId");
            return null;
        }
        return await _context.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }

    private async Task SendConfirmationEmail(string toEmail, string toName, int userId)
    {
        var token = Guid.NewGuid();
        var emailToken = new EmailConfirmationToken
        {
            Token = token,
            ExpDate = DateTime.UtcNow.AddDays(1),
            UserId = userId
        };
        _context.EmailToken.Add(emailToken);
        await _context.SaveChangesAsync();
        var baseUrl = $"{Request.Scheme}://{Request.Host.Value}/";

        if (_hostingEnv.EnvironmentName == "Development")
        {
            baseUrl = _config["BaseUrl"];
        }

        var body = $"<h3>Use <a href='{baseUrl}tokenVerifier/{token}'>This link</a> to verify your account on Re-Store " +
                    "<br>This link is valid for 1 day <br>" +
                    "If you didn't sign up to Re-Store you can safely ignore this email</h3>";
        await _mailService.SendEmailAsync(toName, toEmail, "Email Confirmation", body, MimeKit.Text.TextFormat.Html);
    }

}

