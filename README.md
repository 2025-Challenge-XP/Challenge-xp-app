Pra rodar o codigo local:
npx expo start --tunnel -c

A parte que resolve os problemas do supabase:

'''
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

module.exports = config;
