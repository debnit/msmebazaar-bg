import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Card } from "@mobile/components/ui/Card";
import { Button } from "@mobile/components/ui/Button";
import { useQuery } from "react-query";
import { apiClient } from "@mobile/api/apiClient";
import { COLORS, SPACING, TYPOGRAPHY } from "@mobile/utils/constants";

const screenWidth = Dimensions.get("window").width;

interface AnalyticsData {
  revenue: { labels: string[]; datasets: Array<{ data: number[] }> };
  orders: { labels: string[]; datasets: Array<{ data: number[] }> };
  customers: { labels: string[]; data: Array<{ name: string; population: number; color: string; legendFontColor: string }> };
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    customerGrowth: number;
  };
}

export default function BusinessAnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  
  const { data: analytics, isLoading } = useQuery<AnalyticsData>(
    ["analytics", timeRange],
    () => apiClient.get(`/analytics/dashboard?range=${timeRange}`),
    { refetchInterval: 300000 } // Refresh every 5 minutes
  );

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#2563eb",
    },
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Business Analytics</Text>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {(["7d", "30d", "90d", "1y"] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricValue}>
              ₹{analytics?.metrics.totalRevenue.toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </Card>
          
          <Card style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {analytics?.metrics.totalOrders}
            </Text>
            <Text style={styles.metricLabel}>Total Orders</Text>
          </Card>
          
          <Card style={styles.metricCard}>
            <Text style={styles.metricValue}>
              ₹{analytics?.metrics.avgOrderValue.toFixed(0)}
            </Text>
            <Text style={styles.metricLabel}>Avg Order Value</Text>
          </Card>
          
          <Card style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: COLORS.success }]}>
              +{analytics?.metrics.customerGrowth}%
            </Text>
            <Text style={styles.metricLabel}>Customer Growth</Text>
          </Card>
        </View>

        {/* Revenue Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Revenue Trend</Text>
          {analytics?.revenue && (
            <LineChart
              data={analytics.revenue}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </Card>

        {/* Orders Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Orders Overview</Text>
          {analytics?.orders && (
            <BarChart
              data={analytics.orders}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          )}
        </Card>

        {/* Customer Distribution */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Customer Distribution</Text>
          {analytics?.customers && (
            <PieChart
              data={analytics.customers.data}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 50]}
            />
          )}
        </Card>

        {/* Export Options */}
        <Card style={styles.exportCard}>
          <Text style={styles.chartTitle}>Export Data</Text>
          <View style={styles.exportButtons}>
            <Button
              title="Export to Excel"
              variant="outline"
              onPress={() => {/* Export to Excel */}}
              style={styles.exportButton}
            />
            <Button
              title="Share Report"
              variant="outline"  
              onPress={() => {/* Share report */}}
              style={styles.exportButton}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  timeRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.xs,
  },
  timeRangeButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeRangeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  timeRangeTextActive: {
    color: "#fff",
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  metricCard: {
    width: "48%",
    alignItems: "center",
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  metricValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  metricLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  chartCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
  },
  chartTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  chart: {
    marginVertical: SPACING.sm,
    borderRadius: 16,
  },
  exportCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
  },
  exportButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  exportButton: {
    flex: 0.45,
  },
});