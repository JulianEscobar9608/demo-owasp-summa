import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SecurePattern {
  id: string;
  name: string;
  description: string;
  category: 'validation' | 'architecture' | 'authentication' | 'state-management';
  implementation: string;
  codeExample: string;
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ArchitecturalLayer {
  layer: string;
  responsibility: string;
  securityControls: string[];
  angularImplementation: string;
  codeExample: string;
}

@Component({
  selector: 'app-insecure-design-protection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insecure-design-protection.component.html',
  styleUrl: './insecure-design-protection.component.css'
})
export class InsecureDesignProtectionComponent {
  activeTab: string = 'overview';
  selectedPattern: string = 'server-validation';
  currentDemo: string = 'secure-flow';
  simulationResults: string[] = [];

  securePatterns: SecurePattern[] = [
    {
      id: 'server-validation',
      name: 'Validación Server-Side',
      description: 'Implementación de validación robusta en el backend con Angular Forms',
      category: 'validation',
      implementation: 'Interceptors + Backend validators + Error handling',
      codeExample: `// ✅ Validación completa server-side
// Backend: validators/user.validator.js
const { body } = require('express-validator');

const userValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new Error('Email already exists');
    }),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be strong'),
  body('age')
    .isInt({ min: 18, max: 120 })
    .withMessage('Age must be between 18 and 120')
];

// Frontend: interceptors/validation.interceptor.ts
@Injectable()
export class ValidationInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 422 && error.error.errors) {
          this.handleValidationErrors(error.error.errors);
        }
        return throwError(error);
      })
    );
  }

  private handleValidationErrors(errors: any[]) {
    // Mostrar errores específicos del servidor
    errors.forEach(error => {
      this.toastr.error(error.msg, \`Error en \${error.param}\`);
    });
  }
}`,
      benefits: [
        'Validación independiente del cliente',
        'Prevención de bypass de validación',
        'Mensajes de error consistentes',
        'Auditoría de intentos maliciosos'
      ],
      difficulty: 'intermediate'
    },
    {
      id: 'secure-state-management',
      name: 'State Management Seguro',
      description: 'Gestión segura del estado con NgRx y consideraciones de seguridad',
      category: 'state-management',
      implementation: 'NgRx con effects seguros + Selective persistence + Encryption',
      codeExample: `// ✅ State management seguro con NgRx
// auth.state.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
  // ❌ NO almacenar: tokens, passwords, sensitive data
}

// auth.effects.ts
@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(response => {
            // ✅ Solo almacenar datos necesarios en state
            const { user, permissions } = response;

            // ✅ Token se maneja en HTTP-only cookie
            this.cookieService.setSecureToken(response.token);

            return AuthActions.loginSuccess({ user, permissions });
          }),
          catchError(error => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );
}

// secure-storage.service.ts
@Injectable()
export class SecureStorageService {
  private readonly ENCRYPTION_KEY = environment.clientEncryptionKey;

  setSecureItem(key: string, data: any): void {
    if (this.containsSensitiveData(data)) {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.ENCRYPTION_KEY
      ).toString();
      localStorage.setItem(key, encrypted);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  private containsSensitiveData(data: any): boolean {
    const sensitiveFields = ['ssn', 'creditCard', 'bankAccount'];
    return sensitiveFields.some(field =>
      JSON.stringify(data).toLowerCase().includes(field)
    );
  }
}`,
      benefits: [
        'Estado predecible y auditeable',
        'Prevención de manipulación del estado',
        'Encriptación de datos sensibles',
        'Gestión segura de tokens'
      ],
      difficulty: 'advanced'
    },
    {
      id: 'secure-api-design',
      name: 'Diseño Seguro de APIs',
      description: 'Arquitectura de servicios con principios de seguridad by design',
      category: 'architecture',
      implementation: 'RESTful security + Ownership validation + Rate limiting',
      codeExample: `// ✅ Diseño seguro de API service
// user-api.service.ts
@Injectable()
export class UserApiService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ✅ Endpoint específico con filtros de seguridad
  getCurrentUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/users/me/profile');
  }

  // ✅ Validación de ownership implícita
  updateCurrentUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    // Solo campos permitidos para auto-actualización
    const allowedFields = this.filterAllowedFields(profile, [
      'displayName', 'bio', 'preferences', 'avatar'
    ]);

    return this.http.patch<UserProfile>('/api/users/me/profile', allowedFields)
      .pipe(
        retry({ count: 3, delay: 1000 }),
        timeout(10000),
        catchError(this.handleApiError)
      );
  }

  // ✅ Admin endpoint separado con validación de roles
  getAdminUserList(filters: UserFilters): Observable<UserSummary[]> {
    if (!this.authService.hasRole('admin')) {
      throw new Error('Insufficient permissions');
    }

    return this.http.get<UserSummary[]>('/api/admin/users', {
      params: this.sanitizeFilters(filters)
    });
  }

  private filterAllowedFields<T>(data: T, allowedFields: string[]): Partial<T> {
    const filtered: any = {};
    allowedFields.forEach(field => {
      if (data.hasOwnProperty(field)) {
        filtered[field] = data[field];
      }
    });
    return filtered;
  }

  private sanitizeFilters(filters: UserFilters): HttpParams {
    let params = new HttpParams();

    // ✅ Validar y sanitizar parámetros
    if (filters.search && filters.search.length >= 3) {
      params = params.set('search', filters.search.substring(0, 50));
    }

    if (filters.role && this.isValidRole(filters.role)) {
      params = params.set('role', filters.role);
    }

    return params;
  }

  private handleApiError = (error: HttpErrorResponse): Observable<never> => {
    // ✅ No exponer detalles internos
    let userMessage = 'Ha ocurrido un error inesperado';

    switch (error.status) {
      case 400:
        userMessage = 'Datos inválidos proporcionados';
        break;
      case 403:
        userMessage = 'No tienes permisos para esta acción';
        break;
      case 404:
        userMessage = 'Recurso no encontrado';
        break;
      case 429:
        userMessage = 'Demasiadas solicitudes. Intenta más tarde';
        break;
    }

    // ✅ Log detallado solo en desarrollo
    if (!environment.production) {
      console.error('API Error:', error);
    }

    return throwError(() => new Error(userMessage));
  }
}`,
      benefits: [
        'Principio de menor exposición',
        'Validación de ownership automática',
        'Manejo de errores seguro',
        'Rate limiting y timeouts'
      ],
      difficulty: 'intermediate'
    },
    {
      id: 'secure-authentication-flow',
      name: 'Flujo de Autenticación Seguro',
      description: 'Implementación robusta de autenticación con múltiples capas de seguridad',
      category: 'authentication',
      implementation: 'JWT + HTTP-only cookies + CSRF protection + 2FA',
      codeExample: `// ✅ Flujo completo de autenticación segura
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private securityService: SecurityService
  ) {}

  login(credentials: LoginCredentials): Observable<AuthResult> {
    // ✅ Hash password antes de enviar (opcional extra security)
    const hashedCredentials = {
      ...credentials,
      password: this.hashClientSide(credentials.password)
    };

    return this.http.post<AuthResult>('/api/auth/login', hashedCredentials, {
      withCredentials: true // ✅ Para HTTP-only cookies
    }).pipe(
      tap(result => {
        if (result.requiresMFA) {
          this.router.navigate(['/auth/mfa']);
        } else {
          this.handleSuccessfulAuth(result);
        }
      }),
      catchError(error => {
        this.handleAuthError(error);
        return throwError(() => error);
      })
    );
  }

  // ✅ Validación continua de sesión
  validateSession(): Observable<boolean> {
    return this.http.get<{ valid: boolean }>('/api/auth/validate', {
      withCredentials: true
    }).pipe(
      map(response => response.valid),
      tap(valid => {
        if (!valid) {
          this.logout();
        }
      }),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  // ✅ Logout seguro
  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}, {
      withCredentials: true
    }).pipe(
      finalize(() => {
        // ✅ Limpieza completa del estado
        this.clearClientState();
        this.router.navigate(['/login']);
      })
    );
  }

  private handleSuccessfulAuth(result: AuthResult): void {
    // ✅ NO almacenar tokens en localStorage
    // ✅ Solo datos de usuario necesarios
    this.store.dispatch(AuthActions.loginSuccess({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        roles: result.user.roles
      }
    }));

    // ✅ Configurar renovación automática
    this.scheduleTokenRefresh();
  }

  private scheduleTokenRefresh(): void {
    // ✅ Renovar token automáticamente
    timer(15 * 60 * 1000) // 15 minutos
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshToken().subscribe();
      });
  }

  private clearClientState(): void {
    // ✅ Limpieza completa
    localStorage.clear();
    sessionStorage.clear();
    this.store.dispatch(AuthActions.logout());
  }
}`,
      benefits: [
        'Tokens seguros en HTTP-only cookies',
        'Validación continua de sesión',
        'Limpieza automática del estado',
        'Protección contra CSRF'
      ],
      difficulty: 'advanced'
    }
  ];

  architecturalLayers: ArchitecturalLayer[] = [
    {
      layer: 'Presentation Layer (Components)',
      responsibility: 'UI/UX segura y validación básica de entrada',
      securityControls: [
        'Input sanitization',
        'XSS prevention',
        'Client-side validation',
        'Secure routing guards'
      ],
      angularImplementation: 'Components + Guards + Pipes + Directives',
      codeExample: `// Ejemplo: Componente con seguridad básica
@Component({
  template: \`
    <!-- ✅ Sanitización automática de Angular -->
    <div [innerHTML]="sanitizedContent"></div>

    <!-- ✅ Validación reactiva -->
    <form [formGroup]="secureForm" (ngSubmit)="onSubmit()">
      <input formControlName="email" type="email">
      <div *ngIf="secureForm.get('email')?.errors?.['email']">
        Email inválido
      </div>
    </form>
  \`
})
export class SecureComponent {
  sanitizedContent = this.sanitizer.sanitize(SecurityContext.HTML, this.rawContent);
}`
    },
    {
      layer: 'Service Layer (Business Logic)',
      responsibility: 'Lógica de negocio segura y validación de reglas',
      securityControls: [
        'Business rule validation',
        'Authorization checks',
        'Data transformation',
        'Error handling'
      ],
      angularImplementation: 'Services + Interceptors + Guards',
      codeExample: `// Ejemplo: Service con validación de reglas de negocio
@Injectable()
export class SecureOrderService {
  processOrder(order: Order): Observable<OrderResult> {
    // ✅ Validación de reglas de negocio
    if (!this.validateOrderRules(order)) {
      throw new Error('Order validation failed');
    }

    // ✅ Verificar permisos del usuario
    if (!this.canUserProcessOrder(order)) {
      throw new Error('Insufficient permissions');
    }

    return this.http.post<OrderResult>('/api/orders', order);
  }
}`
    },
    {
      layer: 'Data Access Layer (HTTP)',
      responsibility: 'Comunicación segura con APIs y manejo de datos',
      securityControls: [
        'Request/response interceptors',
        'Authentication headers',
        'Rate limiting',
        'Error sanitization'
      ],
      angularImplementation: 'HttpClient + Interceptors + Error handlers',
      codeExample: `// Ejemplo: Interceptor de seguridad
@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // ✅ Agregar headers de seguridad
    const secureReq = req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    });

    return next.handle(secureReq);
  }
}`
    },
    {
      layer: 'State Management Layer',
      responsibility: 'Estado seguro y predecible de la aplicación',
      securityControls: [
        'Immutable state',
        'Selective persistence',
        'State validation',
        'Audit trails'
      ],
      angularImplementation: 'NgRx + Effects + Selectors + Persistence',
      codeExample: `// Ejemplo: State management seguro
const userReducer = createReducer(
  initialState,
  on(UserActions.updateProfile, (state, { profile }) => ({
    ...state,
    user: {
      ...state.user,
      // ✅ Solo campos seguros
      ...this.filterSecureFields(profile)
    }
  }))
);`
    }
  ];

  securityPrinciples = [
    {
      principle: 'Secure by Default',
      description: 'Configuraciones seguras por defecto en toda la aplicación',
      implementation: 'Defaults restrictivos, opt-in para funcionalidades riesgosas'
    },
    {
      principle: 'Defense in Depth',
      description: 'Múltiples capas de validación y control',
      implementation: 'Client + Server + Database validation layers'
    },
    {
      principle: 'Principle of Least Privilege',
      description: 'Mínimos permisos necesarios para cada operación',
      implementation: 'Granular permissions, role-based access control'
    },
    {
      principle: 'Fail Securely',
      description: 'Fallar de manera segura ante errores inesperados',
      implementation: 'Default deny, secure error messages, graceful degradation'
    }
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setSelectedPattern(pattern: string): void {
    this.selectedPattern = pattern;
  }

  setCurrentDemo(demo: string): void {
    this.currentDemo = demo;
  }

  runSecurityDemo(demo: string): void {
    this.simulationResults = [];

    setTimeout(() => {
      switch (demo) {
        case 'secure-flow':
          this.simulationResults = [
            '🔐 Iniciando flujo seguro de validación...',
            '📱 Cliente: Enviando datos de formulario',
            '🛡️ Interceptor: Agregando headers de seguridad',
            '🔍 Frontend: Validación básica completada',
            '📤 Enviando request al servidor',
            '⚙️ Backend: Validando reglas de negocio',
            '✅ Backend: Validación server-side exitosa',
            '📊 Backend: Aplicando transformaciones seguras',
            '💾 Base de datos: Almacenando con constraints',
            '✅ Operación completada de forma segura'
          ];
          break;
        case 'auth-flow':
          this.simulationResults = [
            '🔑 Iniciando flujo de autenticación seguro...',
            '👤 Usuario: Ingresando credenciales',
            '🔒 Cliente: Hash de password (opcional)',
            '📡 Enviando credenciales cifradas',
            '🛡️ Backend: Validando credenciales',
            '✅ Backend: Generando JWT seguro',
            '🍪 Backend: Configurando HTTP-only cookie',
            '🔐 Backend: Iniciando sesión segura',
            '📱 Cliente: Redirigiendo a dashboard',
            '⏰ Sistema: Programando renovación automática'
          ];
          break;
        case 'api-security':
          this.simulationResults = [
            '🌐 Demostrando API security patterns...',
            '📊 Cliente: Solicitando datos de usuario',
            '🔍 Service: Validando permisos localmente',
            '📤 Enviando request con filtros seguros',
            '⚙️ Backend: Aplicando ownership validation',
            '🔒 Backend: Filtrando datos sensibles',
            '📋 Backend: Limitando campos de respuesta',
            '✅ Respuesta con datos mínimos necesarios',
            '📱 Cliente: Procesando respuesta segura',
            '📝 Sistema: Registrando acceso en audit log'
          ];
          break;
      }
    }, 1000);
  }

  getSelectedPattern(): SecurePattern | undefined {
    return this.securePatterns.find(p => p.id === this.selectedPattern);
  }

  getPatternsByCategory(category: string): SecurePattern[] {
    return this.securePatterns.filter(p => p.category === category);
  }

  getDifficultyColor(difficulty: string): string {
    const colors = {
      'beginner': '#10b981',
      'intermediate': '#f59e0b',
      'advanced': '#ef4444'
    };
    return colors[difficulty as keyof typeof colors] || '#6b7280';
  }

  getCategoryIcon(category: string): string {
    const icons = {
      'validation': '✅',
      'architecture': '🏗️',
      'authentication': '🔐',
      'state-management': '📊'
    };
    return icons[category as keyof typeof icons] || '❓';
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      console.log('Código copiado al portapapeles');
    });
  }

  resetDemo(): void {
    this.simulationResults = [];
  }
}
