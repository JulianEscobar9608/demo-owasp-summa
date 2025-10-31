import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VulnerableExample {
  id: string;
  title: string;
  description: string;
  vulnerability: string;
  vulnerableCode: string;
  secureCode: string;
  impact: string;
  category: 'validation' | 'business-logic' | 'architecture' | 'authentication';
  severity: 'critical' | 'high' | 'medium';
}

interface BusinessLogicFlaw {
  scenario: string;
  description: string;
  vulnerableFlow: string[];
  exploitSteps: string[];
  secureFlow: string[];
  prevention: string;
}

@Component({
  selector: 'app-insecure-design-vulnerable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insecure-design-vulnerable.component.html',
  styleUrl: './insecure-design-vulnerable.component.css'
})
export class InsecureDesignVulnerableComponent {
  activeTab: string = 'overview';
  selectedExample: string = 'missing-validation';
  currentDemo: string = 'purchase-bypass';
  simulationResults: string[] = [];

  vulnerableExamples: VulnerableExample[] = [
    {
      id: 'missing-validation',
      title: 'Validación Solo en Frontend',
      description: 'Formulario que confía únicamente en validaciones del lado cliente',
      vulnerability: 'Sin validación server-side, permite bypass completo',
      vulnerableCode: `// ❌ VULNERABLE - Solo validación cliente
// user.service.ts
updateProfile(userData: any) {
  return this.http.put('/api/users/profile', userData);
}

// component.ts
onSubmit() {
  if (this.profileForm.valid) { // Solo validación Angular
    this.userService.updateProfile(this.profileForm.value)
      .subscribe(result => console.log('Updated'));
  }
}`,
      secureCode: `// ✅ SEGURO - Validación en ambos lados
// Backend: user.controller.js
app.put('/api/users/profile', validate(profileSchema), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Procesar actualización...
});

// Frontend: component.ts
onSubmit() {
  if (this.profileForm.valid) {
    this.userService.updateProfile(this.profileForm.value)
      .pipe(
        catchError(error => {
          this.handleValidationErrors(error);
          return throwError(error);
        })
      )
      .subscribe(result => console.log('Updated'));
  }
}`,
      impact: 'Bypass completo de validaciones, manipulación de datos',
      category: 'validation',
      severity: 'critical'
    },
    {
      id: 'price-manipulation',
      title: 'Manipulación de Precios',
      description: 'Sistema de compras que permite modificar precios desde el frontend',
      vulnerability: 'Precio enviado desde el cliente sin validación server-side',
      vulnerableCode: `// ❌ VULNERABLE - Precio controlado por cliente
// checkout.component.ts
processPayment() {
  const orderData = {
    productId: this.selectedProduct.id,
    quantity: this.quantity,
    price: this.selectedProduct.price, // ⚠️ Precio del cliente
    total: this.quantity * this.selectedProduct.price
  };

  this.orderService.createOrder(orderData).subscribe();
}

// order.service.ts
createOrder(orderData: any) {
  return this.http.post('/api/orders', orderData); // Confía en precio cliente
}`,
      secureCode: `// ✅ SEGURO - Precio calculado en servidor
// checkout.component.ts
processPayment() {
  const orderData = {
    productId: this.selectedProduct.id,
    quantity: this.quantity
    // ✅ NO enviar precio desde cliente
  };

  this.orderService.createOrder(orderData).subscribe();
}

// Backend: order.controller.js
app.post('/api/orders', auth, async (req, res) => {
  const { productId, quantity } = req.body;

  // ✅ Obtener precio real desde DB
  const product = await Product.findById(productId);
  const total = product.price * quantity;

  const order = await Order.create({
    userId: req.user.id,
    productId,
    quantity,
    price: product.price, // Precio real
    total: total
  });

  res.json(order);
});`,
      impact: 'Pérdidas financieras, compras fraudulentas',
      category: 'business-logic',
      severity: 'critical'
    },
    {
      id: 'role-escalation',
      title: 'Escalación de Privilegios',
      description: 'Sistema de roles que permite auto-asignación de permisos',
      vulnerability: 'Usuario puede modificar sus propios roles desde el frontend',
      vulnerableCode: `// ❌ VULNERABLE - Usuario modifica sus roles
// user-settings.component.ts
updateUserRoles() {
  const userData = {
    ...this.userForm.value,
    roles: this.selectedRoles // ⚠️ Roles desde frontend
  };

  this.userService.updateUser(userData).subscribe();
}

// Backend vulnerable
app.put('/api/users/:id', (req, res) => {
  const { roles, ...otherData } = req.body;

  // ⚠️ Actualiza roles sin verificar permisos
  User.findByIdAndUpdate(req.params.id, {
    ...otherData,
    roles: roles // Peligroso: acepta cualquier rol
  });
});`,
      secureCode: `// ✅ SEGURO - Roles manejados por admin
// user-settings.component.ts
updateUserProfile() {
  const userData = {
    name: this.userForm.value.name,
    email: this.userForm.value.email
    // ✅ NO incluir roles en actualización de perfil
  };

  this.userService.updateProfile(userData).subscribe();
}

// Backend seguro
app.put('/api/users/:id/profile', auth, (req, res) => {
  const allowedFields = ['name', 'email', 'phone'];
  const updateData = {};

  // ✅ Solo campos permitidos
  allowedFields.forEach(field => {
    if (req.body[field]) updateData[field] = req.body[field];
  });

  User.findByIdAndUpdate(req.params.id, updateData);
});

// Endpoint separado para roles (solo admin)
app.put('/api/admin/users/:id/roles', auth, requireAdmin, (req, res) => {
  const { roles } = req.body;
  User.findByIdAndUpdate(req.params.id, { roles });
});`,
      impact: 'Escalación de privilegios, acceso no autorizado',
      category: 'authentication',
      severity: 'critical'
    },
    {
      id: 'data-exposure',
      title: 'Exposición Excesiva de Datos',
      description: 'API que devuelve más información de la necesaria',
      vulnerability: 'Endpoints que exponen datos sensibles innecesariamente',
      vulnerableCode: `// ❌ VULNERABLE - API expone todo
// user.service.ts
getAllUsers() {
  return this.http.get<User[]>('/api/users'); // Retorna TODO
}

// Backend vulnerable
app.get('/api/users', (req, res) => {
  // ⚠️ Retorna TODOS los campos de TODOS los usuarios
  const users = await User.find();
  res.json(users); // Incluye passwords, tokens, etc.
});

// user-list.component.ts
loadUsers() {
  this.userService.getAllUsers().subscribe(users => {
    this.users = users; // ⚠️ Cliente recibe datos sensibles
  });
}`,
      secureCode: `// ✅ SEGURO - API con filtrado específico
// user.service.ts
getUsersForListing() {
  return this.http.get<UserSummary[]>('/api/users/summary');
}

// Backend seguro
app.get('/api/users/summary', auth, (req, res) => {
  // ✅ Solo campos necesarios para listing
  const users = await User.find()
    .select('name email role createdAt') // Campos específicos
    .where('isActive', true); // Filtros apropiados

  res.json(users);
});

// user-list.component.ts
interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

loadUsers() {
  this.userService.getUsersForListing().subscribe(users => {
    this.users = users; // ✅ Solo datos necesarios
  });
}`,
      impact: 'Exposición de datos personales, violación de privacidad',
      category: 'architecture',
      severity: 'high'
    }
  ];

  businessLogicFlaws: BusinessLogicFlaw[] = [
    {
      scenario: 'Bypass de Proceso de Compra',
      description: 'Flujo de compra que puede ser manipulado para obtener productos gratis',
      vulnerableFlow: [
        '1. Usuario selecciona producto (precio: $100)',
        '2. Frontend calcula total: 1 × $100 = $100',
        '3. Usuario modifica request: price: $0',
        '4. Backend acepta precio modificado',
        '5. Orden creada con total: $0'
      ],
      exploitSteps: [
        'Interceptar request POST /api/orders',
        'Modificar field "price": 0 o "quantity": -1',
        'Enviar request modificado',
        'Sistema procesa orden con precio alterado'
      ],
      secureFlow: [
        '1. Usuario selecciona producto y cantidad',
        '2. Frontend envía solo productId y quantity',
        '3. Backend obtiene precio real de la base de datos',
        '4. Backend calcula total con datos confiables',
        '5. Backend valida stock disponible',
        '6. Orden creada con datos verificados'
      ],
      prevention: 'Never trust client data, always recalculate server-side, implement audit trails'
    },
    {
      scenario: 'Manipulación de Descuentos',
      description: 'Sistema de cupones que puede ser abusado para descuentos ilimitados',
      vulnerableFlow: [
        '1. Usuario aplica cupón válido (10% descuento)',
        '2. Frontend calcula descuento localmente',
        '3. Usuario modifica porcentaje a 100%',
        '4. Sistema aplica descuento sin validar',
        '5. Producto obtenido gratis'
      ],
      exploitSteps: [
        'Aplicar cupón válido en la UI',
        'Interceptar request de aplicación',
        'Modificar "discountPercentage": 100',
        'Sistema aplica descuento completo'
      ],
      secureFlow: [
        '1. Usuario ingresa código de cupón',
        '2. Backend valida código en base de datos',
        '3. Backend verifica restricciones (uso único, fecha, etc.)',
        '4. Backend aplica descuento según reglas stored',
        '5. Backend registra uso del cupón',
        '6. Descuento aplicado correctamente'
      ],
      prevention: 'Server-side coupon validation, rate limiting, usage tracking, audit logs'
    }
  ];

  architecturalProblems = [
    {
      title: 'State Management Inseguro',
      description: 'Estado de la aplicación que expone información sensible',
      problem: 'Almacenar datos sensibles en estado cliente accesible',
      example: 'JWT tokens en localStorage, user data sin encriptar en NgRx store',
      solution: 'Secure storage, encrypted sensitive data, minimal client state'
    },
    {
      title: 'Service Layer Débil',
      description: 'Servicios que no implementan validaciones de seguridad',
      problem: 'Servicios que confían en datos del cliente sin validación',
      example: 'Services que no validan ownership, sin rate limiting',
      solution: 'Service-level validation, ownership checks, proper error handling'
    },
    {
      title: 'API Design Inseguro',
      description: 'Diseño de APIs que facilita ataques',
      problem: 'APIs RESTful mal diseñadas que exponen estructura interna',
      example: 'IDs secuenciales, endpoints predecibles, respuestas verbosas',
      solution: 'UUID usage, proper HTTP status codes, minimal response data'
    }
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setSelectedExample(example: string): void {
    this.selectedExample = example;
  }

  setCurrentDemo(demo: string): void {
    this.currentDemo = demo;
  }

  runBusinessLogicDemo(demo: string): void {
    this.simulationResults = [];

    setTimeout(() => {
      switch (demo) {
        case 'purchase-bypass':
          this.simulationResults = [
            '🛒 Iniciando proceso de compra...',
            '📱 Cliente: Producto seleccionado - Laptop Gaming ($1,500)',
            '🔧 Atacante: Interceptando request POST /api/orders',
            '⚠️ Atacante: Modificando price: 1500 → 0',
            '📤 Enviando request modificado al servidor',
            '❌ Servidor: Procesando sin validación',
            '✅ Orden creada exitosamente - Total: $0',
            '💰 Resultado: Laptop obtenida gratis - Pérdida: $1,500'
          ];
          break;
        case 'coupon-abuse':
          this.simulationResults = [
            '🎟️ Aplicando cupón de descuento...',
            '📱 Cliente: Cupón "SAVE10" aplicado (10% descuento)',
            '🔧 Atacante: Interceptando request de checkout',
            '⚠️ Atacante: Modificando discountPercentage: 10 → 100',
            '📤 Enviando request con descuento 100%',
            '❌ Servidor: Aplicando descuento sin validar',
            '✅ Compra procesada - Descuento: 100%',
            '💰 Resultado: Producto gratis con cupón manipulado'
          ];
          break;
        case 'role-elevation':
          this.simulationResults = [
            '👤 Actualizando perfil de usuario...',
            '📱 Cliente: Usuario regular editando perfil',
            '🔧 Atacante: Interceptando PUT /api/users/profile',
            '⚠️ Atacante: Agregando "roles": ["admin"]',
            '📤 Enviando request con roles modificados',
            '❌ Servidor: Actualizando sin validar permisos',
            '✅ Usuario actualizado con rol admin',
            '🚨 Resultado: Escalación de privilegios exitosa'
          ];
          break;
      }
    }, 1000);
  }

  getSelectedExample(): VulnerableExample | undefined {
    return this.vulnerableExamples.find(ex => ex.id === this.selectedExample);
  }

  getExamplesByCategory(category: string): VulnerableExample[] {
    return this.vulnerableExamples.filter(ex => ex.category === category);
  }

  getSeverityColor(severity: string): string {
    const colors = {
      'critical': '#dc2626',
      'high': '#ea580c',
      'medium': '#d97706'
    };
    return colors[severity as keyof typeof colors] || '#6b7280';
  }

  getCategoryIcon(category: string): string {
    const icons = {
      'validation': '✅',
      'business-logic': '⚙️',
      'architecture': '🏗️',
      'authentication': '🔐'
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
