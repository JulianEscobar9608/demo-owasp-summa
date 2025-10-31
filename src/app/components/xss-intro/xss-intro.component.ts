import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-xss-intro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './xss-intro.component.html',
  styleUrl: './xss-intro.component.css'
})
export class XssIntroComponent {
  activeTab: string = 'architecture';

  // Arquitectura Integrada Angular + .NET/C# para prevención XSS
  integrationArchitecture = {
    title: 'A03: Injection (XSS) - Arquitectura Integrada Angular + .NET/C#',
    description: 'Enfoque completo de prevención XSS desde el frontend Angular hasta el backend .NET/C#',

    layers: [
      {
        name: 'Cliente Angular',
        icon: '🅰️',
        color: '#dd0031',
        responsibilities: [
          'Sanitización automática del DOM',
          'Validación reactiva de formularios',
          'Interceptors HTTP para headers seguros',
          'Content Security Policy (CSP) implementation'
        ],
        technologies: ['Angular 19', 'TypeScript', 'RxJS', 'Angular Forms'],
        securityFeatures: [
          'DomSanitizer automático',
          'Template sanitization',
          'HttpClient interceptors',
          'Router guards'
        ]
      },
      {
        name: 'Comunicación HTTP',
        icon: '🔄',
        color: '#007acc',
        responsibilities: [
          'Headers de seguridad coordinados',
          'Validación de Content-Type',
          'CORS configuration',
          'Request/Response interceptors'
        ],
        technologies: ['HTTP/HTTPS', 'JSON', 'Headers HTTP', 'CORS'],
        securityFeatures: [
          'Content-Security-Policy',
          'X-XSS-Protection',
          'X-Content-Type-Options',
          'Referrer-Policy'
        ]
      },
      {
        name: 'API .NET Core',
        icon: '🔷',
        color: '#239120',
        responsibilities: [
          'Validación server-side definitiva',
          'HTML Encoding automático',
          'Data Annotations validation',
          'Security headers middleware'
        ],
        technologies: ['.NET 8', 'ASP.NET Core', 'Entity Framework', 'System.Text.Encodings.Web'],
        securityFeatures: [
          'HtmlEncoder.Default',
          'ModelState validation',
          'Authorization filters',
          'Security middleware'
        ]
      }
    ]
  };

  // Escenarios de Vulnerabilidad XSS y su Prevención Integrada
  xssScenarios = [
    {
      id: 'reflected',
      title: 'Reflected XSS - Comunicación Angular ↔ .NET',
      description: 'XSS que viaja desde Angular al servidor .NET y se refleja de vuelta',
      riskLevel: 'Alto',
      icon: '🔄',

      vulnerableFlow: {
        title: 'Flujo Vulnerable',
        steps: [
          {
            layer: 'Angular',
            action: 'Usuario ingresa payload malicioso en search box',
            code: `// ❌ Vulnerable: Sin sanitización
ngOnInit() {
  const query = this.route.snapshot.queryParams['search'];
  this.searchTerm = query; // Directo al template
}`
          },
          {
            layer: 'HTTP Request',
            action: 'Angular envía datos sin validar',
            code: `// ❌ Request sin headers seguros
this.http.get(\`/api/search?q=\${userInput}\`)`
          },
          {
            layer: '.NET Controller',
            action: 'Servidor refleja entrada sin encoding',
            code: `// ❌ Sin HTML encoding
[HttpGet]
public IActionResult Search(string q) {
    ViewBag.Query = q; // Vulnerable
    return Json(new { searchTerm = q });
}`
          }
        ]
      },

      secureFlow: {
        title: 'Flujo Seguro',
        steps: [
          {
            layer: 'Angular',
            action: 'Sanitización automática + validación',
            code: `// ✅ Seguro: Angular sanitiza automáticamente
ngOnInit() {
  const query = this.route.snapshot.queryParams['search'];
  // Angular sanitiza automáticamente en {{ }}
  this.searchTerm = query;
}`
          },
          {
            layer: 'HTTP Request',
            action: 'Headers seguros via interceptor',
            code: `// ✅ Interceptor con headers seguros
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const secureReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    return next.handle(secureReq);
  }
}`
          },
          {
            layer: '.NET Controller',
            action: 'Validación + HTML encoding automático',
            code: `// ✅ Seguro: Validación y encoding
[HttpGet]
public IActionResult Search([FromQuery] string q) {
    if (!ModelState.IsValid) return BadRequest();

    var encodedQuery = HtmlEncoder.Default.Encode(q);
    return Json(new {
        searchTerm = encodedQuery,
        isEncoded = true
    });
}`
          }
        ]
      }
    },

    {
      id: 'stored',
      title: 'Stored XSS - Persistencia Angular + .NET + Database',
      description: 'XSS almacenado en base de datos que afecta a múltiples usuarios',
      riskLevel: 'Crítico',
      icon: '💾',

      vulnerableFlow: {
        title: 'Flujo Vulnerable',
        steps: [
          {
            layer: 'Angular Form',
            action: 'Envío de datos sin validación client-side',
            code: `// ❌ Sin validación en Angular
submitComment() {
  const comment = this.commentForm.value.content;
  // Sin sanitización previa
  this.http.post('/api/comments', { content: comment })
    .subscribe();
}`
          },
          {
            layer: '.NET API',
            action: 'Almacenamiento directo sin encoding',
            code: `// ❌ Almacenamiento vulnerable
[HttpPost]
public async Task<IActionResult> AddComment(CommentDto dto) {
    var comment = new Comment {
        Content = dto.Content, // Sin encoding
        UserId = GetCurrentUserId()
    };
    await _context.Comments.AddAsync(comment);
    await _context.SaveChangesAsync();
    return Ok();
}`
          }
        ]
      },

      secureFlow: {
        title: 'Flujo Seguro',
        steps: [
          {
            layer: 'Angular Form',
            action: 'Validación reactiva + sanitización',
            code: `// ✅ Validación con ReactiveFormsModule
ngOnInit() {
  this.commentForm = this.fb.group({
    content: ['', [
      Validators.required,
      Validators.maxLength(1000),
      this.noScriptValidator()
    ]]
  });
}

noScriptValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (value && /<script|javascript:|onload=/i.test(value)) {
      return { containsScript: true };
    }
    return null;
  };
}`
          },
          {
            layer: '.NET API',
            action: 'Data Annotations + HTML encoding',
            code: `// ✅ Validación y encoding seguro
public class CommentDto {
    [Required]
    [StringLength(1000)]
    [RegularExpression(@"^[a-zA-Z0-9\\s.,!?-]*$")]
    public string Content { get; set; }
}

[HttpPost]
public async Task<IActionResult> AddComment(CommentDto dto) {
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var comment = new Comment {
        Content = HtmlEncoder.Default.Encode(dto.Content),
        UserId = GetCurrentUserId()
    };
    await _context.Comments.AddAsync(comment);
    await _context.SaveChangesAsync();
    return Ok();
}`
          }
        ]
      }
    }
  ];

  // Estrategias de Integración Angular + .NET para Prevención XSS
  integrationStrategies = [
    {
      category: '🔗 Comunicación Segura',
      description: 'Coordinación entre Angular y .NET para prevenir XSS en la comunicación',
      angular: {
        title: 'Angular Frontend',
        practices: [
          'HTTP Headers coordinados via Interceptors',
          'Validación client-side para UX',
          'CSP configuration en index.html'
        ],
        code: `// Angular HttpInterceptor
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }));
  }
}`
      },
      dotnet: {
        title: '.NET Backend',
        practices: [
          'Security Headers Middleware',
          'CORS configuration',
          'ModelState validation'
        ],
        code: `// .NET Security Headers Middleware
public void Configure(IApplicationBuilder app) {
    app.Use(async (context, next) => {
        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
        context.Response.Headers.Add("Content-Security-Policy",
            "default-src 'self'; script-src 'self'");
        await next();
    });
}`
      }
    },
    {
      category: '🛡️ Sanitización Coordinada',
      description: 'Estrategias de sanitización que trabajan en conjunto',
      angular: {
        title: 'Angular Template Binding',
        practices: [
          'Interpolación {{ }} para auto-sanitización',
          'Property binding [textContent]',
          'DomSanitizer para casos especiales'
        ],
        code: `// Angular Component Seguro
@Component({
  template: \`
    <!-- ✅ Angular sanitiza automáticamente -->
    <div>{{ userContent }}</div>
    <span [textContent]="userContent"></span>
  \`
})
export class SafeComponent {
  sanitizedContent = this.sanitizer.sanitize(
    SecurityContext.HTML,
    this.rawContent
  );
}`
      },
      dotnet: {
        title: '.NET HTML Encoding',
        practices: [
          'HtmlEncoder.Default.Encode()',
          'Razor automatic encoding',
          'API response encoding'
        ],
        code: `// .NET Controller Seguro
[HttpGet]
public IActionResult GetContent() {
    var content = _service.GetUserContent();

    return Json(new {
        safeContent = HtmlEncoder.Default.Encode(content),
        isEncoded = true
    });
}`
      }
    }
  ];

  // Flujo de Datos Seguro End-to-End
  secureDataFlow = {
    title: 'Flujo de Datos Seguro: Angular ↔ .NET/C#',
    description: 'Proceso completo de manejo seguro de datos desde el cliente hasta la base de datos',
    steps: [
      {
        step: 1,
        component: 'Angular Component',
        action: 'Usuario ingresa datos en formulario reactivo',
        security: 'Validación client-side inmediata + sanitización visual'
      },
      {
        step: 2,
        component: 'Angular Service',
        action: 'HTTP request con interceptor de seguridad',
        security: 'Headers seguros automáticos + pre-validación'
      },
      {
        step: 3,
        component: '.NET Controller',
        action: 'Recepción y validación con Data Annotations',
        security: 'ModelState validation + custom filters'
      },
      {
        step: 4,
        component: '.NET Service Layer',
        action: 'Procesamiento con HTML encoding',
        security: 'HtmlEncoder.Default.Encode() antes de persistencia'
      },
      {
        step: 5,
        component: 'Database',
        action: 'Almacenamiento de datos codificados',
        security: 'EF Core previene SQL injection automáticamente'
      },
      {
        step: 6,
        component: '.NET API Response',
        action: 'Respuesta con headers de seguridad',
        security: 'CSP headers + content-type correcto'
      },
      {
        step: 7,
        component: 'Angular Display',
        action: 'Renderizado con template binding seguro',
        security: 'Angular sanitiza automáticamente en {{ }}'
      }
    ]
  };

  // Ejemplo Práctico Completo: Sistema de Comentarios Seguro
  practicalExample = {
    title: 'Sistema de Comentarios Full-Stack Seguro',
    description: 'Implementación completa con prevención XSS integrada',

    angular: {
      title: 'Angular Frontend',
      code: `// ✅ Angular Component Seguro
@Component({
  selector: 'app-comments',
  template: \`
    <form [formGroup]="commentForm" (ngSubmit)="submitComment()">
      <textarea
        formControlName="content"
        placeholder="Escribe tu comentario...">
      </textarea>

      <div *ngIf="commentForm.get('content')?.errors?.['containsScript']" class="error">
        ⚠️ Contenido no permitido detectado
      </div>

      <button type="submit" [disabled]="commentForm.invalid">
        Publicar Comentario
      </button>
    </form>

    <div class="comments">
      <div *ngFor="let comment of comments" class="comment">
        <!-- ✅ Angular sanitiza automáticamente -->
        <p>{{ comment.content }}</p>
        <small>{{ comment.author }} - {{ comment.date | date }}</small>
      </div>
    </div>
  \`
})
export class CommentsComponent {
  commentForm = this.fb.group({
    content: ['', [
      Validators.required,
      Validators.maxLength(500),
      this.noScriptValidator()
    ]]
  });

  noScriptValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (/<script|javascript:|onload=/i.test(control.value)) {
        return { containsScript: true };
      }
      return null;
    };
  }
}`
    },

    dotnet: {
      title: '.NET Backend',
      code: `// ✅ .NET Controller y DTO Seguros
public class CommentDto {
    [Required]
    [StringLength(500, MinimumLength = 1)]
    [RegularExpression(@"^[a-zA-Z0-9\\s.,!?¿¡\\-_áéíóúüñÁÉÍÓÚÜÑ]*$")]
    public string Content { get; set; }

    [Required]
    [StringLength(100)]
    public string Author { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase {

    [HttpPost]
    public async Task<IActionResult> AddComment([FromBody] CommentDto dto) {
        if (!ModelState.IsValid) {
            return BadRequest(ModelState);
        }

        var comment = new Comment {
            Content = HtmlEncoder.Default.Encode(dto.Content),
            Author = HtmlEncoder.Default.Encode(dto.Author),
            CreatedAt = DateTime.UtcNow
        };

        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Comentario agregado exitosamente" });
    }

    [HttpGet]
    public async Task<IActionResult> GetComments() {
        var comments = await _context.Comments
            .Select(c => new {
                Id = c.Id,
                Content = c.Content, // Ya encoded en DB
                Author = c.Author,
                Date = c.CreatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }
}`
    }
  };

  // Métodos de utilidad
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getTabTitle(tab: string): string {
    const titles: { [key: string]: string } = {
      'architecture': '🏗️ Arquitectura',
      'scenarios': '🎯 Escenarios XSS',
      'strategies': '🛡️ Estrategias',
      'flow': '🔄 Flujo Seguro',
      'example': '💡 Ejemplo Práctico'
    };
    return titles[tab] || tab;
  }

  getScenarioIcon(riskLevel: string): string {
    const icons: { [key: string]: string } = {
      'Crítico': '🚨',
      'Alto': '⚠️',
      'Medio': '⚡',
      'Bajo': '💡'
    };
    return icons[riskLevel] || '📝';
  }

  getRiskColor(riskLevel: string): string {
    const colors: { [key: string]: string } = {
      'Crítico': '#dc2626',
      'Alto': '#ea580c',
      'Medio': '#d97706',
      'Bajo': '#65a30d'
    };
    return colors[riskLevel] || '#6b7280';
  }
}
