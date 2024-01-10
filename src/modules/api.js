const SERVER_URL = process.env.REACT_APP_BACKEND_URL;

const METHOD = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
};

// Log outgoing requests
const logRequest =  (url, body = undefined) => {
	let message = `${url}`;
	if (body) message += `\nWith body: ${JSON.stringify(body)}`;

	console.info(message);
};

// Log incoming responses
const logResponse = (url, body = undefined) => {
	let message = `${url}`;
	if (body) message += `\nWith body: ${JSON.stringify(body)}`;

	console.info(message);
};

// Compose fetch with logging & JSON parsing
const myFetch = (url, options = {}) => {
    logRequest(url, options);

    return fetch(url, {
        headers: {
            // 'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    })
        .then(response => {
            const contentType = response.headers.get('content-type');
            console.log(contentType);
            console.log(response);

            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json().then(response_body => {
                    return {
                        body: response_body,
                        statusCode: response.status,
                    };
                });
            } else {
                // Handle non-JSON response here if needed
                return {
                    body: null,
                    statusCode: response.status,
                };
            }
        })
        .catch(function(error) {
            console.log("request failed!");
            // Rethrow the error to propagate it to the caller
            throw error;
        });
};


export const getSpeciesList = () => {
    const url = `${SERVER_URL}/species`;
    return myFetch(url, {
        method: METHOD.GET,
    })
}

export const getNationsList = () => {
    const url = `${SERVER_URL}/nations`;
    return myFetch(url, {
        method: METHOD.GET,
    })
}

export const updateNationVariables = (nationVariables) => {
    const url = `${SERVER_URL}/nations`
    return new Promise((resolve) => {
        resolve(
            myFetch(url, {
            method: METHOD.POST,
            body: JSON.stringify(nationVariables)
        }))}
    );
}

export const updateNationRequest = (nationName, species, year, requested_quota, requested_license) => {
    const url = `${SERVER_URL}/nation/update-request/${nationName}`
    return new Promise((resolve) => {
        resolve(
            myFetch(url, {
            method: METHOD.POST,
            body: JSON.stringify({
                "species": species,
                "year": year,
                "requested_quota": requested_quota,
                "requested_license": requested_license,
            })
        }))}
    );
}

export const getYearRequestForSpecies = (species, year) => {
    const url = `${SERVER_URL}/requests/${species}/${year}`
    return myFetch(url, {
        method: METHOD.GET
    })
}

export const getNationVariables = (nationName) => {
    const url = `${SERVER_URL}/nations/${nationName}`
    return myFetch(url, {
        method: METHOD.GET,
    })
}

export const runAlgorithm = data => {
    const url = `${SERVER_URL}/run-algorithm`
    return new Promise((resolve) => {
        resolve(myFetch(url, {
            method: METHOD.POST,
            body: JSON.stringify(data)
        }
        ))
    })
} 

export const login = (username, password) => {
    const url = `${SERVER_URL}/login`
    return new Promise((resolve) => {
        resolve(myFetch(url, {
            method: METHOD.POST,
            body: JSON.stringify({
                "username": username,
                "password": password,
            })}))
    })
}

export const activateAccount = (username, verificationToken) => {
    const url = `${SERVER_URL}/activate-account`
    return new Promise((resolve) => {
        resolve(myFetch(url, {
            method: METHOD.POST,
            body: JSON.stringify({
                "username": username,
                "token": verificationToken,
            })}))
    })
}

export const createUser = (username, password, email) => {
    const url = `${SERVER_URL}/add-user`
    return new Promise((resolve) => {
        resolve(myFetch(url, {
            method: METHOD.POST,
            body: JSON.stringify({
                "username": username,
                "password": password,
                "email": email,
            })}))
    })
}
