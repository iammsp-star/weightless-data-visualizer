# Weightless Data Visualizer

A cinematic 3D data visualization experiment using React Three Fiber. Concepts include floating physics, emissive materials, and magnetic cursor interactions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

-   **Atmospheric Scene**: Deep charcoal environment with a subtle grid floor and neon accent lighting.
-   **Data Representation**: 50 floating spheres where height corresponds to data value.
-   **Fluid Animation**: Spheres bob gently on a sine wave.
-   **Magnet Interaction**: Move your mouse near a sphere to see it "attract" towards your cursor and scale up.
-   **Holographic UI**: Minimalist overlay with data counters.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/manas/weightless-data-visualizer.git
    cd weightless-data-visualizer
    ```

2.  Install dependencies:
    > **Note**: This project uses React 19. Until React Three Fiber fully updates its peer dependencies, use `--legacy-peer-deps`.
    ```bash
    npm install --legacy-peer-deps
    ```

### Running Locally

Start the development server:
```bash
npm run dev
```
Open your browser to ![alt text](image.png) (or the URL shown in your terminal).

## 🎮 How to Interact

-   **Orbit**: Left-click and drag to rotate the camera around the data cluster.
-   **Zoom**: Scroll wheel to zoom in/out.
-   **Magnet Effect**: Simply move your mouse cursor near any floating sphere. It will magnetically pull towards your cursor and glow brighter.

## 🛠️ Tech Stack

-   [Vite](https://vitejs.dev/)
-   [React](https://react.dev/)
-   [Three.js](https://threejs.org/)
-   [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
-   [Drei](https://github.com/pmndrs/drei) (Helpers)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
