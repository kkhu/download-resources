
module.exports = {
	server: {
		listen: 6789,
		www: './www/',
		index: 'index.html',

		gzip: true,

		socket: {
			listen: 8888
		},
		cros: true
	}
}
