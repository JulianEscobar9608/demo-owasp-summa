import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface IntegrationPattern {
  name: string;
  description: string;
  scenario: string;
  frontend: string;
  backend: string;
  benefits: string[];
  considerations: string[];
}

interface SecurityFlow {
  step: number;
  title: string;
  description: string;
  frontend: string;
  backend: string;
  securityCheck: string;
}

interface BestPractice {
  category: string;
  title: string;
  description: string;
  implementation: string;
  example: string;
  importance: 'critical' | 'high' | 'medium';
}

@Component({
  selector: 'app-access-integration-best-practices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-integration-best-practices.component.html',
  styleUrls: ['./access-integration-best-practices.component.css']
})
export class AccessIntegrationBestPracticesComponent {
  activeTab: string = 'patterns';

  integrationPatterns: IntegrationPattern[] = [
    {
      name: 'JWT con HttpOnly Cookies',
      description: 'Utiliza JWT almacenados en cookies HttpOnly para mayor seguridad contra XSS.',
      scenario: 'Aplicaciones web donde la seguridad contra XSS es prioritaria',
      frontend: `// Angular HTTP Interceptor - ejemplo simplificado
// Código de autenticación con cookies HttpOnly`,
      backend: `// ASP.NET Core - Configuración simplificada
// Código de configuración JWT y cookies`,
      benefits: [
        'Protección contra ataques XSS',
        'Token no accesible desde JavaScript',
        'Renovación automática transparente',
        'CSRF protection con SameSite'
      ],
      considerations: [
        'Requiere configuración de CORS cuidadosa',
        'Más complejo para aplicaciones móviles',
        'Necesita manejo específico de CSRF'
      ]
    },
    {
      name: 'Authorization Header con Token Storage',
      description: 'Almacena JWT en localStorage/sessionStorage y envía en Authorization header.',
      scenario: 'SPAs y aplicaciones móviles que requieren flexibilidad de almacenamiento',
      frontend: `// Angular Auth Service - ejemplo simplificado
// Código de AuthService y AuthInterceptor`,
      backend: `// ASP.NET Core - ejemplo simplificado
// Código de configuración JWT estándar`,
      benefits: [
        'Implementación más simple',
        'Compatible con aplicaciones móviles',
        'Fácil debugging y testing',
        'Estándar ampliamente adoptado'
      ],
      considerations: [
        'Vulnerable a ataques XSS',
        'Requiere limpieza manual del token',
        'Visible en DevTools del navegador'
      ]
    },
    {
      name: 'OAuth 2.0 con PKCE',
      description: 'Implementa OAuth 2.0 con Proof Key for Code Exchange para aplicaciones públicas.',
      scenario: 'Aplicaciones que requieren autenticación con proveedores externos (Google, Microsoft)',
      frontend: `// Angular OAuth Configuration - ejemplo simplificado
// Código de configuración OAuth 2.0 con PKCE`,
      backend: `// ASP.NET Core - OAuth simplificado
// Código de configuración OAuth`,
      benefits: [
        'Seguridad mejorada con PKCE',
        'No manejo directo de credenciales',
        'Integración con proveedores confiables',
        'Estándar de la industria'
      ],
      considerations: [
        'Dependencia de proveedores externos',
        'Configuración más compleja',
        'Manejo de múltiples flujos de auth'
      ]
    }
  ];

  securityFlow: SecurityFlow[] = [
    {
      step: 1,
      title: 'Autenticación Inicial',
      description: 'Usuario ingresa credenciales en el frontend',
      frontend: 'Validación de formulario, envío de credenciales vía HTTPS',
      backend: 'Validación de credenciales, generación de token JWT',
      securityCheck: 'Rate limiting, validación de entrada, hash de contraseña'
    },
    {
      step: 2,
      title: 'Almacenamiento de Token',
      description: 'Token se almacena de forma segura en el cliente',
      frontend: 'HttpOnly cookie o localStorage con expiración',
      backend: 'Configuración de cookies seguras, SameSite, Secure flags',
      securityCheck: 'Protección XSS, validación de origen, expiración'
    },
    {
      step: 3,
      title: 'Solicitud Autenticada',
      description: 'Cliente envía requests con token de autenticación',
      frontend: 'Interceptor HTTP agrega Authorization header',
      backend: 'Middleware valida token en cada request',
      securityCheck: 'Validación de firma, expiración, claims del token'
    },
    {
      step: 4,
      title: 'Autorización de Recurso',
      description: 'Verificación de permisos para el recurso solicitado',
      frontend: 'Manejo de errores 401/403, redirección a login',
      backend: 'Verificación de roles, permisos, ownership del recurso',
      securityCheck: 'Autorización basada en roles y recursos'
    },
    {
      step: 5,
      title: 'Renovación de Token',
      description: 'Renovación automática antes de expiración',
      frontend: 'Interceptor detecta 401, solicita nuevo token',
      backend: 'Endpoint de refresh con refresh token',
      securityCheck: 'Validación de refresh token, rotación de tokens'
    }
  ];

  bestPractices: BestPractice[] = [
    {
      category: 'Comunicación',
      title: 'HTTPS Obligatorio',
      description: 'Toda comunicación entre frontend y backend debe ser a través de HTTPS.',
      implementation: 'Configurar redirección automática HTTP → HTTPS y headers HSTS.',
      example: `// Angular - environment.prod.ts simplificado
// Configuración de HTTPS para producción`,
      importance: 'critical'
    },
    {
      category: 'CORS',
      title: 'Configuración CORS Restrictiva',
      description: 'Configurar CORS de forma restrictiva permitiendo solo orígenes necesarios.',
      implementation: 'Especificar orígenes explícitos, métodos y headers permitidos.',
      example: `// ASP.NET Core CORS simplificado
// Configuración restrictiva de CORS`,
      importance: 'critical'
    },
    {
      category: 'Tokens',
      title: 'Gestión Segura de Tokens',
      description: 'Implementar expiración corta, renovación automática y revocación.',
      implementation: 'Access tokens de corta duración (15-30 min) con refresh tokens.',
      example: `// Token configuration simplificado
// Configuración de JWT con expiración corta`,
      importance: 'high'
    },
    {
      category: 'Validación',
      title: 'Validación Dual (Frontend + Backend)',
      description: 'Validar datos tanto en frontend (UX) como en backend (seguridad).',
      implementation: 'Nunca confiar solo en validación del frontend.',
      example: `// Frontend + Backend validation simplificado
// Validación dual para seguridad`,
      importance: 'critical'
    },
    {
      category: 'Errores',
      title: 'Manejo Seguro de Errores',
      description: 'No exponer información sensible en mensajes de error.',
      implementation: 'Logs detallados en servidor, mensajes genéricos al cliente.',
      example: `// Error handling simplificado
// Manejo seguro de errores sin exposición de datos`,
      importance: 'high'
    },
    {
      category: 'Sessions',
      title: 'Gestión de Sesiones',
      description: 'Implementar timeout de sesión y logout automático.',
      implementation: 'Detectar inactividad, limpiar tokens expirados.',
      example: `// Session timeout simplificado
// Gestión automática de timeout de sesión`,
      importance: 'medium'
    }
  ];

  selectedPattern: IntegrationPattern | null = null;
  selectedStep: SecurityFlow | null = null;

  constructor() {
    this.selectedPattern = this.integrationPatterns[0];
    this.selectedStep = this.securityFlow[0];
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  selectPattern(pattern: IntegrationPattern): void {
    this.selectedPattern = pattern;
  }

  selectStep(step: SecurityFlow): void {
    this.selectedStep = step;
  }

  getFilteredPractices(category: string): BestPractice[] {
    return this.bestPractices.filter(practice => practice.category === category);
  }

  getImportanceColor(importance: string): string {
    switch (importance) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      default: return '#16a34a';
    }
  }
}
