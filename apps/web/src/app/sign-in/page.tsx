import { AuthForm } from '@/components/auth-form';

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-sm p-10">
      <AuthForm mode="sign-in" />
    </main>
  );
}