function licenseChecker() {
    const checker = require('license-checker');

    const customFormat = {
        "name": "/",
        "version": "",
        "description": "",
        "licenses": "",
        "copyright": "",
        "licenseText": ""
    };

    const options = {
        start: '.',
        json: true,
        customFormat,
        production: true,
        excludePrivatePackages: true,
    }

    return new Promise((resolve, reject) => {
        checker.init(options, (error, result) => {
            if(error) { reject(error); }
            else { resolve(result); }
        });
    });
}

function write(fileName, data) {
    const fs = require('fs');

    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, (error) => {
            if(error) { reject(error); }
            else { resolve(); }
        });
    });
}

function separator(num) {
    let text = '';

    for(let i = 0; i < num; ++i) {
        text += '-';
    }

    return text;
}

(async function main() {
    const result = await licenseChecker();

    const moduleInfos = Object.values(result).map((moduleInfo) => {
        return {
            name: moduleInfo.name,
            version: moduleInfo.version,
            licenses: moduleInfo.licenses,
            publisher: moduleInfo.publisher,
            copyright: moduleInfo.copyright,
            repository: moduleInfo.repository,
            licenseText: moduleInfo.licenseText,
        };
    });

    let text = 'THIRD PARTY SOFTWARE LICENSES\n\n';

    for(const { name, version, licenseText } of moduleInfos) {
        text += `${separator(100)}\n`;
        text += `${name}@${version}\n\n`;
        text += `${licenseText}\n\n`;
    }

    await write('THIRD-PARTY-SOFTWARE-LICENSES', text);

    return 0;
})();
