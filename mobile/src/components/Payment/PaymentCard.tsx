import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../shared/Card';

interface PaymentCardProps {
  payment: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    description?: string;
  };
  onPress?: () => void;
}

export function PaymentCard({ payment, onPress }: PaymentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '📄';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={styles.card} variant="outlined">
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusIcon}>
              {getStatusIcon(payment.status)}
            </Text>
            <Text style={[styles.status, { color: getStatusColor(payment.status) }]}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.amount}>
            {formatAmount(payment.amount, payment.currency)}
          </Text>
        </View>

        {payment.description && (
          <Text style={styles.description} numberOfLines={2}>
            {payment.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.id}>ID: {payment.id.slice(-8)}</Text>
          <Text style={styles.date}>
            {formatDate(payment.createdAt)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  id: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'monospace',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default PaymentCard;
