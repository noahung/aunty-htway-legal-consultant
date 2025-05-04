
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-myanmar-light px-4 py-8">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="inline-block p-2 bg-myanmar-primary rounded-lg mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold myanmar-text text-myanmar-primary mb-2">
          အန်တီထွေးအမှုအတွက် ဥပဒေ အကြံပေး
        </h1>
        <p className="text-myanmar-dark myanmar-text">
          မြန်မာပြစ်မှုဥပဒေဆိုင်ရာ အကြံဉာဏ်ရယူရန် ဝင်ရောက်ပါ
        </p>
      </div>
      <LoginForm />
      <div className="mt-8 text-sm text-myanmar-dark text-center max-w-md myanmar-text">
        ဤစနစ်သည် AI ကို အသုံးပြု၍ မြန်မာဥပဒေဆိုင်ရာ အကြံဉာဏ်များ ပေးသည့်စနစ် ဖြစ်ပါသည်။ 
        ဤဝန်ဆောင်မှုသည် တရားရုံးတွင် ရှေ့နေတစ်ဦး၏ လုပ်ဆောင်မှုကို အစားထိုးခြင်း မဟုတ်ပါ။
      </div>
    </div>
  );
};

export default Login;
