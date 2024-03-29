const SERVER_URL = process.env.REACT_APP_BACKEND_URL;

const METHOD = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
};

function generateTraceId(length=16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let traceId = '';
  
    for (let i = 0; i < length; i++) {
      traceId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return traceId;
}

const myFetch = (url, options = {}, maxRetries = 3, baseDelay = 2000) => {
    const fetchWithRetry = async (url, options, retries) => {
        try {
            if (!options.headers) {
                options.headers = {}
            }
            if (options.method === METHOD.POST ) {
                options.headers['Content-Type'] = "application/json"
            }
            if (localStorage.getItem("token")) {
                options.headers["authorization"] = `Bearer ${localStorage.getItem("token")}`
            }
            options.headers["x_trace_id"] = generateTraceId()
             
            const response = await fetch(url, {
                headers: {
                    ...(options.headers || {}),
                },
                ...options,
            });
            if ([500, 502, 503].includes(response.status)) {
                if (retries > 0) {
                    const delay = baseDelay * Math.pow(2, maxRetries - retries);
                    console.log(`Retrying in ${delay} milliseconds (${retries} retries left)`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return fetchWithRetry(url, options, retries - 1);
                }
                console.error(`Retried ${maxRetries} times, giving up`)
                window.location.href = '/error';
            }
            if (response.status === 401) {
                window.location.href = "/login"
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const response_body = await response.json();
                return {
                    body: response_body,
                    statusCode: response.status,
                };
            } else {
                return {
                    body: null,
                    statusCode: response.status,
                };
            }
        } catch (error) {
            console.log('Request failed!');
            console.log(error);  
        }
    };

    return fetchWithRetry(url, options, maxRetries);
};

export const getHealth = () => {
    const url = `${SERVER_URL}/health`;
    return myFetch(url, {
        method: METHOD.GET,
    })
}

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

export const updateNationVariables = (nationName, nationVariables) => {
    const url = `${SERVER_URL}/nations/${nationName}`
    return new Promise((resolve) => {
        resolve(
            myFetch(url, {
            method: METHOD.POST,
            body: JSON.stringify(nationVariables),
        }))}
    );
}

export async function updateNationRequest (nationName, species, year, requested_quota, requested_license) {
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

export async function updateNationRequests (data) {
    const url = `${SERVER_URL}/nation/update-requests`
    return new Promise((resolve) => {
        resolve(
            myFetch(url, {
            method: METHOD.POST,
            body: JSON.stringify(data)
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

export const confirmGrant = (nationName, year, species, requestedLicense, grantedLicense, requestedQuota, grantedQuota, quotaCost, licenseCost) => {
    const url = `${SERVER_URL}/grant`
    return new Promise((resolve) => {
        resolve(myFetch(url, {
            method: METHOD.POST,
            body: JSON.stringify({
                "year": year,
                "species": species,
                "nation_name": nationName,
                "requested_license": requestedLicense,
                "granted_license": grantedLicense,
                "requested_quota": requestedQuota,
                "granted_quota": grantedQuota,
                "quota_cost": quotaCost,
                "license_cost": licenseCost,
            })
        }))
    })
}

export const getGrant = (year) => {
    const url = `${SERVER_URL}/grants/${year}`
    return new Promise((resolve) => {
        resolve(myFetch(url, {
            method: METHOD.GET,
        }))
    })
}

export const getFunds = (nationName) => {
    const url = `${SERVER_URL}/funds/${nationName}`
    return new Promise((resolve) => {
        resolve(myFetch(url, {
            method: METHOD.GET,
        }))
    })
}

export const getHealthWithAuth = () => {
    const url = `${SERVER_URL}/health-authenticated`
    return new Promise((resolve) => {
        resolve(myFetch(url, {
            method: METHOD.GET,
        }))
    })
}
