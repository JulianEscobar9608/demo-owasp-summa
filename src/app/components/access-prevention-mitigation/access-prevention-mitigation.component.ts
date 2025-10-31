import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SecurityControl {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective';
  effectiveness: number;
  implementation: string;
  codeExample: string;
}

interface ValidationRule {
  field: string;
  rule: string;
  example: string;
  vulnerable: string;
  secure: string;
}

@Component({
  selector: 'app-access-prevention-mitigation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-prevention-mitigation.component.html',
  styleUrl: './access-prevention-mitigation.component.css'
})
export class AccessPreventionMitigationComponent {
  activeTab: string = 'overview';
  currentDemo: string = 'server-validation';
  simulationResults: string[] = [];

  securityControls: SecurityControl[] = [
    {
      id: 'auth-guard',
      name: 'Authentication Guards',
      description: 'Verificación de autenticación antes del acceso a rutas',
      type: 'preventive',
      effectiveness: 95,
      implementation: 'Angular CanActivate',
      codeExample: `@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return this.authService.isAuthenticated();
  }
}`
    },
    {
      id: 'role-guard',
      name: 'Role-Based Guards',
      description: 'Control de acceso basado en roles del usuario',
      type: 'preventive',
      effectiveness: 90,
      implementation: 'Custom Role Guard',
      codeExample: `@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'];
    return this.authService.hasAnyRole(requiredRoles);
  }
}`
    },
    {
      id: 'server-validation',
      name: 'Server-Side Validation',
      description: 'Validación de permisos en cada request del backend',
      type: 'preventive',
      effectiveness: 98,
      implementation: 'Backend Middleware',
      codeExample: `app.use('/api/admin', (req, res, next) => {
  if (!req.user.hasRole('admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});`
    },
    {
      id: 'audit-logging',
      name: 'Audit Logging',
      description: 'Registro de todos los intentos de acceso para auditoría',
      type: 'detective',
      effectiveness: 85,
      implementation: 'Logging Service',
      codeExample: `@Injectable()
export class AuditService {
  logAccess(user: string, resource: string, action: string) {
    console.log(\`[\${new Date().toISOString()}] \${user} attempted \${action} on \${resource}\`);
  }
}`
    }
  ];

  validationRules: ValidationRule[] = [
    {
      field: 'userId',
      rule: 'Validar ownership del recurso',
      example: 'GET /api/users/:id/profile',
      vulnerable: `app.get('/api/users/:id/profile', (req, res) => {
  const profile = getUserProfile(req.params.id);
  res.json(profile); // ❌ No valida si el usuario puede acceder
});`,
      secure: `app.get('/api/users/:id/profile', auth, (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const profile = getUserProfile(req.params.id);
  res.json(profile);
});`
    },
    {
      field: 'resourceId',
      rule: 'Validar existencia y permisos del recurso',
      example: 'DELETE /api/documents/:id',
      vulnerable: `app.delete('/api/documents/:id', (req, res) => {
  deleteDocument(req.params.id);
  res.json({ success: true }); // ❌ No verifica ownership
});`,
      secure: `app.delete('/api/documents/:id', auth, async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  if (doc.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await doc.delete();
  res.json({ success: true });
});`
    },
    {
      field: 'rolePermissions',
      rule: 'Validar permisos específicos por acción',
      example: 'POST /api/admin/users',
      vulnerable: `app.post('/api/admin/users', (req, res) => {
  const newUser = createUser(req.body);
  res.json(newUser); // ❌ No verifica permisos de admin
});`,
      secure: `app.post('/api/admin/users', auth, requireRole('admin'), (req, res) => {
  const newUser = createUser(req.body);
  auditLog('USER_CREATED', req.user.id, newUser.id);
  res.json(newUser);
});`
    }
  ];

  preventionLayers = [
    {
      layer: 'Frontend (Angular)',
      controls: [
        'Route Guards (CanActivate, CanLoad)',
        'Role-based UI rendering',
        'Token validation',
        'Secure routing configuration'
      ],
      note: 'Primera línea de defensa - UX y validación básica'
    },
    {
      layer: 'API Gateway',
      controls: [
        'Rate limiting',
        'Authentication middleware',
        'Request sanitization',
        'CORS configuration'
      ],
      note: 'Punto de entrada único - filtrado inicial'
    },
    {
      layer: 'Backend Services',
      controls: [
        'Authorization checks',
        'Resource ownership validation',
        'Business logic enforcement',
        'Audit logging'
      ],
      note: 'Validación definitiva - source of truth'
    },
    {
      layer: 'Database',
      controls: [
        'Row-level security',
        'Database user permissions',
        'Encrypted sensitive data',
        'Access logging'
      ],
      note: 'Última línea de defensa - datos protegidos'
    }
  ];

  mitigationStrategies = [
    {
      strategy: 'Principle of Least Privilege',
      description: 'Otorgar solo los permisos mínimos necesarios',
      implementation: 'Roles granulares, permisos específicos por recurso',
      impact: 'Alto - Reduce superficie de ataque'
    },
    {
      strategy: 'Defense in Depth',
      description: 'Múltiples capas de validación y control',
      implementation: 'Frontend + API + Backend + Database validation',
      impact: 'Muy Alto - Redundancia de seguridad'
    },
    {
      strategy: 'Zero Trust Architecture',
      description: 'Never trust, always verify',
      implementation: 'Validar cada request independientemente',
      impact: 'Muy Alto - Asume compromiso'
    },
    {
      strategy: 'Regular Access Reviews',
      description: 'Revisión periódica de permisos y accesos',
      implementation: 'Auditorías automatizadas, cleanup de permisos',
      impact: 'Medio - Mantiene higiene de seguridad'
    }
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setCurrentDemo(demo: string): void {
    this.currentDemo = demo;
  }

  runSecurityDemo(demo: string): void {
    this.simulationResults = [];

    setTimeout(() => {
      switch (demo) {
        case 'server-validation':
          this.simulationResults = [
            '🔄 Iniciando request: GET /api/users/123/sensitive-data',
            '🔍 Verificando token JWT...',
            '✅ Token válido - Usuario ID: 456',
            '🔒 Validando ownership: User 456 != Resource Owner 123',
            '❌ ACCESO DENEGADO - 403 Forbidden',
            '📝 Logged: Unauthorized access attempt by user 456'
          ];
          break;
        case 'guard-validation':
          this.simulationResults = [
            '🚪 Navegando a /admin-panel',
            '🛡️ AuthGuard: Verificando autenticación...',
            '✅ Usuario autenticado',
            '🛡️ RoleGuard: Verificando roles...',
            '👤 Roles del usuario: [\'user\', \'moderator\']',
            '🔍 Roles requeridos: [\'admin\', \'superadmin\']',
            '❌ ACCESO DENEGADO - Redirigiendo a /unauthorized'
          ];
          break;
        case 'layered-security':
          this.simulationResults = [
            '🌐 Layer 1 - Frontend: Guard permite acceso',
            '🚪 Layer 2 - API Gateway: Rate limit OK, Auth válida',
            '⚙️ Layer 3 - Backend: Validando permisos específicos...',
            '🔍 Verificando ownership del recurso...',
            '✅ Usuario es owner del recurso',
            '🗄️ Layer 4 - Database: Row-level security aplicada',
            '✅ ACCESO PERMITIDO - Request procesado'
          ];
          break;
      }
    }, 1000);
  }

  getControlTypeColor(type: string): string {
    const colors = {
      'preventive': '#10b981',
      'detective': '#f59e0b',
      'corrective': '#ef4444'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  }

  getEffectivenessColor(effectiveness: number): string {
    if (effectiveness >= 95) return '#10b981';
    if (effectiveness >= 85) return '#f59e0b';
    return '#ef4444';
  }

  copyCodeExample(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      console.log('Código copiado al portapapeles');
    });
  }

  resetDemo(): void {
    this.simulationResults = [];
  }
}
