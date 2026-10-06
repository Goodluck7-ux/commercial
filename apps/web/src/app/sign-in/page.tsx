import { AuthForm } from '@/components/auth-form';

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md px-5 py-12">
      <AuthForm mode="sign-in" />
    </main>
  );
}