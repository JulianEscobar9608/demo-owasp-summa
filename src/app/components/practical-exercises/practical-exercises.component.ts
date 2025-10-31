import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Exercise {
  id: number;
  title: string;
  description: string;
  code: string;
  isVulnerable: boolean;
  explanation: string;
  userAnswer?: boolean;
  completed: boolean;
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
  completed: boolean;
}

@Component({
  selector: 'app-practical-exercises',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './practical-exercises.component.html',
  styleUrl: './practical-exercises.component.css'
})
export class PracticalExercisesComponent {
  currentExerciseIndex = 0;
  currentQuizIndex = 0;
  showResults = false;

  // Ejercicios de identificación de código
  codeExercises: Exercise[] = [
    {
      id: 1,
      title: 'Identificar código vulnerable #1',
      description: 'Analiza este código y determina si es vulnerable a XSS',
      code: `// Componente Angular
@Component({
  template: \`<div [innerHTML]="userComment"></div>\`
})
export class CommentComponent {
  userComment: string = this.getFromAPI();
}`,
      isVulnerable: false,
      explanation: 'Este código NO es vulnerable. Angular sanitiza automáticamente el contenido en [innerHTML], removiendo scripts y elementos peligrosos.',
      completed: false
    },
    {
      id: 2,
      title: 'Identificar código vulnerable #2',
      description: '¿Es este código seguro contra ataques XSS?',
      code: `// Manipulación directa del DOM
ngOnInit() {
  const element = document.getElementById('content');
  element.innerHTML = this.userInput;
}`,
      isVulnerable: true,
      explanation: 'Este código ES vulnerable. La manipulación directa del DOM con innerHTML sin sanitización permite la ejecución de scripts maliciosos.',
      completed: false
    },
    {
      id: 3,
      title: 'Identificar código vulnerable #3',
      description: 'Revisa esta implementación de interpolación',
      code: `// Template Angular
<h1>Bienvenido {{ username }}</h1>
<p>Tu mensaje: {{ userMessage }}</p>`,
      isVulnerable: false,
      explanation: 'Este código NO es vulnerable. La interpolación {{ }} de Angular escapa automáticamente el contenido, convirtiendo caracteres HTML en entidades.',
      completed: false
    },
    {
      id: 4,
      title: 'Identificar código vulnerable #4',
      description: '¿Qué opinas de esta función de redirección?',
      code: `// Función de redirección
redirectUser(url: string) {
  window.location.href = url;
}

// Uso
redirectUser(this.userProvidedUrl);`,
      isVulnerable: true,
      explanation: 'Este código ES vulnerable. Permite redirecciones a URLs maliciosas como javascript:alert("XSS") sin validación.',
      completed: false
    },
    {
      id: 5,
      title: 'Identificar código vulnerable #5',
      description: 'Analiza esta implementación con bypassSecurityTrust',
      code: `// Uso del DomSanitizer
constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.bypassSecurityTrustHtml(html);
}

// Template
<div [innerHTML]="getSafeHtml(userInput)"></div>`,
      isVulnerable: true,
      explanation: 'Este código ES vulnerable. bypassSecurityTrustHtml() omite toda la sanitización de Angular, permitiendo la ejecución de scripts si el contenido no se valida manualmente.',
      completed: false
    },
    {
      id: 6,
      title: 'Identificar código vulnerable #6',
      description: 'Evalúa esta función de validación de URL',
      code: `// Validación de URL
isValidUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

// Uso en template
<a [href]="isValidUrl(userUrl) ? userUrl : '#'">Enlace</a>`,
      isVulnerable: true,
      explanation: 'Este código ES vulnerable. La validación es insuficiente, no previene URLs como "javascript:alert(1)" que no empiezan con http/https.',
      completed: false
    },
    {
      id: 7,
      title: 'Identificar código vulnerable #7',
      description: '¿Es seguro este componente que usa textContent?',
      code: `// Componente Angular
@Component({
  template: '<div [textContent]="userMessage"></div>'
})
export class SafeComponent {
  userMessage: string = '';
}`,
      isVulnerable: false,
      explanation: 'Este código NO es vulnerable. textContent establece solo texto plano, no interpreta HTML ni ejecuta scripts.',
      completed: false
    },
    {
      id: 8,
      title: 'Identificar código vulnerable #8',
      description: 'Analiza este manejo de eventos dinámicos',
      code: `// Event handler dinámico
ngAfterViewInit() {
  const button = document.createElement('button');
  button.onclick = new Function(this.userScript);
  document.body.appendChild(button);
}`,
      isVulnerable: true,
      explanation: 'Este código ES muy vulnerable. new Function() con entrada del usuario puede ejecutar código JavaScript arbitrario.',
      completed: false
    },
    {
      id: 9,
      title: 'Identificar código vulnerable #9',
      description: '¿Qué opinas de esta implementación con Renderer2?',
      code: `// Usando Renderer2
constructor(private renderer: Renderer2) {}

updateContent(content: string) {
  const element = this.renderer.createElement('div');
  this.renderer.setProperty(element, 'textContent', content);
  return element;
}`,
      isVulnerable: false,
      explanation: 'Este código NO es vulnerable. Renderer2 con textContent es seguro y es la forma recomendada de manipular el DOM en Angular.',
      completed: false
    },
    {
      id: 10,
      title: 'Identificar código vulnerable #10',
      description: 'Revisa esta implementación de CSP',
      code: `// Configuración CSP en meta tag
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self' 'unsafe-inline' 'unsafe-eval' *;">`,
      isVulnerable: true,
      explanation: 'Este CSP ES vulnerable. "unsafe-inline", "unsafe-eval" y "*" permiten casi cualquier contenido, anulando la protección CSP.',
      completed: false
    },
    {
      id: 11,
      title: 'Identificar código vulnerable #11',
      description: 'Evalúa este uso de JSON.parse',
      code: `// Parseo de datos
loadUserData(jsonString: string) {
  try {
    this.userData = JSON.parse(jsonString);
    this.displayData();
  } catch (e) {
    console.error('Error parsing JSON');
  }
}`,
      isVulnerable: false,
      explanation: 'Este código NO es vulnerable a XSS. JSON.parse por sí solo no ejecuta código, solo parsea datos. La vulnerabilidad dependería de cómo se use userData.',
      completed: false
    },
    {
      id: 12,
      title: 'Identificar código vulnerable #12',
      description: 'Analiza esta función de sanitización casera',
      code: `// Sanitización manual
sanitizeInput(input: string): string {
  return input.replace(/<script>/g, '')
              .replace(/javascript:/g, '');
}

// Uso
element.innerHTML = this.sanitizeInput(userInput);`,
      isVulnerable: true,
      explanation: 'Este código ES vulnerable. La sanitización manual es insuficiente: no cubre todas las variantes (<SCRIPT>, JavaScript:, eventos onclick, etc.).',
      completed: false
    }
  ];

  // Quiz de conocimientos
  quiz: Quiz[] = [
    {
      question: '¿Cuál es la principal diferencia entre XSS Reflejado y XSS Almacenado?',
      options: [
        'No hay diferencia, ambos son iguales',
        'El XSS Reflejado se ejecuta inmediatamente, el Almacenado se guarda en el servidor',
        'El XSS Almacenado es menos peligroso',
        'El XSS Reflejado solo funciona en Internet Explorer'
      ],
      correctAnswer: 1,
      explanation: 'El XSS Reflejado se ejecuta inmediatamente (como en parámetros URL), mientras que el XSS Almacenado se guarda en el servidor y afecta a múltiples usuarios.',
      completed: false
    },
    {
      question: '¿Qué hace Angular automáticamente para prevenir XSS?',
      options: [
        'Nada, el desarrollador debe hacerlo todo manualmente',
        'Solo valida las entradas del usuario',
        'Sanitiza el contenido en interpolaciones y property bindings',
        'Bloquea todo el JavaScript'
      ],
      correctAnswer: 2,
      explanation: 'Angular sanitiza automáticamente el contenido en interpolaciones {{ }} y property bindings como [innerHTML], removiendo elementos y atributos peligrosos.',
      completed: false
    },
    {
      question: '¿Cuándo deberías usar bypassSecurityTrustHtml()?',
      options: [
        'Siempre que necesites mostrar HTML',
        'Nunca, es peligroso',
        'Solo cuando el HTML proviene de una fuente confiable y ya está validado',
        'Cuando Angular no funciona correctamente'
      ],
      correctAnswer: 2,
      explanation: 'bypassSecurityTrustHtml() solo debe usarse con contenido HTML de fuentes completamente confiables y previamente validado, ya que omite toda la protección de Angular.',
      completed: false
    },
    {
      question: '¿Qué es Content Security Policy (CSP)?',
      options: [
        'Un framework de JavaScript',
        'Una librería de Angular',
        'Un header HTTP que controla qué recursos puede cargar una página',
        'Un método de cifrado'
      ],
      correctAnswer: 2,
      explanation: 'CSP es un header HTTP que permite especificar qué fuentes de contenido son válidas, ayudando a prevenir XSS al bloquear scripts no autorizados.',
      completed: false
    },
    {
      question: '¿Cuál es la forma MÁS segura de mostrar texto del usuario en Angular?',
      options: [
        'Usar [innerHTML] directamente',
        'Usar interpolación {{ }}',
        'Usar document.innerHTML',
        'Usar eval()'
      ],
      correctAnswer: 1,
      explanation: 'La interpolación {{ }} es la forma más segura ya que Angular escapa automáticamente todo el contenido, tratándolo como texto plano.',
      completed: false
    },
    {
      question: '¿Qué contexto de seguridad NO sanitiza Angular automáticamente?',
      options: [
        'HTML',
        'URLs',
        'Resource URLs (src de iframe, embed, etc.)',
        'Texto plano'
      ],
      correctAnswer: 2,
      explanation: 'Angular no sanitiza Resource URLs automáticamente debido a su alto riesgo. Debes validarlas manualmente antes de usar bypassSecurityTrustResourceUrl().',
      completed: false
    },
    {
      question: '¿Cuál de estos payloads XSS NO sería bloqueado por Angular en interpolación?',
      options: [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert("XSS")',
        'Ninguno, Angular los bloquea todos en interpolación'
      ],
      correctAnswer: 3,
      explanation: 'Angular escapa todo el contenido en interpolaciones {{ }}, convirtiendo caracteres especiales en entidades HTML, por lo que ningún payload XSS puede ejecutarse.',
      completed: false
    },
    {
      question: '¿Qué método del DomSanitizer es MÁS peligroso si se usa incorrectamente?',
      options: [
        'bypassSecurityTrustUrl()',
        'bypassSecurityTrustHtml()',
        'bypassSecurityTrustScript()',
        'bypassSecurityTrustResourceUrl()'
      ],
      correctAnswer: 2,
      explanation: 'bypassSecurityTrustScript() es el más peligroso porque permite la ejecución directa de JavaScript, pudiendo ejecutar cualquier código malicioso.',
      completed: false
    },
    {
      question: '¿Cuál es una buena práctica para validar URLs antes de usarlas?',
      options: [
        'Solo verificar que empiece con http://',
        'Usar una whitelist de dominios permitidos',
        'Confiar en que el navegador las validará',
        'No es necesario validarlas'
      ],
      correctAnswer: 1,
      explanation: 'Una whitelist de dominios permitidos es la práctica más segura, ya que solo permite URLs de fuentes conocidas y confiables.',
      completed: false
    },
    {
      question: '¿Qué hace el header "X-XSS-Protection: 1; mode=block"?',
      options: [
        'Habilita protección XSS del navegador y bloquea la página si detecta un ataque',
        'Desactiva completamente JavaScript',
        'Solo funciona en Internet Explorer',
        'Es lo mismo que Content Security Policy'
      ],
      correctAnswer: 0,
      explanation: 'Este header habilita el filtro XSS del navegador y le dice que bloquee completamente la página si detecta un posible ataque XSS.',
      completed: false
    },
    {
      question: '¿Cuál es el principal riesgo de usar innerHTML con contenido no sanitizado?',
      options: [
        'Puede romper el CSS',
        'Permite la ejecución de JavaScript malicioso',
        'Hace que la página cargue más lento',
        'No hay riesgo'
      ],
      correctAnswer: 1,
      explanation: 'innerHTML puede ejecutar JavaScript incluido en el HTML, permitiendo ataques XSS que pueden robar datos, sesiones, o realizar acciones maliciosas.',
      completed: false
    },
    {
      question: '¿Qué es DOM XSS (XSS Tipo 0)?',
      options: [
        'XSS que solo afecta al DOM',
        'XSS donde el payload nunca llega al servidor, solo se ejecuta en el cliente',
        'XSS que usa DOM methods obsoletos',
        'No existe este tipo de XSS'
      ],
      correctAnswer: 1,
      explanation: 'DOM XSS ocurre cuando JavaScript del lado cliente modifica el DOM de forma insegura, sin que el payload malicioso llegue al servidor.',
      completed: false
    },
    {
      question: '¿Cuál es la mejor estrategia para prevenir XSS en aplicaciones Angular?',
      options: [
        'Solo usar CSP',
        'Solo confiar en la sanitización automática de Angular',
        'Combinar sanitización automática, validación de entrada, CSP y buenas prácticas',
        'Solo validar en el servidor'
      ],
      correctAnswer: 2,
      explanation: 'La defensa en profundidad es la mejor estrategia: combinar múltiples capas de protección incluyendo sanitización, validación, CSP y seguir buenas prácticas.',
      completed: false
    },
    {
      question: '¿En qué escenario sería apropiado usar bypassSecurityTrustHtml()?',
      options: [
        'Para mostrar comentarios de usuarios',
        'Para contenido HTML de un editor WYSIWYG después de validación exhaustiva',
        'Para cualquier contenido de API externa',
        'Nunca debería usarse'
      ],
      correctAnswer: 1,
      explanation: 'Es apropiado solo para contenido HTML de fuentes confiables que ya ha sido validado exhaustivamente, como contenido de un CMS interno o editor controlado.',
      completed: false
    }
  ];

  // Verificar respuesta del ejercicio
  checkExerciseAnswer(exerciseIndex: number, userAnswer: boolean) {
    const exercise = this.codeExercises[exerciseIndex];
    exercise.userAnswer = userAnswer;
    exercise.completed = true;
  }

  // Verificar respuesta del quiz
  checkQuizAnswer(quizIndex: number, userAnswer: number) {
    const question = this.quiz[quizIndex];
    question.userAnswer = userAnswer;
    question.completed = true;
  }

  // Navegar ejercicios
  nextExercise() {
    if (this.currentExerciseIndex < this.codeExercises.length - 1) {
      this.currentExerciseIndex++;
    }
  }

  prevExercise() {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
    }
  }

  // Navegar quiz
  nextQuiz() {
    if (this.currentQuizIndex < this.quiz.length - 1) {
      this.currentQuizIndex++;
    }
  }

  prevQuiz() {
    if (this.currentQuizIndex > 0) {
      this.currentQuizIndex--;
    }
  }

  // Obtener resultados
  getExerciseResults() {
    const total = this.codeExercises.length;
    const completed = this.codeExercises.filter(ex => ex.completed).length;
    const correct = this.codeExercises.filter(ex =>
      ex.completed && ex.userAnswer === ex.isVulnerable
    ).length;

    return { total, completed, correct };
  }

  getQuizResults() {
    const total = this.quiz.length;
    const completed = this.quiz.filter(q => q.completed).length;
    const correct = this.quiz.filter(q =>
      q.completed && q.userAnswer === q.correctAnswer
    ).length;

    return { total, completed, correct };
  }

  // Mostrar resultados finales
  showFinalResults() {
    this.showResults = true;
  }

  // Reiniciar ejercicios
  resetExercises() {
    for (const ex of this.codeExercises) {
      ex.completed = false;
      ex.userAnswer = undefined;
    }
    for (const q of this.quiz) {
      q.completed = false;
      q.userAnswer = undefined;
    }
    this.currentExerciseIndex = 0;
    this.currentQuizIndex = 0;
    this.showResults = false;
  }

  // Verificar si está completado
  isExerciseAnswered(index: number): boolean {
    return this.codeExercises[index].completed;
  }

  isQuizAnswered(index: number): boolean {
    return this.quiz[index].completed;
  }

  // Verificar si la respuesta es correcta
  isExerciseCorrect(index: number): boolean {
    const exercise = this.codeExercises[index];
    return exercise.completed && exercise.userAnswer === exercise.isVulnerable;
  }

  isQuizCorrect(index: number): boolean {
    const question = this.quiz[index];
    return question.completed && question.userAnswer === question.correctAnswer;
  }

  // Helper methods for templates
  getOptionLetter(index: number): string {
    return String.fromCodePoint(65 + index) + '.';
  }

  roundPercentage(value: number): number {
    return Math.round(value);
  }

  calculateExercisePercentage(): number {
    const results = this.getExerciseResults();
    return this.roundPercentage((results.correct / results.total) * 100);
  }

  calculateQuizPercentage(): number {
    const results = this.getQuizResults();
    return this.roundPercentage((results.correct / results.total) * 100);
  }

  calculateTotalPercentage(): number {
    const exerciseResults = this.getExerciseResults();
    const quizResults = this.getQuizResults();
    const total = exerciseResults.total + quizResults.total;
    const correct = exerciseResults.correct + quizResults.correct;
    return this.roundPercentage((correct / total) * 100);
  }
}
