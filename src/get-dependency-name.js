module.exports = function getDependencyName (dep, scope) {
  if (typeof dep === 'string') return dep
  if (scope === 'global') return dep.global || dep.name
  if (scope === 'amd') return dep.amd || dep.name
  return dep.name
}
