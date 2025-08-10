// Temporary shim for Supabase client.
// NOTE: This is a placeholder used until the project is connected to Supabase via Lovable's integration.
// Once connected, this file will be replaced automatically. Do not edit the generated file.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const notReady = (method: string): any => {
  throw new Error(`Supabase is not connected yet. Attempted to use: ${method}. Connect Supabase (green button top right) and try again.`);
};

export const supabase: any = {
  auth: {
    async getSession() { return { data: { session: null } }; },
    onAuthStateChange() { return { data: { subscription: { unsubscribe: () => {} } } }; },
    async signInWithPassword() { return notReady('auth.signInWithPassword'); },
    async signUp() { return notReady('auth.signUp'); },
    async signOut() { return; },
  },
  from() { return { select: notReady('from.select'), insert: notReady('from.insert'), update: notReady('from.update'), eq: notReady('from.eq'), gte: notReady('from.gte') }; },
  functions: {
    async invoke() { return notReady('functions.invoke'); }
  }
};
