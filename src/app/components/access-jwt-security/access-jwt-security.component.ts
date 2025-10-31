import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface JWTExample {
  id: string;
  title: string;
  description: string;
  vulnerability: string;
  secureImplementation: string;
  impact: string[];
  prevention: string[];
}

@Component({
  selector: 'app-access-jwt-security',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-jwt-security.component.html',
  styleUrl: './access-jwt-security.component.css'
})
export class AccessJwtSecurityComponent {
  currentTab: string = 'overview';
  selectedExample: string = 'weak-secret';

  jwtStructure = {
    header: '{"alg":"HS256","typ":"JWT"}',
    payload: '{"sub":"1234567890","name":"John Doe","admin":true}',
    signature: 'HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)'
  };

  vulnerabilityExamples: { [key: string]: JWTExample } = {
    'weak-secret': {
      id: 'weak-secret',
      title: 'Secretos Débiles',
      description: 'Uso de secretos predecibles o débiles para firmar tokens JWT',
      vulnerability: `
// ❌ Secreto débil y predecible
const JWT_SECRET = 'secret123';
const JWT_SECRET = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

// ❌ Hardcoded en el código
export class AuthService {
  private secret = 'myapp-secret-key';

  generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      this.secret,  // ⚠️ Secreto débil
      { expiresIn: '24h' }
    );
  }
}`,
      secureImplementation: `
// ✅ Secreto fuerte y seguro
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

// ✅ Configuración segura
export class AuthService {
  private secret: string;

  constructor() {
    // Valida que el secreto tenga la longitud mínima
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    this.secret = secret;
  }

  generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),  // Issued at
        jti: uuidv4()  // JWT ID único
      },
      this.secret,
      {
        expiresIn: '15m',  // ✅ Tiempo de vida corto
        issuer: 'myapp.com',
        audience: 'myapp-users'
      }
    );
  }
}`,
      impact: [
        'Tokens pueden ser falsificados fácilmente',
        'Ataques de fuerza bruta exitosos',
        'Compromiso total del sistema de autenticación',
        'Escalación de privilegios no autorizada'
      ],
      prevention: [
        'Usar secretos criptográficamente seguros (mínimo 256 bits)',
        'Almacenar secretos en variables de entorno seguras',
        'Rotar secretos regularmente',
        'Implementar múltiples secretos para rotación sin interrupciones'
      ]
    },

    'algorithm-confusion': {
      id: 'algorithm-confusion',
      title: 'Confusión de Algoritmos',
      description: 'Vulnerabilidad que permite cambiar el algoritmo de firma del token',
      vulnerability: `
// ❌ No especifica algoritmo permitido
export class JWTService {
  verifyToken(token: string): any {
    try {
      // ⚠️ VULNERABLE: Acepta cualquier algoritmo
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // ⚠️ Acepta algoritmo "none"
  decodeToken(token: string): any {
    return jwt.decode(token, { complete: true });
  }
}

// ❌ Token malicioso con algoritmo "none"
const maliciousToken = {
  header: { alg: 'none', typ: 'JWT' },
  payload: { userId: 1, admin: true, exp: 9999999999 },
  signature: ''  // Sin firma!
};`,
      secureImplementation: `
// ✅ Especifica algoritmos permitidos
export class JWTService {
  private allowedAlgorithms = ['HS256', 'HS384', 'HS512'];

  verifyToken(token: string): any {
    try {
      // ✅ SEGURO: Solo permite algoritmos específicos
      return jwt.verify(token, this.secret, {
        algorithms: this.allowedAlgorithms,
        issuer: 'myapp.com',
        audience: 'myapp-users'
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // ✅ Validación estricta del header
  validateTokenHeader(token: string): boolean {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.header) {
      return false;
    }

    const { alg } = decoded.header;

    // Rechaza explícitamente "none"
    if (alg === 'none') {
      return false;
    }

    return this.allowedAlgorithms.includes(alg);
  }
}`,
      impact: [
        'Bypass completo de la autenticación',
        'Creación de tokens sin firma válida',
        'Suplantación de identidad de cualquier usuario',
        'Acceso administrativo no autorizado'
      ],
      prevention: [
        'Especificar explícitamente algoritmos permitidos',
        'Rechazar tokens con algoritmo "none"',
        'Validar el header del token antes de procesar',
        'Implementar lista blanca de algoritmos'
      ]
    }
  };

  // Simulación de tokens
  sampleTokens = {
    valid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyfQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ',
    malicious: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.'
  };

  setActiveTab(tab: string): void {
    this.currentTab = tab;
  }

  selectExample(exampleId: string): void {
    this.selectedExample = exampleId;
  }

  getCurrentExample(): JWTExample {
    return this.vulnerabilityExamples[this.selectedExample];
  }

  decodeJWT(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { error: 'Token malformado' };
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      return {
        header,
        payload,
        signature: parts[2] || 'No signature'
      };
    } catch (error) {
      return { error: 'Error decodificando token' };
    }
  }

  analyzeToken(tokenType: string): any {
    const token = this.sampleTokens[tokenType as keyof typeof this.sampleTokens];
    return this.decodeJWT(token);
  }

  // Simulación de validación
  simulateValidation(tokenType: string, useSecureValidation: boolean): any {
    const token = this.sampleTokens[tokenType as keyof typeof this.sampleTokens];
    const decoded = this.decodeJWT(token);

    if (decoded.error) {
      return { valid: false, reason: decoded.error };
    }

    // Simulación de validación insegura
    if (!useSecureValidation) {
      return {
        valid: true,
        reason: 'Token aceptado sin validación adecuada',
        warning: 'Validación insegura detectada'
      };
    }

    // Simulación de validación segura
    if (decoded.header.alg === 'none') {
      return { valid: false, reason: 'Algoritmo "none" no permitido' };
    }

    if (tokenType === 'expired') {
      return { valid: false, reason: 'Token expirado' };
    }

    return { valid: true, reason: 'Token válido y seguro' };
  }

  generateSecureToken(): string {
    // Simula la generación de un token seguro
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: '1234567890',
      name: 'John Doe',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutos
      iss: 'myapp.com',
      aud: 'myapp-users'
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    // Simula una firma (en producción usarías una biblioteca JWT real)
    const signature = 'SECURE_SIGNATURE_' + Math.random().toString(36).substring(7);

    return `${encodedHeader}.${encodedPayload}.${btoa(signature)}`;
  }
}
