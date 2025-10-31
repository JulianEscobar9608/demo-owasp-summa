import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SecurityPractice {
  name: string;
  description: string;
  implementation: string;
  example: string;
  importance: 'critical' | 'high' | 'medium';
  category: 'data-protection' | 'input-validation' | 'communication' | 'session-security';
}

interface VulnerabilityExample {
  scenario: string;
  vulnerability: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  solution: string;
  codeExample: string;
  preventionCode: string;
}

interface SecurityTool {
  name: string;
  purpose: string;
  usage: string;
  configuration: string;
  benefits: string[];
}

@Component({
  selector: 'app-access-dotnet-security',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-dotnet-security.component.html',
  styleUrls: ['./access-dotnet-security.component.css']
})
export class AccessDotnetSecurityComponent {
  activeTab: string = 'data-protection';

  securityPractices: SecurityPractice[] = [
    {
      name: 'Data Protection API',
      description: 'Proporciona criptografía simple y fácil de usar para proteger datos en reposo y en tránsito.',
      implementation: 'Utiliza el servicio IDataProtectionProvider inyectado para crear protectores de datos específicos.',
      example: `services.AddDataProtection()
    .SetApplicationName("MyApp")
    .PersistKeysToFileSystem(new DirectoryInfo(@"c:\\keys\\"))
    .SetDefaultKeyLifetime(TimeSpan.FromDays(90));`,
      importance: 'critical',
      category: 'data-protection'
    },
    {
      name: 'Validación de Entrada',
      description: 'Validación robusta de datos de entrada para prevenir inyecciones y ataques de manipulación.',
      implementation: 'Usa Data Annotations, FluentValidation o validación personalizada en todos los puntos de entrada.',
      example: `public class UserModel
{
    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(50, MinimumLength = 2)]
    [RegularExpression("^[a-zA-Z\\s]+$")]
    public string Name { get; set; }
    
    [EmailAddress]
    public string Email { get; set; }
}`,
      importance: 'critical',
      category: 'input-validation'
    },
    {
      name: 'HTTPS Obligatorio',
      description: 'Fuerza todas las comunicaciones a través de HTTPS para proteger datos en tránsito.',
      implementation: 'Configura HTTPS redirection y HSTS headers en el pipeline de la aplicación.',
      example: `app.UseHttpsRedirection();
app.UseHsts(); // Solo en producción

// En Startup.cs
services.AddHsts(options =>
{
    options.Preload = true;
    options.IncludeSubDomains = true;
    options.MaxAge = TimeSpan.FromDays(365);
});`,
      importance: 'critical',
      category: 'communication'
    },
    {
      name: 'Protección Anti-Forgery',
      description: 'Previene ataques CSRF usando tokens anti-forgery en formularios y APIs.',
      implementation: 'Aplica [ValidateAntiForgeryToken] en acciones que modifican datos y genera tokens en vistas.',
      example: `// En la vista
@Html.AntiForgeryToken()

// En el controlador
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult UpdateProfile(UserProfile model)
{
    // Lógica segura aquí
    return View(model);
}`,
      importance: 'high',
      category: 'session-security'
    }
  ];

  vulnerabilityExamples: VulnerabilityExample[] = [
    {
      scenario: 'Manipulación de URLs para acceder a datos de otros usuarios',
      vulnerability: 'Insecure Direct Object Reference (IDOR)',
      riskLevel: 'critical',
      impact: 'Acceso no autorizado a datos sensibles de otros usuarios',
      solution: 'Implementar verificación de autorización basada en recursos',
      codeExample: `// VULNERABLE: No verifica propiedad del recurso
[HttpGet("profile/{userId}")]
public async Task<IActionResult> GetProfile(int userId)
{
    var user = await _context.Users.FindAsync(userId);
    return View(user); // ¡Cualquiera puede ver cualquier perfil!
}`,
      preventionCode: `// SEGURO: Verifica autorización del recurso
[HttpGet("profile/{userId}")]
public async Task<IActionResult> GetProfile(int userId)
{
    var user = await _context.Users.FindAsync(userId);
    if (user == null) return NotFound();
    
    // Verificar que el usuario actual puede acceder a este perfil
    var authResult = await _authorizationService
        .AuthorizeAsync(User, user, "CanViewProfile");
    
    if (!authResult.Succeeded)
        return Forbid();
    
    return View(user);
}`
    },
    {
      scenario: 'Exposición de información sensible en logs',
      vulnerability: 'Information Disclosure',
      riskLevel: 'high',
      impact: 'Filtración de datos sensibles como contraseñas o información personal',
      solution: 'Configurar logging seguro y sanitizar datos sensibles',
      codeExample: `// VULNERABLE: Loggea información sensible
_logger.LogInformation($"Usuario {user.Email} intentó login con password {password}");

// VULNERABLE: Exception expone detalles internos
catch (Exception ex)
{
    return BadRequest(ex.Message); // Puede exponer stack traces
}`,
      preventionCode: `// SEGURO: Logging sin información sensible
_logger.LogInformation("Usuario {UserId} intentó login", user.Id);

// SEGURO: Manejo de excepciones sin exposición
catch (Exception ex)
{
    _logger.LogError(ex, "Error durante el login del usuario {UserId}", user.Id);
    return BadRequest("Error durante el proceso de autenticación");
}`
    },
    {
      scenario: 'Inyección SQL a través de parámetros dinámicos',
      vulnerability: 'SQL Injection',
      riskLevel: 'critical',
      impact: 'Compromiso completo de la base de datos',
      solution: 'Usar Entity Framework Core con parámetros seguros',
      codeExample: `// VULNERABLE: Concatenación directa de strings
public async Task<User> GetUserByName(string userName)
{
    var sql = $"SELECT * FROM Users WHERE UserName = '{userName}'";
    return await _context.Users.FromSqlRaw(sql).FirstOrDefaultAsync();
}`,
      preventionCode: `// SEGURO: Parámetros parametrizados
public async Task<User> GetUserByName(string userName)
{
    return await _context.Users
        .Where(u => u.UserName == userName)
        .FirstOrDefaultAsync();
}

// O con SQL raw seguro
public async Task<User> GetUserByNameRaw(string userName)
{
    return await _context.Users
        .FromSqlRaw("SELECT * FROM Users WHERE UserName = {0}", userName)
        .FirstOrDefaultAsync();
}`
    }
  ];

  securityTools: SecurityTool[] = [
    {
      name: 'Security Headers Middleware',
      purpose: 'Agrega headers de seguridad esenciales para proteger contra ataques comunes',
      usage: 'Configurar en el pipeline de la aplicación para aplicar headers automáticamente',
      configuration: `app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Add("Content-Security-Policy", 
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
    
    await next();
});`,
      benefits: [
        'Previene clickjacking con X-Frame-Options',
        'Protege contra MIME type sniffing',
        'Habilita protección XSS del navegador',
        'Controla política de referrer',
        'Implementa Content Security Policy'
      ]
    },
    {
      name: 'Rate Limiting',
      purpose: 'Protege contra ataques de fuerza bruta y abuso de API',
      usage: 'Implementar límites de velocidad en endpoints críticos como login',
      configuration: `// Usando AspNetCoreRateLimit
services.AddMemoryCache();
services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));
services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// En appsettings.json
{
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "GeneralRules": [
      {
        "Endpoint": "POST:/api/auth/login",
        "Period": "1m",
        "Limit": 5
      }
    ]
  }
}`,
      benefits: [
        'Previene ataques de fuerza bruta',
        'Protege recursos de la API',
        'Mejora la disponibilidad del servicio',
        'Permite configuración granular por endpoint',
        'Incluye whitelist/blacklist de IPs'
      ]
    },
    {
      name: 'Input Sanitization',
      purpose: 'Limpia y valida entradas del usuario para prevenir ataques de inyección',
      usage: 'Aplicar en todos los puntos donde se reciben datos del usuario',
      configuration: `public class SanitizationService
{
    private readonly HtmlSanitizer _htmlSanitizer;
    
    public SanitizationService()
    {
        _htmlSanitizer = new HtmlSanitizer();
        _htmlSanitizer.AllowedTags.Clear();
        _htmlSanitizer.AllowedTags.Add("p");
        _htmlSanitizer.AllowedTags.Add("br");
        _htmlSanitizer.AllowedTags.Add("strong");
        _htmlSanitizer.AllowedTags.Add("em");
    }
    
    public string SanitizeHtml(string input)
    {
        return _htmlSanitizer.Sanitize(input);
    }
    
    public string SanitizeFileName(string fileName)
    {
        var invalidChars = Path.GetInvalidFileNameChars();
        return string.Join("", fileName.Split(invalidChars));
    }
}`,
      benefits: [
        'Previene ataques XSS',
        'Protege contra path traversal',
        'Sanitiza contenido HTML',
        'Valida nombres de archivo',
        'Configurable según necesidades'
      ]
    }
  ];

  selectedVulnerability: VulnerabilityExample | null = null;
  selectedTool: SecurityTool | null = null;

  constructor() {
    this.selectedVulnerability = this.vulnerabilityExamples[0];
    this.selectedTool = this.securityTools[0];
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  selectVulnerability(vulnerability: VulnerabilityExample): void {
    this.selectedVulnerability = vulnerability;
  }

  selectTool(tool: SecurityTool): void {
    this.selectedTool = tool;
  }

  getFilteredPractices(category: string): SecurityPractice[] {
    return this.securityPractices.filter(practice => practice.category === category);
  }

  getImportanceColor(importance: string): string {
    switch (importance) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      default: return '#16a34a';
    }
  }

  getRiskColor(risk: string): string {
    switch (risk) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  }
}