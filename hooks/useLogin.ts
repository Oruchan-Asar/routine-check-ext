import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResult {
  formData: LoginForm;
  error: string;
  setFormData: (data: LoginForm) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useLogin(): LoginResult {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("An unexpected error occurred");
    }
  };

  return {
    formData,
    error,
    setFormData,
    handleSubmit,
  };
}
