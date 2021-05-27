/* 

export const initAzureAD = async () => {
    //Get Azure Active Directory token.
    let token = await getAadToken();

    // Create a repeating timeout that will renew the AAD token
    // This timeout must be cleared once the TokenCredential object is no longer needed
    // If the timeout is not cleared the memory used by the TokenCredential will never be reclaimed.
    const renewToken = async () => {
        try {
            console.log("Renewing token");
            token = await getAadToken();
            tokenRenewalTimer = setTimeout(renewToken, getExpiration(token));
        } catch (error) {
            console.log("Caught error when renewing token");
            clearTimeout(tokenRenewalTimer);
            throw error;
        }
    }
    tokenRenewalTimer = setTimeout(renewToken, getExpiration(token));
    return token;
}
const getAadToken = async() => {
    //Fetch an AAD token from an endpoint using a client credential secret to authenticate.
    const response = await fetch(TOKENSERVICE);
    return response.text();
}
const getExpiration = (jwtToken) => {
    // Decode the JWT token to get the expiration timestamp
    const json = atob(jwtToken.split(".")[1]);
    const decode = JSON.parse(json);

    // Return the milliseconds until the token needs renewed
    // Reduce the time until renew by 5 minutes to avoid using an expired token
    // The exp property is the timestamp of the expiration in seconds
    const renewSkew = 300000;
    return (1000 * decode.exp) - Date.now() - renewSkew;
}
export default initAzureAD; */