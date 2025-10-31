import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AuthorizationStrategy {
  id: string;
  title: string;
  description: string;
  complexity: 'simple' | 'moderate' | 'complex';
  useCase: string;
  implementation: string;
  codeExample: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
}

interface SecurityDemo {
  scenario: string;
  user: string;
  resource: string;
  action: string;
  authorized: boolean;
  reason: string;
  code: string;
}

@Component({
  selector: 'app-access-dotnet-authorization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-dotnet-authorization.component.html',
  styleUrl: './access-dotnet-authorization.component.css'
})
export class AccessDotnetAuthorizationComponent {
  activeTab: string = 'rbac';
  selectedScenario: string = 'admin-access';

  // Estrategias de autorización en .NET
  authorizationStrategies: AuthorizationStrategy[] = [
    {
      id: 'rbac',
      title: 'Role-Based Access Control (RBAC)',
      description: 'Control de acceso basado en roles predefinidos del usuario',
      complexity: 'simple',
      useCase: 'Sistemas con jerarquías claras de usuarios (Admin, User, Guest)',
      implementation: 'Decoradores [Authorize] con roles específicos',
      codeExample: `
// Program.cs - Configuración RBAC
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => 
        policy.RequireRole("Administrator"));
    
    options.AddPolicy("ModeratorOrAdmin", policy =>
        policy.RequireRole("Administrator", "Moderator"));
    
    options.AddPolicy("RequireManagerRole", policy =>
        policy.RequireRole("Manager")
               .RequireClaim("Department", "Sales", "Marketing"));
});

// Controllers con autorización basada en roles
[ApiController]
[Route("api/[controller]")]
[Authorize] // Requiere autenticación
public class UsersController : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Administrator,Manager")] // Solo Admin o Manager
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }
    
    [HttpPost]
    [Authorize(Policy = "AdminOnly")] // Solo Administradores
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto userDto)
    {
        var result = await _userService.CreateUserAsync(userDto);
        return Ok(result);
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")] // Solo Admin puede eliminar
    public async Task<IActionResult> DeleteUser(string id)
    {
        await _userService.DeleteUserAsync(id);
        return NoContent();
    }
    
    [HttpGet("profile")]
    [Authorize] // Cualquier usuario autenticado
    public IActionResult GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userProfile = _userService.GetUserProfile(userId);
        return Ok(userProfile);
    }
}

// Asignación de roles durante registro/login
public class AuthService
{
    public async Task<string> RegisterUserAsync(RegisterDto model)
    {
        var user = new IdentityUser
        {
            UserName = model.Email,
            Email = model.Email
        };
        
        var result = await _userManager.CreateAsync(user, model.Password);
        
        if (result.Succeeded)
        {
            // Asignar rol por defecto
            await _userManager.AddToRoleAsync(user, "User");
            
            // Roles específicos según criterios de negocio
            if (model.Email.EndsWith("@company.com"))
            {
                await _userManager.AddToRoleAsync(user, "Employee");
            }
            
            return await GenerateJwtTokenAsync(user);
        }
        
        throw new InvalidOperationException("User creation failed");
    }
}`,
      pros: [
        'Implementación simple y directa',
        'Fácil de entender y mantener',
        'Soporte nativo en ASP.NET Core',
        'Integración automática con Identity',
        'Escalable para organizaciones medianas'
      ],
      cons: [
        'Puede volverse rígido con el crecimiento',
        'Difícil manejar permisos granulares',
        'Explosión de roles en sistemas complejos',
        'No maneja contexto dinámico'
      ],
      bestFor: [
        'Aplicaciones con jerarquías claras',
        'Sistemas de administración',
        'Portales corporativos',
        'CMS básicos'
      ]
    },
    {
      id: 'policy',
      title: 'Policy-Based Authorization',
      description: 'Autorización basada en políticas personalizables con lógica compleja',
      complexity: 'moderate',
      useCase: 'Sistemas que requieren lógica de autorización compleja y flexible',
      implementation: 'Políticas personalizadas con requirements y handlers',
      codeExample: `
// Program.cs - Configuración de políticas personalizadas
builder.Services.AddAuthorization(options =>
{
    // Política para documentos - solo el autor o admin pueden editar
    options.AddPolicy("CanEditDocument", policy =>
        policy.Requirements.Add(new DocumentEditRequirement()));
    
    // Política para usuarios activos con email verificado
    options.AddPolicy("ActiveVerifiedUser", policy =>
        policy.RequireClaim("email_verified", "true")
              .RequireClaim("account_status", "active")
              .RequireAuthenticatedUser());
    
    // Política basada en edad mínima
    options.AddPolicy("MinimumAge18", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(18)));
    
    // Política para acceso en horario laboral
    options.AddPolicy("BusinessHoursOnly", policy =>
        policy.Requirements.Add(new BusinessHoursRequirement()));
});

// Requirement personalizado para edición de documentos
public class DocumentEditRequirement : IAuthorizationRequirement
{
    // Vacío - la lógica está en el handler
}

// Handler que implementa la lógica de autorización
public class DocumentEditHandler : AuthorizationHandler<DocumentEditRequirement>
{
    private readonly IDocumentService _documentService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public DocumentEditHandler(IDocumentService documentService, 
                              IHttpContextAccessor httpContextAccessor)
    {
        _documentService = documentService;
        _httpContextAccessor = httpContextAccessor;
    }
    
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        DocumentEditRequirement requirement)
    {
        var user = context.User;
        var httpContext = _httpContextAccessor.HttpContext;
        
        // Verificar si es administrador
        if (user.IsInRole("Administrator"))
        {
            context.Succeed(requirement);
            return;
        }
        
        // Obtener ID del documento de la ruta
        var routeData = httpContext.Request.RouteValues;
        if (routeData.TryGetValue("documentId", out var documentIdObj) &&
            int.TryParse(documentIdObj.ToString(), out var documentId))
        {
            var document = await _documentService.GetDocumentAsync(documentId);
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Verificar si el usuario es el autor del documento
            if (document?.AuthorId == userId)
            {
                context.Succeed(requirement);
                return;
            }
            
            // Verificar si el usuario pertenece al mismo departamento
            var userDepartment = user.FindFirst("Department")?.Value;
            if (!string.IsNullOrEmpty(userDepartment) && 
                document?.Department == userDepartment &&
                user.IsInRole("Manager"))
            {
                context.Succeed(requirement);
                return;
            }
        }
        
        // Si llegamos aquí, no está autorizado
        context.Fail();
    }
}

// Requirement para edad mínima
public class MinimumAgeRequirement : IAuthorizationRequirement
{
    public int MinimumAge { get; }
    
    public MinimumAgeRequirement(int minimumAge)
    {
        MinimumAge = minimumAge;
    }
}

public class MinimumAgeHandler : AuthorizationHandler<MinimumAgeRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        MinimumAgeRequirement requirement)
    {
        var dateOfBirthClaim = context.User.FindFirst("date_of_birth");
        
        if (dateOfBirthClaim != null &&
            DateTime.TryParse(dateOfBirthClaim.Value, out var dateOfBirth))
        {
            var age = DateTime.Today.Year - dateOfBirth.Year;
            if (dateOfBirth.Date > DateTime.Today.AddYears(-age))
                age--;
                
            if (age >= requirement.MinimumAge)
            {
                context.Succeed(requirement);
            }
        }
        
        return Task.CompletedTask;
    }
}

// Controller usando políticas personalizadas
[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    [HttpPut("{documentId}")]
    [Authorize(Policy = "CanEditDocument")]
    public async Task<IActionResult> UpdateDocument(int documentId, 
                                                   [FromBody] UpdateDocumentDto dto)
    {
        await _documentService.UpdateDocumentAsync(documentId, dto);
        return Ok();
    }
    
    [HttpGet("restricted")]
    [Authorize(Policy = "MinimumAge18")]
    public IActionResult GetRestrictedContent()
    {
        return Ok("Content for adults only");
    }
}`,
      pros: [
        'Flexibilidad máxima en lógica de autorización',
        'Reutilización de políticas complejas',
        'Separación clara de concerns',
        'Testeable de forma independiente',
        'Soporte para contexto dinámico'
      ],
      cons: [
        'Mayor complejidad de implementación',
        'Curva de aprendizaje más alta',
        'Potencial impacto en rendimiento',
        'Requiere más código boilerplate'
      ],
      bestFor: [
        'Sistemas empresariales complejos',
        'Aplicaciones con reglas de negocio dinámicas',
        'Plataformas multi-tenancy',
        'Sistemas con contexto variable'
      ]
    },
    {
      id: 'resource',
      title: 'Resource-Based Authorization',
      description: 'Autorización basada en el recurso específico que se está accediendo',
      complexity: 'complex',
      useCase: 'Sistemas donde los permisos dependen del recurso específico',
      implementation: 'Autorización manual con IAuthorizationService',
      codeExample: `
// Autorización basada en recursos específicos
public class ResourceAuthorizationController : ControllerBase
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IProjectService _projectService;
    
    public ResourceAuthorizationController(
        IAuthorizationService authorizationService,
        IProjectService projectService)
    {
        _authorizationService = authorizationService;
        _projectService = projectService;
    }
    
    [HttpGet("projects/{projectId}")]
    [Authorize]
    public async Task<IActionResult> GetProject(int projectId)
    {
        var project = await _projectService.GetProjectAsync(projectId);
        if (project == null)
            return NotFound();
        
        // Verificar autorización para este proyecto específico
        var authResult = await _authorizationService.AuthorizeAsync(
            User, project, "CanViewProject");
        
        if (!authResult.Succeeded)
            return Forbid();
        
        return Ok(project);
    }
    
    [HttpPut("projects/{projectId}")]
    [Authorize]
    public async Task<IActionResult> UpdateProject(int projectId, 
                                                  [FromBody] UpdateProjectDto dto)
    {
        var project = await _projectService.GetProjectAsync(projectId);
        if (project == null)
            return NotFound();
        
        // Verificar autorización para editar este proyecto específico
        var authResult = await _authorizationService.AuthorizeAsync(
            User, project, "CanEditProject");
        
        if (!authResult.Succeeded)
            return Forbid();
        
        await _projectService.UpdateProjectAsync(project, dto);
        return Ok();
    }
    
    [HttpDelete("projects/{projectId}")]
    [Authorize]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        var project = await _projectService.GetProjectAsync(projectId);
        if (project == null)
            return NotFound();
        
        // Solo el owner o admin pueden eliminar
        var authResult = await _authorizationService.AuthorizeAsync(
            User, project, "CanDeleteProject");
        
        if (!authResult.Succeeded)
            return Forbid();
        
        await _projectService.DeleteProjectAsync(projectId);
        return NoContent();
    }
}

// Requirements y Handlers para recursos específicos
public class ProjectViewRequirement : IAuthorizationRequirement { }
public class ProjectEditRequirement : IAuthorizationRequirement { }
public class ProjectDeleteRequirement : IAuthorizationRequirement { }

public class ProjectAuthorizationHandler : 
    AuthorizationHandler<ProjectViewRequirement, Project>,
    AuthorizationHandler<ProjectEditRequirement, Project>,
    AuthorizationHandler<ProjectDeleteRequirement, Project>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ProjectViewRequirement requirement,
        Project project)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        // El owner puede ver siempre
        if (project.OwnerId == userId)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        
        // Los miembros del equipo pueden ver
        if (project.TeamMembers.Any(tm => tm.UserId == userId))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        
        // Los administradores pueden ver todo
        if (context.User.IsInRole("Administrator"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        
        // Proyectos públicos son visibles para todos los autenticados
        if (project.IsPublic)
        {
            context.Succeed(requirement);
        }
        
        return Task.CompletedTask;
    }
    
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ProjectEditRequirement requirement,
        Project project)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        // Solo el owner puede editar
        if (project.OwnerId == userId)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        
        // Los administradores pueden editar todo
        if (context.User.IsInRole("Administrator"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        
        // Los managers del departamento pueden editar proyectos del departamento
        var userDepartment = context.User.FindFirst("Department")?.Value;
        if (context.User.IsInRole("Manager") && 
            project.Department == userDepartment)
        {
            context.Succeed(requirement);
        }
        
        return Task.CompletedTask;
    }
    
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ProjectDeleteRequirement requirement,
        Project project)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        // Solo el owner puede eliminar
        if (project.OwnerId == userId)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        
        // Los administradores pueden eliminar todo
        if (context.User.IsInRole("Administrator"))
        {
            context.Succeed(requirement);
        }
        
        return Task.CompletedTask;
    }
}

// Configuración en Program.cs
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanViewProject", policy =>
        policy.Requirements.Add(new ProjectViewRequirement()));
    
    options.AddPolicy("CanEditProject", policy =>
        policy.Requirements.Add(new ProjectEditRequirement()));
    
    options.AddPolicy("CanDeleteProject", policy =>
        policy.Requirements.Add(new ProjectDeleteRequirement()));
});

builder.Services.AddScoped<IAuthorizationHandler, ProjectAuthorizationHandler>();`,
      pros: [
        'Control granular por recurso',
        'Lógica específica por tipo de objeto',
        'Máxima flexibilidad',
        'Soporte para ownership patterns',
        'Ideal para sistemas complejos'
      ],
      cons: [
        'Implementación más verbosa',
        'Requiere carga del recurso',
        'Potencial impacto en rendimiento',
        'Mayor complejidad de testing'
      ],
      bestFor: [
        'Sistemas de gestión de contenido',
        'Plataformas colaborativas',
        'APIs con ownership patterns',
        'Sistemas multi-tenant complejos'
      ]
    }
  ];

  // Escenarios de demostración
  securityDemos: SecurityDemo[] = [
    {
      scenario: 'admin-access',
      user: 'Administrator',
      resource: 'User Management',
      action: 'Delete User',
      authorized: true,
      reason: 'Administrator role has full permissions',
      code: '[Authorize(Roles = "Administrator")]'
    },
    {
      scenario: 'user-access',
      user: 'Regular User',
      resource: 'User Management',
      action: 'Delete User',
      authorized: false,
      reason: 'Regular users cannot delete other users',
      code: '[Authorize(Roles = "Administrator")]'
    },
    {
      scenario: 'owner-access',
      user: 'Document Owner',
      resource: 'Document #123',
      action: 'Edit Document',
      authorized: true,
      reason: 'User owns the document',
      code: 'Resource-based: document.OwnerId == userId'
    },
    {
      scenario: 'team-access',
      user: 'Team Member',
      resource: 'Project #456',
      action: 'View Project',
      authorized: true,
      reason: 'User is part of the project team',
      code: 'Policy-based: team membership validation'
    },
    {
      scenario: 'time-restricted',
      user: 'Employee',
      resource: 'Payroll System',
      action: 'Access Reports',
      authorized: false,
      reason: 'Access only allowed during business hours',
      code: 'Policy-based: time restriction validation'
    }
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setSelectedScenario(scenario: string): void {
    this.selectedScenario = scenario;
  }

  getComplexityColor(complexity: string): string {
    switch (complexity) {
      case 'simple': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'complex': return '#ef4444';
      default: return '#64748b';
    }
  }

  getStrategyById(id: string): AuthorizationStrategy {
    return this.authorizationStrategies.find(strategy => strategy.id === id) || this.authorizationStrategies[0];
  }

  getCurrentDemo(): SecurityDemo {
    return this.securityDemos.find(demo => demo.scenario === this.selectedScenario) || this.securityDemos[0];
  }
}