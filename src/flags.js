const FLAG_CONFIGURATION = {
  "dark-mode": {
    variants: {
      on: true,
      off: false,
    },
    disabled: false,
    defaultVariant: "on",
  },
  "app-language": {
    variants: {
      en: "en",
      fr: "fr",
    },
    disabled: false,
    defaultVariant: "fr",
  },
  "max-recipes": {
    variants: {
      one: 1,
      three: 3,
    },
    disabled: false,
    defaultVariant: "one",
  },
  "recipe-layout": {
    variants: {
      "two-column": {
        layout: "two-column",
        showIngredients: true,
        showInstructions: true,
      },
      "one-column": {
        layout: "one-column",
        showIngredients: true,
        showInstructions: true,
      },
    },
    disabled: false,
    defaultVariant: "one-column",
  },
};

export default FLAG_CONFIGURATION;
