# Flappy Bird ECS Game

This project implements a basic Flappy Bird game using an Entity-Component-System (ECS) architectural pattern, built with React, TypeScript, and Vite. The goal was to demonstrate how ECS principles can be applied to game development in a frontend environment, emphasizing separation of concerns, modularity, and extensibility.

## Features

The game currently includes the following core functionalities:

-   **ECS Architecture:** A clean implementation of Entity-Component-System from scratch, featuring:
    -   `Entity`: A unique identifier for any game object.
    -   `Component`: Raw data attached to entities (e.g., Position, Velocity, Size, Sprite).
    -   `System`: Logic that operates on entities based on their components (e.g., MovementSystem, RenderSystem).
    -   `World`: Manages entities, components, and systems, orchestrating the game loop.
-   **Bird Mechanics:**
    -   Gravity-driven falling.
    -   Jump (flap) on Spacebar press or left mouse click.
    -   Collision detection with ground and ceiling boundaries.
-   **Pipe Generation:**
    -   Pipes spawn off-screen to the right at regular intervals.
    -   Pipes move from right to left, creating obstacles.
    -   Pipes are removed when they go off-screen to the left.
-   **Collision Detection:**
    -   Bird-pipe collision detection.
    -   Bird-ground/ceiling collision detection.
-   **Game State Management:**
    -   "Ready," "Running," and "Game Over" states are managed by a central `GameComponent`.
    -   UI (buttons, messages) dynamically updates based on the game state.
-   **Restart Functionality:** A restart button appears on "Game Over" to reset the game.
-   **Scoring System:**
    -   Score increments when the bird successfully passes a pipe.
    -   Score is displayed on the UI.

## Architectural Highlights

-   **Single Responsibility Principle (SRP):** Each system is designed to perform a single, focused task (e.g., `GravitySystem` for gravity, `CollisionSystem` for collisions).
-   **Decoupling:** Systems operate on data (components) without knowing about other systems or specific entity types, promoting flexibility.
-   **Centralized Canvas Access:** Only the `RenderSystem` directly interacts with the HTML canvas element. Other systems requiring canvas dimensions (e.g., `PipeSpawnerSystem`, `CollisionSystem`) retrieve this information from a `ViewportComponent` managed by the ECS world, further decoupling game logic from rendering specifics.
-   **Two-Phase System Initialization:** Systems now follow a two-phase initialization process (`initialize` then `postInitialize`). This allows systems to first set up their basic requirements and populate shared data (e.g., `RenderSystem` setting viewport dimensions), and then, in the `postInitialize` phase, consume that data, ensuring flexible and correct setup order for interdependent systems.
-   **Component-Based Design:** Game objects are composed of data, allowing for highly flexible and dynamic entity definitions.
-   **React Integration:** The React `App` component acts as the presentation layer, connecting to the ECS `World` to display game state and capture user input for game control (Start/Stop/Restart).

## How to Run the Project

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd flappy-bird
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install
    # or yarn install
    ```
3.  **Start the development server:**
    ```bash
    pnpm dev
    # or npm run dev
    # or yarn dev
    ```
    The game will open in your browser, typically at `http://localhost:5173/`.

## Development Process & Key Decisions

During the development, several architectural discussions and refactorings took place to adhere to ECS principles and improve code quality:

-   **Gravity Logic:** Initially part of `MovementSystem`, gravity was later extracted into a dedicated `GravitySystem` for better SRP.
-   **Entity Sizing:** Hardcoded entity sizes in systems were replaced with a `SizeComponent` to decouple rendering/physics from specific entity dimensions.
-   **System Lifecycle Enhancement:** The existing system lifecycle (`initialize`, `update`, `destroy` methods) was further enhanced by introducing a two-phase initialization (`initialize` and `postInitialize`). This resolves dependencies where some systems need data provided by others during their setup, ensuring a flexible and correct setup order.
-   **Centralized Canvas Access & ViewportComponent:** To further decouple game logic from DOM specifics, direct canvas element access was centralized within the `RenderSystem`. Other systems now retrieve viewport dimensions from a `ViewportComponent` attached to the game entity. This refactoring was also intertwined with the two-phase initialization to ensure the `ViewportComponent` is populated before other systems attempt to read its values.
-   **Performance Monitoring Renaming:** The `Metrics` class, used for profiling system update durations, was renamed to `Profiler` to align with common industry terminology for such tools.
-   **Object Pooling (Attempt & Revert):** An attempt was made to implement object pooling for pipes to optimize performance by reducing garbage collection. However, initial results showed a potential increase in lag, leading to a reversion to simpler entity creation/destruction for the current scope, prioritizing functionality and stability.
-   **Game Over Decoupling:** The "Game Over" logic was refactored. `CollisionSystem` now only marks an entity with `GameOverComponent` on collision, while a new `GameControllerSystem` is responsible for reacting to this marker, setting the global game state, and stopping the game loop, thus maintaining SRP.