
import { useState } from "react";
import ConsultationLayout from "@/components/ConsultationLayout";
import DocumentUpload from "@/components/DocumentUpload";
import CaseInformationForm, { CaseInformation } from "@/components/CaseInformationForm";
import ChatInterface from "@/components/ChatInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Consultation = () => {
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [caseInformation, setCaseInformation] = useState<CaseInformation | null>(null);
  const [activeTab, setActiveTab] = useState("document");

  const handleDocumentUpload = (content: string) => {
    setDocumentContent(content);
    setActiveTab("case-info");
  };

  const handleCaseInfoSubmit = (info: CaseInformation) => {
    setCaseInformation(info);
    setActiveTab("chat");
  };

  return (
    <ConsultationLayout>
      <div className="grid grid-cols-1 gap-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="document" className="myanmar-text">
              ၁။ ပြစ်မှုဥပဒေတင်ရန်
            </TabsTrigger>
            <TabsTrigger 
              value="case-info" 
              className="myanmar-text"
              disabled={!documentContent}
            >
              ၂။ အမှုအကြောင်း
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="myanmar-text"
              disabled={!documentContent || !caseInformation}
            >
              ၃။ အကြံဉာဏ်ရယူရန်
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="document" className="mt-0">
            <DocumentUpload onUpload={handleDocumentUpload} />
            {documentContent && (
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setActiveTab("case-info")}
                  className="myanmar-text text-myanmar-primary hover:underline"
                >
                  နောက်တဆင့်သို့ ဆက်သွားရန် →
                </button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="case-info" className="mt-0">
            <CaseInformationForm onSubmit={handleCaseInfoSubmit} />
            {caseInformation && (
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setActiveTab("chat")}
                  className="myanmar-text text-myanmar-primary hover:underline"
                >
                  အကြံဉာဏ်ရယူရန်သွားရန် →
                </button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chat" className="mt-0">
            <div className="h-[calc(100vh-20rem)]">
              <ChatInterface 
                documentUploaded={!!documentContent}
                caseInformation={caseInformation}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ConsultationLayout>
  );
};

export default Consultation;
