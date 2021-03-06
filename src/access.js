const { KJUR } = require("jsrsasign");
const axios = require("axios");
const querystring = require("querystring");

/**
 * 
 * @param {*} tokenConfig The token configuration for the request.
 * @param {*} tokenConfig.aud Audience
 * @param {*} tokenConfig.kid Key Id
 * @param {*} tokenConfig.alg Algorithm
 * @param {*} tokenConfig.iss Issuer
 * @param {*} tokenConfig.sub Subject
 * @param {*} tokenConfig.privateKey Private key.
 */
async function getAccessTokenJWT(tokenConfig) {
  try {
    const jwt = getSignedJWT(tokenConfig);
    const tokenResp = await tokenRequest(tokenConfig.aud, jwt);
    return tokenResp.access_token;
  } catch (e) {
    throw e;
  }
}

async function getAccessTokenSecret(tokenConfig) {
    try {
        // TODO
    //   const jwt = getSignedJWT(tokenConfig);
    //   const tokenResp = await tokenRequest(tokenConfig.aud, jwt);
    //   return tokenResp.access_token;
    } catch (e) {
      throw e;
    }
  }

async function tokenRequest(aud, jwt) {
  const url = aud + "/protocol/openid-connect/token";
  const data = {
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: jwt
  };

  try {
    const response = await axios({
      method: "post",
      url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      data: querystring.stringify(data)
    });

    return response.data;
  } catch (e) {
    throw e;
  }
}

function getSignedJWT({ kid, alg, iss, aud, sub, privateKey }) {
  const currentTime = +new Date(); // the current time in milliseconds
  const issuedAtTimeSeconds = currentTime / 1000;
  const expirationTimeSeconds = currentTime / 1000 + 3600;

  // Generate random string for "jti" claim - needed if client has Replay Prevention enabled
  let jti = "";
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 12; i++) {
    jti += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Create Header and Payload objects
  const header = {
    kid,
    alg
  };

  var payload = {
    iss,
    aud,
    sub,
    jti,
    exp: Math.ceil(expirationTimeSeconds),
    iat: Math.ceil(issuedAtTimeSeconds)
  };

  // Prep the objects for a JWT
  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(payload);
  const sJWT = KJUR.jws.JWS.sign(header.alg, sHeader, sPayload, privateKey);
  return sJWT;
}

module.exports = {
    getAccessTokenJWT,
    getAccessTokenSecret
};
