const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const portFinderSync = require('portfinder-sync')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer:
        {
            host: 'local-ip',
            port: portFinderSync.getPort(1234),
            open: true,
            https: false,
            client: {
                overlay: true,
                progress: true
            }
        }
    }
)
