
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
*   **3D Keyword Map**: An interactive 3D point cloud of keywords, with similar keywords clustered together.
*   **Gradient Accent**: A subtle animated gradient is used for accents and backgrounds.
*   **Glassmorphism**: The chart container has a frosted glass effect, with a blurred background and a subtle border.

### Interactivity

*   **Hover Effect**: When hovering over a bar in the chart, it will have a "glow" effect.
*   **Tooltip**: The tooltip for the chart has been redesigned for better visibility and a more professional look.
*   **3D Map Interaction**: Users can scroll, pan, and zoom the 3D keyword map to explore the keyword clusters. Hovering over a point reveals a label with the keyword.

### 3D Keyword Map Design

*   **Background**: `Warm Gray — #F5F5F5`
*   **Point Colors**: `Mist Blue — #AEC6CF`, `Powder Pink — #F6C1C1`, `Pale Lilac — #D8BFD8`, `Mint Cream — #E8F8F5`

## Current Plan

*   Create a 3D keyword map.
*   Use a force-directed graph to cluster similar keywords.
*   Use `@react-three/fiber` and `@react-three/drei` for 3D rendering.
*   Create a new `KeywordCloud.tsx` component.
*   Integrate the component into the main page.
