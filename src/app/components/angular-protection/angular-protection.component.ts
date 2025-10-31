import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-angular-protection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './angular-protection.component.html',
  styleUrl: './angular-protection.component.css'
})
export class AngularProtectionComponent {
  userInput: string = '<script>alert("Intentando XSS")</script><b>Texto en negrita</b>';
  activeTab: string = 'angular-protection';

  // Estrategias de protección XSS en Angular
  angularProtectionStrategies = [
    {
      method: 'Interpolación {{ }}',
      code: `<!-- Seguro por defecto -->
<p>{{ userInput }}</p>`,
      description: 'Angular escapa automáticamente el contenido, convirtiendo < y > en entidades HTML.',
      safe: true,
      technology: 'angular'
    },
    {
      method: 'Property binding [textContent]',
      code: `<!-- Seguro - solo texto plano -->
<p [textContent]="userInput"></p>`,
      description: 'Establece solo el contenido de texto, ignorando cualquier HTML.',
      safe: true,
      technology: 'angular'
    },
    {
      method: 'innerHTML con sanitización',
      code: `<!-- Angular sanitiza automáticamente -->
<div [innerHTML]="userInput"></div>`,
      description: 'Angular remueve elementos peligrosos pero mantiene HTML seguro como <b>, <i>, etc.',
      safe: true,
      technology: 'angular'
    },
    {
      method: 'Attribute binding',
      code: `<!-- Seguro para atributos -->
<img [alt]="userInput">`,
      description: 'Los valores de atributos son escapados automáticamente.',
      safe: true,
      technology: 'angular'
    }
  ];

  // Estrategias de protección XSS en .NET/C#
  dotnetProtectionStrategies = [
    {
      method: 'HTML Encoding con HtmlEncoder',
      code: `using System.Text.Encodings.Web;

// ✅ Codificación segura
public IActionResult DisplayComment(string comment)
{
    var safeComment = HtmlEncoder.Default.Encode(comment);
    ViewBag.SafeComment = safeComment;
    return View();
}`,
      description: 'HtmlEncoder.Default.Encode convierte caracteres peligrosos en entidades HTML seguras.',
      safe: true,
      technology: 'dotnet'
    },
    {
      method: 'Data Annotations para Validación',
      code: `using System.ComponentModel.DataAnnotations;

public class CommentModel
{
    [Required]
    [StringLength(500)]
    [RegularExpression(@"^[a-zA-Z0-9\\s.,!?-]*$")]
    public string Comment { get; set; }
}`,
      description: 'Validación en el modelo previene entrada maliciosa antes del procesamiento.',
      safe: true,
      technology: 'dotnet'
    },
    {
      method: 'Razor - Codificación Automática',
      code: `<!-- En vista Razor -->
<div>@Model.Comment</div>
<!-- Angular automáticamente codifica -->

<!-- Para contenido confiable -->
<div>@Html.Raw(trustedContent)</div>
<!-- ¡Solo usar con contenido validado! -->`,
      description: 'Razor codifica automáticamente la salida, similar a Angular.',
      safe: true,
      technology: 'dotnet'
    },
    {
      method: 'Content Security Policy Headers',
      code: `// En Startup.cs o Program.cs
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy",
        "default-src 'self'; script-src 'self'");
    await next();
});`,
      description: 'CSP previene ejecución de scripts no autorizados, complementando Angular.',
      safe: true,
      technology: 'dotnet'
    }
  ];

  // Contextos de seguridad integrados
  integratedSecurityContexts = [
    {
      context: 'Frontend Angular',
      layer: 'Client-Side',
      protections: [
        'Sanitización automática del DOM',
        'Contextos de seguridad (HTML, Style, URL)',
        'Template security',
        'Content Security Policy'
      ],
      vulnerabilities: [
        'innerHTML con contenido no confiable',
        'bypassSecurityTrust* mal usado',
        'Manipulación directa del DOM'
      ],
      color: '#dd0031'
    },
    {
      context: 'Comunicación HTTP',
      layer: 'Transport',
      protections: [
        'HTTP Interceptors para sanitización',
        'Validación de respuestas',
        'HTTPS obligatorio',
        'CORS configuración'
      ],
      vulnerabilities: [
        'Headers maliciosos',
        'Respuestas no validadas',
        'Man-in-the-middle'
      ],
      color: '#68217a'
    },
    {
      context: 'Backend .NET API',
      layer: 'Server-Side',
      protections: [
        'Model validation con Data Annotations',
        'HTML Encoding automático',
        'Security headers middleware',
        'Input sanitization'
      ],
      vulnerabilities: [
        'Validación insuficiente',
        'Raw HTML output',
        'Missing security headers'
      ],
      color: '#512bd4'
    }
  ];

  constructor(private readonly sanitizer: DomSanitizer) {}

  // Demostrar sanitización manual
  getSanitizedHtml(): SafeHtml {
    return this.sanitizer.sanitize(1, this.userInput) || '';
  }

  // Mostrar contenido raw para comparación
  getRawContent(): string {
    return this.userInput;
  }

  // Ejemplo de URL segura
  getSafeUrl(url: string): any {
    return this.sanitizer.sanitize(4, url);
  }

  // Cambio de tabs
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Obtener color para tecnología
  getTechnologyColor(technology: string): string {
    const colors: {[key: string]: string} = {
      'angular': '#dd0031',
      'dotnet': '#512bd4',
      'integration': '#68217a'
    };
    return colors[technology] || '#666';
  }

  // Ejemplos de integración completa
  integrationExamples = [
    {
      title: 'Flujo Completo: Comentario de Usuario',
      description: 'Ejemplo de cómo Angular y .NET trabajan juntos para prevenir XSS',
      steps: [
        {
          step: 1,
          layer: 'Angular Frontend',
          action: 'Usuario ingresa comentario en formulario',
          code: `<form [formGroup]="commentForm" (ngSubmit)="submitComment()">
  <textarea formControlName="comment" 
            [class.error]="commentForm.get('comment')?.invalid"></textarea>
  <button type="submit" [disabled]="commentForm.invalid">Enviar</button>
</form>`,
          security: 'Validación en tiempo real, deshabilitación de submit si es inválido'
        },
        {
          step: 2,
          layer: 'Angular Service',
          action: 'Interceptor sanitiza antes del envío',
          code: `// HTTP Interceptor
intercept(req: HttpRequest<any>, next: HttpHandler) {
  if (req.method === 'POST' && req.body?.comment) {
    const sanitizedBody = {
      ...req.body,
      comment: this.sanitizeInput(req.body.comment)
    };
    req = req.clone({ body: sanitizedBody });
  }
  return next.handle(req);
}`,
          security: 'Sanitización en el cliente antes del envío'
        },
        {
          step: 3,
          layer: '.NET API Controller',
          action: 'Validación del modelo y encoding',
          code: `[HttpPost]
public IActionResult CreateComment(CommentDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);
    
    // Encoding adicional por seguridad
    dto.Comment = HtmlEncoder.Default.Encode(dto.Comment);
    
    // Guardar en base de datos
    _service.SaveComment(dto);
    return Ok();
}`,
          security: 'Validación del servidor + encoding obligatorio'
        },
        {
          step: 4,
          layer: 'Angular Display',
          action: 'Mostrar comentario de forma segura',
          code: `<!-- Mostrar comentario -->
<div class="comment">
  <p>{{ comment.text }}</p> <!-- Seguro por defecto -->
  <span class="author">Por: {{ comment.author }}</span>
</div>`,
          security: 'Angular escapa automáticamente la salida'
        }
      ]
    }
  ];

  // Configuración de headers de seguridad para integración
  securityHeaders = {
    title: 'Headers de Seguridad para Aplicaciones Angular + .NET',
    description: 'Configuración recomendada de headers HTTP para máxima protección',
    implementation: `// En .NET API (Program.cs o Startup.cs)
app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;
    
    // Content Security Policy para Angular
    headers.Add("Content-Security-Policy", 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' " + allowedApiEndpoints);
    
    // Prevenir clickjacking
    headers.Add("X-Frame-Options", "SAMEORIGIN");
    
    // Prevenir MIME sniffing
    headers.Add("X-Content-Type-Options", "nosniff");
    
    // XSS Protection (navegadores legacy)
    headers.Add("X-XSS-Protection", "1; mode=block");
    
    // HTTPS Strict Transport Security
    headers.Add("Strict-Transport-Security", 
        "max-age=31536000; includeSubDomains");
    
    await next();
});`,
    benefits: [
      'CSP previene carga de scripts maliciosos',
      'X-Frame-Options previene clickjacking',
      'HSTS asegura comunicación cifrada',
      'Complementa protecciones nativas de Angular'
    ]
  };

  // Ejemplo de validación avanzada .NET citado en artículos de Microsoft
  advancedDotnetValidation = {
    title: 'Validación Avanzada con Data Annotations y Fluent Validation',
    vulnerableExample: `// ❌ Modelo sin validación
public class CommentModel
{
    public string Comment { get; set; }
    public string AuthorName { get; set; }
}`,
    secureExample: `// ✅ Modelo con validación completa
using System.ComponentModel.DataAnnotations;

public class CommentModel
{
    [Required(ErrorMessage = "El comentario es obligatorio")]
    [StringLength(500, MinimumLength = 10, 
        ErrorMessage = "El comentario debe tener entre 10 y 500 caracteres")]
    [RegularExpression(@"^[a-zA-Z0-9\\s.,!?-]*$", 
        ErrorMessage = "Caracteres no permitidos detectados")]
    public string Comment { get; set; }

    [Required]
    [StringLength(50, ErrorMessage = "Nombre demasiado largo")]
    [RegularExpression(@"^[a-zA-Z\\s]+$", 
        ErrorMessage = "Solo se permiten letras y espacios")]
    public string AuthorName { get; set; }
}

// Controlador con manejo de errores
[HttpPost]
public IActionResult CreateComment(CommentModel model)
{
    if (!ModelState.IsValid)
    {
        var errors = ModelState
            .SelectMany(x => x.Value.Errors)
            .Select(x => x.ErrorMessage);
        
        return BadRequest(new { 
            message = "Datos inválidos", 
            errors = errors 
        });
    }

    // Encoding adicional por defensa en profundidad
    model.Comment = HtmlEncoder.Default.Encode(model.Comment);
    model.AuthorName = HtmlEncoder.Default.Encode(model.AuthorName);

    _commentService.SaveComment(model);
    return Ok(new { message = "Comentario guardado exitosamente" });
}`
  };
}
