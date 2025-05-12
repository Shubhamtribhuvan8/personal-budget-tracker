import { LoginForm } from "../components/login-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16 ">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
          Personal Budget Tracker
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 md:w-2/3 lg:w-1/2">
          Take control of your finances with our intuitive budget tracking tool. Monitor your income, expenses, and
          savings goals all in one place.
        </p>
        <LoginForm />
      </div>
    </div>
  )
}
