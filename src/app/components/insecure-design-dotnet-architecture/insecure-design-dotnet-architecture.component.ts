import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insecure-design-dotnet-architecture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tutorial-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="vulnerability-badge critical">
          <span class="badge-icon">🏗️</span>
          <div class="badge-content">
            <h1>A04: Diseño Inseguro - Arquitectura .NET</h1>
            <p class="vulnerability-description">
              Patrones arquitecturales seguros y diseño defensivo en aplicaciones .NET
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

        <!-- Architectural Principles -->
        <div *ngIf="activeTab === 'principles'" class="tab-content">
          <div class="content-card">
            <h2><span class="icon">🎯</span>Principios de Diseño Seguro</h2>

            <div class="principle-grid">
              <div class="principle-card">
                <h3><span class="icon">🔒</span>Defense in Depth</h3>
                <p>Múltiples capas de seguridad que se apoyan mutuamente</p>
                <div class="code-example">
                  <h4>Implementación en ASP.NET Core</h4>
                  <pre><code>// Program.cs - Configuración por capas
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {{ '{' }}
        options.TokenValidationParameters = new TokenValidationParameters
        {{ '{' }}
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
        {{ '}' }};
    {{ '}' }});

// Capa de autorización
builder.Services.AddAuthorization(options =>
{{ '{' }}
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("role", "Administrator"));
    options.AddPolicy("ValidatedUser", policy =>
        policy.RequireClaim("email_verified", "true"));
{{ '}' }});

// Capa de validación adicional
builder.Services.AddScoped&lt;ISecurityValidationService, SecurityValidationService&gt;();</code></pre>
                </div>
              </div>

              <div class="principle-card">
                <h3><span class="icon">❌</span>Fail Securely</h3>
                <p>Los fallos deben resultar en un estado seguro, no en acceso no autorizado</p>
                <div class="code-example">
                  <h4>Exception Handling Seguro</h4>
                  <pre><code>public class SecureUserService
{{ '{' }}
    private readonly ILogger&lt;SecureUserService&gt; _logger;

    public async Task&lt;UserProfile&gt; GetUserProfileAsync(int userId)
    {{ '{' }}
        try
        {{ '{' }}
            // Validación de autorización ANTES de acceso
            if (!await _authService.IsAuthorizedAsync(userId))
            {{ '{' }}
                _logger.LogWarning("Unauthorized access attempt for user {{ '{' }}UserId{{ '}' }}", userId);
                throw new UnauthorizedAccessException();
            {{ '}' }}

            return await _repository.GetUserAsync(userId);
        {{ '}' }}
        catch (Exception ex) when (!(ex is UnauthorizedAccessException))
        {{ '{' }}
            // Log del error sin exponer información sensible
            _logger.LogError(ex, "Error retrieving user profile");

            // Fail securely - no datos, no información de error
            throw new ApplicationException("Unable to retrieve user information");
        {{ '}' }}
    {{ '}' }}
{{ '}' }}</code></pre>
                </div>
              </div>

              <div class="principle-card">
                <h3><span class="icon">🔑</span>Least Privilege</h3>
                <p>Otorgar solo los permisos mínimos necesarios</p>
                <div class="code-example">
                  <h4>Política de Autorización Granular</h4>
                  <pre><code>// Políticas específicas por recurso
public static class SecurityPolicies
{{ '{' }}
    public const string ReadOwnData = "ReadOwnData";
    public const string ModifyOwnData = "ModifyOwnData";
    public const string ReadAllData = "ReadAllData";
    public const string AdminAccess = "AdminAccess";
{{ '}' }}

// Configuración en Program.cs
builder.Services.AddAuthorization(options =>
{{ '{' }}
    options.AddPolicy(SecurityPolicies.ReadOwnData, policy =>
        policy.Requirements.Add(new ResourceOwnerRequirement()));

    options.AddPolicy(SecurityPolicies.ModifyOwnData, policy =>
        policy.Requirements.Add(new ResourceOwnerRequirement())
              .RequireClaim("permissions", "write"));

    options.AddPolicy(SecurityPolicies.AdminAccess, policy =>
        policy.RequireRole("Administrator")
              .RequireClaim("department", "IT"));
{{ '}' }});

// En controladores
[Authorize(Policy = SecurityPolicies.ReadOwnData)]
public async Task&lt;IActionResult&gt; GetUserData(int userId)
{{ '{' }}
    // Solo puede acceder a sus propios datos
    return Ok(await _service.GetUserDataAsync(userId, User.GetUserId()));
{{ '}' }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Threat Modeling -->
        <div *ngIf="activeTab === 'threat-modeling'" class="tab-content">
          <div class="content-card">
            <h2><span class="icon">🎯</span>Threat Modeling para .NET</h2>

            <div class="threat-model-section">
              <h3><span class="icon">📊</span>Metodología STRIDE</h3>
              <p>Análisis sistemático de amenazas en aplicaciones .NET</p>

              <div class="stride-grid">
                <div class="stride-card spoofing">
                  <h4><span class="icon">👤</span>Spoofing (Suplantación)</h4>
                  <div class="threat-details">
                    <p><strong>Amenaza:</strong> Suplantación de identidad de usuarios o servicios</p>
                    <p><strong>Mitigación en .NET:</strong></p>
                    <ul>
                      <li>ASP.NET Core Identity con MFA</li>
                      <li>JWT tokens con firma criptográfica</li>
                      <li>Certificados para autenticación de servicios</li>
                    </ul>
                  </div>
                  <div class="code-example">
                    <pre><code>// Configuración de MFA
services.AddDefaultIdentity&lt;ApplicationUser&gt;(options =>
{{ '{' }}
    options.SignIn.RequireConfirmedAccount = true;
    options.User.RequireUniqueEmail = true;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 12;
{{ '}' }})
.AddEntityFrameworkStores&lt;ApplicationDbContext&gt;()
.AddTokenProvider&lt;AuthenticatorTokenProvider&lt;ApplicationUser&gt;&gt;("Authenticator");</code></pre>
                  </div>
                </div>

                <div class="stride-card tampering">
                  <h4><span class="icon">🔧</span>Tampering (Manipulación)</h4>
                  <div class="threat-details">
                    <p><strong>Amenaza:</strong> Modificación no autorizada de datos</p>
                    <p><strong>Mitigación en .NET:</strong></p>
                    <ul>
                      <li>Data Protection APIs</li>
                      <li>Hashing de integridad</li>
                      <li>Validación de modelos</li>
                    </ul>
                  </div>
                  <div class="code-example">
                    <pre><code>// Data Protection para integridad
public class SecureDataService
{{ '{' }}
    private readonly IDataProtector _protector;

    public SecureDataService(IDataProtectionProvider provider)
    {{ '{' }}
        _protector = provider.CreateProtector("SecureData.v1");
    {{ '}' }}

    public string ProtectData(string data)
    {{ '{' }}
        return _protector.Protect(data);
    {{ '}' }}

    public string UnprotectData(string protectedData)
    {{ '{' }}
        return _protector.Unprotect(protectedData);
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>

                <div class="stride-card repudiation">
                  <h4><span class="icon">📋</span>Repudiation (Repudio)</h4>
                  <div class="threat-details">
                    <p><strong>Amenaza:</strong> Negación de acciones realizadas</p>
                    <p><strong>Mitigación en .NET:</strong></p>
                    <ul>
                      <li>Logging estructurado con Serilog</li>
                      <li>Audit trails inmutables</li>
                      <li>Firmas digitales en transacciones</li>
                    </ul>
                  </div>
                  <div class="code-example">
                    <pre><code>// Audit Trail con Serilog
public class AuditService
{{ '{' }}
    private readonly ILogger&lt;AuditService&gt; _logger;

    public async Task LogUserActionAsync(string userId, string action, object data)
    {{ '{' }}
        _logger.Information("User Action: {{ '{' }}UserId{{ '}' }} performed {{ '{' }}Action{{ '}' }} at {{ '{' }}Timestamp{{ '}' }} with data {{ '{' }}Data{{ '}' }}",
            userId, action, DateTimeOffset.UtcNow, data);

        // Persistir en base de datos inmutable
        await _auditRepository.AddEntryAsync(new AuditEntry
        {{ '{' }}
            UserId = userId,
            Action = action,
            Timestamp = DateTimeOffset.UtcNow,
            Data = JsonSerializer.Serialize(data),
            Hash = ComputeHash(userId, action, data)
        {{ '}' }});
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>
              </div>
            </div>

            <div class="threat-model-tools">
              <h3><span class="icon">🛠️</span>Herramientas de Threat Modeling</h3>
              <div class="tools-grid">
                <div class="tool-card">
                  <h4>Microsoft Threat Modeling Tool</h4>
                  <p>Herramienta gratuita para crear diagramas de amenazas</p>
                  <ul>
                    <li>Templates para aplicaciones web .NET</li>
                    <li>Análisis automático STRIDE</li>
                    <li>Recomendaciones de mitigación</li>
                  </ul>
                </div>
                <div class="tool-card">
                  <h4>OWASP Threat Dragon</h4>
                  <p>Tool de código abierto para threat modeling</p>
                  <ul>
                    <li>Interfaz web intuitiva</li>
                    <li>Integración con repositorios</li>
                    <li>Templates personalizables</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Secure Patterns -->
        <div *ngIf="activeTab === 'patterns'" class="tab-content">
          <div class="content-card">
            <h2><span class="icon">🏛️</span>Patrones Arquitecturales Seguros</h2>

            <div class="patterns-grid">
              <div class="pattern-card">
                <h3><span class="icon">🎭</span>API Gateway Pattern</h3>
                <p>Centralización de seguridad en el punto de entrada</p>
                <div class="pattern-benefits">
                  <h4>Beneficios de Seguridad:</h4>
                  <ul>
                    <li>Punto único de autenticación</li>
                    <li>Rate limiting centralizado</li>
                    <li>Logging y monitoreo unificado</li>
                    <li>Validación de requests</li>
                  </ul>
                </div>
                <div class="code-example">
                  <h4>Implementación con YARP</h4>
                  <pre><code>// Program.cs - API Gateway
var builder = WebApplication.CreateBuilder(args);

// Configurar YARP (Yet Another Reverse Proxy)
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// Middleware de seguridad
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer();

builder.Services.AddAuthorization();
builder.Services.AddRateLimiter();

var app = builder.Build();

// Pipeline de seguridad
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

// Middleware personalizado para validación
app.Use(async (context, next) =>
{{ '{' }}
    // Validar headers de seguridad
    if (!context.Request.Headers.ContainsKey("X-API-Version"))
    {{ '{' }}
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync("API Version required");
        return;
    {{ '}' }}

    await next();
{{ '}' }});

app.MapReverseProxy();
app.Run();</code></pre>
                </div>
              </div>

              <div class="pattern-card">
                <h3><span class="icon">🔐</span>Command Query Responsibility Segregation (CQRS)</h3>
                <p>Separación de operaciones de lectura y escritura para mayor control</p>
                <div class="pattern-benefits">
                  <h4>Beneficios de Seguridad:</h4>
                  <ul>
                    <li>Permisos granulares por operación</li>
                    <li>Audit trail detallado</li>
                    <li>Validación específica por comando</li>
                    <li>Prevención de ataques de modificación</li>
                  </ul>
                </div>
                <div class="code-example">
                  <h4>CQRS con MediatR</h4>
                  <pre><code>// Comando para escritura
public class UpdateUserCommand : IRequest&lt;UserDto&gt;
{{ '{' }}
    public int UserId {{ '{' }} get; set; {{ '}' }}
    public string Email {{ '{' }} get; set; {{ '}' }}
    public string Name {{ '{' }} get; set; {{ '}' }}
{{ '}' }}

// Handler con validación de seguridad
public class UpdateUserCommandHandler : IRequestHandler&lt;UpdateUserCommand, UserDto&gt;
{{ '{' }}
    private readonly IUserRepository _repository;
    private readonly IAuthorizationService _authService;

    public async Task&lt;UserDto&gt; Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {{ '{' }}
        // Validación de autorización
        var authResult = await _authService.AuthorizeAsync(
            _currentUser, request.UserId, "UpdateUser");

        if (!authResult.Succeeded)
            throw new UnauthorizedAccessException();

        // Validación de datos
        if (string.IsNullOrEmpty(request.Email) || !IsValidEmail(request.Email))
            throw new ValidationException("Invalid email");

        // Actualización segura
        var user = await _repository.UpdateAsync(request.UserId, request.Email, request.Name);

        // Audit log
        await _auditService.LogAsync("UserUpdated", request.UserId);

        return _mapper.Map&lt;UserDto&gt;(user);
    {{ '}' }}
{{ '}' }}

// Query para lectura (sin permisos de modificación)
public class GetUserQuery : IRequest&lt;UserDto&gt;
{{ '{' }}
    public int UserId {{ '{' }} get; set; {{ '}' }}
{{ '}' }}</code></pre>
                </div>
              </div>

              <div class="pattern-card">
                <h3><span class="icon">🛡️</span>Circuit Breaker Pattern</h3>
                <p>Protección contra fallos en cascada y ataques DoS</p>
                <div class="pattern-benefits">
                  <h4>Beneficios de Seguridad:</h4>
                  <ul>
                    <li>Prevención de ataques DoS</li>
                    <li>Protección de recursos downstream</li>
                    <li>Monitoreo de patrones anómalos</li>
                    <li>Graceful degradation</li>
                  </ul>
                </div>
                <div class="code-example">
                  <h4>Implementación con Polly</h4>
                  <pre><code>// Configuración del Circuit Breaker
services.AddHttpClient&lt;ExternalApiService&gt;(client =>
{{ '{' }}
    client.BaseAddress = new Uri("https://api.external-service.com");
{{ '}' }})
.AddPolicyHandler(GetCircuitBreakerPolicy())
.AddPolicyHandler(GetRetryPolicy());

static IAsyncPolicy&lt;HttpResponseMessage&gt; GetCircuitBreakerPolicy()
{{ '{' }}
    return Policy
        .HandleResult&lt;HttpResponseMessage&gt;(r => !r.IsSuccessStatusCode)
        .Or&lt;HttpRequestException&gt;()
        .CircuitBreakerAsync(
            failureThreshold: 3,          // Fallos consecutivos
            durationOfBreak: TimeSpan.FromSeconds(30), // Tiempo de break
            onBreak: (exception, duration) =>
            {{ '{' }}
                // Log de seguridad - posible ataque
                Logger.LogWarning("Circuit breaker opened for {{ '{' }}Duration{{ '}' }}ms due to {{ '{' }}Exception{{ '}' }}",
                    duration.TotalMilliseconds, exception.Exception?.Message);
            {{ '}' }},
            onReset: () =>
            {{ '{' }}
                Logger.LogInformation("Circuit breaker reset");
            {{ '}' }});
{{ '}' }}

// Servicio con circuit breaker
public class ExternalApiService
{{ '{' }}
    private readonly HttpClient _httpClient;

    public async Task&lt;string&gt; GetDataAsync(string endpoint)
    {{ '{' }}
        try
        {{ '{' }}
            var response = await _httpClient.GetAsync(endpoint);
            return await response.Content.ReadAsStringAsync();
        {{ '}' }}
        catch (BrokenCircuitException)
        {{ '{' }}
            // Devolver datos de cache o default seguros
            return await GetCachedDataAsync(endpoint);
        {{ '}' }}
    {{ '}' }}
{{ '}' }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Architecture -->
        <div *ngIf="activeTab === 'architecture'" class="tab-content">
          <div class="content-card">
            <h2><span class="icon">🏗️</span>Arquitectura de Seguridad en .NET</h2>

            <div class="architecture-section">
              <h3><span class="icon">🔄</span>Microservicios Seguros</h3>
              <div class="microservices-diagram">
                <div class="service-layer">
                  <h4>API Gateway</h4>
                  <div class="service-box gateway">
                    <p>• Autenticación centralizada</p>
                    <p>• Rate limiting</p>
                    <p>• Request validation</p>
                  </div>
                </div>
                <div class="service-layer">
                  <h4>Servicios de Negocio</h4>
                  <div class="services-grid">
                    <div class="service-box">User Service</div>
                    <div class="service-box">Order Service</div>
                    <div class="service-box">Payment Service</div>
                  </div>
                </div>
                <div class="service-layer">
                  <h4>Capa de Datos</h4>
                  <div class="service-box data">
                    <p>• Encryption at rest</p>
                    <p>• Connection string security</p>
                    <p>• Access control</p>
                  </div>
                </div>
              </div>

              <div class="code-example">
                <h4>Configuración de Microservicio Seguro</h4>
                <pre><code>// Startup de microservicio
public class Program
{{ '{' }}
    public static void Main(string[] args)
    {{ '{' }}
        var builder = WebApplication.CreateBuilder(args);

        // Configuración de seguridad
        ConfigureSecurity(builder);
        ConfigureServices(builder);

        var app = builder.Build();

        // Pipeline de seguridad
        ConfigureSecurityPipeline(app);

        app.Run();
    {{ '}' }}

    private static void ConfigureSecurity(WebApplicationBuilder builder)
    {{ '{' }}
        // JWT Authentication
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {{ '{' }}
                options.Authority = builder.Configuration["Auth:Authority"];
                options.Audience = builder.Configuration["Auth:Audience"];
                options.RequireHttpsMetadata = true;
            {{ '}' }});

        // Service-to-service authentication
        builder.Services.AddHttpClient("secure-client")
            .AddClientAccessTokenHandler(); // Manejo automático de tokens

        // Data protection
        builder.Services.AddDataProtection()
            .PersistKeysToAzureKeyVault(
                builder.Configuration.GetConnectionString("KeyVault"));
    {{ '}' }}

    private static void ConfigureSecurityPipeline(WebApplication app)
    {{ '{' }}
        // Headers de seguridad
        app.UseSecurityHeaders();

        // Rate limiting
        app.UseRateLimiter();

        // Authentication/Authorization
        app.UseAuthentication();
        app.UseAuthorization();

        // Request logging para audit
        app.UseRequestResponseLogging();
    {{ '}' }}
{{ '}' }}</code></pre>
              </div>
            </div>

            <div class="zero-trust-section">
              <h3><span class="icon">🚫</span>Arquitectura Zero Trust</h3>
              <p>Nunca confiar, siempre verificar</p>

              <div class="zero-trust-principles">
                <div class="principle">
                  <h4><span class="icon">🔍</span>Verificación Continua</h4>
                  <p>Cada request es validado independientemente del origen</p>
                  <div class="code-example">
                    <pre><code>// Middleware de verificación continua
public class ContinuousVerificationMiddleware
{{ '{' }}
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {{ '{' }}
        // Verificar token en cada request
        if (!await IsValidToken(context))
        {{ '{' }}
            context.Response.StatusCode = 401;
            return;
        {{ '}' }}

        // Verificar permisos específicos para el recurso
        if (!await HasResourcePermission(context))
        {{ '{' }}
            context.Response.StatusCode = 403;
            return;
        {{ '}' }}

        // Verificar patrones anómalos
        if (await DetectAnomalousPattern(context))
        {{ '{' }}
            await LogSecurityEvent(context);
            // Podríamos requerir MFA adicional
        {{ '}' }}

        await next(context);
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>

                <div class="principle">
                  <h4><span class="icon">🔒</span>Acceso Mínimo Privilegiado</h4>
                  <p>Solo los permisos necesarios para la tarea específica</p>
                  <div class="code-example">
                    <pre><code>// Sistema de permisos granular
[Authorize(Policy = "ReadUser")]
[HttpGet("{{ '{' }}id{{ '}' }}")]
public async Task&lt;IActionResult&gt; GetUser(int id)
{{ '{' }}
    // Verificar que solo puede acceder a su propio perfil
    // o que tiene permisos de administrador
    var currentUserId = User.GetUserId();

    if (id != currentUserId && !User.IsInRole("Admin"))
    {{ '{' }}
        return Forbid();
    {{ '}' }}

    var user = await _userService.GetUserAsync(id);

    // Filtrar datos sensibles basado en permisos
    return Ok(_mapper.Map&lt;PublicUserDto&gt;(user));
{{ '}' }}

// Política dinámica basada en contexto
public class ContextualAuthorizationHandler :
    AuthorizationHandler&lt;ResourceAccessRequirement&gt;
{{ '{' }}
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceAccessRequirement requirement)
    {{ '{' }}
        var resource = context.Resource as ResourceContext;
        var user = context.User;

        // Verificar horario de acceso
        if (!IsWithinAllowedHours(user))
        {{ '{' }}
            context.Fail();
            return Task.CompletedTask;
        {{ '}' }}

        // Verificar ubicación si es necesario
        if (requirement.RequireLocationVerification &&
            !IsFromAllowedLocation(context.Resource))
        {{ '{' }}
            context.Fail();
            return Task.CompletedTask;
        {{ '}' }}

        context.Succeed(requirement);
        return Task.CompletedTask;
    {{ '}' }}
{{ '}' }}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./insecure-design-dotnet-architecture.component.css']
})
export class InsecureDesignDotnetArchitectureComponent {
  activeTab: string = 'principles';

  tabs = [
    { id: 'principles', label: 'Principios de Diseño', icon: '🎯' },
    { id: 'threat-modeling', label: 'Threat Modeling', icon: '🛡️' },
    { id: 'patterns', label: 'Patrones Seguros', icon: '🏛️' },
    { id: 'architecture', label: 'Arquitectura de Seguridad', icon: '🏗️' }
  ];
}
