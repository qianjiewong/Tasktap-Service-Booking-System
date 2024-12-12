import TaskerSignInForm from "@/app/_components/form/TaskerSignInForm";

const page = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Add a border at the top of the content */}
      <div className="border-b border-gray-300">
        <TaskerSignInForm />
      </div>
    </main>
  );
};

export default page;
