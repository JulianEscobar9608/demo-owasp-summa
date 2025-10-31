import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-access-angular-guards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-angular-guards.component.html',
  styleUrl: './access-angular-guards.component.css'
})
export class AccessAngularGuardsComponent {
  currentExample: string = 'can-activate';
  simulationResults: string[] = [];

  examples = {
    'can-activate': {
      title: 'CanActivate Guard',
      description: 'Guard para controlar el acceso a rutas',
      code: `
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// app-routing.module.ts
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }
];`
    },
    'role-guard': {
      title: 'Role-Based Guard',
      description: 'Guard basado en roles de usuario',
      code: `
// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;
    const userRoles = this.authService.getUserRoles();

    if (this.hasRequiredRole(userRoles, requiredRoles)) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }

  private hasRequiredRole(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role));
  }
}

// Uso en rutas
{
  path: 'admin-panel',
  component: AdminPanelComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['admin', 'superuser'] }
}`
    },
    'can-deactivate': {
      title: 'CanDeactivate Guard',
      description: 'Guard para controlar la salida de componentes',
      code: `
// can-deactivate.guard.ts
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate(): boolean | Promise<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(component: CanComponentDeactivate): boolean | Promise<boolean> {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

// form.component.ts
export class FormComponent implements CanComponentDeactivate {
  hasUnsavedChanges = false;

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
    }
    return true;
  }
}`
    }
  };

  selectExample(exampleKey: string): void {
    this.currentExample = exampleKey;
  }

  getCurrentExample() {
    return this.examples[this.currentExample as keyof typeof this.examples];
  }

  simulateGuardExecution(guardType: string): void {
    this.simulationResults = [];

    switch (guardType) {
      case 'auth-success':
        this.simulationResults = [
          '🔍 Verificando autenticación...',
          '✅ Usuario autenticado correctamente',
          '🚀 Permitiendo acceso a la ruta',
          '📍 Navegando a /admin'
        ];
        break;
      case 'auth-failure':
        this.simulationResults = [
          '🔍 Verificando autenticación...',
          '❌ Usuario no autenticado',
          '🚫 Bloqueando acceso a la ruta',
          '↩️ Redirigiendo a /login'
        ];
        break;
      case 'role-success':
        this.simulationResults = [
          '🔍 Verificando roles de usuario...',
          '👤 Usuario tiene rol: "admin"',
          '✅ Rol requerido encontrado',
          '🚀 Permitiendo acceso a /admin-panel'
        ];
        break;
      case 'role-failure':
        this.simulationResults = [
          '🔍 Verificando roles de usuario...',
          '👤 Usuario tiene rol: "user"',
          '❌ Rol insuficiente (se requiere "admin")',
          '↩️ Redirigiendo a /unauthorized'
        ];
        break;
    }
  }

  resetSimulation(): void {
    this.simulationResults = [];
  }

  copyToClipboard(): void {
    const codeElement = document.querySelector('.code-block.demo pre');
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.textContent || '').then(() => {
        console.log('Código copiado al portapapeles');
      });
    }
  }
}
