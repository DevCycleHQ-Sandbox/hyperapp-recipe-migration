import { app } from "hyperapp";
import recipes from "./recipes.js";
import FLAG_CONFIGURATION from "./flags.js";
import { InMemoryProvider, OpenFeature } from "@openfeature/web-sdk";
import DevCycleProvider from "@devcycle/openfeature-web-provider";
import { WebMultiProvider } from "@openfeature/multi-provider-web";
import { DevCycleMigrationStrategy } from "@devcycle/openfeature-web-provider/strategy";

const devcycleProvider = new DevCycleProvider("dvc_client_key");

const user = { user_id: "my_user" };

OpenFeature.setContext(user);

const inMemoryProvider = new InMemoryProvider(FLAG_CONFIGURATION);

// Multi-provider Setup
const multiProvider = new WebMultiProvider(
  [{ provider: devcycleProvider }, { provider: inMemoryProvider }],
  new DevCycleMigrationStrategy()
);

await OpenFeature.setProviderAndWait(multiProvider);

// create a new client
const client = OpenFeature.getClient();

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

// Apply dark mode based on the feature flag
if (featureFlags.dark_mode) {
  document.documentElement.className = "dark";
}

const RecipeItem = ({ recipe, flags }) => (
  <div class="p-4 mb-4 bg-gray-100 rounded shadow-md dark:bg-gray-700">
    <h2 class="text-xl font-semibold">{recipe.name[flags.app_language]}</h2>
    {flags.recipe_layout.showIngredients && (
      <p class="mt-2">
        <strong>Ingredients:</strong> {recipe.ingredients[flags.app_language]}
      </p>
    )}
    {flags.recipe_layout.showInstructions && (
      <p class="mt-2">
        <strong>Instructions:</strong> {recipe.instructions[flags.app_language]}
      </p>
    )}
  </div>
);

const RecipeList = ({ flags }) => {
  const filteredRecipes = recipes.slice(0, flags.max_recipes);
  return (
    <div
      class={`grid ${
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

const mainView = (state) => (
  <div class="min-h-screen p-4 dark:bg-gray-800 dark:text-white">
    <h1 class="text-3xl font-bold mb-4">Hyperapp Recipe Manager</h1>
    <RecipeList flags={state.flags} />
  </div>
);

app({
  init: { flags: featureFlags },
  view: mainView,
  node: document.getElementById("app"),
});
