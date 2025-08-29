import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import Card from '../../components/shared/Card';
import Input from '../../components/shared/Input';
import { useCreatePayment, useVerifyPayment } from '../../services/payment.mobile';
import { UserRole } from '@shared/types/feature';

interface OnboardingData {
  businessType: string;
  businessName: string;
  businessDescription: string;
  panNumber: string;
  gstNumber: string;
  primaryGoal: string;
  secondaryGoals: string[];
}

type Step = 1 | 2 | 3 | 'payment' | 'success';

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    businessType: '',
    businessName: '',
    businessDescription: '',
    panNumber: '',
    gstNumber: '',
    primaryGoal: '',
    secondaryGoals: [],
  });

  const createPaymentMutation = useCreatePayment();
  const verifyPaymentMutation = useVerifyPayment();

  const businessTypes = [
    'Manufacturing',
    'Trading',
    'Service Provider',
    'Retail',
    'Technology',
    'Healthcare',
    'Education',
    'Food & Beverage',
    'Textile',
    'Other',
  ];

  const goals = [
    {
      id: 'loan',
      title: 'Business Loan',
      description: 'Get funding for expansion, inventory, or working capital',
      color: '#10b981',
    },
    {
      id: 'exit',
      title: 'Exit Strategy',
      description: 'Plan your business exit and maximize returns',
      color: '#8b5cf6',
    },
    {
      id: 'market',
      title: 'Market Linkage',
      description: 'Connect with suppliers, distributors, and customers',
      color: '#3b82f6',
    },
  ];

  const getProgress = () => {
    switch (currentStep) {
      case 1: return 25;
      case 2: return 50;
      case 3: return 75;
      case 'payment': return 90;
      case 'success': return 100;
      default: return 0;
    }
  };

  const handleNext = async () => {
    if (currentStep === 3) {
      // Initiate payment for onboarding
      await handlePayment();
    } else if (currentStep === 'payment') {
      setCurrentStep('success');
    } else {
      setCurrentStep((prev) => (prev as number + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep(3);
    } else if (currentStep !== 1) {
      setCurrentStep((prev) => (prev as number - 1) as Step);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const paymentRequest = {
        amount: 999, // ₹999 for onboarding
        currency: 'INR',
        purpose: 'onboarding' as const,
        description: 'MSMEBazaar Onboarding Fee',
        metadata: {
          businessName: data.businessName,
          businessType: data.businessType,
          primaryGoal: data.primaryGoal,
        },
      };

      const response = await createPaymentMutation.mutateAsync(paymentRequest);
      
      if (response.success && response.data) {
        // In a real app, you would integrate with Razorpay SDK here
        // For now, we'll simulate a successful payment
        setTimeout(() => {
          handlePaymentSuccess(response.data!.razorpayOrderId!);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string) => {
    try {
      // Simulate payment verification
      const verifyRequest = {
        paymentId: orderId,
        razorpayPaymentId: 'pay_mock_success',
        razorpayOrderId: orderId,
        razorpaySignature: 'mock_signature',
      };

      await verifyPaymentMutation.mutateAsync(verifyRequest);
      setCurrentStep('success');
    } catch (error) {
      console.error('Payment verification failed:', error);
    }
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep1 = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>Business Information</Text>
      <Text style={styles.stepDescription}>
        Tell us about your business to get personalized recommendations
      </Text>

      <Input
        label="Business Name"
        value={data.businessName}
        onChangeText={(text) => updateData('businessName', text)}
        placeholder="Enter your business name"
      />

      <View style={styles.businessTypeContainer}>
        <Text style={styles.label}>Business Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {businessTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.businessTypeChip,
                data.businessType === type && styles.businessTypeChipSelected,
              ]}
              onPress={() => updateData('businessType', type)}
            >
              <Text
                style={[
                  styles.businessTypeText,
                  data.businessType === type && styles.businessTypeTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Input
        label="Business Description"
        value={data.businessDescription}
        onChangeText={(text) => updateData('businessDescription', text)}
        placeholder="Briefly describe your business"
        multiline
        numberOfLines={3}
      />
    </Card>
  );

  const renderStep2 = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>Business Documents</Text>
      <Text style={styles.stepDescription}>
        Add your business registration details
      </Text>

      <Input
        label="PAN Number"
        value={data.panNumber}
        onChangeText={(text) => updateData('panNumber', text.toUpperCase())}
        placeholder="ABCDE1234F"
        maxLength={10}
      />

      <Input
        label="GST Number (Optional)"
        value={data.gstNumber}
        onChangeText={(text) => updateData('gstNumber', text.toUpperCase())}
        placeholder="27ABCDE1234F1Z5"
        maxLength={15}
      />
    </Card>
  );

  const renderStep3 = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>Your Goals</Text>
      <Text style={styles.stepDescription}>
        What would you like to achieve with MSMEBazaar?
      </Text>

      {goals.map((goal) => (
        <TouchableOpacity
          key={goal.id}
          style={[
            styles.goalCard,
            data.primaryGoal === goal.id && styles.goalCardSelected,
          ]}
          onPress={() => updateData('primaryGoal', goal.id)}
        >
          <View style={[styles.goalIcon, { backgroundColor: goal.color }]} />
          <View style={styles.goalContent}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  );

  const renderPaymentStep = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>Complete Your Onboarding</Text>
      <Text style={styles.stepDescription}>
        Pay the onboarding fee to unlock all features
      </Text>

      <View style={styles.paymentSummary}>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Onboarding Fee</Text>
          <Text style={styles.paymentAmount}>₹999</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>GST (18%)</Text>
          <Text style={styles.paymentAmount}>₹180</Text>
        </View>
        <View style={[styles.paymentRow, styles.paymentTotal]}>
          <Text style={styles.paymentTotalLabel}>Total</Text>
          <Text style={styles.paymentTotalAmount}>₹1,179</Text>
        </View>
      </View>

      <Text style={styles.paymentNote}>
        This one-time fee gives you access to all MSMEBazaar features including
        business loans, market linkage, and premium support.
      </Text>
    </Card>
  );

  const renderSuccessStep = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.successTitle}>🎉 Welcome to MSMEBazaar!</Text>
      <Text style={styles.successDescription}>
        Your onboarding is complete. You now have access to all features.
      </Text>

      <Button
        title="Start Exploring"
        onPress={() => navigation.navigate('Dashboard' as never)}
        style={styles.successButton}
      />
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 'payment': return renderPaymentStep();
      case 'success': return renderSuccessStep();
      default: return renderStep1();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.businessName && data.businessType && data.businessDescription;
      case 2:
        return data.panNumber.length === 10;
      case 3:
        return data.primaryGoal;
      default:
        return true;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${getProgress()}%` }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {currentStep !== 'success' && (
        <View style={styles.navigation}>
          {currentStep !== 1 && (
            <Button
              title="Back"
              variant="outline"
              onPress={handleBack}
              style={styles.backButton}
            />
          )}
          
          <Button
            title={
              currentStep === 'payment' 
                ? isLoading 
                  ? 'Processing...' 
                  : 'Pay Now'
                : 'Continue'
            }
            onPress={handleNext}
            disabled={!canProceed() || isLoading}
            loading={isLoading}
            style={styles.continueButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepCard: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  businessTypeContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  businessTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  businessTypeChipSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  businessTypeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  businessTypeTextSelected: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  goalCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalCardSelected: {
    backgroundColor: '#f0f9ff',
    borderColor: '#3b82f6',
  },
  goalIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
    marginTop: 4,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  paymentSummary: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  paymentAmount: {
    fontSize: 14,
    color: '#111827',
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  paymentTotalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  paymentNote: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    textAlign: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  successDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successButton: {
    marginTop: 16,
  },
  navigation: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  backButton: {
    flex: 1,
    marginRight: 12,
  },
  continueButton: {
    flex: 2,
  },
});
