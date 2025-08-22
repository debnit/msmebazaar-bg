import { Performance, PerformanceObserver } from 'react-native-performance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@mobile/api/apiClient';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  type: 'navigation' | 'api' | 'render' | 'user_interaction';
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;

  initialize() {
    if (this.observer) return;

    // Monitor performance entries
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric({
          name: entry.name,
          duration: entry.duration,
          timestamp: entry.startTime,
          type: this.getMetricType(entry.name),
        });
      });
    });

    this.observer.observe({ entryTypes: ['navigation', 'measure', 'mark'] });
  }

  private getMetricType(name: string): PerformanceMetric['type'] {
    if (name.includes('navigation')) return 'navigation';
    if (name.includes('api')) return 'api';
    if (name.includes('render')) return 'render';
    return 'user_interaction';
  }

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory issues
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Send critical performance issues immediately
    if (metric.duration > 1000) {
      this.reportSlowOperation(metric);
    }
  }

  // Measure screen navigation performance
  measureNavigation(screenName: string, startTime: number) {
    const endTime = Performance.now();
    const duration = endTime - startTime;
    
    this.recordMetric({
      name: `navigation_to_${screenName}`,
      duration,
      timestamp: startTime,
      type: 'navigation',
      metadata: { screenName }
    });
  }

  // Measure API call performance
  measureApiCall(endpoint: string, startTime: number, success: boolean) {
    const endTime = Performance.now();
    const duration = endTime - startTime;
    
    this.recordMetric({
      name: `api_${endpoint}`,
      duration,
      timestamp: startTime,
      type: 'api',
      metadata: { endpoint, success }
    });
  }

  // Measure component render time
  measureRender(componentName: string, startTime: number) {
    const endTime = Performance.now();
    const duration = endTime - startTime;
    
    this.recordMetric({
      name: `render_${componentName}`,
      duration,
      timestamp: startTime,
      type: 'render',
      metadata: { componentName }
    });
  }

  private async reportSlowOperation(metric: PerformanceMetric) {
    try {
      await apiClient.post('/analytics/performance', {
        type: 'slow_operation',
        metric,
        deviceInfo: await this.getDeviceInfo(),
      });
    } catch (error) {
      console.error('Failed to report slow operation:', error);
    }
  }

  private async getDeviceInfo() {
    // Get device performance info
    return {
      platform: Platform.OS,
      version: Platform.Version,
      // Add more device-specific info as needed
    };
  }

  async sendPerformanceReport() {
    try {
      const report = {
        metrics: this.metrics,
        summary: this.generateSummary(),
        timestamp: Date.now(),
      };

      await apiClient.post('/analytics/performance-report', report);
      
      // Clear metrics after successful send
      this.metrics = [];
    } catch (error) {
      console.error('Failed to send performance report:', error);
    }
  }

  private generateSummary() {
    const navigationMetrics = this.metrics.filter(m => m.type === 'navigation');
    const apiMetrics = this.metrics.filter(m => m.type === 'api');
    const renderMetrics = this.metrics.filter(m => m.type === 'render');

    return {
      avgNavigationTime: this.calculateAverage(navigationMetrics.map(m => m.duration)),
      avgApiResponseTime: this.calculateAverage(apiMetrics.map(m => m.duration)),
      avgRenderTime: this.calculateAverage(renderMetrics.map(m => m.duration)),
      slowOperationsCount: this.metrics.filter(m => m.duration > 1000).length,
      totalMetrics: this.metrics.length,
    };
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  getMetrics() {
    return [...this.metrics];
  }

  clearMetrics() {
    this.metrics = [];
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();