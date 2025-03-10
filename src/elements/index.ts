/**
 * Predefined Fabric.js components
 * Users can extend with custom components using createFabricElement
 */
import { createFabricElement } from "./createFabricElement";

export const Rect = createFabricElement("rect");
export const Circle = createFabricElement("circle");
export const Group = createFabricElement("group");
export const Text = createFabricElement("text");
export const Image = createFabricElement("image");
// Add more Fabric.js objects as needed
