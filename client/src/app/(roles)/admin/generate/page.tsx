import { Toggle } from "@/components/ui/toggle";
import BatchForm from "./BatchForm";
import SignInForm from "./generateForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsDemo() {
  return (
    <>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Form</TabsTrigger>
          <TabsTrigger value="file">Batch</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <SignInForm /> {/* Replace the Card content with SignInForm */}
        </TabsContent>
        <TabsContent value="file">
          <BatchForm /> {/* Replace the Card content with BatchForm */}
        </TabsContent>
      </Tabs>
      {/* <Toggle />jdiwsjd */}
    </>
  );
}
