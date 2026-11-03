// Complementa o app.json injetando o hash do commit que originou o build, exibido na tela "Sobre o App".
const { execSync } = require('child_process');

function git(command) {
  try {
    return execSync(`git ${command}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch (e) {
    return '';
  }
}

function resolveCommitHash() {
  // O EAS Build informa o commit que está sendo compilado.
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) return process.env.EAS_BUILD_GIT_COMMIT_HASH;

  const hash = git('rev-parse HEAD');
  if (!hash) return 'desconhecido';
  // Em build local com alterações não commitadas, o hash não representa exatamente o código executado.
  return git('status --porcelain') ? `${hash}-dirty` : hash;
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: resolveCommitHash(),
  },
});
