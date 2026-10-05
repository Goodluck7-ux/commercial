import { AuthForm } from '@/components/auth-form';

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-sm p-10">
      <AuthForm mode="sign-up" />
    </main>
  );
}