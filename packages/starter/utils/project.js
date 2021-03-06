const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const latestVersion = require('latest-version');
const merge = require('merge-package-json');
const sortPackageJson = require('sort-package-json');

const readPackageJSON = (currentPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(currentPath, 'package.json'), (err, data) => {
      if (err) {
        return reject(err);
      }
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        reject(e);
      }
      resolve(parsed);
    });
  })
}

const addDependencies = async (packageJSON, { dependencies = [], devDependencies = [] }) => {
  const toMerge = {
    dependencies: {},
    devDependencies: {}
  };

  for (let i = 0, l = dependencies.length; i < l; i++) {
    const dep = dependencies[i];
    const depVersion = await latestVersion(dep.name, { version: dep.version });
    toMerge.dependencies[dep.name] = depVersion;
  }

  for (let i = 0, l = devDependencies.length; i < l; i++) {
    const devDep = devDependencies[i];
    const devDepVersion = await latestVersion(devDep.name, { version: devDep.version });
    toMerge.devDependencies[devDep.name] = devDepVersion;
  }

  return JSON.parse(merge(packageJSON, toMerge));
}

const addFields = (packageJSON, fields = {}) => {
  return JSON.parse(merge(packageJSON, fields));
}

const addScripts = (packageJSON, scripts = {}) => {
  return JSON.parse(merge(packageJSON, { scripts }));
}

const writePackageJSON = (currentPath, packageJSON) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(currentPath, 'package.json'), JSON.stringify(sortPackageJson(packageJSON), null, 2), err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

const createPackageJSON = (cwd) => {
  return new Promise((resolve, reject) => {
    childProcess.exec('npm init -y --silent', {
      cwd
    }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

const installDependencies = (yarn = false, cwd) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(yarn ? 'yarn install --silent' : 'npm install --silent', {
      cwd
    }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports = {
  addFields,
  addScripts,
  addDependencies,
  createPackageJSON,
  readPackageJSON,
  writePackageJSON,
  installDependencies
}
