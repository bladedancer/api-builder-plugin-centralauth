const { getAccessTokenJWT } = require('./access');

async function authenticateJWT({ kid, alg, iss, aud, sub, privateKey }) {
	if (!kid) {
		throw new Error('Missing required parameter: kid');
	}

	if (!sub) {
		throw new Error('Missing required parameter: sub');
	}

	if (!privateKey) {
		throw new Error('Missing required parameter: privateKey');
	}

	if (!alg) {
		alg = 'RS256';
	}

	if (!iss) {
		iss = `urn:ietf:params:oauth:client-assertion-type:jwt-bearer:${sub}`
	}

	if (!aud) {
		aud = 'https://login-preprod.axway.com/auth/realms/Broker';
	}

	return getAccessTokenJWT({ kid, alg, iss, aud, sub, privateKey });
}


module.exports = {
	authenticateJWT
};
