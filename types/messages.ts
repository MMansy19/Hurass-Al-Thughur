// Message types for internationalization
export interface AuthMessages {
  signin: string;
  signout: string;
  signup: string;
  name: string;
  password: string;
  email: string;
  signinSuccess: string;
  signoutSuccess: string;
  signupSuccess: string;
  signinError: string;
  signupError: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  adminPasswordRequired: string;
  enterAdminPassword: string;
  incorrectPassword: string;
}

export interface CommonMessages {
  language: string;
  switchLanguage: string;
  home: string;
  magazine: string;
  dawah: string;
  library: string;
  articles: string;
  contact: string;
  readMore: string;
  view: string;
  edit: string;
  delete: string;
  viewAll: string;
  preview: string;
  download: string;
  share: string;
  items: string;
  loading: string;
  sending: string;
  madeWith: string;
  by: string;
  goToLibrary: string;
  siteName: string;
  send: string;
  goBack: string;
  cancel: string;
  confirm: string;
  notSignedIn: string;
}

export interface ErrorMessages {
  articleNotFound: string;
  somethingWentWrong: string;
  tryAgain: string;
}

export interface Messages {
  common: CommonMessages;
  auth: AuthMessages;
  errors: ErrorMessages;
  [key: string]: any; // For other sections that might exist
}
