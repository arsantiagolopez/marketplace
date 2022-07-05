export interface SignInResponse {
  /**
   * Will be different error codes,
   * depending on the type of error.
   */
  error: string | undefined;
  /**
   * HTTP status code,
   * hints the kind of error that happened.
   */
  status: number;
  /**
   * `true` if the signin was successful
   */
  ok: boolean;
  /**
   * `null` if there was an error,
   * otherwise the url the user
   * should have been redirected to.
   */
  url: string | null;
}

export interface UserSession {
  expires: string;
  user: {
    name: string;
    walletAddress: string;
    isSeller: boolean;
    store?: string;
  };
}
