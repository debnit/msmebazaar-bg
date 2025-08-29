import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../shared/Card';
import { useCurrentUser } from '../../services/auth.mobile';
import { usePaymentHistory } from '../../services/payment.mobile';

export function DashboardStats() {
  const { data: user } = useCurrentUser();
  const { data: paymentHistory } = usePaymentHistory();

  const stats = [
    {
      title: 'Total Payments',
      value: paymentHistory?.data?.total || 0,
      icon: '💳',
      color: '#3b82f6',
    },
    {
      title: 'Active Listings',
      value: user?.isPro ? 'Unlimited' : '1',
      icon: '📋',
      color: '#10b981',
    },
    {
      title: 'Profile Status',
      value: user?.isPro ? 'Pro' : 'Basic',
      icon: user?.isPro ? '⭐' : '👤',
      color: user?.isPro ? '#f59e0b' : '#6b7280',
    },
    {
      title: 'Messages',
      value: user?.isPro ? 'Unlimited' : 'Limited',
      icon: '💬',
      color: '#8b5cf6',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview</Text>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard} variant="elevated">
            <View style={styles.statContent}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default DashboardStats;
