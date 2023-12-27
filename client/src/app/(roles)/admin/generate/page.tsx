import BatchForm from "./BatchForm";
import SignInForm from "./generateForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GeneratePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-screen-md">
        <Tabs
          defaultValue="account"
          className="w-full border rounded-md overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="account"
              className="py-2 px-4 text-center cursor-pointer"
            >
              Form
            </TabsTrigger>
            <TabsTrigger
              value="file"
              className="py-2 px-4 text-center cursor-pointer"
            >
              Batch
            </TabsTrigger>
          </TabsList>
          <div className=" p-4 flex flex-col">
            <TabsContent value="account">
              <SignInForm />
            </TabsContent>
            <TabsContent value="file" className="flex-grow">
              <BatchForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
