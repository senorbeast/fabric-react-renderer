import * as fabric from "fabric";

/**
 * Class inspector for Fabric.js classes
 * This utility analyzes Fabric.js classes at runtime to determine their constructor signatures
 */
class FabricClassInspector {
  /**
   * Gets class constructor information based on className
   * @param className - Name of the class to inspect (e.g., 'Rect', 'Circle')
   * @returns Object containing parameter information
   */
  static inspectClass(className: string): {
    paramCount: number;
    paramNames: string[];
    optionalParams: Record<string, boolean>;
    constructorSource?: string;
  } {
    // Check if class exists in fabric
    if (!(className in fabric)) {
      throw new Error(`Class "${className}" not found in fabric library`);
    }

    // Get the class constructor
    const fabricClass = (fabric as any)[className];

    // Get constructor source code to analyze
    const constructorSource = fabricClass.toString();

    // Extract parameter information from function signature
    const paramInfo = this.extractParameterInfo(constructorSource);

    // Check for default values to determine optional parameters
    const optionalParams: Record<string, boolean> = {};

    // Determine which parameters are optional by checking for default values
    paramInfo.paramNames.forEach((paramName) => {
      // Look for patterns like "paramName = defaultValue" in constructor
      const hasDefaultValue = new RegExp(`${paramName}\\s*=\\s*[^,\\)]+`).test(
        constructorSource
      );
      optionalParams[paramName] = hasDefaultValue;
    });

    return {
      paramCount: paramInfo.paramNames.length,
      paramNames: paramInfo.paramNames,
      optionalParams,
      constructorSource,
    };
  }

  /**
   * Try to create an instance to analyze runtime errors and parameter requirements
   * @param className - Name of the class to test
   * @returns Information about parameter requirements
   */
  static testClassInstantiation(className: string): {
    requiresFirstArg: boolean;
    firstArgKeys?: string[];
  } {
    const fabricClass = (fabric as any)[className];
    let requiresFirstArg = false;
    let firstArgKeys: string[] = [];

    try {
      // Try to create with no arguments
      new fabricClass();
    } catch (error) {
      // If it throws an error, it likely requires arguments
      requiresFirstArg = true;

      // Try to create with an empty object to see what properties it tries to access
      try {
        const proxyHandler = {
          get: (target: any, prop: string) => {
            firstArgKeys.push(String(prop));
            return undefined;
          },
        };

        const proxy = new Proxy({}, proxyHandler);
        try {
          new fabricClass(proxy);
        } catch (err) {
          // We've collected the properties it tried to access
        }
      } catch (err) {
        // Failed to use proxy approach
      }
    }

    return {
      requiresFirstArg,
      firstArgKeys: firstArgKeys.length > 0 ? firstArgKeys : undefined,
    };
  }

  /**
   * Extract parameter names from constructor source
   * @param source - Constructor function source code
   * @returns Parameter count and names
   */
  private static extractParameterInfo(source: string): {
    paramCount: number;
    paramNames: string[];
  } {
    // Match the function parameters
    const paramRegex = /function.*?\(([^)]*)\)/;
    const match = source.match(paramRegex);

    if (!match || !match[1]) {
      return { paramCount: 0, paramNames: [] };
    }

    // Split the parameters by comma and remove whitespace
    const paramString = match[1].trim();
    if (!paramString) {
      return { paramCount: 0, paramNames: [] };
    }

    const paramNames = paramString
      .split(",")
      .map((param) => param.trim().split("=")[0].trim());

    return {
      paramCount: paramNames.length,
      paramNames,
    };
  }
}

/**
 * Helper function to check if a Fabric class requires a first argument
 * @param className - Name of the fabric class to check
 * @returns Whether the class requires a first argument
 */
export function requiresFirstArg(className: string): boolean {
  return FabricClassInspector.testClassInstantiation(className)
    .requiresFirstArg;
}

/**
 * Get the keys that are accessed on the first argument of a Fabric class constructor
 * @param className - Name of the fabric class to check
 * @returns Array of property names accessed on the first argument
 */
export function getFirstArgKeys(className: string): string[] {
  const result = FabricClassInspector.testClassInstantiation(className);
  return result.firstArgKeys || [];
}

/**
 * Type guard to check if a class requires a first argument
 */
export type RequiresFirstArg<T> = T extends new () => any ? false : true;

/**
 * Get the constructor's first argument type
 */
export type FirstArg<T> = T extends new (...args: infer P) => any
  ? P[0]
  : never;

/**
 * Extract key names if the first argument is required (non-object)
 */
export type FirstArgKey<T> = RequiresFirstArg<T> extends true
  ? keyof FirstArg<T>
  : never;

// Usage example function
export function analyzeClass(className: string): void {
  console.log(`Analyzing ${className}:`);

  try {
    // Get class info
    const classInfo = FabricClassInspector.inspectClass(className);
    console.log(`Parameters count: ${classInfo.paramCount}`);
    console.log(`Parameter names: ${classInfo.paramNames.join(", ")}`);

    // Check which parameters are optional
    const optionalParams = Object.entries(classInfo.optionalParams)
      .filter(([_, isOptional]) => isOptional)
      .map(([paramName]) => paramName);

    console.log(`Optional parameters: ${optionalParams.join(", ") || "None"}`);

    // Check first argument requirements
    const requiresArg = requiresFirstArg(className);
    console.log(`Requires first argument: ${requiresArg}`);

    if (requiresArg) {
      const keys = getFirstArgKeys(className);
      console.log(
        `First argument accessed keys: ${keys.join(", ") || "None detected"}`
      );
    }
  } catch (error) {
    console.error(`Error analyzing class ${className}:`, error);
  }
}
export function mainGetParams() {
  // Example usage for Polyline

  ["Rect", "Circle", "Polygon", "Text", "Polyline"].forEach(analyzeClass);
}
