import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/custom/Login";
import Signup from "@/components/custom/Signup";

function Auth() {
  const [activeTab, setActiveTab] = useState("login");

  const switchToSignup = () => {
    setActiveTab("signup");
  };
  const switchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">SignUp</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login switchToSignup={switchToSignup} />
        </TabsContent>
        <TabsContent value="signup">
          <Signup switchToLogin={switchToLogin} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;
