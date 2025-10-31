import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insecure-design-dotnet-security-patterns',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tutorial-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="vulnerability-badge high">
          <span class="badge-icon">🔐</span>
          <div class="badge-content">
            <h1>A04: Patrones de Seguridad .NET</h1>
            <p class="vulnerability-description">
              Secure coding patterns y mejores prácticas de desarrollo seguro en .NET
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-container">
        <div class="tabs">
          <button 
            *ngFor="let tab of tabs" 
            class="tab"
            [class.active]="activeTab === tab.id"
            (click)="activeTab = tab.id">
            <span class="tab-icon">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Content Sections -->
      <div class="content-section">

        <!-- Input Validation -->
        <div *ngIf="activeTab === 'input-validation'" class="tab-content">
          <div class="content-card">
            <h2><span class="icon">✅</span>Validación de Entrada Segura</h2>
            
            <div class="validation-section">
              <h3><span class="icon">🛡️</span>Principios de Validación</h3>
              <div class="principles-grid">
                <div class="principle-item">
                  <h4><span class="icon">🎯</span>Allowlist vs Denylist</h4>
                  <p>Siempre preferir allowlist (whitelist) sobre denylist (blacklist)</p>
                  <div class="code-example">
                    <h5>❌ Enfoque Inseguro (Denylist)</h5>
                    <pre><code>// Vulnerable - fácil de bypass
public bool IsValidInput(string input)
{{ '{' }}
    string[] forbidden = {{ '{' }} "&lt;script&gt;", "javascript:", "onload=" {{ '}' }};
    return !forbidden.Any(f => input.Contains(f));
{{ '}' }}</code></pre>
                    
                    <h5>✅ Enfoque Seguro (Allowlist)</h5>
                    <pre><code>// Seguro - solo permite patrones conocidos
public bool IsValidUsername(string username)
{{ '{' }}
    // Solo letras, números y guiones bajos, longitud 3-20
    var pattern = &#64;"^[a-zA-Z0-9_]{{ '{' }}3,20{{ '}' }}$";
    return Regex.IsMatch(username, pattern);
{{ '}' }}

public bool IsValidEmail(string email)
{{ '{' }}
    try
    {{ '{' }}
        var addr = new MailAddress(email);
        return addr.Address == email;
    {{ '}' }}
    catch
    {{ '{' }}
        return false;
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>

                <div class="principle-item">
                  <h4><span class="icon">📏</span>Validación por Capas</h4>
                  <p>Validar en múltiples capas: cliente, API, negocio, datos</p>
                  <div class="code-example">
                    <h5>Modelo con Data Annotations</h5>
                    <pre><code>public class CreateUserRequest
{{ '{' }}
    [Required(ErrorMessage = "Username is required")]
    [StringLength(20, MinimumLength = 3)]
    [RegularExpression(&#64;"^[a-zA-Z0-9_]+$", 
        ErrorMessage = "Username can only contain letters, numbers and underscores")]
    public string Username {{ '{' }} get; set; {{ '}' }}

    [Required]
    [EmailAddress]
    [StringLength(254)] // RFC 5321 limit
    public string Email {{ '{' }} get; set; {{ '}' }}

    [Required]
    [StringLength(128, MinimumLength = 8)]
    [RegularExpression(&#64;"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&#64;$!%*?&amp;])[A-Za-z\d&#64;$!%*?&amp;]{{ '{' }}8,{{ '}' }}$",
        ErrorMessage = "Password must contain uppercase, lowercase, digit and special character")]
    public string Password {{ '{' }} get; set; {{ '}' }}
{{ '}' }}

// Controller con validación adicional
[ApiController]
public class UserController : ControllerBase
{{ '{' }}
    [HttpPost]
    public async Task&lt;IActionResult&gt; CreateUser([FromBody] CreateUserRequest request)
    {{ '{' }}
        // 1. Model validation automática
        if (!ModelState.IsValid)
        {{ '{' }}
            return BadRequest(ModelState);
        {{ '}' }}

        // 2. Validación de negocio
        if (await _userService.UsernameExistsAsync(request.Username))
        {{ '{' }}
            return Conflict("Username already exists");
        {{ '}' }}

        // 3. Sanitización adicional
        request.Username = request.Username.Trim().ToLowerInvariant();
        
        var user = await _userService.CreateUserAsync(request);
        return CreatedAtAction(nameof(GetUser), new {{ '{' }} id = user.Id {{ '}' }}, user);
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>
              </div>
            </div>

            <div class="custom-validators">
              <h3><span class="icon">🔧</span>Validadores Personalizados</h3>
              <div class="code-example">
                <h4>Validador de Archivo Seguro</h4>
                <pre><code>public class SafeFileAttribute : ValidationAttribute
{{ '{' }}
    private readonly string[] _allowedExtensions;
    private readonly long _maxFileSize;

    public SafeFileAttribute(string[] allowedExtensions, long maxFileSize = 5 * 1024 * 1024)
    {{ '{' }}
        _allowedExtensions = allowedExtensions;
        _maxFileSize = maxFileSize;
    {{ '}' }}

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {{ '{' }}
        if (value is not IFormFile file)
            return ValidationResult.Success;

        // Validar tamaño
        if (file.Length > _maxFileSize)
        {{ '{' }}
            return new ValidationResult($"File size cannot exceed {{ '{' }}_maxFileSize / 1024 / 1024{{ '}' }} MB");
        {{ '}' }}

        // Validar extensión
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
        {{ '{' }}
            return new ValidationResult($"Only {{ '{' }}string.Join(", ", _allowedExtensions){{ '}' }} files are allowed");
        {{ '}' }}

        // Validar content type
        var allowedContentTypes = new Dictionary&lt;string, string&gt;
        {{ '{' }}
            {{ '{' }} ".jpg", "image/jpeg" {{ '}' }},
            {{ '{' }} ".jpeg", "image/jpeg" {{ '}' }},
            {{ '{' }} ".png", "image/png" {{ '}' }},
            {{ '{' }} ".pdf", "application/pdf" {{ '}' }}
        {{ '}' }};

        if (allowedContentTypes.TryGetValue(extension, out var expectedContentType) &&
            file.ContentType != expectedContentType)
        {{ '{' }}
            return new ValidationResult("File content type does not match extension");
        {{ '}' }}

        return ValidationResult.Success;
    {{ '}' }}
{{ '}' }}

// Uso en modelo
public class DocumentUploadRequest
{{ '{' }}
    [Required]
    [SafeFile(new[] {{ '{' }} ".pdf", ".jpg", ".png" {{ '}' }}, 10 * 1024 * 1024)]
    public IFormFile Document {{ '{' }} get; set; {{ '}' }}
{{ '}' }}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Output Encoding -->
        <div *ngIf="activeTab === 'output-encoding'" class="tab-content">
          <div class="content-card">
            <h2><span class="icon">🔒</span>Codificación de Salida</h2>
            
            <div class="encoding-patterns">
              <h3><span class="icon">🌐</span>Contextos de Codificación</h3>
              <p>Diferentes contextos requieren diferentes tipos de codificación</p>
              
              <div class="context-grid">
                <div class="context-card html">
                  <h4><span class="icon">📄</span>HTML Context</h4>
                  <p>Para contenido dentro de elementos HTML</p>
                  <div class="code-example">
                    <pre><code>// Razor Pages - codificación automática
&lt;p&gt;Welcome &#64;Model.UserName&lt;/p&gt;

// Manual encoding si es necesario
&lt;p&gt;&#64;Html.Encode(Model.UserInput)&lt;/p&gt;

// En controladores
public class HomeController : Controller
{{ '{' }}
    public IActionResult Index()
    {{ '{' }}
        // ViewData se encodifica automáticamente en Razor
        ViewData["Message"] = GetUserInput();
        return View();
    {{ '}' }}
    
    // Para JSON responses
    public IActionResult GetUserData(int id)
    {{ '{' }}
        var userData = _userService.GetUser(id);
        
        // JsonResult encodifica automáticamente
        return Json(new
        {{ '{' }}
            Name = userData.Name, // Se encodifica automáticamente
            Bio = userData.Bio
        {{ '}' }});
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>

                <div class="context-card attr">
                  <h4><span class="icon">🏷️</span>HTML Attribute Context</h4>
                  <p>Para valores de atributos HTML</p>
                  <div class="code-example">
                    <pre><code>// Razor - codificación automática de atributos
&lt;input type="text" value="&#64;Model.UserInput" /&gt;

// Para URLs en atributos
&lt;a href="&#64;Url.Action("Profile", "User", new {{ '{' }} id = Model.UserId {{ '}' }})"&gt;
    View Profile
&lt;/a&gt;

// JavaScript en atributos (cuidado especial)
&lt;button onclick="alert('&#64;Html.JavaScriptStringEncode(Model.Message)')"&gt;
    Show Message
&lt;/button&gt;

// Custom helper para URLs seguras
public static class UrlHelper
{{ '{' }}
    public static string SafeUrl(string url)
    {{ '{' }}
        if (string.IsNullOrEmpty(url))
            return string.Empty;
            
        // Validar que sea URL segura
        if (Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {{ '{' }}
            // Solo permitir HTTP/HTTPS
            if (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps)
            {{ '{' }}
                return Html.AttributeEncode(url);
            {{ '}' }}
        {{ '}' }}
        
        return string.Empty;
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>

                <div class="context-card js">
                  <h4><span class="icon">💻</span>JavaScript Context</h4>
                  <p>Para valores dentro de JavaScript</p>
                  <div class="code-example">
                    <pre><code>// En Razor Pages
&lt;script&gt;
    // Usar Json.Serialize para datos complejos
    var userData = &#64;Html.Raw(Json.Serialize(Model.User));
    
    // Para strings simples
    var message = '&#64;Html.JavaScriptStringEncode(Model.Message)';
    
    // Para números
    var userId = &#64;Model.UserId; // Safe si es número
&lt;/script&gt;

// Helper para JavaScript seguro
public static class JavaScriptHelper
{{ '{' }}
    public static string ToJavaScriptString(object value)
    {{ '{' }}
        if (value == null)
            return "null";
            
        return JsonSerializer.Serialize(value, new JsonSerializerOptions
        {{ '{' }}
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        {{ '}' }});
    {{ '}' }}
    
    public static string SafeJavaScriptString(string input)
    {{ '{' }}
        if (string.IsNullOrEmpty(input))
            return "''";
            
        // Escape caracteres peligrosos
        return "'" + input
            .Replace("\\", "\\\\")
            .Replace("'", "\\'")
            .Replace("\"", "\\\"")
            .Replace("\n", "\\n")
            .Replace("\r", "\\r")
            .Replace("&lt;", "\\u003c")
            .Replace("&gt;", "\\u003e") + "'";
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>

                <div class="context-card url">
                  <h4><span class="icon">🔗</span>URL Context</h4>
                  <p>Para parámetros en URLs</p>
                  <div class="code-example">
                    <pre><code>// En controladores
public class SearchController : Controller
{{ '{' }}
    public IActionResult Search(string query)
    {{ '{' }}
        // Validar y sanitizar query
        if (string.IsNullOrWhiteSpace(query))
        {{ '{' }}
            return BadRequest("Search query is required");
        {{ '}' }}
        
        // Limitar longitud
        if (query.Length > 100)
        {{ '{' }}
            query = query.Substring(0, 100);
        {{ '}' }}
        
        // URL encode para redirección
        var encodedQuery = Uri.EscapeDataString(query);
        
        var results = _searchService.Search(query);
        
        ViewData["Query"] = query; // Se encodifica automáticamente en Razor
        return View(results);
    {{ '}' }}
    
    public IActionResult RedirectToSearch(string term)
    {{ '{' }}
        // URL encoding para parámetros
        return RedirectToAction("Search", new {{ '{' }} query = term {{ '}' }});
    {{ '}' }}
{{ '}' }}

// Helper para construcción segura de URLs
public static class SafeUrlBuilder
{{ '{' }}
    public static string BuildSearchUrl(string baseUrl, Dictionary&lt;string, string&gt; parameters)
    {{ '{' }}
        var uriBuilder = new UriBuilder(baseUrl);
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        
        foreach (var param in parameters)
        {{ '{' }}
            // Validar parámetros
            if (!string.IsNullOrEmpty(param.Value) && param.Value.Length &lt;= 100)
            {{ '{' }}
                query[param.Key] = param.Value; // Automáticamente URL encoded
            {{ '}' }}
        {{ '}' }}
        
        uriBuilder.Query = query.ToString();
        return uriBuilder.ToString();
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>
              </div>
            </div>

            <div class="csp-section">
              <h3><span class="icon">🛡️</span>Content Security Policy (CSP)</h3>
              <p>Defensa adicional contra XSS</p>
              <div class="code-example">
                <h4>Configuración CSP en ASP.NET Core</h4>
                <pre><code>// Program.cs
app.Use(async (context, next) =>
{{ '{' }}
    // CSP estricto
    context.Response.Headers.Add("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://api.example.com; " +
        "frame-ancestors 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';");
        
    await next();
{{ '}' }});

// Usando NetEscapades.AspNetCore.SecurityHeaders
public void ConfigureServices(IServiceCollection services)
{{ '{' }}
    services.AddSecurityHeaders(policies =>
        policies.AddContentSecurityPolicy(builder =>
        {{ '{' }}
            builder.AddDefaultSrc()
                .Self();
            builder.AddScriptSrc()
                .Self()
                .UnsafeInline() // Solo si es absolutamente necesario
                .From("https://cdnjs.cloudflare.com");
            builder.AddStyleSrc()
                .Self()
                .UnsafeInline()
                .From("https://fonts.googleapis.com");
            builder.AddImgSrc()
                .Self()
                .Data()
                .Over("https:");
        {{ '}' }}));
{{ '}' }}

// Nonce para scripts inline
public class NonceService
{{ '{' }}
    public string GenerateNonce()
    {{ '{' }}
        var bytes = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {{ '{' }}
            rng.GetBytes(bytes);
        {{ '}' }}
        return Convert.ToBase64String(bytes);
    {{ '}' }}
{{ '}' }}

// En Razor Page
&lt;script nonce="&#64;ViewData["ScriptNonce"]"&gt;
    // Script inline con nonce
    console.log('Safe inline script');
&lt;/script&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration Security -->
        <div *ngIf="activeTab === 'configuration'" class="tab-content">
          <div class="content-card">
            <h2><span class="icon">⚙️</span>Configuración Segura</h2>
            
            <div class="config-section">
              <h3><span class="icon">🔐</span>Gestión de Secretos</h3>
              
              <div class="secret-management">
                <div class="method-card">
                  <h4><span class="icon">🗝️</span>Azure Key Vault</h4>
                  <p>Solución recomendada para secretos en producción</p>
                  <div class="code-example">
                    <pre><code>// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Configurar Key Vault
var keyVaultEndpoint = builder.Configuration["KeyVaultEndpoint"];
if (!string.IsNullOrEmpty(keyVaultEndpoint))
{{ '{' }}
    builder.Configuration.AddAzureKeyVault(
        new Uri(keyVaultEndpoint),
        new DefaultAzureCredential());
{{ '}' }}

// Acceso a secretos
public class DatabaseService
{{ '{' }}
    private readonly string _connectionString;
    
    public DatabaseService(IConfiguration configuration)
    {{ '{' }}
        // Key Vault secret automáticamente disponible
        _connectionString = configuration["DatabaseConnectionString"];
    {{ '}' }}
{{ '}' }}

// appsettings.json (sin secretos)
{{ '{' }}
  "KeyVaultEndpoint": "https://myvault.vault.azure.net/",
  "DatabaseSettings": {{ '{' }}
    "DatabaseName": "MyDatabase",
    "TimeoutSeconds": 30
  {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>

                <div class="method-card">
                  <h4><span class="icon">👤</span>User Secrets (Desarrollo)</h4>
                  <p>Para desarrollo local únicamente</p>
                  <div class="code-example">
                    <pre><code>// Configurar User Secrets
dotnet user-secrets init
dotnet user-secrets set "DatabaseConnectionString" "Server=.;Database=MyDb;Trusted_Connection=true"
dotnet user-secrets set "ApiKeys:ExternalService" "your-secret-key"

// Program.cs
var builder = WebApplication.CreateBuilder(args);

// User secrets automáticamente incluidos en Development
if (builder.Environment.IsDevelopment())
{{ '{' }}
    builder.Configuration.AddUserSecrets&lt;Program&gt;();
{{ '}' }}

// Acceso tipado a configuración
public class ApiKeySettings
{{ '{' }}
    public const string SectionName = "ApiKeys";
    
    public string ExternalService {{ '{' }} get; set; {{ '}' }} = string.Empty;
    public string PaymentGateway {{ '{' }} get; set; {{ '}' }} = string.Empty;
{{ '}' }}

// Registro en DI
builder.Services.Configure&lt;ApiKeySettings&gt;(
    builder.Configuration.GetSection(ApiKeySettings.SectionName));

// Uso en servicio
public class ExternalApiService
{{ '{' }}
    private readonly ApiKeySettings _apiKeys;
    
    public ExternalApiService(IOptions&lt;ApiKeySettings&gt; apiKeys)
    {{ '{' }}
        _apiKeys = apiKeys.Value;
    {{ '}' }}
    
    public async Task&lt;string&gt; CallExternalApiAsync()
    {{ '{' }}
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("X-API-Key", _apiKeys.ExternalService);
        // ...
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>
              </div>
            </div>

            <div class="config-validation">
              <h3><span class="icon">✅</span>Validación de Configuración</h3>
              <div class="code-example">
                <h4>Validación al Startup</h4>
                <pre><code>public class DatabaseSettings
{{ '{' }}
    public const string SectionName = "Database";
    
    [Required]
    [MinLength(10)]
    public string ConnectionString {{ '{' }} get; set; {{ '}' }} = string.Empty;
    
    [Range(5, 300)]
    public int TimeoutSeconds {{ '{' }} get; set; {{ '}' }} = 30;
    
    [Required]
    public string DatabaseName {{ '{' }} get; set; {{ '}' }} = string.Empty;
{{ '}' }}

// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Configurar y validar settings
builder.Services.AddOptions&lt;DatabaseSettings&gt;()
    .Bind(builder.Configuration.GetSection(DatabaseSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart(); // Fallar al startup si configuración inválida

// Validación personalizada
builder.Services.AddOptions&lt;ApiKeySettings&gt;()
    .Bind(builder.Configuration.GetSection(ApiKeySettings.SectionName))
    .Validate(settings =>
    {{ '{' }}
        // Validar que las API keys no estén vacías en producción
        if (builder.Environment.IsProduction())
        {{ '{' }}
            return !string.IsNullOrEmpty(settings.ExternalService) &&
                   !string.IsNullOrEmpty(settings.PaymentGateway);
        {{ '}' }}
        return true;
    {{ '}' }}, "API keys are required in production")
    .ValidateOnStart();

// Health checks para configuración
builder.Services.AddHealthChecks()
    .AddCheck&lt;ConfigurationHealthCheck&gt;("configuration");

public class ConfigurationHealthCheck : IHealthCheck
{{ '{' }}
    private readonly DatabaseSettings _dbSettings;
    private readonly ApiKeySettings _apiSettings;
    
    public ConfigurationHealthCheck(
        IOptions&lt;DatabaseSettings&gt; dbSettings,
        IOptions&lt;ApiKeySettings&gt; apiSettings)
    {{ '{' }}
        _dbSettings = dbSettings.Value;
        _apiSettings = apiSettings.Value;
    {{ '}' }}
    
    public Task&lt;HealthCheckResult&gt; CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {{ '{' }}
        var errors = new List&lt;string&gt;();
        
        // Validar configuración de base de datos
        if (string.IsNullOrEmpty(_dbSettings.ConnectionString))
        {{ '{' }}
            errors.Add("Database connection string is missing");
        {{ '}' }}
        
        // Validar API keys en producción
        if (context.Registration.Name == "production")
        {{ '{' }}
            if (string.IsNullOrEmpty(_apiSettings.ExternalService))
            {{ '{' }}
                errors.Add("External service API key is missing");
            {{ '}' }}
        {{ '}' }}
        
        return Task.FromResult(errors.Any()
            ? HealthCheckResult.Unhealthy(string.Join("; ", errors))
            : HealthCheckResult.Healthy("Configuration is valid"));
    {{ '}' }}
{{ '}' }}</code></pre>
              </div>
            </div>

            <div class="environment-config">
              <h3><span class="icon">🌍</span>Configuración por Ambiente</h3>
              <div class="code-example">
                <h4>Configuración Segura por Ambiente</h4>
                <pre><code>// appsettings.json (base)
{{ '{' }}
  "Logging": {{ '{' }}
    "LogLevel": {{ '{' }}
      "Default": "Information"
    {{ '}' }}
  {{ '}' }},
  "Database": {{ '{' }}
    "TimeoutSeconds": 30,
    "RetryCount": 3
  {{ '}' }}
{{ '}' }}

// appsettings.Development.json
{{ '{' }}
  "Logging": {{ '{' }}
    "LogLevel": {{ '{' }}
      "Default": "Debug",
      "Microsoft.AspNetCore": "Warning"
    {{ '}' }}
  {{ '}' }},
  "Database": {{ '{' }}
    "DatabaseName": "MyApp_Dev"
  {{ '}' }},
  "FeatureFlags": {{ '{' }}
    "EnableDebugMode": true,
    "EnableDetailedErrors": true
  {{ '}' }}
{{ '}' }}

// appsettings.Production.json
{{ '{' }}
  "Logging": {{ '{' }}
    "LogLevel": {{ '{' }}
      "Default": "Warning",
      "Microsoft.AspNetCore": "Error"
    {{ '}' }}
  {{ '}' }},
  "Database": {{ '{' }}
    "DatabaseName": "MyApp_Prod"
  {{ '}' }},
  "FeatureFlags": {{ '{' }}
    "EnableDebugMode": false,
    "EnableDetailedErrors": false
  {{ '}' }},
  "Security": {{ '{' }}
    "RequireHttps": true,
    "EnableHsts": true,
    "StrictCsp": true
  {{ '}' }}
{{ '}' }}

// Configuración condicional por ambiente
var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{{ '{' }}
    builder.Services.AddDeveloperExceptionPage();
    
    // Configuración menos estricta para desarrollo
    builder.Services.Configure&lt;SecuritySettings&gt;(options =>
    {{ '{' }}
        options.RequireHttps = false;
        options.EnableDetailedErrors = true;
    {{ '}' }});
{{ '}' }}
else
{{ '{' }}
    // Configuración estricta para producción
    builder.Services.Configure&lt;SecuritySettings&gt;(options =>
    {{ '{' }}
        options.RequireHttps = true;
        options.EnableDetailedErrors = false;
        options.EnableHsts = true;
    {{ '}' }});
    
    // Exception handling sin detalles internos
    builder.Services.AddExceptionHandler&lt;GlobalExceptionHandler&gt;();
{{ '}' }}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Handling -->
        <div *ngIf="activeTab === 'error-handling'" class="tab-content">
          <div class="content-card">
            <h2><span class="icon">🚨</span>Manejo Seguro de Errores</h2>
            
            <div class="error-principles">
              <h3><span class="icon">🎯</span>Principios de Error Handling Seguro</h3>
              
              <div class="principle-grid">
                <div class="principle-card">
                  <h4><span class="icon">👁️</span>No Exposición de Información</h4>
                  <p>Los errores no deben revelar información sensible del sistema</p>
                </div>
                
                <div class="principle-card">
                  <h4><span class="icon">📝</span>Logging Completo</h4>
                  <p>Log todos los errores internamente para debugging</p>
                </div>
                
                <div class="principle-card">
                  <h4><span class="icon">🎭</span>Mensajes Genéricos</h4>
                  <p>Mostrar mensajes genéricos a usuarios no autorizados</p>
                </div>
                
                <div class="principle-card">
                  <h4><span class="icon">🔍</span>Tracking de Errores</h4>
                  <p>Incluir IDs de tracking para correlación</p>
                </div>
              </div>
            </div>

            <div class="error-implementation">
              <h3><span class="icon">⚙️</span>Implementación de Error Handling</h3>
              
              <div class="code-example">
                <h4>Global Exception Handler</h4>
                <pre><code>public class GlobalExceptionHandler : IExceptionHandler
{{ '{' }}
    private readonly ILogger&lt;GlobalExceptionHandler&gt; _logger;
    private readonly IWebHostEnvironment _environment;

    public GlobalExceptionHandler(
        ILogger&lt;GlobalExceptionHandler&gt; logger,
        IWebHostEnvironment environment)
    {{ '{' }}
        _logger = logger;
        _environment = environment;
    {{ '}' }}

    public async ValueTask&lt;bool&gt; TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {{ '{' }}
        var traceId = Activity.Current?.Id ?? httpContext.TraceIdentifier;

        // Log completo del error (solo internamente)
        _logger.LogError(exception,
            "Unhandled exception occurred. TraceId: {{ '{' }}TraceId{{ '}' }}, Path: {{ '{' }}Path{{ '}' }}, User: {{ '{' }}User{{ '}' }}",
            traceId,
            httpContext.Request.Path,
            httpContext.User.Identity?.Name ?? "Anonymous");

        // Respuesta basada en tipo de excepción
        var response = exception switch
        {{ '{' }}
            ValidationException validationEx => new ErrorResponse
            {{ '{' }}
                Status = 400,
                Title = "Validation Error",
                Detail = "One or more validation errors occurred",
                TraceId = traceId,
                Errors = validationEx.Errors
            {{ '}' }},
            
            UnauthorizedAccessException => new ErrorResponse
            {{ '{' }}
                Status = 401,
                Title = "Unauthorized",
                Detail = "Authentication is required to access this resource",
                TraceId = traceId
            {{ '}' }},
            
            ForbiddenAccessException => new ErrorResponse
            {{ '{' }}
                Status = 403,
                Title = "Forbidden",
                Detail = "You don't have permission to access this resource",
                TraceId = traceId
            {{ '}' }},
            
            NotFoundException => new ErrorResponse
            {{ '{' }}
                Status = 404,
                Title = "Not Found",
                Detail = "The requested resource was not found",
                TraceId = traceId
            {{ '}' }},
            
            _ => new ErrorResponse
            {{ '{' }}
                Status = 500,
                Title = "Internal Server Error",
                Detail = _environment.IsDevelopment() 
                    ? exception.Message 
                    : "An error occurred while processing your request",
                TraceId = traceId
            {{ '}' }}
        {{ '}' }};

        httpContext.Response.StatusCode = response.Status;
        httpContext.Response.ContentType = "application/json";

        await httpContext.Response.WriteAsync(
            JsonSerializer.Serialize(response), cancellationToken);

        return true;
    {{ '}' }}
{{ '}' }}

public class ErrorResponse
{{ '{' }}
    public int Status {{ '{' }} get; set; {{ '}' }}
    public string Title {{ '{' }} get; set; {{ '}' }} = string.Empty;
    public string Detail {{ '{' }} get; set; {{ '}' }} = string.Empty;
    public string TraceId {{ '{' }} get; set; {{ '}' }} = string.Empty;
    public Dictionary&lt;string, string[]&gt;? Errors {{ '{' }} get; set; {{ '}' }}
{{ '}' }}</code></pre>
              </div>

              <div class="code-example">
                <h4>Controller Error Handling</h4>
                <pre><code>[ApiController]
public class UserController : ControllerBase
{{ '{' }}
    private readonly IUserService _userService;
    private readonly ILogger&lt;UserController&gt; _logger;

    [HttpGet("{{ '{' }}id{{ '}' }}")]
    public async Task&lt;ActionResult&lt;UserDto&gt;&gt; GetUser(int id)
    {{ '{' }}
        try
        {{ '{' }}
            // Validación de entrada
            if (id &lt;= 0)
            {{ '{' }}
                return BadRequest(new ErrorResponse
                {{ '{' }}
                    Status = 400,
                    Title = "Invalid Request",
                    Detail = "User ID must be a positive number",
                    TraceId = HttpContext.TraceIdentifier
                {{ '}' }});
            {{ '}' }}

            var user = await _userService.GetUserAsync(id);
            
            if (user == null)
            {{ '{' }}
                return NotFound(new ErrorResponse
                {{ '{' }}
                    Status = 404,
                    Title = "User Not Found",
                    Detail = $"User with ID {{ '{' }}id{{ '}' }} was not found",
                    TraceId = HttpContext.TraceIdentifier
                {{ '}' }});
            {{ '}' }}

            return Ok(user);
        {{ '}' }}
        catch (UnauthorizedAccessException)
        {{ '{' }}
            // Re-throw para que sea manejado por GlobalExceptionHandler
            throw;
        {{ '}' }}
        catch (Exception ex)
        {{ '{' }}
            // Log específico del controlador
            _logger.LogError(ex, "Error retrieving user {{ '{' }}UserId{{ '}' }}", id);
            throw; // GlobalExceptionHandler se encargará
        {{ '}' }}
    {{ '}' }}

    [HttpPost]
    public async Task&lt;ActionResult&lt;UserDto&gt;&gt; CreateUser([FromBody] CreateUserRequest request)
    {{ '{' }}
        try
        {{ '{' }}
            if (!ModelState.IsValid)
            {{ '{' }}
                return BadRequest(new ErrorResponse
                {{ '{' }}
                    Status = 400,
                    Title = "Validation Error",
                    Detail = "One or more validation errors occurred",
                    TraceId = HttpContext.TraceIdentifier,
                    Errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .ToDictionary(
                            kvp => kvp.Key,
                            kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray())
                {{ '}' }});
            {{ '}' }}

            var user = await _userService.CreateUserAsync(request);
            
            return CreatedAtAction(
                nameof(GetUser),
                new {{ '{' }} id = user.Id {{ '}' }},
                user);
        {{ '}' }}
        catch (DuplicateUserException ex)
        {{ '{' }}
            // Error de negocio específico
            return Conflict(new ErrorResponse
            {{ '{' }}
                Status = 409,
                Title = "User Already Exists",
                Detail = ex.Message,
                TraceId = HttpContext.TraceIdentifier
            {{ '}' }});
        {{ '}' }}
        catch (Exception ex)
        {{ '{' }}
            _logger.LogError(ex, "Error creating user with email {{ '{' }}Email{{ '}' }}", request.Email);
            throw;
        {{ '}' }}
    {{ '}' }}
{{ '}' }}</code></pre>
              </div>

              <div class="code-example">
                <h4>Structured Logging</h4>
                <pre><code>// Program.cs - Configuración de logging
var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Serilog para logging estructurado
builder.Host.UseSerilog((context, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("ApplicationName", "MySecureApp")
        .WriteTo.Console(outputTemplate: 
            "{{ '{' }}Timestamp:yyyy-MM-dd HH:mm:ss.fff{{ '}' }} {{ '{' }}Level:u3{{ '}' }} {{ '{' }}Message:lj{{ '}' }} {{ '{' }}NewLine{{ '}' }}{{ '{' }}Exception{{ '}' }}")
        .WriteTo.File("logs/app-.log", 
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 30));

// Service que utiliza logging estructurado
public class UserService
{{ '{' }}
    private readonly ILogger&lt;UserService&gt; _logger;
    
    public async Task&lt;User&gt; CreateUserAsync(CreateUserRequest request)
    {{ '{' }}
        using var activity = Activity.StartActivity("CreateUser");
        activity?.SetTag("user.email", request.Email);
        
        try
        {{ '{' }}
            _logger.LogInformation(
                "Creating user with email {{ '{' }}Email{{ '}' }} at {{ '{' }}Timestamp{{ '}' }}",
                request.Email,
                DateTimeOffset.UtcNow);

            // Validación de negocio
            if (await EmailExistsAsync(request.Email))
            {{ '{' }}
                _logger.LogWarning(
                    "Attempt to create user with existing email {{ '{' }}Email{{ '}' }}",
                    request.Email);
                throw new DuplicateUserException($"User with email {{ '{' }}request.Email{{ '}' }} already exists");
            {{ '}' }}

            var user = new User
            {{ '{' }}
                Email = request.Email,
                Username = request.Username,
                CreatedAt = DateTimeOffset.UtcNow
            {{ '}' }};

            await _repository.AddAsync(user);
            
            _logger.LogInformation(
                "User created successfully with ID {{ '{' }}UserId{{ '}' }} and email {{ '{' }}Email{{ '}' }}",
                user.Id,
                user.Email);

            return user;
        {{ '}' }}
        catch (Exception ex)
        {{ '{' }}
            _logger.LogError(ex,
                "Failed to create user with email {{ '{' }}Email{{ '}' }}. Error: {{ '{' }}ErrorType{{ '}' }}",
                request.Email,
                ex.GetType().Name);
            throw;
        {{ '}' }}
    {{ '}' }}
{{ '}' }}</code></pre>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./insecure-design-dotnet-security-patterns.component.css']
})
export class InsecureDesignDotnetSecurityPatternsComponent {
  activeTab: string = 'input-validation';

  tabs = [
    { id: 'input-validation', label: 'Validación de Entrada', icon: '✅' },
    { id: 'output-encoding', label: 'Codificación de Salida', icon: '🔒' },
    { id: 'configuration', label: 'Configuración Segura', icon: '⚙️' },
    { id: 'error-handling', label: 'Manejo de Errores', icon: '🚨' }
  ];
}