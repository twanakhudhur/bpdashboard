import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useLoginMutation } from "@/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username is required",
    })
    .max(50),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .max(50),
});

export default function Login() {
  const { showLoadingToast, showSuccessToast, showErrorToast } =
    useCustomToast();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (cridenials) => {
    showLoadingToast();
    const { data, error: loginError } = await login(cridenials);
    if (data) {
      showSuccessToast(`Welcome, ${data?.user?.username}!`);
      navigate("/");
      return;
    }
    showErrorToast(loginError?.data?.message);
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="bg-background w-screen h-screen text-text flex justify-center items-center">
      <Card className="md:w-[500px] min-w-80 backdrop-blur-sm bg-black/20">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {error && <div className="text-sm text-error">{error}</div>}
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoginLoading ? "Loading..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center mt-6">
          <p>BackPipeFactory.com</p>
        </CardFooter>
      </Card>
    </div>
  );
}
