import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  level: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

@Component({
  selector: 'app-access-roles-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-roles-permissions.component.html',
  styleUrl: './access-roles-permissions.component.css'
})
export class AccessRolesPermissionsComponent {
  currentView: string = 'overview';
  selectedRole: string = 'user';
  selectedUser: string = 'user1';
  simulationMode: boolean = false;
  Object = Object;
  routesExample = `const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'superadmin'] }
  },
  {
    path: 'moderate',
    component: ModerateComponent,
    canActivate: [RoleGuard],
    data: { permissions: ['MODERATE_CONTENT'] }
  }
];`;

  roles: { [key: string]: Role } = {
    guest: {
      id: 'guest',
      name: 'Invitado',
      description: 'Acceso mínimo solo para visualización pública',
      permissions: ['READ_PUBLIC_CONTENT'],
      color: '#9ca3af',
      level: 1
    },
    user: {
      id: 'user',
      name: 'Usuario Regular',
      description: 'Usuario estándar con permisos básicos',
      permissions: ['READ_PUBLIC_CONTENT', 'READ_OWN_PROFILE', 'UPDATE_OWN_PROFILE', 'CREATE_BASIC_CONTENT'],
      color: '#3b82f6',
      level: 2
    },
    moderator: {
      id: 'moderator',
      name: 'Moderador',
      description: 'Moderador de contenido con permisos de gestión limitada',
      permissions: ['READ_PUBLIC_CONTENT', 'READ_OWN_PROFILE', 'UPDATE_OWN_PROFILE', 'CREATE_BASIC_CONTENT', 'MODERATE_CONTENT', 'READ_USER_REPORTS'],
      color: '#f59e0b',
      level: 3
    },
    admin: {
      id: 'admin',
      name: 'Administrador',
      description: 'Administrador del sistema con permisos elevados',
      permissions: ['READ_PUBLIC_CONTENT', 'READ_OWN_PROFILE', 'UPDATE_OWN_PROFILE', 'CREATE_BASIC_CONTENT', 'MODERATE_CONTENT', 'READ_USER_REPORTS', 'MANAGE_USERS', 'ACCESS_ADMIN_PANEL', 'VIEW_ANALYTICS'],
      color: '#dc2626',
      level: 4
    },
    superadmin: {
      id: 'superadmin',
      name: 'Super Administrador',
      description: 'Acceso completo al sistema',
      permissions: ['*'],
      color: '#7c3aed',
      level: 5
    }
  };

  permissions: { [key: string]: Permission } = {
    'READ_PUBLIC_CONTENT': {
      id: 'READ_PUBLIC_CONTENT',
      name: 'Leer Contenido Público',
      description: 'Acceso a contenido público del sitio',
      resource: 'content',
      action: 'read',
      risk: 'low'
    },
    'READ_OWN_PROFILE': {
      id: 'READ_OWN_PROFILE',
      name: 'Ver Perfil Propio',
      description: 'Acceso a la información del propio perfil',
      resource: 'profile',
      action: 'read',
      risk: 'low'
    },
    'UPDATE_OWN_PROFILE': {
      id: 'UPDATE_OWN_PROFILE',
      name: 'Actualizar Perfil Propio',
      description: 'Modificar información del propio perfil',
      resource: 'profile',
      action: 'update',
      risk: 'low'
    },
    'CREATE_BASIC_CONTENT': {
      id: 'CREATE_BASIC_CONTENT',
      name: 'Crear Contenido Básico',
      description: 'Crear publicaciones y comentarios básicos',
      resource: 'content',
      action: 'create',
      risk: 'medium'
    },
    'MODERATE_CONTENT': {
      id: 'MODERATE_CONTENT',
      name: 'Moderar Contenido',
      description: 'Aprobar, rechazar o eliminar contenido de usuarios',
      resource: 'content',
      action: 'moderate',
      risk: 'high'
    },
    'READ_USER_REPORTS': {
      id: 'READ_USER_REPORTS',
      name: 'Ver Reportes de Usuarios',
      description: 'Acceso a reportes y denuncias de usuarios',
      resource: 'reports',
      action: 'read',
      risk: 'medium'
    },
    'MANAGE_USERS': {
      id: 'MANAGE_USERS',
      name: 'Gestionar Usuarios',
      description: 'Crear, modificar o desactivar cuentas de usuario',
      resource: 'users',
      action: 'manage',
      risk: 'critical'
    },
    'ACCESS_ADMIN_PANEL': {
      id: 'ACCESS_ADMIN_PANEL',
      name: 'Acceder Panel Admin',
      description: 'Acceso al panel de administración del sistema',
      resource: 'admin',
      action: 'access',
      risk: 'high'
    },
    'VIEW_ANALYTICS': {
      id: 'VIEW_ANALYTICS',
      name: 'Ver Analíticas',
      description: 'Acceso a estadísticas y métricas del sistema',
      resource: 'analytics',
      action: 'read',
      risk: 'medium'
    }
  };

  users: { [key: string]: User } = {
    user1: {
      id: 'user1',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      roles: ['user'],
      isActive: true
    },
    user2: {
      id: 'user2',
      name: 'María González',
      email: 'maria.gonzalez@example.com',
      roles: ['moderator'],
      isActive: true
    },
    user3: {
      id: 'user3',
      name: 'Carlos Admin',
      email: 'carlos.admin@example.com',
      roles: ['admin'],
      isActive: true
    }
  };

  // Código de ejemplo
  angularRoleImplementation = `
// ✅ Implementación segura de roles en Angular
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  hasRole(role: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.roles.includes(role);
  }

  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;

    // Super admin tiene todos los permisos
    if (this.hasRole('superadmin')) return true;

    // Verificar permisos específicos por rol
    const userPermissions = this.getUserPermissions();
    return userPermissions.includes(permission);
  }

  private getUserPermissions(): string[] {
    if (!this.currentUser) return [];

    let permissions: string[] = [];
    this.currentUser.roles.forEach(roleId => {
      const role = this.getRoleById(roleId);
      if (role) {
        permissions = [...permissions, ...role.permissions];
      }
    });

    return [...new Set(permissions)]; // Remover duplicados
  }

  canAccessResource(resource: string, action: string): boolean {
    const permissionKey = \`\${action.toUpperCase()}_\${resource.toUpperCase()}\`;
    return this.hasPermission(permissionKey);
  }
}

// Guard para proteger rutas
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const requiredPermissions = route.data['permissions'] as string[];

    // Verificar roles requeridos
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role =>
        this.roleService.hasRole(role)
      );
      if (!hasRequiredRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    // Verificar permisos requeridos
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.some(permission =>
        this.roleService.hasPermission(permission)
      );
      if (!hasRequiredPermission) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }
}`;

  setCurrentView(view: string): void {
    this.currentView = view;
  }

  selectRole(roleId: string): void {
    this.selectedRole = roleId;
  }

  selectUser(userId: string): void {
    this.selectedUser = userId;
  }

  getCurrentRole(): Role {
    return this.roles[this.selectedRole];
  }

  getCurrentUser(): User {
    return this.users[this.selectedUser];
  }

  getRolePermissions(roleId: string): Permission[] {
    const role = this.roles[roleId];
    if (!role) return [];

    if (role.permissions.includes('*')) {
      return Object.values(this.permissions);
    }

    return role.permissions.map(permId => this.permissions[permId]).filter(Boolean);
  }

  getUserPermissions(userId: string): Permission[] {
    const user = this.users[userId];
    if (!user) return [];

    let permissions: Permission[] = [];
    user.roles.forEach(roleId => {
      permissions = [...permissions, ...this.getRolePermissions(roleId)];
    });

    // Remover duplicados
    return permissions.filter((permission, index, self) =>
      index === self.findIndex(p => p.id === permission.id)
    );
  }

  getRiskColor(risk: string): string {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  }

  simulateAccess(resource: string, action: string): { allowed: boolean; reason: string } {
    const user = this.getCurrentUser();
    const userPermissions = this.getUserPermissions(user.id);
    const requiredPermission = `${action.toUpperCase()}_${resource.toUpperCase()}`;

    // Verificar si el usuario tiene el permiso específico
    const hasPermission = userPermissions.some(p => p.id === requiredPermission);

    if (hasPermission) {
      return {
        allowed: true,
        reason: `Usuario tiene el permiso ${requiredPermission}`
      };
    } else {
      return {
        allowed: false,
        reason: `Usuario no tiene el permiso ${requiredPermission} requerido`
      };
    }
  }

  // Simulación de escalación de privilegios
  simulatePrivilegeEscalation(): any {
    return {
      scenario: 'Intento de escalación de privilegios',
      attack: 'Usuario regular intenta acceder a funciones administrativas',
      method: 'Manipulación de roles en el frontend',
      prevention: 'Validación en backend y Guards de Angular',
      success: false,
      detection: 'Sistema detectó intento no autorizado'
    };
  }

  toggleSimulation(): void {
    this.simulationMode = !this.simulationMode;
  }

  getRolesArray(): Role[] {
    return Object.values(this.roles);
  }

  getUsersArray(): User[] {
    return Object.values(this.users);
  }

  getRolesCount(): number {
    return Object.keys(this.roles).length;
  }

  getPermissionsCount(): number {
    return Object.keys(this.permissions).length;
  }

  getUsersCount(): number {
    return Object.keys(this.users).length;
  }

  getPermissionsArray(): Permission[] {
    return Object.values(this.permissions);
  }
}
