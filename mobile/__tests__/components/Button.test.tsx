import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "@mobile/components/ui/Button";

describe("Button Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <Button onPress={() => {}} title="Test Button" />
    );
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress} title="Test Button" />
    );
    
    fireEvent.press(getByText("Test Button"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} title="Test Button" loading />
    );
    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  it("is disabled when disabled prop is true", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress} title="Test Button" disabled />
    );
    
    const button = getByText("Test Button").parent;
    expect(button?.props.accessibilityState.disabled).toBe(true);
  });
});