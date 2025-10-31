import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DesignProblem {
  id: string;
  name: string;
  description: string;
  example: string;
  impact: 'critical' | 'high' | 'medium';
  angularContext: string;
  icon: string;
}

interface ThreatScenario {
  scenario: string;
  description: string;
  vulnerability: string;
  exploitation: string;
  prevention: string;
  severity: 'critical' | 'high' | 'medium';
}

@Component({
  selector: 'app-insecure-design-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insecure-design-intro.component.html',
  styleUrl: './insecure-design-intro.component.css'
})
export class InsecureDesignIntroComponent {
  currentExample: string = 'overview';

  designProblems: DesignProblem[] = [
    {
      id: 'missing-validation',
      name: 'Validación Ausente',
      description: 'Falta de validación en capas críticas de la aplicación',
      example: 'Forms sin validación server-side, APIs que confían en el frontend',
      impact: 'critical',
      angularContext: 'Formularios reactivos sin validators custom, pipes inseguros',
      icon: '❌'
    },
    {
      id: 'weak-authentication',
      name: 'Autenticación Débil',
      description: 'Procesos de autenticación mal diseñados o insuficientes',
      example: 'Passwords débiles, sin 2FA, tokens predecibles',
      impact: 'critical',
      angularContext: 'Guards que no validan correctamente, JWT mal implementados',
      icon: '🔓'
    },
    {
      id: 'insufficient-authorization',
      name: 'Autorización Insuficiente',
      description: 'Controles de acceso mal diseñados o incompletos',
      example: 'RBAC inexistente, privilegios por defecto altos',
      impact: 'high',
      angularContext: 'Route guards simples, sin validación de ownership',
      icon: '🚫'
    },
    {
      id: 'data-exposure',
      name: 'Exposición de Datos',
      description: 'APIs y servicios que exponen más información de la necesaria',
      example: 'APIs sin filtrado, logs con información sensible',
      impact: 'high',
      angularContext: 'Services que no filtran datos, interceptors ausentes',
      icon: '📊'
    },
    {
      id: 'business-logic-flaws',
      name: 'Lógica de Negocio Defectuosa',
      description: 'Flujos de trabajo mal diseñados que permiten bypass',
      example: 'Procesos de compra manipulables, workflows saltables',
      impact: 'critical',
      angularContext: 'State management inseguro, validación solo en UI',
      icon: '⚙️'
    },
    {
      id: 'insecure-defaults',
      name: 'Configuración Insegura',
      description: 'Configuraciones por defecto que comprometen la seguridad',
      example: 'Debug habilitado en producción, CORS permisivo',
      impact: 'medium',
      angularContext: 'Environment configs expuestos, build sin optimizaciones',
      icon: '⚙️'
    }
  ];

  threatScenarios: ThreatScenario[] = [
    {
      scenario: 'Bypass de Proceso de Compra',
      description: 'Atacante manipula el flujo de compra para obtener productos gratis',
      vulnerability: 'Validación solo en frontend, sin verificación de integridad',
      exploitation: 'Modificación de requests, manipulación del state manager',
      prevention: 'Validación completa en backend, immutable state, audit trail',
      severity: 'critical'
    },
    {
      scenario: 'Escalación de Privilegios',
      description: 'Usuario regular obtiene acceso de administrador',
      vulnerability: 'Authorization checks incompletos, roles mal diseñados',
      exploitation: 'Manipulación de tokens JWT, bypass de route guards',
      prevention: 'RBAC granular, validación server-side, principle of least privilege',
      severity: 'critical'
    },
    {
      scenario: 'Exposición de Datos Sensibles',
      description: 'API expone información de otros usuarios',
      vulnerability: 'Falta de filtrado por ownership, APIs demasiado permisivas',
      exploitation: 'Enumeration attacks, manipulation de parámetros',
      prevention: 'Data filtering, ownership validation, minimal data exposure',
      severity: 'high'
    }
  ];

  angularSpecificRisks = [
    {
      risk: 'Client-Side Security',
      description: 'Confiar únicamente en validaciones del frontend',
      examples: [
        'Validators de Angular sin validación backend',
        'Route Guards como única línea de defensa',
        'Configuraciones sensibles en environment.ts'
      ]
    },
    {
      risk: 'State Management',
      description: 'Estado de la aplicación manipulable o predecible',
      examples: [
        'NgRx state sin encryption para datos sensibles',
        'Local/Session storage con información crítica',
        'Observables que exponen datos sin autorización'
      ]
    },
    {
      risk: 'Service Architecture',
      description: 'Servicios mal diseñados que facilitan ataques',
      examples: [
        'HTTP Services sin interceptors de seguridad',
        'Servicios que no validan ownership',
        'APIs que retornan más datos de los necesarios'
      ]
    }
  ];

  setExample(example: string): void {
    this.currentExample = example;
  }

  getImpactColor(impact: string): string {
    const colors = {
      'critical': '#dc2626',
      'high': '#ea580c',
      'medium': '#d97706'
    };
    return colors[impact as keyof typeof colors] || '#6b7280';
  }

  getSeverityIcon(severity: string): string {
    const icons = {
      'critical': '🚨',
      'high': '⚠️',
      'medium': '⚡'
    };
    return icons[severity as keyof typeof icons] || '❓';
  }
}
