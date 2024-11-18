function ensureEnvVar(envVarName) {
  if (!(envVarName in process.env)) {
    throw new Error(`Missing environment variable ${envVarName}`);
  }

  return process.env[envVarName];
}

const envVars = {
  Edition: ensureEnvVar('NOTION_REPACKAGED_EDITION'),
  Version: ensureEnvVar('NOTION_VERSION'),
  Revision: ensureEnvVar('NOTION_REPACKAGED_REVISION'),
}

const isVanilla = envVars.Edition === 'vanilla';

const productMetadata = isVanilla ? {
  name: 'Notion',
  description: 'The all-in-one workspace for your notes and tasks',
  id: 'notion-app',
  conflictId: 'notion-app-enhanced',
} : {
  name: 'Notion Enhanced',
  description: 'The all-in-one workspace for your notes and tasks, but enhanced',
  id: 'notion-app-enhanced',
  conflictId: 'notion-app',
}

const fpmOptions = [
  `--version=${envVars.Version}`,
  `--iteration=${envVars.Revision}`,
  `--conflicts=${productMetadata.conflictId}`,
];

const combineTargetAndArch = (targets, architectures = ['x64', 'arm64']) =>
  targets.map((target) => ({ target, arch: architectures }));

// realistically Auto Update only works for Windows
const getPublishProviders = (platform) => [
  {
    provider: 'github',
    publishAutoUpdate: platform === 'win',
  },
];

module.exports = {
  asar: true,
  productName: productMetadata.name,
  extraMetadata: {
    description: productMetadata.description,
  },
  appId: 'com.github.notion-repackaged',
  protocols: [{ name: 'Notion', schemes: ['notion'] }],
  npmRebuild: false,
  win: {
    icon: 'icon.ico',
    target: combineTargetAndArch(['nsis', 'zip'], ['x64']),
    publish: getPublishProviders('win'),
  },
  mac: {
    icon: 'icon.icns',
    category: 'public.app-category.productivity',
    target: combineTargetAndArch(['dmg', 'zip']),
    publish: getPublishProviders('mac'),
  },
  linux: {
    icon: 'icon.icns',
    category: 'Office;Utility;',
    maintainer: 'jaime@jamezrin.name',
    mimeTypes: ['x-scheme-handler/notion'],
    desktop: {
      StartupNotify: 'true',
      StartupWMClass: productMetadata.id,
    },
    target: combineTargetAndArch(['AppImage', 'deb', 'pacman', 'zip']), // FIXME: RPM build is broken, add ", 'rpm'" when fixed
    publish: getPublishProviders('linux'),
  },
  nsis: {
    installerIcon: 'icon.ico',
    oneClick: false,
    perMachine: false,
  },
  deb: {
    fpm: fpmOptions,
    depends: [
      'libgtk-3-0',
      'libnotify4',
      'libnss3',
      'libxss1',
      'libxtst6',
      'xdg-utils',
      'libatspi2.0-0',
      'libuuid1',
      'libsecret-1-0',
      /* 'libappindicator3-1', */
    ],
  },
  pacman: { fpm: fpmOptions },
  rpm: { fpm: fpmOptions },
};
