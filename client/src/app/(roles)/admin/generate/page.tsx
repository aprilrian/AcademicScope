import BatchForm from "./BatchForm";
import SignInForm from "./generateForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GeneratePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-screen-md">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Form</TabsTrigger>
            <TabsTrigger value="file">Batch</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <SignInForm />
          </TabsContent>
          <TabsContent value="file">
            <BatchForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
