import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

export default class helper {
    static async timeout(sec) {
        const err = new Error(`Request took too long! Timeout after ${sec} second`);
        return new Promise((_, reject) =>
            setTimeout(() => reject(err), sec * 1000)
        );
    }

    static async ajax(url, uploadData = undefined) {
        try {
            const fetched = uploadData
                ? fetch(url, {
                    method: 'POST',
                    headers: {
                        // many of them are standardized.
                        // tell the API that we are sending the file in the json format.
                        // so the API accept only it as a json, and it performs the operations
                        // through the database.
                        'Content-Type': 'application/json'
                    },
                    // data that we want to send.
                    body: JSON.stringify(uploadData)
                })
                : fetch(url);

            // race between fetch and timeout
            const res = await Promise.race([
                fetched,
                helper.timeout(TIMEOUT_SEC)
            ]);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(`${data.name} :: ${data.message} (${res.status})`);
            }
            return data;
        }
        catch (err) {
            throw err;
        }
    }    
};

