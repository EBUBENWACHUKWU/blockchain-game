module.exports = {
    presets: [
      '@babel/preset-env', // Ensures compatibility with modern JavaScript features
      '@babel/preset-react', // Ensures compatibility with React JSX
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties', // Handles class properties (e.g., `this.myProperty = ...`)
      '@babel/plugin-proposal-private-methods',  // Handles private methods and fields (e.g., `#request`)
    ]
  };
  