
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface DocumentUploadProps {
  onUpload: (content: string) => void;
}

const DocumentUpload = ({ onUpload }: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "ဖိုင်ရွေးချယ်ပါ",
        description: "ပထမဦးစွာ PDF ဖိုင်ကို ရွေးချယ်ပေးပါ။",
        variant: "destructive",
      });
      return;
    }

    if (file.type !== "application/pdf") {
      toast({
        title: "ဖိုင်အမျိုးအစားမှားယွင်းနေပါသည်",
        description: "PDF ဖိုင်ကိုသာ ရွေးချယ်ပေးပါ။",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // For this prototype, we're just simulating the file upload and text extraction
    // In a real app, we would need to parse the PDF file and extract text
    try {
      const reader = new FileReader();
      reader.onload = function(event) {
        // In a real app, this content would be extracted text from PDF
        // For now we'll fake success with a placeholder message
        setTimeout(() => {
          onUpload("Myanmar Penal Code content would be extracted here");
          setLoading(false);
          toast({
            title: "အောင်မြင်စွာတင်ပြီးပါပြီ",
            description: "Myanmar Penal Code စာတမ်းကို အောင်မြင်စွာ တင်ပြီးပါပြီ။",
          });
        }, 2000);
      };
      
      reader.readAsText(file);
    } catch (error) {
      setLoading(false);
      toast({
        title: "အမှားရှိနေပါသည်",
        description: "ဖိုင်တင်ရာတွင် အမှားရှိနေပါသည်။ နောက်မှထပ်ကြိုးစားပါ။",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="myanmar-text">မြန်မာပြစ်မှုဥပဒေ တင်ရန်</CardTitle>
        <CardDescription className="myanmar-text">
          AI က မြန်မာဥပဒေကို နားလည်ရန် ပြစ်မှုဥပဒေ PDF ဖိုင်ကို တင်ပေးပါ။
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="border-2 border-dashed border-myanmar-accent rounded-lg p-6 text-center">
            <Upload className="h-10 w-10 mb-2 mx-auto text-myanmar-primary" />
            <p className="mb-4 myanmar-text">PDF ဖိုင်ကို ဆွဲချပါ သို့မဟုတ် ရွေးချယ်ပါ</p>
            <input
              type="file"
              id="file-upload"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block bg-myanmar-light text-myanmar-primary px-4 py-2 rounded-md hover:bg-myanmar-accent transition-colors duration-200 myanmar-text"
            >
              ဖိုင်ရွေးချယ်ရန်
            </label>
            {file && (
              <p className="mt-4 text-sm text-myanmar-primary myanmar-text">
                ရွေးချယ်ထားသောဖိုင်: {file.name}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={!file || loading} 
          className="myanmar-text"
        >
          {loading ? "တင်နေသည်..." : "တင်ရန်"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUpload;
