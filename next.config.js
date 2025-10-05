/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.externals = [...config.externals, { 'onnxruntime-node': 'commonjs onnxruntime-node' }, 'redis', 'net', 'tls', 'fs', 'dns', 'pg']
        return config
    }
}

module.exports = nextConfig
