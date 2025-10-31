import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SecurityFramework {
  id: string;
  name: string;
  type: 'methodology' | 'standard' | 'practice';
  description: string;
  keyPrinciples: string[];
  angularImplementation: string;
  tools: string[];
  maturityLevel: 'basic' | 'intermediate' | 'advanced';
  adoptionSteps: string[];
  benefits: string[];
  codeExample: string;
}

interface DevelopmentPhase {
  phase: string;
  activities: SecurityActivity[];
  deliverables: string[];
  tools: string[];
  angularSpecific: string[];
}

interface SecurityActivity {
  activity: string;
  description: string;
  owner: string;
  frequency: string;
  automation: boolean;
}

interface SecurityTool {
  id: string;
  name: string;
  category: 'static-analysis' | 'dynamic-testing' | 'dependency-check' | 'monitoring';
  description: string;
  angularSupport: boolean;
  integration: string;
  configuration: string;
  benefits: string[];
  limitations: string[];
}

interface ComplianceFramework {
  id: string;
  name: string;
  scope: string;
  requirements: string[];
  angularMapping: string[];
  implementationGuide: string;
  auditChecklist: string[];
}

@Component({
  selector: 'app-insecure-design-best-practices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insecure-design-best-practices.component.html',
  styleUrls: ['./insecure-design-best-practices.component.css']
})
export class InsecureDesignBestPracticesComponent {
  activeTab: string = 'frameworks';
  selectedFramework: string = 'sdlc';
  selectedPhase: string = 'planning';
  selectedTool: string = 'eslint';
  selectedCompliance: string = 'owasp';

  securityFrameworks: SecurityFramework[] = [
    {
      id: 'sdlc',
      name: 'Secure Development Lifecycle (SDLC)',
      type: 'methodology',
      description: 'Metodología integral para integrar seguridad en cada fase del desarrollo de aplicaciones Angular',
      keyPrinciples: [
        'Security by Design - Seguridad desde el diseño inicial',
        'Threat Modeling - Modelado de amenazas específicas',
        'Secure Coding Standards - Estándares de codificación segura',
        'Continuous Security Testing - Testing de seguridad continuo',
        'Security Reviews - Revisiones de seguridad regulares',
        'Incident Response - Respuesta a incidentes preparada'
      ],
      angularImplementation: 'Implementación en Angular usando guards, interceptors, sanitización automática, CSP headers y validación tanto client-side como server-side',
      tools: ['SonarQube', 'ESLint Security', 'Snyk', 'OWASP ZAP', 'npm audit'],
      maturityLevel: 'advanced',
      adoptionSteps: [
        '1. Establecer políticas de seguridad específicas para Angular',
        '2. Configurar herramientas de análisis estático y dinámico',
        '3. Implementar threat modeling para componentes Angular',
        '4. Crear templates seguros y guidelines de desarrollo',
        '5. Establecer pipeline de CI/CD con checks de seguridad',
        '6. Entrenar al equipo en prácticas de Angular seguro'
      ],
      benefits: [
        'Reducción del 60% en vulnerabilidades críticas',
        'Detección temprana de problemas de diseño',
        'Cumplimiento automático de estándares de seguridad',
        'Menor costo de corrección de vulnerabilidades',
        'Mayor confianza del cliente y usuarios finales'
      ],
      codeExample: `// SDLC - Implementación en Angular
// 1. Security Guard Template
@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Threat model validation
    const requiredPermissions = route.data['permissions'] || [];
    const userPermissions = this.authService.getUserPermissions();

    // Secure by design principle
    return requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
  }
}

// 2. Secure HTTP Interceptor
@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Security headers by default
    const secureReq = req.clone({
      setHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    });

    return next.handle(secureReq);
  }
}`
    },
    {
      id: 'owasp-samm',
      name: 'OWASP SAMM (Software Assurance Maturity Model)',
      type: 'standard',
      description: 'Framework de madurez para evaluar y mejorar las prácticas de seguridad en desarrollo Angular',
      keyPrinciples: [
        'Governance - Gobernanza y políticas de seguridad',
        'Design - Diseño seguro y threat modeling',
        'Implementation - Implementación con prácticas seguras',
        'Verification - Verificación y testing de seguridad',
        'Operations - Operaciones y monitoreo seguros'
      ],
      angularImplementation: 'Evaluación de madurez específica para aplicaciones Angular con métricas de componentes seguros, uso de guards, sanitización y configuración de CSP',
      tools: ['SAMM Assessment', 'Security Scorecards', 'Angular Security Linter'],
      maturityLevel: 'intermediate',
      adoptionSteps: [
        '1. Realizar assessment inicial de madurez Angular',
        '2. Identificar gaps en prácticas de seguridad Angular',
        '3. Crear roadmap de mejora específico para Angular',
        '4. Implementar controles de seguridad por nivel',
        '5. Establecer métricas de progreso Angular-específicas',
        '6. Revisión y mejora continua del modelo'
      ],
      benefits: [
        'Evaluación objetiva del nivel de seguridad',
        'Roadmap claro para mejoras de seguridad',
        'Métricas cuantificables de progreso',
        'Alineación con estándares de la industria',
        'Mejora continua y sistemática'
      ],
      codeExample: `// OWASP SAMM - Angular Security Assessment
interface SAMMAssessment {
  governance: {
    securityPolicies: boolean;
    trainingPrograms: boolean;
    complianceChecks: boolean;
  };
  design: {
    threatModeling: boolean;
    secureArchitecture: boolean;
    dataProtection: boolean;
  };
  implementation: {
    secureComponents: number;
    guardsCoverage: number;
    sanitizationUsage: number;
  };
}

// SAMM Maturity Calculator for Angular
class AngularSAMMCalculator {
  calculateMaturity(assessment: SAMMAssessment): number {
    const governanceScore = this.calculateGovernanceScore(assessment.governance);
    const designScore = this.calculateDesignScore(assessment.design);
    const implementationScore = this.calculateImplementationScore(assessment.implementation);

    return (governanceScore + designScore + implementationScore) / 3;
  }

  generateImprovementPlan(currentScore: number): string[] {
    if (currentScore < 2) {
      return [
        'Implement basic Angular security guards',
        'Enable automatic sanitization',
        'Configure basic CSP headers'
      ];
    }
    // ... more maturity levels
    return [];
  }
}`
    },
    {
      id: 'devsecops',
      name: 'DevSecOps para Angular',
      type: 'practice',
      description: 'Integración de seguridad en pipelines de CI/CD específicamente para aplicaciones Angular',
      keyPrinciples: [
        'Shift Left Security - Seguridad desde desarrollo',
        'Automation First - Automatización de controles',
        'Continuous Monitoring - Monitoreo continuo',
        'Fast Feedback - Retroalimentación rápida',
        'Shared Responsibility - Responsabilidad compartida'
      ],
      angularImplementation: 'Pipeline automatizado con linting de seguridad Angular, análisis de dependencias npm, testing de componentes seguros y deployment con headers de seguridad',
      tools: ['Jenkins/GitHub Actions', 'Docker Security', 'Kubernetes Security', 'Angular CLI'],
      maturityLevel: 'advanced',
      adoptionSteps: [
        '1. Configurar pipeline básico con Angular CLI',
        '2. Integrar análisis de seguridad automatizado',
        '3. Implementar tests de seguridad para componentes',
        '4. Configurar deployment seguro con headers',
        '5. Establecer monitoreo de seguridad en producción',
        '6. Crear feedback loops para mejora continua'
      ],
      benefits: [
        'Detección automática de vulnerabilidades',
        'Deployment más seguro y confiable',
        'Reducción de tiempo de corrección',
        'Mayor colaboración entre equipos',
        'Compliance automatizado'
      ],
      codeExample: `# DevSecOps Pipeline para Angular
# .github/workflows/angular-security.yml
name: Angular Security Pipeline

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Angular Security Linting
      - name: Security Lint
        run: |
          npm install
          npx ng lint --configuration=security

      # Dependency Security Scan
      - name: Dependency Check
        run: |
          npm audit --audit-level high
          npx snyk test

      # Component Security Testing
      - name: Security Unit Tests
        run: |
          npm run test:security
          npm run e2e:security

      # Build with Security Headers
      - name: Secure Build
        run: |
          ng build --configuration=production
          # Add CSP and security headers
          node scripts/add-security-headers.js

      # Container Security Scan
      - name: Container Scan
        run: |
          docker build -t angular-app .
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
            aquasec/trivy image angular-app`
    }
  ];

  developmentPhases: DevelopmentPhase[] = [
    {
      phase: 'Planning & Requirements',
      activities: [
        {
          activity: 'Security Requirements Definition',
          description: 'Definir requerimientos de seguridad específicos para la aplicación Angular',
          owner: 'Security Architect',
          frequency: 'Por proyecto',
          automation: false
        },
        {
          activity: 'Threat Modeling',
          description: 'Identificar amenazas específicas para componentes y servicios Angular',
          owner: 'Development Team',
          frequency: 'Por feature',
          automation: true
        },
        {
          activity: 'Security Architecture Review',
          description: 'Revisar arquitectura Angular desde perspectiva de seguridad',
          owner: 'Security Team',
          frequency: 'Por sprint',
          automation: false
        }
      ],
      deliverables: [
        'Security Requirements Document',
        'Threat Model Diagrams',
        'Security Architecture Blueprint',
        'Angular Security Guidelines'
      ],
      tools: ['Microsoft Threat Modeling Tool', 'OWASP Threat Dragon', 'Angular Schematics'],
      angularSpecific: [
        'Component security patterns',
        'Service injection security',
        'Router guard configurations',
        'HTTP interceptor design'
      ]
    },
    {
      phase: 'Design & Architecture',
      activities: [
        {
          activity: 'Secure Component Design',
          description: 'Diseñar componentes Angular con principios de seguridad',
          owner: 'Frontend Architect',
          frequency: 'Por componente',
          automation: true
        },
        {
          activity: 'API Security Design',
          description: 'Diseñar APIs con consideraciones de seguridad para Angular',
          owner: 'Backend Team',
          frequency: 'Por API',
          automation: false
        },
        {
          activity: 'Data Flow Security Review',
          description: 'Revisar flujos de datos entre componentes y servicios',
          owner: 'Security Team',
          frequency: 'Por feature',
          automation: true
        }
      ],
      deliverables: [
        'Secure Component Templates',
        'API Security Specifications',
        'Data Flow Diagrams',
        'Security Design Patterns'
      ],
      tools: ['Angular Schematics', 'Swagger/OpenAPI', 'PlantUML'],
      angularSpecific: [
        'Template security patterns',
        'Dependency injection security',
        'State management security',
        'Communication security patterns'
      ]
    },
    {
      phase: 'Implementation',
      activities: [
        {
          activity: 'Secure Coding Practices',
          description: 'Implementar código Angular siguiendo estándares de seguridad',
          owner: 'Developers',
          frequency: 'Continuo',
          automation: true
        },
        {
          activity: 'Code Security Review',
          description: 'Revisar código Angular para identificar vulnerabilidades',
          owner: 'Senior Developer',
          frequency: 'Por PR',
          automation: true
        },
        {
          activity: 'Dependency Security Management',
          description: 'Gestionar dependencias npm con consideraciones de seguridad',
          owner: 'DevOps Team',
          frequency: 'Semanal',
          automation: true
        }
      ],
      deliverables: [
        'Secure Angular Components',
        'Code Review Reports',
        'Dependency Audit Reports',
        'Security Test Cases'
      ],
      tools: ['ESLint Security', 'SonarQube', 'Snyk', 'npm audit'],
      angularSpecific: [
        'Angular security linter rules',
        'Component security testing',
        'Service security validation',
        'Build security optimization'
      ]
    }
  ];

  securityTools: SecurityTool[] = [
    {
      id: 'eslint',
      name: 'ESLint Security Plugin',
      category: 'static-analysis',
      description: 'Análisis estático de código Angular para detectar vulnerabilidades de seguridad',
      angularSupport: true,
      integration: 'Integración nativa con Angular CLI y pipelines de CI/CD',
      configuration: `{
  "extends": ["@angular-eslint/recommended", "plugin:security/recommended"],
  "rules": {
    "security/detect-object-injection": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-non-literal-regexp": "warn"
  }
}`,
      benefits: [
        'Detección temprana de vulnerabilidades',
        'Integración con IDE y CI/CD',
        'Reglas específicas para Angular',
        'Feedback inmediato a developers'
      ],
      limitations: [
        'Solo análisis estático',
        'Falsos positivos ocasionales',
        'No detecta vulnerabilidades lógicas complejas'
      ]
    },
    {
      id: 'sonarqube',
      name: 'SonarQube Security',
      category: 'static-analysis',
      description: 'Plataforma completa de análisis de calidad y seguridad de código para proyectos Angular',
      angularSupport: true,
      integration: 'Plugin específico para TypeScript y Angular con reglas de seguridad personalizadas',
      configuration: `sonar.projectKey=angular-security-project
sonar.sources=src
sonar.exclusions=**/*.spec.ts,**/node_modules/**
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.security.hotspots.inherited=true`,
      benefits: [
        'Análisis profundo de seguridad',
        'Métricas de calidad y seguridad',
        'Tracking de progreso histórico',
        'Integración con herramientas de desarrollo'
      ],
      limitations: [
        'Requiere configuración inicial compleja',
        'Licencia comercial para equipos grandes',
        'Curva de aprendizaje pronunciada'
      ]
    },
    {
      id: 'snyk',
      name: 'Snyk Vulnerability Scanner',
      category: 'dependency-check',
      description: 'Escáner de vulnerabilidades en dependencias npm y análisis de código Angular',
      angularSupport: true,
      integration: 'CLI, IDE plugins, GitHub Actions y integración con Angular CLI',
      configuration: `{
  "language-settings": {
    "javascript": {
      "includeDevDependencies": true
    }
  },
  "exclude": {
    "global": ["**/*.spec.ts", "**/test/**"]
  }
}`,
      benefits: [
        'Base de datos actualizada de vulnerabilidades',
        'Sugerencias automáticas de corrección',
        'Monitoreo continuo de dependencias',
        'Informes detallados de seguridad'
      ],
      limitations: [
        'Enfoque principalmente en dependencias',
        'Limitaciones en plan gratuito',
        'Requiere conectividad constante'
      ]
    }
  ];

  complianceFrameworks: ComplianceFramework[] = [
    {
      id: 'owasp',
      name: 'OWASP Top 10 Compliance',
      scope: 'Cumplimiento con las 10 vulnerabilidades más críticas según OWASP',
      requirements: [
        'A01 - Broken Access Control Prevention',
        'A02 - Cryptographic Failures Protection',
        'A03 - Injection Attack Prevention',
        'A04 - Insecure Design Mitigation',
        'A05 - Security Misconfiguration Prevention',
        'A06 - Vulnerable Components Management',
        'A07 - Authentication Failures Prevention',
        'A08 - Software Integrity Failures Prevention',
        'A09 - Logging Failures Prevention',
        'A10 - SSRF Prevention'
      ],
      angularMapping: [
        'Router Guards para Access Control',
        'HTTP Interceptors para Cryptography',
        'Sanitización automática para Injection',
        'Secure Design Patterns para Insecure Design',
        'Angular Security Headers para Misconfiguration',
        'npm audit para Vulnerable Components',
        'Auth Services para Authentication',
        'CSP y SRI para Software Integrity',
        'Logging Services para Security Logging',
        'HTTP Client validation para SSRF'
      ],
      implementationGuide: `Implementación paso a paso:
1. Configurar Guards en todas las rutas sensibles
2. Implementar interceptors con headers de seguridad
3. Usar sanitización automática en templates
4. Aplicar patrones de diseño seguro en componentes
5. Configurar CSP y security headers
6. Automatizar auditoría de dependencias
7. Implementar servicios de autenticación robustos
8. Configurar Content Security Policy
9. Implementar logging de seguridad
10. Validar todas las comunicaciones HTTP`,
      auditChecklist: [
        '✅ Todas las rutas protegidas tienen guards',
        '✅ Headers de seguridad configurados',
        '✅ Sanitización automática habilitada',
        '✅ Componentes siguen patrones seguros',
        '✅ CSP configurado correctamente',
        '✅ Dependencias actualizadas y auditadas',
        '✅ Autenticación multi-factor implementada',
        '✅ Integridad de software verificada',
        '✅ Logging de seguridad configurado',
        '✅ Validación SSRF implementada'
      ]
    }
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setSelectedFramework(frameworkId: string): void {
    this.selectedFramework = frameworkId;
  }

  setSelectedPhase(phaseId: string): void {
    this.selectedPhase = phaseId;
  }

  setSelectedTool(toolId: string): void {
    this.selectedTool = toolId;
  }

  setSelectedCompliance(complianceId: string): void {
    this.selectedCompliance = complianceId;
  }

  getSelectedFramework(): SecurityFramework | undefined {
    return this.securityFrameworks.find(f => f.id === this.selectedFramework);
  }

  getSelectedPhase(): DevelopmentPhase | undefined {
    return this.developmentPhases.find(p => p.phase.toLowerCase().includes(this.selectedPhase));
  }

  getSelectedTool(): SecurityTool | undefined {
    return this.securityTools.find(t => t.id === this.selectedTool);
  }

  getSelectedCompliance(): ComplianceFramework | undefined {
    return this.complianceFrameworks.find(c => c.id === this.selectedCompliance);
  }

  getMaturityColor(level: string): string {
    switch (level) {
      case 'basic': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#64748b';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'static-analysis': return '🔍';
      case 'dynamic-testing': return '🎯';
      case 'dependency-check': return '📦';
      case 'monitoring': return '📊';
      default: return '🛠️';
    }
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      console.log('Código copiado al portapapeles');
    });
  }

  downloadChecklist(): void {
    const compliance = this.getSelectedCompliance();
    if (compliance) {
      const checklist = compliance.auditChecklist.join('\n');
      const blob = new Blob([checklist], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${compliance.name}_checklist.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
