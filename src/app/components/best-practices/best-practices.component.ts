import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-best-practices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './best-practices.component.html',
  styleUrl: './best-practices.component.css'
})
export class BestPracticesComponent {

  // Ejemplos de buenas prácticas
  bestPractices = [
    {
      title: 'Validación de Entrada',
      category: 'input',
      good: `// ✅ Validar y limpiar entradas
validateInput(input: string): string {
  return input.trim()
    .replace(/[<>"']/g, '')
    .substring(0, 100);
}`,
      bad: `// ❌ Usar entrada directamente
element.innerHTML = userInput;`,
      description: 'Siempre valida y limpia las entradas del usuario antes de procesarlas.'
    },
    {
      title: 'CSP (Content Security Policy)',
      category: 'security',
      good: `<!-- ✅ Configurar CSP en el servidor -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';">`,
      bad: `<!-- ❌ Sin CSP o muy permisivo -->
<meta http-equiv="Content-Security-Policy"
      content="default-src *;">`,
      description: 'Implementa Content Security Policy para limitar las fuentes de recursos.'
    },
    {
      title: 'Escape HTML',
      category: 'output',
      good: `// ✅ Usar métodos seguros
<p>{{ userContent }}</p>
<div [textContent]="userContent"></div>`,
      bad: `// ❌ innerHTML sin sanitizar
<div [innerHTML]="userContent"></div>
element.innerHTML = userContent;`,
      description: 'Usa interpolación o textContent para contenido de usuario.'
    },
    {
      title: 'URLs Seguras',
      category: 'urls',
      good: `// ✅ Validar URLs
isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}`,
      bad: `// ❌ URLs sin validar
window.location.href = userInput;
<a [href]="userInput">Link</a>`,
      description: 'Valida URLs para prevenir redirecciones maliciosas.'
    },
    {
      title: 'DomSanitizer - HTML Seguro',
      category: 'sanitizer',
      good: `// ✅ Sanitizar HTML correctamente
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  // Solo usar con contenido confiable
  return this.sanitizer.bypassSecurityTrustHtml(html);
}`,
      bad: `// ❌ HTML sin sanitizar
element.innerHTML = userHtml;
[innerHTML]="rawUserContent"`,
      description: 'Usa DomSanitizer solo con contenido HTML confiable y previamente validado.'
    },
    {
      title: 'DomSanitizer - URLs Confiables',
      category: 'sanitizer',
      good: `// ✅ URLs sanitizadas
getSafeUrl(url: string): SafeUrl {
  if (this.isValidUrl(url)) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  return this.sanitizer.bypassSecurityTrustUrl('about:blank');
}`,
      bad: `// ❌ URLs directas sin validar
<iframe [src]="userUrl"></iframe>
window.open(userProvidedUrl);`,
      description: 'Sanitiza URLs solo después de validarlas exhaustivamente.'
    },
    {
      title: 'DomSanitizer - Resource URLs',
      category: 'sanitizer',
      good: `// ✅ Resource URLs seguras
getSafeResourceUrl(url: string): SafeResourceUrl {
  if (this.isWhitelistedDomain(url)) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  throw new Error('Dominio no autorizado');
}`,
      bad: `// ❌ Resource URLs sin verificar
<iframe [src]="externalUrl"></iframe>
<embed [src]="userFileUrl">`,
      description: 'Usa Resource URLs solo con dominios en lista blanca.'
    },
    {
      title: 'Escape Manual de HTML',
      category: 'security',
      good: `// ✅ Escape manual cuando sea necesario
escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}`,
      bad: `// ❌ Texto sin escapar
innerHTML = '<p>' + userText + '</p>';`,
      description: 'Cuando no puedas usar interpolación, escapa el HTML manualmente.'
    },
    {
      title: 'Mantener Angular Actualizado',
      category: 'maintenance',
      good: `// ✅ Mantener dependencias actualizadas
ng update @angular/core @angular/cli
npm audit fix

// Revisar changelog regularmente
// https://github.com/angular/angular/blob/main/CHANGELOG.md`,
      bad: `// ❌ Versiones desactualizadas
"@angular/core": "^15.0.0" // Versión antigua
// Ignorar avisos de seguridad`,
      description: 'Las actualizaciones de Angular incluyen parches de seguridad críticos.'
    },
    {
      title: 'Evitar APIs Peligrosas',
      category: 'security',
      good: `// ✅ Usar APIs seguras de Angular
// Plantillas estáticas, interpolación, property binding
<div [textContent]="userContent"></div>
<p>{{ userMessage }}</p>`,
      bad: `// ❌ APIs marcadas como "Security Risk"
// bypassSecurityTrust* sin validación exhaustiva
// ElementRef manipulation directa
// document.createElement sin sanitización`,
      description: 'Evita APIs marcadas como "Security Risk" en la documentación.'
    },
    {
      title: 'Compilador AOT en Producción',
      category: 'compilation',
      good: `// ✅ AOT por defecto en Angular CLI
ng build --prod
// Beneficios: previene inyección de plantillas

// angular.json
"aot": true`,
      bad: `// ❌ JIT en producción
ng build --aot=false
// Riesgo: plantillas compiladas en runtime`,
      description: 'AOT previene inyección de plantillas y mejora seguridad.'
    }
  ];

  // Ejemplos prácticos
  userInput: string = '';
  urlInput: string = 'https://example.com';

  // Configuraciones de CSP
  cspExamples = [
    {
      level: 'Básico',
      policy: "default-src 'self'",
      description: 'Solo permite recursos del mismo origen'
    },
    {
      level: 'Moderado',
      policy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
      description: 'Permite scripts y estilos inline del mismo origen'
    },
    {
      level: 'Estricto',
      policy: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:",
      description: 'Sin inline scripts, solo recursos del mismo origen'
    }
  ];

  constructor(private readonly sanitizer: DomSanitizer) {}

  // Variables para demostraciones del DomSanitizer
  sanitizerDemoHtml: string = '<p>Contenido <strong>HTML</strong> seguro</p>';
  sanitizerDemoUrl: string = 'https://angular.io/guide/security';
  trustedHtml: any = null;
  trustedUrl: any = null;

  // Ejemplo de validación segura
  validateInput(input: string): string {
    if (!input) return '';

    return input
      .trim()
      .replaceAll(/[<>"'&]/g, (match) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match] || match;
      })
      .substring(0, 200);
  }

  // Validación de URL segura
  isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  // Obtener URL segura
  getSafeUrl(url: string): SafeUrl | string {
    if (this.isValidUrl(url)) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return '#';
  }

  // Ejemplo de sanitización de HTML
  sanitizeHtml(html: string): string {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  }

  // Filtros de contenido
  filterMaliciousPatterns(input: string): string {
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
    ];

    let filtered = input;
    for (const pattern of maliciousPatterns) {
      filtered = filtered.replace(pattern, '[CONTENIDO BLOQUEADO]');
    }

    return filtered;
  }

  // Métodos específicos del DomSanitizer

  // Sanitizar HTML de forma segura
  sanitizeTrustedHtml(): void {
    if (this.isHtmlSafe(this.sanitizerDemoHtml)) {
      this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(this.sanitizerDemoHtml);
    } else {
      this.trustedHtml = null;
    }
  }

  // Sanitizar URL de forma segura
  sanitizeTrustedUrl(): void {
    if (this.isValidUrl(this.sanitizerDemoUrl)) {
      this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(this.sanitizerDemoUrl);
    } else {
      this.trustedUrl = null;
    }
  }

  // Verificar si el HTML es seguro (simplificado para demo)
  isHtmlSafe(html: string): boolean {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<form/i
    ];

    return !dangerousPatterns.some(pattern => pattern.test(html));
  }

  // Verificar dominio en lista blanca
  isWhitelistedDomain(url: string): boolean {
    try {
      const parsed = new URL(url);
      const allowedDomains = [
        'angular.io',
        'developer.mozilla.org',
        'github.com',
        'stackblitz.com'
      ];
      return allowedDomains.some(domain =>
        parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
      );
    } catch {
      return false;
    }
  }

  // Obtener ResourceUrl segura
  getSafeResourceUrl(url: string): SafeResourceUrl | null {
    if (this.isValidUrl(url) && this.isWhitelistedDomain(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return null;
  }

  // Resetear demostraciones
  resetSanitizerDemo(): void {
    this.trustedHtml = null;
    this.trustedUrl = null;
    this.sanitizerDemoHtml = '<p>Contenido <strong>HTML</strong> seguro</p>';
    this.sanitizerDemoUrl = 'https://angular.io/guide/security';
  }
}
