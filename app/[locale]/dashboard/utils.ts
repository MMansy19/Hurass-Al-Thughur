export async function loadMessages(locale: string, setMessages: (messages: any) => void) {
  const messagesModule = await import(`@/locales/${locale}.json`);
  setMessages(messagesModule.default);
}
