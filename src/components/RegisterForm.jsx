import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
  const [form, setForm] = useState({});
  const { onRegister } = useAuth();

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    onRegister({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <Card className="w-full max-w-md mt-6">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to register a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitForm}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                required
                onChange={handleForm}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Doe"
                required
                onChange={handleForm}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={handleForm}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                name="password"
                type="password"
                required
                onChange={handleForm}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                onChange={handleForm}
              />
            </div>
            <Button variant="outline" type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  );
}
