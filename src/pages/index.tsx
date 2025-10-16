import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome to the MMN Store</h1>
      {user ? (
        <p>You are logged in as {user.name}.</p>
      ) : (
        <p>Please log in to continue.</p>
      )}
    </main>
  );
}
