import SignInForm from "@/app/_components/form/SignInForm"

const page = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Add a border at the top of the content */}
      <div className="border-b border-gray-300">
        <SignInForm />
      </div>
    </main>
  );
};

export default page;
