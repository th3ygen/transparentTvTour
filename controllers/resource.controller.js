const fs = require('fs');
const root = require('app-root-path');
const path = require('path');
const utils = require('util');

const readdir = utils.promisify(fs.readdir);

module.exports = {
    img: {
        byFac: async (req, res, next) => {
            if (req.params.fac === 'fkom') {
                const files = await readdir(path.join(root.path, `public/res/img/${req.params.fac}`));
    
                return res.status(200).send(files.map(filename => {
                    return `/res/img/${req.params.fac}/${filename}`;
                }));
            } else {
                return res.status(404);
            }
        },
    },
    
    video: {
        corporate: async (req, res, next) => {
            const files = await readdir(path.join(root.path, `public/res/vid/corporate`));

            return res.status(200).send(files.map(filename => {
                return `/res/vid/corporate/${filename}`;
            }));
        }
    }

};