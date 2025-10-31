import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-advanced-security',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-security.component.html',
  styleUrl: './advanced-security.component.css'
})
export class AdvancedSecurityComponent {
  activeSection: string = 'trusted-types';

  // Configuraciones de Trusted Types
  trustedTypesExamples = [
    {
      title: 'Configuración Básica',
      description: 'Configuración mínima para aplicaciones Angular',
      header: `Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';`,
      use: 'Para aplicaciones Angular estándar sin bypass de seguridad'
    },
    {
      title: 'Con Bypass de Seguridad',
      description: 'Para apps que usan bypassSecurityTrust* methods',
      header: `Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for 'script';`,
      use: 'Cuando usas DomSanitizer.bypassSecurityTrustHtml() y similares'
    },
    {
      title: 'Con JIT Compiler',
      description: 'Para aplicaciones que usan compilación Just-In-Time',
      header: `Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for 'script';`,
      use: 'Solo para desarrollo o casos especiales con JIT'
    },
    {
      title: 'Con Lazy Loading',
      description: 'Para aplicaciones con carga perezosa de módulos',
      header: `Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';`,
      use: 'Aplicaciones con lazy loading modules'
    },
    {
      title: 'Aplicaciones Híbridas',
      description: 'Para migraciones AngularJS a Angular',
      header: `Content-Security-Policy: trusted-types angular angular#unsafe-upgrade; require-trusted-types-for 'script';`,
      use: 'Durante migración de AngularJS usando @angular/upgrade'
    }
  ];

  // Configuraciones de HttpClient y XSRF
  xsrfConfigurations = [
    {
      title: 'Configuración por Defecto',
      description: 'Angular protege automáticamente contra XSRF',
      code: `// Configuración automática
// Cookie: XSRF-TOKEN
// Header: X-XSRF-TOKEN
// Solo en requests mutativos (POST, PUT, DELETE)`,
      type: 'default'
    },
    {
      title: 'Configuración Personalizada',
      description: 'Personalizar nombres de cookie y header',
      code: `import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ]
};`,
      type: 'custom'
    },
    {
      title: 'Deshabilitación',
      description: 'Desactivar protección XSRF (NO recomendado)',
      code: `import { provideHttpClient, withNoXsrfProtection } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withNoXsrfProtection(),
    ),
  ]
};`,
      type: 'disabled'
    }
  ];

  // Configuraciones de CSP con Nonce
  cspNonceExamples = [
    {
      title: 'Configuración Automática',
      description: 'Angular CLI maneja automáticamente el nonce',
      config: `// En angular.json
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
      "autoCsp": true
    }
  }
}`,
      use: 'La opción más simple para proyectos nuevos'
    },
    {
      title: 'Atributo en Elemento Root',
      description: 'Establecer nonce directamente en el HTML',
      config: `<!-- En index.html -->
<app ngCspNonce="randomNonceGoesHere"></app>

<!-- Header HTTP requerido -->
Content-Security-Policy: default-src 'self';
  style-src 'self' 'nonce-randomNonceGoesHere';
  script-src 'self' 'nonce-randomNonceGoesHere';`,
      use: 'Cuando tienes acceso a templating server-side'
    },
    {
      title: 'Inyección de Token',
      description: 'Configurar nonce mediante dependency injection',
      config: `import { bootstrapApplication, CSP_NONCE } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [{
    provide: CSP_NONCE,
    useValue: globalThis.myRandomNonceValue
  }]
});`,
      use: 'Para configuración dinámica en runtime'
    }
  ];

  // Información sobre compilador AOT
  aotSecurityInfo = {
    title: 'Compilador AOT y Seguridad',
    benefits: [
      'Previene vulnerabilidades de inyección de plantillas',
      'Las plantillas se compilan durante el build, no en runtime',
      'Elimina la necesidad del compilador JIT en producción',
      'Reduce el tamaño del bundle al remover el compilador',
      'Mejora significativamente el rendimiento'
    ],
    comparison: {
      aot: {
        title: 'AOT (Ahead-of-Time)',
        security: 'Alto',
        performance: 'Excelente',
        bundleSize: 'Pequeño',
        risks: 'Mínimos',
        recommendation: '✅ Usar en producción'
      },
      jit: {
        title: 'JIT (Just-in-Time)',
        security: 'Bajo',
        performance: 'Regular',
        bundleSize: 'Grande',
        risks: 'Inyección de plantillas',
        recommendation: '❌ Solo desarrollo'
      }
    }
  };

  // Protección XSSI
  xssiInfo = {
    title: 'Cross-Site Script Inclusion (XSSI)',
    description: 'Angular protege automáticamente contra ataques XSSI',
    mechanism: `HttpClient automáticamente detecta y remueve el prefijo de seguridad de respuestas JSON`,
    serverExample: `// En el servidor - respuesta protegida con prefijo
PREFIJO_SEGURIDAD
{"data": "información sensible", "user": "john"}

// Angular automáticamente remueve el prefijo
// antes de parsear el JSON`,
    clientProtection: 'No requiere configuración adicional en Angular - protección automática'
  };

  // Mejores prácticas avanzadas
  advancedBestPractices = [
    {
      title: 'Mantener Angular Actualizado',
      description: 'Revisar regularmente actualizaciones de seguridad',
      action: 'ng update @angular/core @angular/cli',
      frequency: 'Mensualmente'
    },
    {
      title: 'Auditoría de APIs Peligrosas',
      description: 'Revisar uso de APIs marcadas como "Security Risk"',
      focus: 'bypassSecurityTrust*, ElementRef, document',
      tools: 'ESLint rules, code review'
    },
    {
      title: 'Configuración de Producción',
      description: 'Validar configuraciones de seguridad',
      checklist: ['AOT compilar habilitado', 'CSP configurado', 'Trusted Types activos', 'HTTPS obligatorio']
    }
  ];

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Opcional: mostrar feedback visual
    });
  }

  // Ejemplos de código para mostrar en templates
  safeTemplateExample = `// Usa plantillas estáticas con interpolación segura
<div>{{ safeUserData }}</div>`;

  dangerousTemplateExample = `// NO hagas esto
const template = \`<div>\${userData}</div>\`;
this.compileTemplate(template);`;
}
