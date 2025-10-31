import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AuthenticationMethod {
  id: string;
  title: string;
  description: string;
  implementation: string;
  securityLevel: 'basic' | 'intermediate' | 'advanced';
  pros: string[];
  cons: string[];
  codeExample: string;
  vulnerabilities: string[];
  mitigations: string[];
}

interface SecurityFeature {
  feature: string;
  description: string;
  implementation: string;
  codeExample: string;
  impact: string;
}

@Component({
  selector: 'app-access-dotnet-authentication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-dotnet-authentication.component.html',
  styleUrl: './access-dotnet-authentication.component.css'
})
export class AccessDotnetAuthenticationComponent {
  activeTab: string = 'identity';

  // Métodos de autenticación en .NET
  authenticationMethods: AuthenticationMethod[] = [
    {
      id: 'identity',
      title: 'ASP.NET Core Identity',
      description: 'Sistema completo de autenticación y autorización integrado en .NET',
      implementation: 'Framework oficial de Microsoft para gestión de usuarios',
      securityLevel: 'advanced',
      pros: [
        'Integración nativa con .NET',
        'Gestión completa de usuarios',
        'Soporte para 2FA',
        'Políticas de contraseñas configurables',
        'Integración con Entity Framework'
      ],
      cons: [
        'Puede ser complejo para casos simples',
        'Requiere configuración inicial extensa',
        'Dependencia del Entity Framework'
      ],
      codeExample: `
// Program.cs - Configuración de ASP.NET Core Identity
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<IdentityUser>(options => 
{
    // Políticas de contraseña
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    
    // Configuración de bloqueo
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    
    // Configuración de usuarios
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>();

// Configuración de cookies
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(1);
    options.LoginPath = "/Account/Login";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.SlidingExpiration = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
});

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();`,
      vulnerabilities: [
        'Configuración débil de políticas de contraseñas',
        'Cookies inseguras (sin HttpOnly, Secure)',
        'Falta de límites de intentos de login',
        'Sesiones que no expiran adecuadamente'
      ],
      mitigations: [
        'Implementar políticas estrictas de contraseñas',
        'Configurar cookies seguras con HttpOnly y Secure',
        'Habilitar bloqueo de cuentas después de intentos fallidos',
        'Configurar expiración de sesiones adecuada',
        'Implementar autenticación de dos factores'
      ]
    },
    {
      id: 'jwt',
      title: 'JWT Authentication',
      description: 'Autenticación basada en JSON Web Tokens para APIs stateless',
      implementation: 'Tokens firmados para autenticación sin estado',
      securityLevel: 'intermediate',
      pros: [
        'Stateless - escalabilidad',
        'Ideal para APIs y SPA',
        'Claims personalizables',
        'Compatible con estándares OAuth',
        'Menos carga en servidor'
      ],
      cons: [
        'Difícil de revocar tokens',
        'Tamaño mayor que cookies',
        'Requiere gestión de refresh tokens',
        'Vulnerable si se compromete la clave'
      ],
      codeExample: `
// Program.cs - Configuración JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            ClockSkew = TimeSpan.Zero
        };
        
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                // Validaciones adicionales
                var user = context.Principal.Identity;
                if (!user.IsAuthenticated)
                {
                    context.Fail("Unauthorized");
                }
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                // Log de intentos fallidos
                var logger = context.HttpContext.RequestServices
                    .GetRequiredService<ILogger<Program>>();
                logger.LogWarning("JWT Authentication failed: {Error}", 
                    context.Exception.Message);
                return Task.CompletedTask;
            }
        };
    });

// AuthController.cs - Generación de tokens
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly UserManager<IdentityUser> _userManager;
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            
            // Guardar refresh token de forma segura
            await SaveRefreshTokenAsync(user.Id, refreshToken);
            
            return Ok(new
            {
                token = token,
                refreshToken = refreshToken,
                expiration = DateTime.UtcNow.AddHours(1)
            });
        }
        
        return Unauthorized();
    }
    
    private string GenerateJwtToken(IdentityUser user)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, 
            SecurityAlgorithms.HmacSha256);
            
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}`,
      vulnerabilities: [
        'Claves de firma débiles o hardcodeadas',
        'Tokens sin expiración o con vida muy larga',
        'Falta de validación de issuer/audience',
        'Información sensible en claims',
        'Falta de gestión de refresh tokens'
      ],
      mitigations: [
        'Usar claves fuertes y rotarlas regularmente',
        'Configurar expiración corta para access tokens',
        'Implementar refresh tokens con rotación',
        'Validar todos los claims del token',
        'Usar HTTPS para transmisión de tokens',
        'Implementar revocación de tokens'
      ]
    },
    {
      id: 'oauth',
      title: 'OAuth 2.0 & OpenID Connect',
      description: 'Autenticación federada usando proveedores externos',
      implementation: 'Delegación de autenticación a proveedores confiables',
      securityLevel: 'advanced',
      pros: [
        'Sin gestión de contraseñas',
        'Experiencia de usuario mejorada',
        'Delegación a expertos en seguridad',
        'Soporte para múltiples proveedores',
        'Estándares de la industria'
      ],
      cons: [
        'Dependencia de proveedores externos',
        'Complejidad de configuración',
        'Posible vendor lock-in',
        'Requiere manejo de errores del proveedor'
      ],
      codeExample: `
// Program.cs - Configuración OAuth con Google
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Lax;
})
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    
    // Scopes adicionales
    options.Scope.Add("email");
    options.Scope.Add("profile");
    
    // Eventos para manejo personalizado
    options.Events.OnCreatingTicket = async context =>
    {
        // Obtener información adicional del usuario
        var email = context.Principal.FindFirst(ClaimTypes.Email)?.Value;
        var name = context.Principal.FindFirst(ClaimTypes.Name)?.Value;
        
        // Crear o actualizar usuario en base de datos local
        await CreateOrUpdateUserAsync(email, name);
    };
    
    options.Events.OnRemoteFailure = context =>
    {
        // Manejo de errores de autenticación
        context.Response.Redirect("/Account/Login?error=oauth_failed");
        context.HandleResponse();
        return Task.CompletedTask;
    };
});

// Configuración adicional para Azure AD
builder.Services.AddAuthentication()
    .AddMicrosoftAccount(options =>
    {
        options.ClientId = builder.Configuration["Authentication:Microsoft:ClientId"];
        options.ClientSecret = builder.Configuration["Authentication:Microsoft:ClientSecret"];
        options.SaveTokens = true;
    });

// AccountController.cs - Manejo de autenticación externa
[HttpGet]
public IActionResult ExternalLogin(string provider, string returnUrl = null)
{
    var redirectUrl = Url.Action(nameof(ExternalLoginCallback), 
        "Account", new { returnUrl });
    var properties = new AuthenticationProperties 
    { 
        RedirectUri = redirectUrl,
        Items = { { "scheme", provider } }
    };
    
    return Challenge(properties, provider);
}

[HttpGet]
public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null)
{
    var result = await HttpContext.AuthenticateAsync(
        CookieAuthenticationDefaults.AuthenticationScheme);
    
    if (!result.Succeeded)
    {
        return RedirectToAction(nameof(Login), new { error = "external_error" });
    }
    
    // Verificar si el usuario ya existe
    var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
    var user = await _userManager.FindByEmailAsync(email);
    
    if (user == null)
    {
        // Crear nuevo usuario
        user = new IdentityUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true
        };
        
        await _userManager.CreateAsync(user);
    }
    
    await _signInManager.SignInAsync(user, isPersistent: false);
    
    return LocalRedirect(returnUrl ?? "/");
}`,
      vulnerabilities: [
        'Configuración incorrecta de redirect URIs',
        'State parameter no validado (CSRF)',
        'Falta de validación de tokens ID',
        'Scopes excesivamente permisivos',
        'Manejo inseguro de errores'
      ],
      mitigations: [
        'Configurar redirect URIs específicas y validarlas',
        'Implementar y validar state parameter',
        'Validar tokens ID recibidos',
        'Solicitar solo scopes necesarios',
        'Implementar manejo seguro de errores',
        'Usar PKCE para flujos públicos'
      ]
    }
  ];

  // Características de seguridad en .NET
  securityFeatures: SecurityFeature[] = [
    {
      feature: 'Data Protection API',
      description: 'API nativa de .NET para cifrado y protección de datos',
      implementation: 'Cifrado automático de cookies y tokens sensibles',
      codeExample: `
// Program.cs - Configuración Data Protection
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(@"./keys/"))
    .SetApplicationName("MySecureApp")
    .SetDefaultKeyLifetime(TimeSpan.FromDays(90));

// Uso en controller
public class SecureController : ControllerBase
{
    private readonly IDataProtector _protector;
    
    public SecureController(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("MySecureApp.SecureController");
    }
    
    [HttpPost("encrypt")]
    public IActionResult EncryptData([FromBody] string sensitiveData)
    {
        var encryptedData = _protector.Protect(sensitiveData);
        return Ok(new { encrypted = encryptedData });
    }
    
    [HttpPost("decrypt")]
    public IActionResult DecryptData([FromBody] string encryptedData)
    {
        try
        {
            var decryptedData = _protector.Unprotect(encryptedData);
            return Ok(new { decrypted = decryptedData });
        }
        catch (CryptographicException)
        {
            return BadRequest("Invalid encrypted data");
        }
    }
}`,
      impact: 'Alto - Protege datos sensibles automáticamente'
    },
    {
      feature: 'Anti-forgery Tokens',
      description: 'Protección automática contra ataques CSRF',
      implementation: 'Tokens automáticos en formularios y AJAX calls',
      codeExample: `
// Program.cs - Configuración Anti-forgery
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.SuppressXFrameOptionsHeader = false;
    options.Cookie.Name = "__RequestVerificationToken";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
});

// Controller con protección CSRF
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> CreateUser([FromBody] CreateUserModel model)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    
    // Procesar creación de usuario
    var result = await _userService.CreateUserAsync(model);
    
    return Ok(result);
}

// Para APIs que consumen desde Angular
[HttpGet]
public IActionResult GetAntiForgeryToken()
{
    var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
    return Ok(new { token = tokens.RequestToken });
}

// Middleware personalizado para APIs
public class AntiforgeryMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IAntiforgery _antiforgery;
    
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Method == "POST" && 
            context.Request.Path.StartsWithSegments("/api"))
        {
            await _antiforgery.ValidateRequestAsync(context);
        }
        
        await _next(context);
    }
}`,
      impact: 'Alto - Previene ataques CSRF automáticamente'
    },
    {
      feature: 'Security Headers',
      description: 'Headers de seguridad automáticos para protección del navegador',
      implementation: 'Middleware que agrega headers de seguridad',
      codeExample: `
// Program.cs - Configuración de Security Headers
app.Use(async (context, next) =>
{
    // HSTS
    context.Response.Headers.Add("Strict-Transport-Security", 
        "max-age=31536000; includeSubDomains; preload");
    
    // Content Security Policy
    context.Response.Headers.Add("Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
    
    // XSS Protection
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    
    // Content Type Options
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    
    // Frame Options
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    
    // Referrer Policy
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    
    await next();
});

// O usando NWebsec package
builder.Services.AddHsts(options =>
{
    options.MaxAge = TimeSpan.FromDays(365);
    options.IncludeSubdomains = true;
    options.Preload = true;
});

app.UseHsts();
app.UseXContentTypeOptions();
app.UseReferrerPolicy(ReferrerPolicyOptions.StrictOriginWhenCrossOrigin);
app.UseXXssProtection(options => options.EnabledWithBlockMode());
app.UseXfo(options => options.Deny());`,
      impact: 'Medio - Mejora la seguridad general del navegador'
    }
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getSecurityLevelColor(level: string): string {
    switch (level) {
      case 'basic': return '#f59e0b';
      case 'intermediate': return '#3b82f6';
      case 'advanced': return '#10b981';
      default: return '#64748b';
    }
  }

  getMethodById(id: string): AuthenticationMethod {
    return this.authenticationMethods.find(method => method.id === id) || this.authenticationMethods[0];
  }
}