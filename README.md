# Hyperapp OpenFeature Recipe Manager

A simple recipe manager application built with Hyperapp. This application demonstrates the use of OpenFeature-compliant feature flags to control various aspects of the application, and an implementation of the Multi-provider utility to switch between feature flag managment vendors.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/devcyclehq-sandbox/hyperapp-recipe-migration.git
   cd hyperapp-recipe-migration
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the application:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000` to view the application.

## Code Overview

### Feature Flags

OpenFeature-compliant Feature flags are initialized and used to control various aspects of the application:

```javascript
// Initialize feature flags
const featureFlags = {
  dark_mode: client.getBooleanValue("dark-mode", false),
  app_language: client.getStringValue("app-language", "en"),
  max_recipes: client.getNumberValue("max-recipes", 3),
  recipe_layout: client.getObjectValue("recipe-layout", {
    layout: "one-column",
    showIngredients: false,
    showInstructions: false,
  }),
};
```

### Components

#### RecipeItem

Displays an individual recipe:

```javascript
const RecipeItem = ({ recipe, flags }) => (
  <div className="p-4 mb-4 bg-gray-100 rounded shadow-md dark:bg-gray-700">
    <h2 className="text-xl font-semibold">{recipe.name[flags.app_language]}</h2>
    {flags.recipe_layout.showIngredients && (
      <p className="mt-2">
        <strong>Ingredients:</strong> {recipe.ingredients[flags.app_language]}
      </p>
    )}
    {flags.recipe_layout.showInstructions && (
      <p className="mt-2">
        <strong>Instructions:</strong> {recipe.instructions[flags.app_language]}
      </p>
    )}
  </div>
);
```

#### RecipeList

Displays the list of recipes:

```javascript
const RecipeList = ({ flags }) => {
  const filteredRecipes = recipes.slice(0, flags.max_recipes);
  return (
    <div
      className={`grid ${
        flags.recipe_layout.layout === "two-column"
          ? "grid-cols-2 gap-4"
          : "grid-cols-1"
      }`}
    >
      {filteredRecipes.map((recipe) => (
        <RecipeItem recipe={recipe} flags={flags} />
      ))}
    </div>
  );
};
```

#### MainView

The main view of the application:

```javascript
const mainView = (state) => (
  <div className="min-h-screen p-4 dark:bg-gray-800 dark:text-white">
    <h1 className="text-3xl font-bold mb-4">Hyperapp Recipe Manager</h1>
    <RecipeList flags={state.flags} />
  </div>
);
```

### Initialize and Run the Application

```javascript
app({
  init: { flags: featureFlags },
  view: mainView,
  node: document.getElementById("app"),
});
```
