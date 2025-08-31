#!/bin/bash
set -e

echo "=== Migrating Mobile & Web Components to Shared ==="

cd "$(dirname "$0")/.."

# Function to create shared component structure
create_shared_component() {
    local component_name=$1
    local component_type=$2  # ui, business, layout
    
    echo "Creating shared component: $component_name"
    
    mkdir -p "shared/components/$component_type/$component_name"
    
    # Create base component with platform detection
    cat > "shared/components/$component_type/$component_name/index.ts" << EOL
// Shared $component_name Component
import { Platform } from './platform-detection';

// Base component interface
export interface ${component_name}Props {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as ${component_name}Mobile } from './mobile';
export { default as ${component_name}Web } from './web';

// Auto-detect platform and export appropriate component
export const $component_name = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default $component_name;
EOL

    # Create platform detection utility
    cat > "shared/components/$component_type/$component_name/platform-detection.ts" << EOL
// Platform detection utility
export const Platform = {
  isMobile: typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isWeb: typeof window !== 'undefined' && !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isReactNative: typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
};
EOL

    # Create mobile implementation template
    cat > "shared/components/$component_type/$component_name/mobile.tsx" << EOL
import React from 'react';
import { View, Text } from 'react-native';
import { ${component_name}Props } from './index';

const ${component_name}Mobile: React.FC<${component_name}Props> = (props) => {
  return (
    <View>
      <Text>$component_name - Mobile Implementation</Text>
    </View>
  );
};

export default ${component_name}Mobile;
EOL

    # Create web implementation template
    cat > "shared/components/$component_type/$component_name/web.tsx" << EOL
import React from 'react';
import { ${component_name}Props } from './index';

const ${component_name}Web: React.FC<${component_name}Props> = (props) => {
  return (
    <div>
      <h1>$component_name - Web Implementation</h1>
    </div>
  );
};

export default ${component_name}Web;
EOL
}

# Create common UI components
echo "Creating shared UI components..."
create_shared_component "Button" "ui"
create_shared_component "Input" "ui"
create_shared_component "Modal" "ui"
create_shared_component "Loading" "ui"

# Create business components
echo "Creating shared business components..."
create_shared_component "UserProfile" "business"
create_shared_component "PaymentForm" "business"
create_shared_component "MSMEListing" "business"

# Create layout components
echo "Creating shared layout components..."
create_shared_component "DashboardLayout" "layouts"
create_shared_component "AuthLayout" "layouts"

echo "Component migration templates created!"
echo "Next: Implement actual component logic based on existing mobile/web components"
