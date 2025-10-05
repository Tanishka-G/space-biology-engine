
# Space Biology Keyword Analysis Dashboard

## Overview

This is a Next.js application that visualizes the frequency of keywords in a dataset of space biology research papers. The application reads data from a CSV file, processes it, and displays the top keywords in a bar chart and an interactive 3D point cloud. It is styled with Tailwind CSS and uses a modern, visually appealing design.

## Design and Features

### Color Palette

*   **Background**: `#0A0A0A` (Almost Black)
*   **Text**: `#E0E0E0` (Light Gray)
*   **Primary**: `#2EC4B6` (Turquoise)
*   **Secondary**: `#3A86FF` (Blue)
*   **Accent**: `#9EE493` (Light Green)

### Typography

*   **Heading Font**: Outfit
*   **Body Font**: Inter

### UI Components

*   **Chart**: A responsive bar chart from the `recharts` library to display keyword frequency.
*   **3D Keyword Map**: An interactive 3D point cloud of keywords, with similar keywords clustered together based on their semantic meaning.
*   **Gradient Accent**: A subtle animated gradient is used for accents and backgrounds.
*   **Glassmorphism**: The chart container has a frosted glass effect, with a blurred background and a subtle border.

### Interactivity

*   **Hover Effect**: When hovering over a bar in the chart, it will have a "glow" effect.
*   **Tooltip**: The tooltip for the chart has been redesigned for better visibility and a more professional look.
*   **3D Map Interaction**: Users can scroll, pan, and zoom the 3D keyword map to explore the keyword clusters. Hovering over a point reveals a label with the keyword.
*   **Hover Label Display**: When a user hovers over a sphere in the 3D keyword map, the corresponding keyword and its count are now displayed in the top-right corner of the canvas for improved visibility.

### 3D Keyword Map Design

*   **Background**: `Black — #000000`
*   **Point Colors**: A vibrant, planetary-inspired palette including `'#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039', '#900C3F', '#581845'`.
*   **Sphere Appearance**: The spheres have a metallic finish to resemble planets.
*   **Layout Algorithm**: A force-directed layout using `d3-force` and the Jaro-Winkler distance algorithm from the `natural` library. This creates a more meaningful layout where keywords with higher similarity are positioned closer together, while maintaining a clear and organized structure.
*   **Connection Lines**: Thin, semi-transparent lines are drawn between keywords with a high similarity score, visually representing their relationships.

## Current Plan

*   Refine the keyword spacing in the 3D map by using a force-directed layout that considers keyword similarity.
