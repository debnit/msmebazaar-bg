import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../shared/Card';
import { useCurrentUser } from '../../services/auth.mobile';

export function QuickActions() {
  const navigation = useNavigation();
  const { data: user } = useCurrentUser();

  const actions = [
    {
      title: 'Make Payment',
      description: 'Process a new payment',
      icon: '💳',
      color: '#3b82f6',
      onPress: () => navigation.navigate('Payments' as never),
    },
    {
      title: 'Apply for Loan',
      description: 'Start loan application',
      icon: '💰',
      color: '#10b981',
      onPress: () => {/* Navigate to loan application */},
    },
    {
      title: user?.isPro ? 'Manage Listings' : 'Upgrade to Pro',
      description: user?.isPro ? 'View all listings' : 'Unlock more features',
      icon: user?.isPro ? '📋' : '⭐',
      color: user?.isPro ? '#8b5cf6' : '#f59e0b',
      onPress: () => {/* Navigate accordingly */},
    },
    {
      title: 'Business Profile',
      description: 'Update your profile',
      icon: '🏢',
      color: '#6b7280',
      onPress: () => navigation.navigate('Profile' as never),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <TouchableOpacity key={index} onPress={action.onPress}>
            <Card style={styles.actionCard} variant="outlined">
              <View style={styles.actionContent}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
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
  actionCard: {
    width: '48%',
    marginBottom: 12,
  },
  actionContent: {
    alignItems: 'center',
    padding: 8,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default QuickActions;
