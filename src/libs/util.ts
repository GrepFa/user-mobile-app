import { fetchAuthSession } from 'aws-amplify/auth';
import {DEBUG, API_SERVER_ENDPOINT} from '@env';

interface AuthorizedFetchProps {
  url: string;
  body?: any;
  headers?: Record<string, string> | undefined;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

async function ApiRequest({ url, body, headers, method }: AuthorizedFetchProps): Promise<Response> {
  const { tokens } = await fetchAuthSession();
  if (!tokens || !tokens.idToken) {
    if (DEBUG) {
      console.debug('User Credentials get fail. User not authorized.');
    }
    throw new NotAuthorizedError(JSON.stringify({
      message: 'Not Authorized'
    }));
  }
  return await fetch(
    `${API_SERVER_ENDPOINT}${url}`,
    {
      method: method ?? 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.idToken.toString()}`,
        ...headers,
        ...(headers === undefined && {
          'Content-Type': 'application/json',
        }),
      },
      body: body,
    }
  );
}

const DataFetcher = (url: string) => ApiRequest({
  method: 'GET',
  url: url,
}).then(async (res) => {
  const body = await res.json();
  if (!res.ok) {throw body;}
  return body;
});

class NotAuthorizedError extends Error {
  constructor(message?: string | undefined) {
    super(message);
  }
}

export default ApiRequest;
export { NotAuthorizedError, DataFetcher };
