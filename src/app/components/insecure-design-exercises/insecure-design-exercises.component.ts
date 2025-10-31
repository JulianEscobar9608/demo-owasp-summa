import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PracticalExercise {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'analysis' | 'implementation' | 'testing' | 'audit';
  description: string;
  objectives: string[];
  scenario: string;
  vulnerableCode: string;
  secureCode: string;
  hints: string[];
  solution: string;
  learningPoints: string[];
  timeEstimate: number; // minutes
  completed: boolean;
}

interface Lab {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: LabStep[];
  resources: string[];
  completionCriteria: string[];
}

interface LabStep {
  step: number;
  title: string;
  description: string;
  tasks: string[];
  code?: string;
  verification: string;
  completed: boolean;
}

interface Quiz {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-analysis' | 'scenario';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  codeSnippet?: string;
}

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  problem: string;
  impact: string;
  solution: string;
  implementation: string;
  results: string[];
  lessonsLearned: string[];
  angularSpecific: string[];
}

@Component({
  selector: 'app-insecure-design-exercises',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insecure-design-exercises.component.html',
  styleUrls: ['./insecure-design-exercises.component.css']
})
export class InsecureDesignExercisesComponent {
  activeTab: string = 'exercises';
  selectedExercise: string = 'access-control';
  selectedLab: string = 'secure-angular-app';
  currentQuiz: number = 0;
  currentStep: number = 1;
  showSolution: boolean = false;
  userAnswers: (string | number)[] = [];

  practicalExercises: PracticalExercise[] = [
    {
      id: 'access-control',
      title: 'Implementar Control de Acceso Seguro',
      difficulty: 'intermediate',
      category: 'implementation',
      description: 'Diseña e implementa un sistema robusto de control de acceso para una aplicación Angular empresarial',
      objectives: [
        'Identificar problemas de diseño en control de acceso',
        'Implementar guards y interceptors seguros',
        'Crear un sistema de roles granular',
        'Validar la implementación con testing'
      ],
      scenario: `Eres el lead developer de una aplicación Angular para gestión de proyectos empresariales.
      La aplicación maneja información sensible de proyectos, recursos humanos y finanzas.
      Actualmente, el control de acceso es básico y presenta vulnerabilidades críticas que permiten
      escalación de privilegios y acceso no autorizado a datos sensibles.`,
      vulnerableCode: `// ❌ Implementación Vulnerable
@Component({
  selector: 'app-project-dashboard',
  template: \`
    <div *ngIf="user.role === 'admin' || user.role === 'manager'">
      <button (click)="deleteProject()">Eliminar Proyecto</button>
    </div>
    <div *ngIf="user.isManager">
      <app-financial-data [data]="financialData"></app-financial-data>
    </div>
  \`
})
export class ProjectDashboardComponent {
  user = this.authService.getCurrentUser();
  financialData = this.dataService.getFinancialData(); // No validation

  deleteProject() {
    // Direct API call without server-side validation
    this.http.delete(\`/api/projects/\${this.projectId}\`).subscribe();
  }
}

// Vulnerable Route Guard
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).isLoggedIn : false; // Client-side only
  }
}`,
      secureCode: `// ✅ Implementación Segura
@Component({
  selector: 'app-project-dashboard',
  template: \`
    <div *ngIf="hasPermission('project:delete')">
      <button (click)="deleteProject()">Eliminar Proyecto</button>
    </div>
    <div *ngIf="hasPermission('finance:read')">
      <app-financial-data [data]="financialData"></app-financial-data>
    </div>
  \`
})
export class ProjectDashboardComponent implements OnInit {
  financialData: any = null;

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    // Load data based on permissions
    if (this.hasPermission('finance:read')) {
      this.loadFinancialData();
    }
  }

  hasPermission(permission: string): boolean {
    return this.permissionService.hasPermission(permission);
  }

  async deleteProject() {
    try {
      // Server validates permissions before deletion
      await this.projectService.deleteProject(this.projectId);
      this.router.navigate(['/projects']);
    } catch (error) {
      this.handleError('No tiene permisos para eliminar proyectos');
    }
  }

  private async loadFinancialData() {
    try {
      this.financialData = await this.projectService.getFinancialData(this.projectId);
    } catch (error) {
      this.handleError('Sin acceso a datos financieros');
    }
  }
}

// Secure Permission-based Guard
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredPermissions = route.data['permissions'] || [];

    return this.permissionService.validatePermissions(requiredPermissions).pipe(
      map(hasPermission => {
        if (!hasPermission) {
          this.router.navigate(['/unauthorized']);
        }
        return hasPermission;
      })
    );
  }
}`,
      hints: [
        'Implementa validación server-side para todas las operaciones críticas',
        'Usa un sistema de permisos granular basado en recursos y acciones',
        'Valida permisos tanto en cliente como en servidor',
        'Implementa logging de todos los intentos de acceso'
      ],
      solution: `La solución implementa un sistema de control de acceso basado en permisos granulares:

1. **Permission Service**: Centraliza la lógica de validación de permisos
2. **Server Validation**: Todas las operaciones críticas se validan en el servidor
3. **Granular Permissions**: Sistema resource:action (project:delete, finance:read)
4. **Guards Seguros**: Validación de permisos antes de cargar componentes
5. **Error Handling**: Manejo adecuado de errores de autorización`,
      learningPoints: [
        'Never trust client-side permissions alone',
        'Implement defense in depth for access control',
        'Use granular permission systems over simple roles',
        'Validate permissions on every server request',
        'Implement proper error handling for unauthorized access'
      ],
      timeEstimate: 45,
      completed: false
    },
    {
      id: 'input-validation',
      title: 'Sistema de Validación Robusto',
      difficulty: 'advanced',
      category: 'implementation',
      description: 'Desarrolla un sistema completo de validación que prevenga inyecciones y manipulación de datos',
      objectives: [
        'Implementar validación multi-capa',
        'Crear sanitizadores personalizados',
        'Desarrollar interceptors de validación',
        'Establecer políticas de validación estrictas'
      ],
      scenario: `Tu aplicación Angular maneja formularios complejos con datos financieros,
      información personal y configuraciones del sistema. Los atacantes están intentando
      inyección de código, manipulación de precios y bypass de validaciones.
      Necesitas crear un sistema de validación robusto y a prueba de manipulaciones.`,
      vulnerableCode: `// ❌ Validación Vulnerable
@Component({
  template: \`
    <form [formGroup]="paymentForm" (ngSubmit)="processPayment()">
      <input formControlName="amount" placeholder="Monto">
      <input formControlName="description" placeholder="Descripción">
      <select formControlName="currency">
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
      <button type="submit">Procesar Pago</button>
    </form>
  \`
})
export class PaymentFormComponent {
  paymentForm = this.fb.group({
    amount: ['', Validators.required],
    description: [''],
    currency: ['USD']
  });

  processPayment() {
    // Direct submission without validation
    const formData = this.paymentForm.value;
    this.http.post('/api/payments', formData).subscribe();
  }
}`,
      secureCode: `// ✅ Validación Segura Multi-Capa
interface PaymentRequest {
  amount: number;
  description: string;
  currency: CurrencyCode;
  userId: string;
}

@Component({
  template: \`
    <form [formGroup]="paymentForm" (ngSubmit)="processPayment()">
      <input
        formControlName="amount"
        placeholder="Monto"
        [class.invalid]="isFieldInvalid('amount')">
      <div *ngIf="isFieldInvalid('amount')" class="error">
        {{ getFieldError('amount') }}
      </div>

      <textarea
        formControlName="description"
        placeholder="Descripción"
        [class.invalid]="isFieldInvalid('description')">
      </textarea>

      <select formControlName="currency">
        <option *ngFor="let currency of allowedCurrencies" [value]="currency.code">
          {{ currency.name }}
        </option>
      </select>

      <button
        type="submit"
        [disabled]="paymentForm.invalid || isProcessing">
        {{ isProcessing ? 'Procesando...' : 'Procesar Pago' }}
      </button>
    </form>
  \`
})
export class SecurePaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
  allowedCurrencies = SUPPORTED_CURRENCIES;
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private validationService: ValidationService,
    private sanitizer: SecuritySanitizerService
  ) {
    this.createForm();
  }

  private createForm() {
    this.paymentForm = this.fb.group({
      amount: ['', [
        Validators.required,
        Validators.min(0.01),
        Validators.max(10000),
        this.validationService.numericValidator(),
        this.validationService.decimalPlacesValidator(2)
      ]],
      description: ['', [
        Validators.maxLength(200),
        this.validationService.noScriptValidator(),
        this.validationService.noSqlInjectionValidator()
      ]],
      currency: ['', [
        Validators.required,
        this.validationService.allowedCurrencyValidator(this.allowedCurrencies)
      ]]
    });
  }

  async processPayment() {
    if (this.paymentForm.invalid) return;

    this.isProcessing = true;

    try {
      // Sanitize and validate on client
      const sanitizedData = this.sanitizeFormData();

      // Additional business logic validation
      const validationResult = await this.validateBusinessRules(sanitizedData);
      if (!validationResult.isValid) {
        throw new Error(validationResult.message);
      }

      // Server will perform final validation
      await this.paymentService.processPayment(sanitizedData);

      this.showSuccess('Pago procesado exitosamente');
      this.paymentForm.reset();

    } catch (error) {
      this.handlePaymentError(error);
    } finally {
      this.isProcessing = false;
    }
  }

  private sanitizeFormData(): PaymentRequest {
    const raw = this.paymentForm.value;

    return {
      amount: parseFloat(raw.amount),
      description: this.sanitizer.sanitize(raw.description),
      currency: raw.currency as CurrencyCode,
      userId: this.authService.getCurrentUserId()
    };
  }
}`,
      hints: [
        'Implementa validación tanto en cliente como servidor',
        'Usa whitelist validation en lugar de blacklist',
        'Sanitiza todos los inputs antes de procesamiento',
        'Implementa rate limiting para formularios críticos'
      ],
      solution: `Sistema de validación multi-capa con:
      1. **Validators Personalizados**: Para reglas de negocio específicas
      2. **Sanitización Automática**: Limpieza de inputs peligrosos
      3. **Validación de Negocio**: Reglas complejas del dominio
      4. **Server Validation**: Validación final en backend
      5. **Error Handling**: Mensajes claros y seguros`,
      learningPoints: [
        'Client-side validation is for UX, not security',
        'Always sanitize user inputs',
        'Implement business logic validation',
        'Use typed interfaces for data contracts',
        'Validate against whitelists, not blacklists'
      ],
      timeEstimate: 60,
      completed: false
    }
  ];

  labs: Lab[] = [
    {
      id: 'secure-angular-app',
      name: 'Construir Aplicación Angular Segura desde Cero',
      description: 'Laboratorio completo para desarrollar una aplicación Angular con todas las medidas de seguridad implementadas',
      duration: 180, // 3 hours
      difficulty: 'advanced',
      steps: [
        {
          step: 1,
          title: 'Configuración Inicial Segura',
          description: 'Establece la base del proyecto con configuraciones de seguridad',
          tasks: [
            'Crear nuevo proyecto Angular con configuración estricta',
            'Configurar ESLint con reglas de seguridad',
            'Implementar Content Security Policy (CSP)',
            'Configurar headers de seguridad'
          ],
          code: `ng new secure-app --strict --routing
cd secure-app
npm install eslint-plugin-security --save-dev

// angular.json - CSP Configuration
"build": {
  "options": {
    "index": "src/index.html",
    "main": "src/main.ts",
    "polyfills": "src/polyfills.ts",
    "tsConfig": "tsconfig.app.json",
    "assets": [
      "src/favicon.ico",
      "src/assets",
      {
        "glob": "**/*",
        "input": "src/assets",
        "output": "/assets",
        "csp": "default-src 'self'; script-src 'self'"
      }
    ]
  }
}`,
          verification: 'El proyecto debe compilar sin warnings de seguridad y pasar todas las validaciones de ESLint',
          completed: false
        },
        {
          step: 2,
          title: 'Implementar Autenticación Segura',
          description: 'Desarrolla un sistema de autenticación robusto con JWT y multi-factor',
          tasks: [
            'Crear servicio de autenticación con JWT',
            'Implementar guards de ruta',
            'Desarrollar interceptor de autenticación',
            'Configurar refresh token automático'
          ],
          code: `@Injectable()
export class AuthService {
  private readonly tokenKey = 'auth_token';

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials)
      .pipe(
        tap(response => this.storeTokens(response)),
        catchError(this.handleAuthError)
      );
  }

  private storeTokens(response: AuthResponse): void {
    // Store tokens in HTTP-only cookies, never localStorage
    this.cookieService.set(this.tokenKey, response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });
  }
}`,
          verification: 'La autenticación debe funcionar correctamente con tokens seguros y refresh automático',
          completed: false
        },
        {
          step: 3,
          title: 'Sistema de Autorización Granular',
          description: 'Implementa control de acceso basado en roles y permisos',
          tasks: [
            'Crear servicio de permisos',
            'Implementar directivas de autorización',
            'Desarrollar guards basados en permisos',
            'Crear sistema de auditoría'
          ],
          verification: 'El sistema debe restringir acceso basado en permisos específicos',
          completed: false
        },
        {
          step: 4,
          title: 'Validación y Sanitización Completa',
          description: 'Implementa validación robusta en todos los formularios',
          tasks: [
            'Crear validators personalizados',
            'Implementar sanitización automática',
            'Desarrollar interceptor de validación',
            'Configurar rate limiting'
          ],
          verification: 'Todos los inputs deben estar validados y sanitizados correctamente',
          completed: false
        },
        {
          step: 5,
          title: 'Testing de Seguridad',
          description: 'Desarrolla suite completa de tests de seguridad',
          tasks: [
            'Tests unitarios de componentes de seguridad',
            'Tests de integración de autenticación',
            'Tests E2E de flujos completos',
            'Análisis de vulnerabilidades automatizado'
          ],
          verification: 'Todos los tests deben pasar y no debe haber vulnerabilidades detectadas',
          completed: false
        }
      ],
      resources: [
        'Angular Security Guide',
        'OWASP Testing Guide',
        'JWT Security Best Practices',
        'CSP Configuration Guide'
      ],
      completionCriteria: [
        'Aplicación funciona sin vulnerabilidades críticas',
        'Todos los tests de seguridad pasan',
        'Configuraciones de seguridad están activas',
        'Documentación de seguridad está completa'
      ]
    }
  ];

  quizzes: Quiz[] = [
    {
      id: 'q1',
      question: '¿Cuál es la principal diferencia entre Insecure Design (A04) y otros tipos de vulnerabilidades?',
      type: 'multiple-choice',
      options: [
        'Insecure Design son bugs de implementación',
        'Insecure Design son fallas fundamentales en la arquitectura y diseño',
        'Insecure Design solo afecta el frontend',
        'Insecure Design es lo mismo que Security Misconfiguration'
      ],
      correctAnswer: 1,
      explanation: 'Insecure Design se refiere a fallas fundamentales en la arquitectura y diseño del sistema, no a bugs de implementación. Estas fallas no pueden resolverse con parches, requieren rediseño.'
    },
    {
      id: 'q2',
      question: 'Analiza este código Angular. ¿Cuál es el principal problema de diseño?',
      type: 'code-analysis',
      codeSnippet: `@Component({
  template: \`
    <div *ngIf="user.role === 'admin'">
      <button (click)="deleteUser(userId)">Delete User</button>
    </div>
  \`
})
export class UserManagementComponent {
  deleteUser(userId: string) {
    this.http.delete(\`/api/users/\${userId}\`).subscribe();
  }
}`,
      options: [
        'Falta validación de entrada',
        'Control de acceso solo client-side',
        'No hay manejo de errores',
        'Falta sanitización HTML'
      ],
      correctAnswer: 1,
      explanation: 'El principal problema es que el control de acceso está implementado solo en el cliente. Un atacante puede bypasear fácilmente la validación del rol modificando el código cliente.'
    },
    {
      id: 'q3',
      question: 'En un escenario donde necesitas implementar un sistema de aprobación de gastos, ¿cuál sería el diseño MÁS seguro?',
      type: 'scenario',
      options: [
        'Validar montos solo en el frontend para mejor UX',
        'Permitir auto-aprobación si el monto es menor a $100',
        'Implementar segregation of duties: quien crea no puede aprobar',
        'Usar cookies para almacenar límites de aprobación'
      ],
      correctAnswer: 2,
      explanation: 'Segregation of duties es un principio fundamental de seguridad. La misma persona que crea una solicitud no debe poder aprobarla, especialmente en sistemas financieros.'
    }
  ];

  caseStudies: CaseStudy[] = [
    {
      id: 'fintech-case',
      title: 'Vulnerabilidad de Diseño en Aplicación FinTech',
      company: 'SecureBank Mobile App',
      industry: 'Financial Services',
      problem: `Una aplicación bancaria Angular permitía transferencias sin validación adecuada de límites y sin segregation of duties.
      Los usuarios podían iniciar y aprobar sus propias transferencias, y los límites se validaban solo en el cliente.`,
      impact: `- Pérdidas financieras de $2.3M en 6 meses
      - 15,000 cuentas comprometidas
      - Multa regulatoria de $500K
      - Daño reputacional severo`,
      solution: `Rediseño completo del sistema de transferencias con:
      - Workflow de aprobación multi-nivel
      - Validación server-side de todos los límites
      - Segregation of duties obligatoria
      - Audit trail completo`,
      implementation: `@Injectable()
export class TransferService {
  async initiateTransfer(request: TransferRequest): Promise<TransferResult> {
    // Server-side validation
    await this.validateLimits(request);
    await this.validateSegregation(request);

    // Create pending transfer
    const transfer = await this.createPendingTransfer(request);

    // Initiate approval workflow
    await this.workflowService.startApprovalProcess(transfer);

    return { transferId: transfer.id, status: 'pending_approval' };
  }
}`,
      results: [
        'Eliminación completa de transferencias no autorizadas',
        '99.9% reducción en intentos de fraude interno',
        'Cumplimiento total con regulaciones bancarias',
        'Restauración de confianza del cliente'
      ],
      lessonsLearned: [
        'Never trust client-side validations for financial operations',
        'Implement proper segregation of duties from design phase',
        'Audit trails must be immutable and comprehensive',
        'Regular security design reviews are essential'
      ],
      angularSpecific: [
        'Use server-side validation interceptors',
        'Implement role-based component rendering',
        'Never store sensitive limits in client storage',
        'Use typed interfaces for financial data'
      ]
    }
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setSelectedExercise(exerciseId: string): void {
    this.selectedExercise = exerciseId;
    this.showSolution = false;
  }

  setSelectedLab(labId: string): void {
    this.selectedLab = labId;
    this.currentStep = 1;
  }

  getSelectedExercise(): PracticalExercise | undefined {
    return this.practicalExercises.find(e => e.id === this.selectedExercise);
  }

  getSelectedLab(): Lab | undefined {
    return this.labs.find(l => l.id === this.selectedLab);
  }

  getCurrentStep(): LabStep | undefined {
    const lab = this.getSelectedLab();
    return lab?.steps.find(s => s.step === this.currentStep);
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#64748b';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'analysis': return '🔍';
      case 'implementation': return '💻';
      case 'testing': return '🧪';
      case 'audit': return '📊';
      default: return '📝';
    }
  }

  toggleSolution(): void {
    this.showSolution = !this.showSolution;
  }

  markExerciseCompleted(exerciseId: string): void {
    const exercise = this.practicalExercises.find(e => e.id === exerciseId);
    if (exercise) {
      exercise.completed = true;
    }
  }

  markStepCompleted(stepNumber: number): void {
    const step = this.getCurrentStep();
    if (step) {
      step.completed = true;
    }
  }

  nextStep(): void {
    const lab = this.getSelectedLab();
    if (lab && this.currentStep < lab.steps.length) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  nextQuiz(): void {
    if (this.currentQuiz < this.quizzes.length - 1) {
      this.currentQuiz++;
    }
  }

  previousQuiz(): void {
    if (this.currentQuiz > 0) {
      this.currentQuiz--;
    }
  }

  selectAnswer(answer: string | number): void {
    this.userAnswers[this.currentQuiz] = answer;
  }

  isAnswerCorrect(quizIndex: number): boolean {
    return this.userAnswers[quizIndex] === this.quizzes[quizIndex].correctAnswer;
  }

  getQuizScore(): number {
    const correct = this.userAnswers.filter((answer, index) =>
      answer === this.quizzes[index].correctAnswer
    ).length;
    return Math.round((correct / this.quizzes.length) * 100);
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      console.log('Código copiado al portapapeles');
    });
  }

  resetExercise(): void {
    this.showSolution = false;
    const exercise = this.getSelectedExercise();
    if (exercise) {
      exercise.completed = false;
    }
  }

  downloadLabGuide(): void {
    const lab = this.getSelectedLab();
    if (lab) {
      const guide = this.generateLabGuide(lab);
      const blob = new Blob([guide], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${lab.id}_guide.md`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  private generateLabGuide(lab: Lab): string {
    return `# ${lab.name}

## Descripción
${lab.description}

## Duración: ${lab.duration} minutos
## Dificultad: ${lab.difficulty}

## Pasos

${lab.steps.map(step => `
### Paso ${step.step}: ${step.title}
${step.description}

#### Tareas:
${step.tasks.map(task => `- ${task}`).join('\n')}

#### Verificación:
${step.verification}
`).join('\n')}

## Recursos
${lab.resources.map(resource => `- ${resource}`).join('\n')}

## Criterios de Completitud
${lab.completionCriteria.map(criteria => `- ${criteria}`).join('\n')}
`;
  }

  // Helper method for template
  getOptionLetter(index: number): string {
    return String.fromCodePoint(65 + index);
  }
}
