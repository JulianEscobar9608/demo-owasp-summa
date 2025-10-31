import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VulnerabilityExample {
  id: string;
  title: string;
  description: string;
  category: 'insecure-direct-object-reference' | 'missing-function-level-access-control' | 'privilege-escalation' | 'broken-session-management';
  severity: 'critical' | 'high' | 'medium';
  vulnerableCode: string;
  secureCode: string;
  exploitation: string[];
  impact: string[];
}

@Component({
  selector: 'app-access-vulnerable-examples',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-vulnerable-examples.component.html',
  styleUrl: './access-vulnerable-examples.component.css'
})
export class AccessVulnerableExamplesComponent {
  currentExample: string = 'idor';
  showVulnerable: boolean = true;

  vulnerabilities: { [key: string]: VulnerabilityExample } = {
    idor: {
      id: 'idor',
      title: 'Insecure Direct Object Reference (IDOR)',
      description: 'Referencias directas inseguras a objetos que permiten acceso no autorizado',
      category: 'insecure-direct-object-reference',
      severity: 'critical',
      vulnerableCode: `
// ❌ Código Vulnerable
@Component({
  template: \`
    <div *ngFor="let document of userDocuments">
      <a [routerLink]="['/document', document.id]">
        {{ document.name }}
      </a>
    </div>
  \`
})
export class DocumentListComponent {
  userDocuments: Document[] = [];

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // ⚠️ VULNERABLE: Obtiene documentos sin validar propiedad
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      this.documentService.getDocumentsByUserId(userId)
        .subscribe(docs => this.userDocuments = docs);
    });
  }
}

// ❌ Servicio Vulnerable
@Injectable()
export class DocumentService {

  getDocument(documentId: string): Observable<Document> {
    // ⚠️ VULNERABLE: No valida si el usuario puede acceder
    return this.http.get<Document>(\`/api/documents/\${documentId}\`);
  }

  deleteDocument(documentId: string): Observable<any> {
    // ⚠️ VULNERABLE: Cualquier usuario puede eliminar cualquier documento
    return this.http.delete(\`/api/documents/\${documentId}\`);
  }
}`,
      secureCode: `
// ✅ Código Seguro
@Component({
  template: \`
    <div *ngFor="let document of userDocuments">
      <a [routerLink]="['/document', document.secureId]"
         *ngIf="canViewDocument(document)">
        {{ document.name }}
      </a>
    </div>
  \`
})
export class DocumentListComponent {
  userDocuments: Document[] = [];
  currentUser: User;

  constructor(
    private documentService: DocumentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    // ✅ SEGURO: Solo obtiene documentos del usuario autenticado
    this.documentService.getUserDocuments(this.currentUser.id)
      .subscribe(docs => this.userDocuments = docs);
  }

  canViewDocument(document: Document): boolean {
    // ✅ Validación adicional de permisos
    return document.ownerId === this.currentUser.id ||
           this.currentUser.hasPermission('VIEW_ALL_DOCUMENTS');
  }
}

// ✅ Servicio Seguro
@Injectable()
export class DocumentService {

  getDocument(documentId: string, userId: string): Observable<Document> {
    // ✅ SEGURO: Valida ownership en el backend
    return this.http.get<Document>(\`/api/users/\${userId}/documents/\${documentId}\`);
  }

  deleteDocument(documentId: string, userId: string): Observable<any> {
    // ✅ SEGURO: Incluye validación de usuario propietario
    return this.http.delete(\`/api/users/\${userId}/documents/\${documentId}\`);
  }
}`,
      exploitation: [
        'Modificar parámetros de URL para acceder a documentos de otros usuarios',
        'Cambiar IDs en requests para obtener información no autorizada',
        'Enumerar recursos incrementando/decrementando IDs',
        'Acceder a funciones administrativas cambiando parámetros'
      ],
      impact: [
        'Exposición de información confidencial',
        'Acceso no autorizado a datos de otros usuarios',
        'Modificación o eliminación de recursos ajenos',
        'Escalación de privilegios'
      ]
    },

    function_access: {
      id: 'function_access',
      title: 'Missing Function Level Access Control',
      description: 'Falta de control de acceso a nivel de funciones',
      category: 'missing-function-level-access-control',
      severity: 'high',
      vulnerableCode: `
// ❌ Componente Vulnerable
@Component({
  template: \`
    <div class="admin-panel" *ngIf="showAdminPanel">
      <button (click)="deleteUser(selectedUserId)">Eliminar Usuario</button>
      <button (click)="promoteToAdmin(selectedUserId)">Hacer Admin</button>
      <button (click)="viewAuditLog()">Ver Logs de Auditoría</button>
    </div>
  \`
})
export class AdminPanelComponent {
  showAdminPanel = true; // ⚠️ VULNERABLE: Siempre visible
  selectedUserId: string;

  deleteUser(userId: string) {
    // ⚠️ VULNERABLE: No verifica permisos antes de ejecutar
    this.userService.deleteUser(userId).subscribe();
  }

  promoteToAdmin(userId: string) {
    // ⚠️ VULNERABLE: Cualquier usuario puede promocionar
    this.userService.updateUserRole(userId, 'admin').subscribe();
  }

  viewAuditLog() {
    // ⚠️ VULNERABLE: Información sensible sin validación
    this.auditService.getAuditLog().subscribe();
  }
}`,
      secureCode: `
// ✅ Componente Seguro
@Component({
  template: \`
    <div class="admin-panel" *ngIf="canAccessAdminPanel()">
      <button (click)="deleteUser(selectedUserId)"
              *ngIf="hasPermission('DELETE_USERS')">
        Eliminar Usuario
      </button>
      <button (click)="promoteToAdmin(selectedUserId)"
              *ngIf="hasPermission('MANAGE_ROLES')">
        Hacer Admin
      </button>
      <button (click)="viewAuditLog()"
              *ngIf="hasPermission('VIEW_AUDIT_LOG')">
        Ver Logs de Auditoría
      </button>
    </div>
  \`
})
export class AdminPanelComponent {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  canAccessAdminPanel(): boolean {
    // ✅ Validación de acceso al panel completo
    return this.authService.hasRole(['admin', 'superuser']);
  }

  hasPermission(permission: string): boolean {
    // ✅ Validación granular de permisos
    return this.authService.hasPermission(permission);
  }

  deleteUser(userId: string) {
    if (!this.hasPermission('DELETE_USERS')) {
      throw new Error('Permisos insuficientes');
    }
    // ✅ Doble verificación antes de ejecutar
    this.userService.deleteUser(userId).subscribe();
  }

  promoteToAdmin(userId: string) {
    if (!this.hasPermission('MANAGE_ROLES')) {
      throw new Error('Permisos insuficientes');
    }
    // ✅ Validación en frontend y backend
    this.userService.updateUserRole(userId, 'admin').subscribe();
  }
}`,
      exploitation: [
        'Acceder a funciones ocultas manipulando el DOM',
        'Llamar directamente a servicios sin verificar permisos',
        'Usar herramientas de desarrollador para habilitar botones',
        'Interceptar y modificar requests para ejecutar funciones restringidas'
      ],
      impact: [
        'Ejecución de funciones administrativas no autorizadas',
        'Modificación de configuraciones críticas del sistema',
        'Acceso a información de auditoría y logs',
        'Compromiso total del sistema'
      ]
    }
  };

  selectExample(exampleId: string): void {
    this.currentExample = exampleId;
  }

  toggleCodeView(): void {
    this.showVulnerable = !this.showVulnerable;
  }

  getCurrentVulnerability(): VulnerabilityExample {
    return this.vulnerabilities[this.currentExample];
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      default: return '#6b7280';
    }
  }

  simulateAttack(attackType: string): void {
    // Simula diferentes tipos de ataques
    console.log(`Simulando ataque: ${attackType}`);
  }
}
