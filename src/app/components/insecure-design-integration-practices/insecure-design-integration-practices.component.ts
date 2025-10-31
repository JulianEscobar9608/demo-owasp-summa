import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insecure-design-integration-practices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insecure-design-integration-practices.component.html',
  styleUrls: ['./insecure-design-integration-practices.component.css']
})
export class InsecureDesignIntegrationPracticesComponent {
  activeTab: string = 'cicd-security';

  tabs = [
    { id: 'cicd-security', label: 'CI/CD Security', icon: '🔒' },
    { id: 'iac-security', label: 'IaC Security', icon: '🏗️' },
    { id: 'testing-security', label: 'Security Testing', icon: '🧪' },
    { id: 'compliance-governance', label: 'Compliance', icon: '📋' }
  ];
}