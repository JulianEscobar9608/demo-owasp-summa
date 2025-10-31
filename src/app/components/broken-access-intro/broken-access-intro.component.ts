import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-broken-access-intro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './broken-access-intro.component.html',
  styleUrl: './broken-access-intro.component.css'
})
export class BrokenAccessIntroComponent {
  currentExample: string = 'overview';

  // Estadísticas de Broken Access Control
  accessControlStats = [
    {
      title: 'Prevalencia',
      value: '94%',
      description: 'De aplicaciones tienen alguna forma de control de acceso roto',
      icon: '📊'
    },
    {
      title: 'Impacto',
      value: 'Alto',
      description: 'Acceso no autorizado a funcionalidades y datos críticos',
      icon: '💥'
    },
    {
      title: 'En Angular',
      value: '75%',
      description: 'De vulnerabilidades están en guards mal implementados',
      icon: '🅰️'
    },
    {
      title: 'Detección',
      value: 'Media',
      description: 'Se puede detectar con testing y revisión de código',
      icon: '🔍'
    }
  ];

  // Tipos de Broken Access Control en Angular
  accessControlTypes = [
    {
      type: 'Route Guards Débiles',
      description: 'Guards que solo verifican localStorage sin validación del servidor',
      example: 'CanActivate que confía en datos del cliente',
      severity: 'Alta',
      color: 'danger'
    },
    {
      type: 'Elevation of Privilege',
      description: 'Usuarios que pueden acceder a funciones de mayor privilegio',
      example: 'User normal accediendo a panel de admin',
      severity: 'Crítica',
      color: 'critical'
    },
    {
      type: 'Insecure Direct Object References',
      description: 'Acceso directo a objetos sin verificación de permisos',
      example: 'APIs que no validan ownership de recursos',
      severity: 'Alta',
      color: 'danger'
    },
    {
      type: 'Missing Function Level Access Control',
      description: 'Funciones expuestas sin verificación de permisos adecuada',
      example: 'Botones ocultos pero APIs accesibles',
      severity: 'Media',
      color: 'warning'
    },
    {
      type: 'CORS Misconfiguration',
      description: 'Configuración permisiva de CORS que permite acceso no autorizado',
      example: 'Access-Control-Allow-Origin: *',
      severity: 'Media',
      color: 'warning'
    }
  ];

  // Escenarios comunes de vulnerabilidad
  vulnerableScenarios = [
    {
      title: 'Guard Basado en localStorage',
      description: 'El guard solo verifica datos almacenados localmente',
      code: `@Injectable()
export class WeakGuard implements CanActivate {
  canActivate(): boolean {
    // ❌ Solo verifica el lado cliente
    return localStorage.getItem('isAdmin') === 'true';
  }
}`,
      problem: 'Cualquier usuario puede modificar localStorage y obtener acceso',
      impact: 'Escalación de privilegios completa'
    },
    {
      title: 'API sin Autorización',
      description: 'Endpoints que no verifican permisos del usuario',
      code: `// Frontend oculta botón, pero API es accesible
deleteUser(id: string) {
  // ❌ No verifica si el usuario puede eliminar
  return this.http.delete(\`/api/users/\${id}\`);
}`,
      problem: 'Usuario normal puede eliminar cualquier cuenta',
      impact: 'Pérdida de datos y compromiso de la aplicación'
    },
    {
      title: 'Role Check Solo en UI',
      description: 'Verificación de roles únicamente en la interfaz',
      code: `<!-- ❌ Solo oculta visualmente -->
<button *ngIf="userRole === 'admin'"
        (click)="deleteAllData()">
  Eliminar Todo
</button>`,
      problem: 'Función accesible via DevTools o manipulación DOM',
      impact: 'Acceso no autorizado a funciones críticas'
    }
  ];

  // Ejemplos de payloads comunes
  commonPayloads = [
    {
      name: 'localStorage Manipulation',
      description: 'Modificar datos de autenticación locales',
      payload: `localStorage.setItem('isAdmin', 'true');
localStorage.setItem('userRole', 'administrator');
window.location.reload();`,
      risk: 'Escalación de privilegios local'
    },
    {
      name: 'Direct API Access',
      description: 'Acceso directo a endpoints sin autorización',
      payload: `fetch('/api/admin/users', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer ' + token }
})`,
      risk: 'Acceso a datos restringidos'
    },
    {
      name: 'JWT Manipulation',
      description: 'Modificación de claims en JWT tokens',
      payload: `// Modificar payload del JWT
{
  "sub": "user123",
  "role": "admin",  // Escalación
  "permissions": ["*"]
}`,
      risk: 'Completo compromiso del sistema'
    },
    {
      name: 'Route Manipulation',
      description: 'Navegación directa a rutas protegidas',
      payload: `// Navegación directa via URL
window.location.href = '/admin/dashboard';
this.router.navigate(['/admin', 'users']);`,
      risk: 'Bypass de controles de navegación'
    }
  ];

  setExample(example: string): void {
    this.currentExample = example;
  }

  // Simulador básico de ataque
  simulateAttack(payload: string): void {
    console.log('🔴 Simulando ataque de Access Control:', payload);
    // En un entorno real, esto mostraría los resultados del ataque
    alert('⚠️ Este sería un ataque real. En producción, implementa las mitigaciones adecuadas.');
  }

  resetSimulation(): void {
    this.currentExample = 'overview';
  }
}
