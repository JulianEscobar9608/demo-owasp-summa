import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VulnerableDemoComponent } from '../vulnerable-demo/vulnerable-demo.component';
import { AngularProtectionComponent } from '../angular-protection/angular-protection.component';
import { BestPracticesComponent } from '../best-practices/best-practices.component';
import { PracticalExercisesComponent } from '../practical-exercises/practical-exercises.component';
import { AdvancedSecurityComponent } from '../advanced-security/advanced-security.component';
import { BrokenAccessIntroComponent } from '../broken-access-intro/broken-access-intro.component';
import { AccessAngularGuardsComponent } from '../access-angular-guards/access-angular-guards.component';
import { AccessVulnerableExamplesComponent } from '../access-vulnerable-examples/access-vulnerable-examples.component';
import { AccessJwtSecurityComponent } from '../access-jwt-security/access-jwt-security.component';
import { AccessRolesPermissionsComponent } from '../access-roles-permissions/access-roles-permissions.component';
import { AccessTestingSecurityComponent } from '../access-testing-security/access-testing-security.component';
import { AccessPreventionMitigationComponent } from '../access-prevention-mitigation/access-prevention-mitigation.component';
import { InsecureDesignIntroComponent } from '../insecure-design-intro/insecure-design-intro.component';
import { InsecureDesignVulnerableComponent } from '../insecure-design-vulnerable/insecure-design-vulnerable.component';
import { InsecureDesignProtectionComponent } from '../insecure-design-protection/insecure-design-protection.component';
import { InsecureDesignBestPracticesComponent } from '../insecure-design-best-practices/insecure-design-best-practices.component';
import { InsecureDesignExercisesComponent } from '../insecure-design-exercises/insecure-design-exercises.component';
import { AccessDotnetAuthenticationComponent } from '../access-dotnet-authentication/access-dotnet-authentication.component';
import { AccessDotnetAuthorizationComponent } from '../access-dotnet-authorization/access-dotnet-authorization.component';
import { AccessDotnetSecurityComponent } from '../access-dotnet-security/access-dotnet-security.component';
import { AccessIntegrationBestPracticesComponent } from '../access-integration-best-practices/access-integration-best-practices.component';
import { InsecureDesignDotnetArchitectureComponent } from '../insecure-design-dotnet-architecture/insecure-design-dotnet-architecture.component';
import { InsecureDesignDotnetSecurityPatternsComponent } from '../insecure-design-dotnet-security-patterns/insecure-design-dotnet-security-patterns.component';
import { InsecureDesignIntegrationPracticesComponent } from '../insecure-design-integration-practices/insecure-design-integration-practices.component';

interface TutorialChapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

interface VulnerabilityModule {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  severity: 'critical' | 'high' | 'medium';
  chapters: TutorialChapter[];
  completed: boolean;
}

@Component({
  selector: 'app-xss-tutorial',
  standalone: true,
  imports: [
    CommonModule,
    VulnerableDemoComponent,
    AngularProtectionComponent,
    BestPracticesComponent,
    PracticalExercisesComponent,
    AdvancedSecurityComponent,
    BrokenAccessIntroComponent,
    AccessAngularGuardsComponent,
    AccessVulnerableExamplesComponent,
    AccessJwtSecurityComponent,
    AccessRolesPermissionsComponent,
    AccessTestingSecurityComponent,
    AccessPreventionMitigationComponent,
    AccessDotnetAuthenticationComponent,
    AccessDotnetAuthorizationComponent,
    AccessDotnetSecurityComponent,
    AccessIntegrationBestPracticesComponent,
    InsecureDesignIntroComponent,
    InsecureDesignVulnerableComponent,
    InsecureDesignProtectionComponent,
    InsecureDesignBestPracticesComponent,
    InsecureDesignExercisesComponent,
    InsecureDesignDotnetArchitectureComponent,
    InsecureDesignDotnetSecurityPatternsComponent,
    InsecureDesignIntegrationPracticesComponent
  ],
  templateUrl: './xss-tutorial.component.html',
  styleUrl: './xss-tutorial.component.css'
})
export class XssTutorialComponent {
  currentModule: string = 'overview';
  currentChapter: string = 'overview-intro';

  modules: VulnerabilityModule[] = [
    {
      id: 'overview',
      title: 'OWASP Top 10 Overview',
      shortTitle: 'Overview',
      description: 'Introducción al OWASP Top 10 y su aplicación en Angular',
      icon: '🎯',
      severity: 'medium',
      completed: false,
      chapters: [
        {
          id: 'overview-intro',
          title: 'Introducción al OWASP',
          description: 'Conceptos fundamentales y metodología OWASP Top 10',
          icon: '📚',
          completed: false
        }
      ]
    },
    {
      id: 'broken-access-control',
      title: 'A01: Broken Access Control',
      shortTitle: 'Access Control',
      description: 'Control de acceso roto - Guards, permisos y autorización',
      icon: '🚪',
      severity: 'critical',
      completed: false,
      chapters: [
        {
          id: 'broken-access-intro',
          title: 'Introducción',
          description: 'Conceptos y tipos de vulnerabilidades de control de acceso',
          icon: '📖',
          completed: false
        },
        {
          id: 'access-prevention-mitigation',
          title: 'Prevención y Mitigación',
          description: 'Guards seguros, validación del servidor y estrategias de prevención',
          icon: '🛡️',
          completed: false
        },
        {
          id: 'access-angular-guards',
          title: 'Angular Guards',
          description: 'CanActivate, CanDeactivate, Guards y autenticación',
          icon: '�',
          completed: false
        },
        {
          id: 'access-vulnerable-examples',
          title: 'Ejemplos Vulnerables',
          description: 'Código inseguro y bypass de autorización',
          icon: '⚠️',
          completed: false
        },
        {
          id: 'access-jwt-security',
          title: 'JWT y Tokens',
          description: 'Gestión segura de tokens y autenticación',
          icon: '🔐',
          completed: false
        },
        {
          id: 'access-role-permissions',
          title: 'Roles y Permisos',
          description: 'RBAC, autorización basada en roles en Angular',
          icon: '👥',
          completed: false
        },
        {
          id: 'access-testing-security',
          title: 'Testing de Seguridad',
          description: 'Pruebas automatizadas para control de acceso',
          icon: '🧪',
          completed: false
        },
        {
          id: 'access-dotnet-authentication',
          title: 'Autenticación .NET Core',
          description: 'Autenticación en .NET Core: Identity, JWT, OAuth',
          icon: '🔐',
          completed: false
        },
        {
          id: 'access-dotnet-authorization',
          title: 'Autorización .NET Core',
          description: 'Autorización avanzada: RBAC, Claims, Resource-based',
          icon: '🛡️',
          completed: false
        },
        {
          id: 'access-dotnet-security',
          title: 'Seguridad .NET Core',
          description: 'Prácticas de seguridad y herramientas para .NET Core',
          icon: '🔒',
          completed: false
        },
        {
          id: 'access-integration-best-practices',
          title: 'Integración Angular + .NET',
          description: 'Mejores prácticas para integración segura Angular/.NET',
          icon: '🔗',
          completed: false
        }
      ]
    },
    {
      id: 'injection',
      title: 'A03: Injection (XSS)',
      shortTitle: 'XSS',
      description: 'Inyección XSS - Cross-Site Scripting en Angular',
      icon: '💉',
      severity: 'critical',
      completed: false,
      chapters: [
        {
          id: 'xss-vulnerable',
          title: 'Código Vulnerable',
          description: 'Ejemplos de código vulnerable a ataques XSS',
          icon: '⚠️',
          completed: false
        },
        {
          id: 'xss-protection',
          title: 'Protección Angular',
          description: 'Mecanismos de protección XSS en Angular',
          icon: '🛡️',
          completed: false
        },
        {
          id: 'xss-practices',
          title: 'Buenas Prácticas',
          description: 'Buenas prácticas para prevenir XSS',
          icon: '✅',
          completed: false
        },
        {
          id: 'xss-exercises',
          title: 'Ejercicios Prácticos',
          description: 'Ejercicios interactivos de seguridad XSS',
          icon: '🎯',
          completed: false
        },
        {
          id: 'xss-advanced',
          title: 'Configuración Avanzada',
          description: 'CSP, headers de seguridad y configuraciones avanzadas',
          icon: '⚙️',
          completed: false
        }
      ]
    },
    {
      id: 'insecure-design',
      title: 'A04: Insecure Design',
      shortTitle: 'Insecure Design',
      description: 'Diseño inseguro - Fallas arquitecturales y de diseño',
      icon: '🏗️',
      severity: 'high',
      completed: false,
      chapters: [
        {
          id: 'insecure-design-intro',
          title: 'Introducción al Diseño Inseguro',
          description: 'Conceptos de Insecure Design y problemas arquitecturales',
          icon: '📚',
          completed: false
        },
        {
          id: 'insecure-design-vulnerable',
          title: 'Ejemplos Vulnerables',
          description: 'Código vulnerable con fallas de diseño en Angular',
          icon: '⚠️',
          completed: false
        },
        {
          id: 'insecure-design-protection',
          title: 'Patrones de Protección',
          description: 'Arquitectura segura y patrones de diseño defensivos',
          icon: '🛡️',
          completed: false
        },
        {
          id: 'insecure-design-best-practices',
          title: 'Mejores Prácticas',
          description: 'Frameworks, herramientas y metodologías de desarrollo seguro',
          icon: '📋',
          completed: false
        },
        {
          id: 'insecure-design-exercises',
          title: 'Ejercicios Prácticos',
          description: 'Laboratorios y casos de estudio de diseño seguro',
          icon: '🎯',
          completed: false
        },
        {
          id: 'insecure-design-dotnet-architecture',
          title: 'Arquitectura Segura en .NET',
          description: 'Patrones arquitecturales seguros, threat modeling y Zero Trust',
          icon: '🏛️',
          completed: false
        },
        {
          id: 'insecure-design-dotnet-security-patterns',
          title: 'Patrones de Seguridad .NET',
          description: 'Validación, encoding, configuración y manejo de errores',
          icon: '🔐',
          completed: false
        },
        {
          id: 'insecure-design-dotnet-best-practices',
          title: 'Azure Security y .NET',
          description: 'Managed Identity, Key Vault y deployment seguro',
          icon: '☁️',
          completed: false
        },
        {
          id: 'insecure-design-integration-practices',
          title: 'DevSecOps e Integración',
          description: 'CI/CD security, testing, IaC y monitoreo',
          icon: '🔄',
          completed: false
        }
      ]
    }
  ];

  // Navigation methods
  navigateToModule(moduleId: string): void {
    this.currentModule = moduleId;
    const module = this.modules.find(m => m.id === moduleId);
    if (module && module.chapters.length > 0) {
      this.currentChapter = module.chapters[0].id;
    }
  }

  navigateToChapter(chapterId: string): void {
    this.currentChapter = chapterId;
  }

  // Completion methods
  markChapterCompleted(chapterId: string): void {
    for (const module of this.modules) {
      const chapter = module.chapters.find(c => c.id === chapterId);
      if (chapter) {
        chapter.completed = true;
        // Check if all chapters in module are completed
        module.completed = module.chapters.every(c => c.completed);
        break;
      }
    }
  }

  markModuleCompleted(moduleId: string): void {
    const module = this.modules.find(m => m.id === moduleId);
    if (module) {
      module.completed = true;
      for (const chapter of module.chapters) {
        chapter.completed = true;
      }
    }
  }

  // Getter methods
  getCurrentModule(): VulnerabilityModule | undefined {
    return this.modules.find(m => m.id === this.currentModule);
  }

  getCurrentChapter(): TutorialChapter | undefined {
    const module = this.getCurrentModule();
    if (!module) return undefined;
    return module.chapters.find(c => c.id === this.currentChapter);
  }

  getCurrentModuleChapters(): TutorialChapter[] {
    const module = this.getCurrentModule();
    return module ? module.chapters : [];
  }

  getProgressPercentage(): number {
    const totalChapters = this.modules.reduce((total, module) => total + module.chapters.length, 0);
    const completedChapters = this.modules.reduce((total, module) =>
      total + module.chapters.filter(c => c.completed).length, 0);
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  }

  getModuleProgressPercentage(moduleId: string): number {
    const module = this.modules.find(m => m.id === moduleId);
    if (!module || module.chapters.length === 0) return 0;
    const completedChapters = module.chapters.filter(c => c.completed).length;
    return Math.round((completedChapters / module.chapters.length) * 100);
  }

  getCompletedChaptersCount(): number {
    return this.modules.reduce((total, module) =>
      total + module.chapters.filter(c => c.completed).length, 0);
  }

  getTotalChaptersCount(): number {
    return this.modules.reduce((total, module) => total + module.chapters.length, 0);
  }

  // Navigation helpers
  getNextChapter(): TutorialChapter | null {
    const currentModule = this.getCurrentModule();
    if (!currentModule) return null;

    const currentChapterIndex = currentModule.chapters.findIndex(c => c.id === this.currentChapter);

    // Next chapter in current module
    if (currentChapterIndex < currentModule.chapters.length - 1) {
      return currentModule.chapters[currentChapterIndex + 1];
    }

    // First chapter of next module
    const currentModuleIndex = this.modules.findIndex(m => m.id === this.currentModule);
    if (currentModuleIndex < this.modules.length - 1) {
      const nextModule = this.modules[currentModuleIndex + 1];
      return nextModule.chapters.length > 0 ? nextModule.chapters[0] : null;
    }

    return null;
  }

  getPrevChapter(): TutorialChapter | null {
    const currentModule = this.getCurrentModule();
    if (!currentModule) return null;

    const currentChapterIndex = currentModule.chapters.findIndex(c => c.id === this.currentChapter);

    // Previous chapter in current module
    if (currentChapterIndex > 0) {
      return currentModule.chapters[currentChapterIndex - 1];
    }

    // Last chapter of previous module
    const currentModuleIndex = this.modules.findIndex(m => m.id === this.currentModule);
    if (currentModuleIndex > 0) {
      const prevModule = this.modules[currentModuleIndex - 1];
      return prevModule.chapters.length > 0 ? prevModule.chapters.at(-1) ?? null : null;
    }

    return null;
  }

  navigateToNextChapter(): void {
    const nextChapter = this.getNextChapter();
    if (nextChapter) {
      // Find module containing this chapter
      for (const module of this.modules) {
        if (module.chapters.some(c => c.id === nextChapter.id)) {
          this.currentModule = module.id;
          this.currentChapter = nextChapter.id;
          break;
        }
      }
    }
  }

  navigateToPrevChapter(): void {
    const prevChapter = this.getPrevChapter();
    if (prevChapter) {
      // Find module containing this chapter
      for (const module of this.modules) {
        if (module.chapters.some(c => c.id === prevChapter.id)) {
          this.currentModule = module.id;
          this.currentChapter = prevChapter.id;
          break;
        }
      }
    }
  }

  restartTutorial(): void {
    for (const module of this.modules) {
      module.completed = false;
      for (const chapter of module.chapters) {
        chapter.completed = false;
      }
    }
    this.currentModule = 'overview';
    this.currentChapter = 'overview-intro';
  }

  // Template helper methods
  getCurrentChapterIndex(): number {
    const currentModule = this.getCurrentModule();
    if (!currentModule) return 0;

    const chapterIndex = currentModule.chapters.findIndex(chapter => chapter.id === this.currentChapter);
    return chapterIndex >= 0 ? chapterIndex + 1 : 1;
  }

  getCurrentChapterCount(): number {
    const currentModule = this.getCurrentModule();
    return currentModule ? currentModule.chapters.length : 0;
  }

}
