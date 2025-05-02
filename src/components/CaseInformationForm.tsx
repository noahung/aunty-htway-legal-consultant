
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CaseInformationFormProps {
  onSubmit: (caseInfo: CaseInformation) => void;
}

export interface CaseInformation {
  incidentDescription: string;
  suspectStatement: string;
  evidenceDetails: string;
  additionalInfo: string;
}

const CaseInformationForm = ({ onSubmit }: CaseInformationFormProps) => {
  const [caseInfo, setCaseInfo] = useState<CaseInformation>({
    incidentDescription: "",
    suspectStatement: "",
    evidenceDetails: "",
    additionalInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setCaseInfo({
      ...caseInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caseInfo.incidentDescription) {
      toast({
        title: "အချက်အလက်ချို့တဲ့နေပါသည်",
        description: "ဖြစ်စဉ်အကြောင်း ဖော်ပြချက်ကို ထည့်သွင်းပေးပါ။",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      onSubmit(caseInfo);
      setLoading(false);
      toast({
        title: "အချက်အလက်များ သိမ်းဆည်းပြီးပါပြီ",
        description: "သင့်အမှုအကြောင်း အချက်အလက်များကို သိမ်းဆည်းပြီး AI သို့ ပေးပို့ပြီးပါပြီ။",
      });
    }, 1000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="myanmar-text">အမှုအကြောင်း အချက်အလက်များ</CardTitle>
        <CardDescription className="myanmar-text">
          AI က သင့်အမှုအကြောင်း နားလည်စေရန် အောက်ပါ အချက်အလက်များကို ဖြည့်စွက်ပေးပါ။
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="caseInfoForm" onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <label htmlFor="incidentDescription" className="myanmar-text font-medium">
                ဖြစ်စဉ်အကြောင်း ဖော်ပြချက် *
              </label>
              <Textarea
                id="incidentDescription"
                name="incidentDescription"
                value={caseInfo.incidentDescription}
                onChange={handleChange}
                placeholder="ဖြစ်ပွားခဲ့သော အဖြစ်အပျက်အကြောင်း အသေးစိတ် ရေးသားပေးပါ။"
                rows={5}
                required
                className="myanmar-text"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="suspectStatement" className="myanmar-text font-medium">
                သံသယရှိသူ၏ ထွက်ဆိုချက်
              </label>
              <Textarea
                id="suspectStatement"
                name="suspectStatement"
                value={caseInfo.suspectStatement}
                onChange={handleChange}
                placeholder="သံသယရှိသူက ရဲကို ပြောခဲ့သော စကားများ (သိရှိလျှင်)"
                rows={3}
                className="myanmar-text"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="evidenceDetails" className="myanmar-text font-medium">
                သက်သေခံ အချက်အလက်များ
              </label>
              <Textarea
                id="evidenceDetails"
                name="evidenceDetails"
                value={caseInfo.evidenceDetails}
                onChange={handleChange}
                placeholder="လူသေအလောင်းတွေ့ရှိပုံ၊ အခင်းဖြစ်ပွားရာနေရာ အခြေအနေ စသည်"
                rows={3}
                className="myanmar-text"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="additionalInfo" className="myanmar-text font-medium">
                အခြားဖြည့်စွက်လိုသော အချက်အလက်များ
              </label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={caseInfo.additionalInfo}
                onChange={handleChange}
                placeholder="ရှေ့နေကို ပြောပြလိုသော အခြား အချက်အလက်များ"
                rows={3}
                className="myanmar-text"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          type="submit"
          form="caseInfoForm"
          disabled={loading}
          className="myanmar-text"
        >
          {loading ? "ပေးပို့နေသည်..." : "အချက်အလက်များ ပေးပို့ရန်"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CaseInformationForm;
