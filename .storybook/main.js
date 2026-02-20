const React = require('react')

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-knobs'
  ],
  staticDirs: [{ from: './public', to: '/' }],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: false  // Ensure we use Babel, not SWC
      }
    }
  },
  docs: {
    autodocs: false
  },
  babel: async (options) => {
    // Override Storybook's default React preset to use classic runtime
    // This is needed to support /** @jsx jsx */ pragma for Emotion
    return {
      ...options,
      presets: options.presets.map((preset) => {
        // Replace Storybook's React preset with classic runtime
        if (Array.isArray(preset) && preset[0]?.toString().includes('@babel/preset-react')) {
          return ['@babel/preset-react', { runtime: 'classic' }]
        }
        return preset
      })
    }
  },
  webpackFinal: async (config) => {
    const baseConfig = require('@instructure/ui-webpack-config')

    console.log(`Building Storybook with React version ${React.version}...`)

    // Merge base config's module rules with Storybook's, but skip thread-loader for Storybook
    const baseRules = baseConfig.module.rules.map(rule => {
      // Remove thread-loader from the babel-loader chain for Storybook compatibility
      if (rule.use && Array.isArray(rule.use)) {
        return {
          ...rule,
          use: rule.use.filter(loader => {
            if (typeof loader === 'string') return true
            return !loader.loader || !loader.loader.includes('thread-loader')
          })
        }
      }
      return rule
    })

    // Keep Storybook's rules and append base config rules for non-JS files only
    // Filter out JS/JSX rules from base config to avoid conflicts with Storybook's babel setup
    const nonJsBaseRules = baseRules.filter(rule => {
      const testRegex = rule.test?.toString() || ''
      return !testRegex.includes('js') && !testRegex.includes('jsx')
    })

    config.module.rules = [...config.module.rules, ...nonJsBaseRules]

    // Merge resolve configuration
    config.resolve = {
      ...config.resolve,
      ...baseConfig.resolve,
      // Keep Storybook's extensions but add any from base config
      extensions: [...new Set([...(config.resolve.extensions || []), ...(baseConfig.resolve.extensions || [])])],
      // Merge aliases
      alias: {
        ...(config.resolve.alias || {}),
        ...(baseConfig.resolve.alias || {}),
        '@': require('path').resolve(__dirname, '../src'),
      }
    }

    // Add custom resolver to strip .js extensions for TypeScript files
    // This is the webpack equivalent of Jest's moduleNameMapper
    if (!config.resolve.plugins) config.resolve.plugins = []
    config.resolve.plugins.push({
      apply(resolver) {
        const target = resolver.ensureHook('resolve')
        resolver.getHook('described-resolve').tapAsync(
          'StripJsExtensionPlugin',
          (request, resolveContext, callback) => {
            if (request.request && request.request.endsWith('.js')) {
              const requestWithoutExt = request.request.slice(0, -3)
              return resolver.doResolve(
                target,
                { ...request, request: requestWithoutExt },
                null,
                resolveContext,
                callback
              )
            }
            callback()
          }
        )
      }
    })

    // Merge plugins (keeping Storybook's and adding base config's)
    if (baseConfig.plugins) {
      config.plugins = [...config.plugins, ...baseConfig.plugins]
    }

    if (process.env.NODE_ENV === 'production') {
      config.devtool = false
    }

    return config
  }
}
